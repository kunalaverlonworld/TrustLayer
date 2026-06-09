// ─── Shared API config ────────────────────────────────────────────────────────
// All LMS calls must go through the TrustLayer backend proxy to avoid CORS.
// Update VITE_BACKEND_URL in your .env to your deployed backend Render URL.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export const BACKEND_URL = _env.VITE_BACKEND_URL || 'http://localhost:4000';
export const LMS_PROXY   = `${BACKEND_URL}/api/lms`;
export const PRODUCT_ID  = '6a26929078d2d302b575cc10';
