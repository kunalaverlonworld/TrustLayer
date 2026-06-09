// ─── LMS Auth Service ─────────────────────────────────────────────────────────
// All API calls to the LMS auth endpoints
import { syncPasswordToLMS, getActiveLicense } from './paymentService';

const LMS_BASE   = 'https://lisence-system.onrender.com';
const API_KEY    = 'my-secret-key-123';
const PRODUCT_ID = '6a26929078d2d302b575cc10';

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

const headers = () => ({
  'Content-Type': 'application/json',
});

// Login via LMS
export async function lmsLogin(payload: LoginPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_BASE}/api/auth/login`, {
    method: 'POST',
    headers: headers(),
    // NOTE: productId is NOT accepted by the login endpoint
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Invalid email or password');
  }

  const user = normaliseUser(data);

  // Fetch active license and attach it if active
  try {
    const licData = await getActiveLicense(user.email, PRODUCT_ID);
    if (licData?.activeLicense?.status === 'active') {
      const lt = licData.activeLicense.licenseTypeId ?? licData.activeLicense.licenseType ?? {};
      user.activeLicense = {
        licenseType: lt._id ?? '',
        planName: lt.name ?? 'Active',
      };
    }
  } catch (err) {
    console.warn('Failed to fetch active license during login:', err);
  }

  return user;
}

// Register via LMS
export async function lmsRegister(payload: RegisterPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_BASE}/api/auth/register`, {
    method: 'POST',
    headers: headers(),
    // role='customer' is required; productId is NOT accepted
    body: JSON.stringify({
      name:     payload.name,
      email:    payload.email,
      password: payload.password,
      role:     'customer',
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    // API returns errors as an array e.g. ["Role is required"]
    const msg = Array.isArray(data?.errors)
      ? data.errors.join(', ')
      : (data?.message || data?.error || 'Registration failed');
    throw new Error(msg);
  }

  // LMS register returns { success, message, user } — no token.
  // Auto-login immediately to obtain the JWT token
  return lmsLogin({ email: payload.email, password: payload.password });
}

// Normalise whatever shape the LMS returns into AuthUser
function normaliseUser(data: any): AuthUser {
  const user = data.user ?? data;
  const token = data.token ?? data.accessToken ?? '';
  return {
    _id:           user._id ?? user.id ?? '',
    name:          user.name ?? user.fullName ?? '',
    email:         user.email ?? '',
    token,
    activeLicense: user.activeLicense ?? null,
  };
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
