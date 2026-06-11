// ─── LMS Auth Service ─────────────────────────────────────────────────────────
// All API calls go through the TrustLayer backend proxy (/api/lms/*)
// to avoid CORS issues with calling the LMS directly from the browser.
import { LMS_PROXY, PRODUCT_ID, BACKEND_URL, getDashboardUrl } from './config';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  token: string;
  companyName?: string;
  activeLicense?: {
    licenseType: string;
    planName: string;
  } | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

// ── Login via LMS proxy ────────────────────────────────────────────────────────
export async function lmsLogin(payload: LoginPayload): Promise<AuthUser> {
  let res: Response;
  try {
    res = await fetch(`${LMS_PROXY}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
  } catch (networkErr) {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || 'Invalid email or password');
  }

  const customer = data.customer;
  const user: AuthUser = {
    _id:           customer?.customerId ?? customer?._id ?? '',
    name:          customer?.name ?? '',
    email:         customer?.email ?? '',
    token:         '',
    companyName:   customer?.companyName ?? '',
    activeLicense: null,
  };

  // Fetch active license and attach it if active
  try {
    const licData = await getActiveLicense(user.email, PRODUCT_ID);
    if (licData?.activeLicense?.status === 'active') {
      const lt = licData.activeLicense.licenseTypeId ?? licData.activeLicense.licenseType ?? {};
      user.activeLicense = {
        licenseType: lt._id ?? '',
        planName:    lt.name ?? 'Active',
      };
    }
  } catch (err) {
    console.warn('Failed to fetch active license during login:', err);
  }

  return user;
}

// ── Register via LMS proxy (Customer Sync) ────────────────────────────────────
export async function lmsRegister(payload: RegisterPayload): Promise<AuthUser> {
  let res: Response;
  try {
    res = await fetch(`${LMS_PROXY}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:        payload.name,
        email:       payload.email,
        source:      'trustlayer',
        password:    payload.password,
        companyName: payload.companyName,
      }),
    });
  } catch (networkErr) {
    throw new Error('Unable to reach the server. Please check your connection and try again.');
  }

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || 'Registration failed');
  }

  // Auto-login immediately after successful registration
  const loginUser = await lmsLogin({ email: payload.email, password: payload.password });
  loginUser.companyName = payload.companyName;
  return loginUser;
}

// ── Get user's current active license ────────────────────────────────────────
export async function getActiveLicense(email: string, productId: string) {
  try {
    const res = await fetch(
      `${LMS_PROXY}/active-license/${encodeURIComponent(email)}?productId=${productId}`
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Persist to sessionStorage + localStorage (plan survives logout) ───────────
const STORAGE_KEY  = 'tl_auth_user';
const PLAN_KEY     = 'tl_active_license';  // persists across logout

export function saveSession(user: AuthUser) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  // Keep plan in localStorage so re-login can restore it without an LMS round-trip
  if (user.activeLicense) {
    localStorage.setItem(PLAN_KEY, JSON.stringify(user.activeLicense));
  }
}

export function loadSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    // If session exists but has no plan, restore from localStorage backup
    if (!user.activeLicense) {
      const planRaw = localStorage.getItem(PLAN_KEY);
      if (planRaw) user.activeLicense = JSON.parse(planRaw);
    }
    return user;
  } catch {
    return null;
  }
}

export function loadSavedPlan(): { licenseType: string; planName: string } | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
  // NOTE: intentionally NOT clearing PLAN_KEY so plan survives logout → re-login
}

// ── SSO Redirect to Dashboard ──────────────────────────────────────────────────
export async function triggerSSORedirect(user: AuthUser): Promise<void> {
  // Open blank window immediately to prevent browser popup blocker
  const newWindow = window.open('about:blank', '_blank');

  try {
    const activePlan = (user.activeLicense?.planName ?? 'basic').toLowerCase().trim();
    const licenseId = user.activeLicense?.licenseType ?? '';

    const ssoBackendUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : BACKEND_URL;

    const response = await fetch(`${ssoBackendUrl}/api/auth/sso`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        planName: activePlan,
        licenseId: licenseId,
        companyName: user.companyName,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('[SSO Debug] Response not OK:', response.status, errData);
      if (newWindow) newWindow.close();
      throw new Error(`SSO initiation failed: ${errData.error || errData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const dashboardUrl = getDashboardUrl();

    const ssoUrl = `${dashboardUrl}/sso?token=${encodeURIComponent(data.token)}&plan=${encodeURIComponent(data.planName)}&licenseId=${encodeURIComponent(data.licenseId)}`;
    
    if (newWindow) {
      newWindow.location.href = ssoUrl;
    } else {
      window.location.href = ssoUrl;
    }
  } catch (err) {
    if (newWindow) newWindow.close();
    throw err;
  }
}
