const BASE_URL = 'https://license-system-v6ht.onrender.com';
const PRODUCT_ID = '69589d3ba7306459dd47fd87';
const API_KEY = 'my-secret-key-123';

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export async function syncCustomer(fullName: string, email: string, passwordString: string) {
  const res = await fetch(`${BASE_URL}/api/external/customer-sync`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fullName, email, password: passwordString }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to register with licensing system.');
  }
  return res.json();
}

export async function loginCustomer(email: string, passwordString: string) {
  const res = await fetch(`${BASE_URL}/api/external/customer-login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password: passwordString }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Invalid email or password');
  }
  return res.json();
}

export async function checkCustomerExists(email: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/external/customer-exists`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.exists;
    }
    return false;
  } catch (err) {
    console.error('checkCustomerExists error:', err);
    return false;
  }
}

export async function checkActiveLicense(email: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/external/actve-license/${email}?productId=${PRODUCT_ID}`,
      { headers }
    );
    if (res.ok) {
      const data = await res.json();
      return data.activeLicense || null;
    }
    return null;
  } catch (err) {
    console.error('checkActiveLicense error:', err);
    return null;
  }
}

export async function getLicensesByProduct() {
  const res = await fetch(
    `${BASE_URL}/api/license/public/licenses-by-product/${PRODUCT_ID}`,
    { headers }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch pricing plans.');
  }
  const data = await res.json();
  return data.licenses || [];
}

export async function purchaseLicense(companyName: string, email: string, licenseId: string, billingCycle: string = 'monthly') {
  const res = await fetch(`${BASE_URL}/api/lms/purchase-license`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: companyName,
      email,
      licenseId,
      billingCycle,
      amount: 0,
      currency: 'INR',
    }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to activate plan.');
  }
  return res.json();
}
