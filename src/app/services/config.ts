// ─── Shared API config ────────────────────────────────────────────────────────
// All LMS calls must go through the TrustLayer backend proxy to avoid CORS.
// Update VITE_BACKEND_URL in your .env to your deployed backend Render URL.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const BACKEND_URL = _env.VITE_BACKEND_URL || 'https://trustlayer-backend-d3as.onrender.com';
export const LMS_PROXY   = `${BACKEND_URL}/api/lms`;
export const PRODUCT_ID  = '6a26929078d2d302b575cc10';

export const getDashboardUrl = (): string => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5174';
  }
  return _env.VITE_DASHBOARD_URL || 'https://trustlayer-frontend.onrender.com';
};
