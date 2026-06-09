// ─── LMS Auth Service ─────────────────────────────────────────────────────────
// All API calls to the LMS auth endpoints

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
  'x-api-key': API_KEY,
});

// Login via LMS
export async function lmsLogin(payload: LoginPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_BASE}/api/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, productId: PRODUCT_ID }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Invalid credentials');
  }

  return normaliseUser(data);
}

// Register via LMS
export async function lmsRegister(payload: RegisterPayload): Promise<AuthUser> {
  const res = await fetch(`${LMS_BASE}/api/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ ...payload, productId: PRODUCT_ID }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Registration failed');
  }

  return normaliseUser(data);
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
