// ─── LMS Auth Service ─────────────────────────────────────────────────────────
// All API calls go through the TrustLayer backend proxy (/api/lms/*)
// to avoid CORS issues with calling the LMS directly from the browser.
import { LMS_PROXY, PRODUCT_ID } from './config';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  token: string;
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
}

// ── Login via LMS proxy ────────────────────────────────────────────────────────
export async function lmsLogin(payload: LoginPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_PROXY}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });

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
  const res = await fetch(`${LMS_PROXY}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:     payload.name,
      email:    payload.email,
      source:   'trustlayer',
      password: payload.password,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || 'Registration failed');
  }

  // Auto-login immediately after successful registration
  return lmsLogin({ email: payload.email, password: payload.password });
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

// ── Persist to sessionStorage ─────────────────────────────────────────────────
const STORAGE_KEY = 'tl_auth_user';

export function saveSession(user: AuthUser) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function loadSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY);
}
