import express, { Request, Response } from "express";

const router = express.Router();

const LMS_BASE   = process.env.LMS_BASE || "https://license-system-v6ht.onrender.com";
const LMS_API_KEY = process.env.LMS_API_KEY || "my-secret-key-123";
const PRODUCT_ID  = "6a26929078d2d302b575cc10";

const LMS_TIMEOUT_MS = 8000;  // 8 s per attempt
const LMS_MAX_RETRIES = 3;    // total attempts for network errors / 5xx

// Wrap fetch with a timeout signal
function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

// Helper: forward a request to LMS with timeout + exponential-backoff retries.
// Retries on:  network errors (fetch throws) and 5xx LMS responses.
// Passes through immediately: 4xx responses (client errors — no point retrying).
async function proxyToLMS(
  method: string,
  path: string,
  body?: object,
  extraHeaders?: Record<string, string>
): Promise<{ status: number; data: unknown }> {
  const url = `${LMS_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": LMS_API_KEY,
    ...(extraHeaders ?? {}),
  };
  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= LMS_MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(url, fetchOptions, LMS_TIMEOUT_MS);

      // Don't retry 4xx — those are client mistakes
      if (res.status >= 400 && res.status < 500) {
        let data: unknown;
        try { data = await res.json(); } catch { data = { message: "No JSON body" }; }
        return { status: res.status, data };
      }

      // 5xx — log and retry
      if (res.status >= 500) {
        console.warn(`[LMSProxy] attempt ${attempt}/${LMS_MAX_RETRIES} — LMS returned ${res.status} for ${method} ${path}`);
        lastError = new Error(`LMS ${res.status}`);
      } else {
        // 2xx / 3xx — success
        let data: unknown;
        try { data = await res.json(); } catch { data = { message: "No JSON body" }; }
        return { status: res.status, data };
      }
    } catch (err: any) {
      const reason = err?.name === "AbortError" ? `timeout after ${LMS_TIMEOUT_MS}ms` : err?.message;
      console.warn(`[LMSProxy] attempt ${attempt}/${LMS_MAX_RETRIES} — network error: ${reason} for ${method} ${path}`);
      lastError = err;
    }

    // Exponential backoff before next attempt: 500ms, 1000ms, 2000ms …
    if (attempt < LMS_MAX_RETRIES) {
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
    }
  }

  console.error(`[LMSProxy] all ${LMS_MAX_RETRIES} attempts failed for ${method} ${path}`, lastError);
  return { status: 502, data: { success: false, message: "LMS service unavailable after retries" } };
}

// ── POST /api/lms/login ────────────────────────────────────────────────────────
// Body: { email, password }
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required" });
    }
    const { status, data } = await proxyToLMS("POST", "/api/external/customer-login", {
      email,
      password,
    });
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /login error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── POST /api/lms/register ────────────────────────────────────────────────────
// Body: { name, email, password, source? }
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, source } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email and password are required" });
    }
    const { status, data } = await proxyToLMS("POST", "/api/external/customer-sync", {
      name,
      email,
      password,
      source: source || "trustlayer",
    });
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /register error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── GET /api/lms/active-license/:email ────────────────────────────────────────
// Query: ?productId=...
router.get("/active-license/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const productId = (req.query.productId as string) || PRODUCT_ID;
    const { status, data } = await proxyToLMS(
      "GET",
      `/api/external/active-license/${encodeURIComponent(email)}?productId=${productId}`
    );
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /active-license error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── GET /api/lms/plans ─────────────────────────────────────────────────────────
// Returns all license plans for the TrustLayer product
router.get("/plans", async (_req: Request, res: Response) => {
  try {
    const { status, data } = await proxyToLMS(
      "GET",
      `/api/license/public/licenses-by-product/${PRODUCT_ID}`
    );
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /plans error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── POST /api/lms/payment/create-order ────────────────────────────────────────
// Body: { userId, licenseId, billingCycle, amount }
router.post("/payment/create-order", async (req: Request, res: Response) => {
  try {
    const { userId, licenseId, billingCycle, amount } = req.body;
    const { status, data } = await proxyToLMS("POST", "/api/payment/create-order", {
      userId,
      licenseId,
      billingCycle,
      amount,
    });
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /payment/create-order error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── POST /api/lms/payment/verify ──────────────────────────────────────────────
// Body: { razorpay_payment_id, razorpay_order_id, razorpay_signature, transactionId? }
router.post("/payment/verify", async (req: Request, res: Response) => {
  try {
    const { status, data } = await proxyToLMS("POST", "/api/payment/verify-payment", req.body);
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /payment/verify error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

// ── POST /api/lms/password-sync ───────────────────────────────────────────────
// Body: { email, passwordHash }
router.post("/password-sync", async (req: Request, res: Response) => {
  try {
    const { email, passwordHash } = req.body;
    const { status, data } = await proxyToLMS("POST", "/api/external/customer-password-sync", {
      email,
      passwordHash,
    });
    return res.status(status).json(data);
  } catch (err: any) {
    console.error("[LMSProxy] /password-sync error:", err.message);
    return res.status(502).json({ success: false, message: "LMS service unavailable" });
  }
});

export default router;
