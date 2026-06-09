// ── Payment & License API service ────────────────────────────────────────────
const BASE    = 'https://lisence-system.onrender.com';
const API_KEY = 'my-secret-key-123';

const h = () => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
});

export interface PurchasePayload {
  name: string;
  email: string;
  productId: string;
  licenseId: string;
  licenseTypeId: string;
  billingCycle: string;
  trial: boolean;
  amount: number;
  currency: string;
  paymentMode: 'free' | 'razorpay';
  source: string;
}

export interface PurchaseResult {
  transactionId: string;
  userId: string;
}

export interface OrderResult {
  orderId: string;
  key: string;
  currency: string;
  amount: number;
}

export async function purchaseLicense(payload: PurchasePayload): Promise<PurchaseResult> {
  const res = await fetch(`${BASE}/api/license/purchase`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data?.message || 'Purchase failed'), { response: { data } });
  return data;
}

export async function createOrder(payload: {
  userId: string;
  licenseId: string;
  billingCycle: string;
  amount: number;   // in paise
}): Promise<OrderResult> {
  const res = await fetch(`${BASE}/api/payment/create-order`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data?.message || 'Order creation failed'), { response: { data } });
  return data;
}

export async function verifyPayment(payload: {
  transactionId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<void> {
  const res = await fetch(`${BASE}/api/payment/verify`, {
    method: 'POST',
    headers: h(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw Object.assign(new Error(data?.message || 'Payment verification failed'), { response: { data } });
  }
}

export async function getActiveLicense(email: string, productId: string) {
  const res = await fetch(
    `${BASE}/api/external/actve-license/${email}?productId=${productId}`,
    { headers: { 'x-api-key': API_KEY } }
  );
  if (!res.ok) return null;
  return res.json();
}
