// ── Payment & License API service ─────────────────────────────────────────────
// All calls go through the TrustLayer backend proxy to avoid CORS.
import { LMS_PROXY } from './config';

const BASE = LMS_PROXY;

// Razorpay backend base — same backend, different prefix
const RAZORPAY_BASE = BASE.replace('/api/lms', '/api/razorpay');

const h = () => ({ 'Content-Type': 'application/json' });

// ── Razorpay script loader ────────────────────────────────────────────────────
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderResult {
  orderId: string;
  key: string;        // Razorpay key_id
  currency: string;
  amount: number;     // in paise
  transactionId?: string;
}

// ── Create Razorpay order (direct — no LMS pending-transaction required) ──────
// Uses our own backend → Razorpay API directly.
export async function createOrder(payload: {
  userId: string;
  licenseId: string;    // lic._id (the license document ID from LMS)
  billingCycle: string;
  amount: number;       // amount in paise (rupees × 100)
}): Promise<OrderResult> {
  const res = await fetch(`${RAZORPAY_BASE}/create-order`, {
    method:  'POST',
    headers: h(),
    body:    JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw Object.assign(
      new Error(data?.message || 'Failed to create payment order'),
      { response: { data } }
    );
  }
  return data;
}

// ── Verify Razorpay payment + activate LMS license ───────────────────────────
export async function verifyPayment(payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  licenseId?: string;
  userId?: string;
  billingCycle?: string;
  transactionId?: string;
}): Promise<void> {
  const res = await fetch(`${RAZORPAY_BASE}/verify`, {
    method:  'POST',
    headers: h(),
    body:    JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw Object.assign(
      new Error(data?.message || 'Payment verification failed'),
      { response: { data } }
    );
  }
}

// ── Get user's current active license ────────────────────────────────────────
export async function getActiveLicense(email: string, productId: string) {
  try {
    const res = await fetch(
      `${BASE}/active-license/${encodeURIComponent(email)}?productId=${productId}`
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Sync hashed password to LMS after registration/password-change ────────────
export async function syncPasswordToLMS(email: string, passwordHash: string): Promise<void> {
  try {
    const res = await fetch(`${BASE}/password-sync`, {
      method:  'POST',
      headers: h(),
      body:    JSON.stringify({ email, passwordHash }),
    });
    if (!res.ok) {
      const data = await res.json();
      console.warn('Password sync failed:', data?.message);
    }
  } catch (err) {
    console.warn('Password sync error (non-blocking):', err);
  }
}
