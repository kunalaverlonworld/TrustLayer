// ─── LMS Auth Service ─────────────────────────────────────────────────────────
// All API calls to the LMS auth endpoints
import { syncPasswordToLMS, getActiveLicense } from './paymentService';

const LMS_BASE   = 'https://license-system-v6ht.onrender.com';
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
  const res = await fetch(`${LMS_BASE}/api/external/customer-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || data?.error || 'Invalid email or password');
  }

  const customer = data.customer;
  const user: AuthUser = {
    _id:           customer?.customerId ?? '',
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
        planName: lt.name ?? 'Active',
      };
    }
  } catch (err) {
    console.warn('Failed to fetch active license during login:', err);
  }

  return user;
}

// Register via LMS (Customer Sync)
export async function lmsRegister(payload: RegisterPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_BASE}/api/external/customer-sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
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
