// ── Payment & License API service ─────────────────────────────────────────────
// Confirmed working endpoints on https://license-system-v6ht.onrender.com :
//   POST /api/payment/create-order   { userId, licenseId, billingCycle, amount(paise) }
//   POST /api/payment/verify         { razorpay_payment_id, razorpay_order_id, razorpay_signature, transactionId? }
//   GET  /api/external/active-license/:email?productId=...
//   POST /api/external/customer-password-sync { email, passwordHash }

const BASE    = 'https://license-system-v6ht.onrender.com';
const API_KEY = 'my-secret-key-123';

// TrustLayer's own secret — tell LMS admin to whitelist this as a webhook/callback secret
export const TL_SECRET_KEY = 'tl-trustlayer-secret-2024-xK9mP3qR';

const h = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderResult {
  orderId: string;
  key: string;        // Razorpay key_id
  currency: string;
  amount: number;     // in paise
  transactionId?: string;
}

// ── Create Razorpay order via LMS ─────────────────────────────────────────────
export async function createOrder(payload: {
  userId: string;
  licenseId: string;    // lic._id (the license document ID)
  billingCycle: string;
  amount: number;       // amount in paise (rupees × 100)
}): Promise<OrderResult> {
  const res = await fetch(`${BASE}/api/payment/create-order`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify(payload),
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

// ── Verify Razorpay payment ───────────────────────────────────────────────────
export async function verifyPayment(payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  transactionId?: string;
}): Promise<void> {
  const res = await fetch(`${BASE}/api/payment/verify`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify(payload),
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
      `${BASE}/api/external/active-license/${encodeURIComponent(email)}?productId=${productId}`,
      { headers: { 'x-api-key': API_KEY } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Sync hashed password to LMS after registration/password-change ────────────
// LMS expects: { email, passwordHash }
// Call this immediately after user registers or changes password
export async function syncPasswordToLMS(email: string, passwordHash: string): Promise<void> {
  try {
    const res = await fetch(`${BASE}/api/external/customer-password-sync`, {
      method: 'POST',
      headers: h(),
      body: JSON.stringify({ email, passwordHash }),
    });
    if (!res.ok) {
      const data = await res.json();
      console.warn('Password sync failed:', data?.message);
    }
  } catch (err) {
    console.warn('Password sync error (non-blocking):', err);
  }
}
