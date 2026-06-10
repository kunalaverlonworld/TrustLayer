import { useState } from "react";
import { Mail, Lock, ShieldCheck, User, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import {
  lmsLogin,
  lmsRegister,
  saveSession,
  loadSession,
} from "../services/authService";
import { LMS_PROXY, PRODUCT_ID } from "../services/config";

// ─── Error Banner ──────────────────────────────────────────────────────────

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return message ? (
    <div
      style={{
        background: "#fff1f2",
        border: "1.5px solid #fecdd3",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 14,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#ffe4e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <AlertCircle size={14} color="#e11d48" />
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            fontWeight: 700,
            color: "#be123c",
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            margin: "2px 0 0 0",
            fontSize: 11.5,
            color: "#e11d48",
            lineHeight: 1.45,
          }}
        >
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#fda4af",
          padding: 2,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <X size={13} />
      </button>
    </div>
  ) : null;
}

function ValidationBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return message ? (
    <div
      style={{
        background: "#fffbeb",
        border: "1.5px solid #fde68a",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 14,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#fef3c7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <AlertCircle size={14} color="#d97706" />
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12.5,
            fontWeight: 700,
            color: "#b45309",
          }}
        >
          Check your details
        </p>
        <p
          style={{
            margin: "2px 0 0 0",
            fontSize: 11.5,
            color: "#d97706",
            lineHeight: 1.45,
          }}
        >
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#fcd34d",
          padding: 2,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <X size={13} />
      </button>
    </div>
  ) : null;
}

// ─── Password strength ────────────────────────────────────────────────────────────

function getStrengthScore(pw: string) {
  return [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /[0-9]/.test(pw)].filter(Boolean).length;
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { label: "8+ chars",  ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Lowercase", ok: /[a-z]/.test(password) },
    { label: "Number",    ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColor = score <= 1 ? "#f87171" : score === 2 ? "#fb923c" : score === 3 ? "#facc15" : "#4ade80";
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][score];
  return (
    <div style={{ margin: "8px 0 10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <div style={{ display: "flex", flex: 1, gap: 3 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i <= score ? barColor : "#E2EEF9", transition: "background 0.25s" }} />
          ))}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: barColor, minWidth: 32 }}>{strengthLabel}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {checks.map((c) => (
          <span key={c.label} style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 20,
            border: `1px solid ${c.ok ? "#00B4D8" : "#E2EEF9"}`,
            background: c.ok ? "rgba(0,180,216,0.08)" : "transparent",
            color: c.ok ? "#0096B7" : "#94a3b8",
            fontWeight: 600, transition: "all 0.2s",
          }}>
            {c.ok ? "✓ " : ""}{c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, icon, type = "text", value, onChange, placeholder, hasError, rightSlot, noMargin }: {
  label: string; icon: React.ReactNode; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; hasError?: boolean;
  rightSlot?: React.ReactNode; noMargin?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: noMargin ? 0 : 10 }}>
      <label className="lp-label">{label}</label>
      <div style={{ position: "relative" }}>
        <span className="lp-input-icon">{icon}</span>
        <input
          type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          autoComplete="off"
          className={`lp-input${hasError ? " err" : ""}`}
          style={{
            paddingRight: rightSlot ? 34 : 12,
            borderColor: hasError ? "#ef4444" : focused ? "#00B4D8" : "#E2EEF9",
            boxShadow: focused ? "0 0 0 3px rgba(0,180,216,0.10)" : hasError ? "0 0 0 3px rgba(239,68,68,0.10)" : "none",
          }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

function EyeBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="lp-eye-btn">
      {show ? <EyeOff size={13} /> : <Eye size={13} />}
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface LoginPageProps {
  onForgotPassword?: () => void;
  onClose?: () => void;
  onLoginSuccess?: (name: string, hasLicense: boolean) => void;
}

export default function LoginPage({ onForgotPassword, onClose, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [name, setName]                 = useState("");
  const [isSignUp, setIsSignUp]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [hasError, setHasError]         = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const clearErrors = () => {
    setErrorMessage("");
    setValidationMessage("");
    setHasError(false);
  };

  const resetAndToggle = (signUp: boolean) => {
    setIsSignUp(signUp);
    setPassword("");
    setConfirm("");
    setName("");
    setShowPw(false);
    setShowConfirm(false);
    setAccountCreated(false);
    clearErrors();
  };

  const passwordsMatch     = confirm.length > 0 && password === confirm;
  const confirmBorderColor = confirm.length === 0 ? "#E2EEF9" : passwordsMatch ? "#86efac" : "#fca5a5";
  const strengthScore      = getStrengthScore(password);
  const passwordValid      = strengthScore === 4;

  const checkActiveLicense = async (userEmail: string): Promise<{ licenseType: string; planName: string } | null> => {
    try {
      const response = await fetch(
        `${LMS_PROXY}/active-license/${encodeURIComponent(userEmail)}?productId=${PRODUCT_ID}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.activeLicense && data.activeLicense.status === "active") {
          const lt = data.activeLicense.licenseTypeId ?? data.activeLicense.licenseType ?? {};
          return {
            licenseType: lt._id ?? "",
            planName: lt.name ?? "Active",
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error checking active license:", error);
      return null;
    }
  };

  const handlePostLoginActions = async (userEmail: string, userName: string) => {
    // Fetch active license FIRST, then save and notify — avoids race where navbar
    // reads sessionStorage before activeLicense is written.
    const activeLicense = await checkActiveLicense(userEmail);

    // Save license status inside session storage user object so App.tsx reads it correctly
    const authUser = loadSession();
    if (authUser) {
      authUser.activeLicense = activeLicense;
      saveSession(authUser);
    }

    // Only NOW notify listeners — sessionStorage has the full user + activeLicense
    window.dispatchEvent(new Event("userLoggedIn"));
    window.dispatchEvent(new Event("userLoginStatusChanged"));
    if (activeLicense) window.dispatchEvent(new Event("planActivated"));

    onLoginSuccess?.(userName, !!activeLicense);
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email || !password || (isSignUp && !name)) {
      setValidationMessage("Please fill in all fields.");
      return;
    }

    if (isSignUp && !passwordValid) {
      setValidationMessage("Password must be 8+ characters with uppercase, lowercase, and a number.");
      return;
    }

    if (isSignUp && !passwordsMatch) {
      setValidationMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        try {
          const authUser = await lmsRegister({
            name,
            email,
            password,
          });

          const user = {
            name: name || email.split("@")[0],
            email,
            source: "trustlayer",
            customerId: authUser._id,
          };

          localStorage.setItem("user", JSON.stringify(user));

          setLoading(false);
          setIsSignUp(false);
          setAccountCreated(true);
          setPassword("");
          setConfirm("");

          setTimeout(() => setAccountCreated(false), 4000);
          return;
        } catch (signupError: any) {
          setLoading(false);
          setErrorMessage(
            signupError.message ||
            "Failed to create account. Please try again."
          );
          return;
        }
      }

      try {
        const authUser = await lmsLogin({ email, password });

        // Save to sessionStorage so App.tsx can read user via loadSession()
        saveSession(authUser);

        const user = {
          name: authUser.name || email.split("@")[0],
          email: authUser.email || email,
          source: "trustlayer",
          customerId: authUser._id,
        };

        localStorage.setItem("user", JSON.stringify(user));

        setLoading(false);
        await handlePostLoginActions(user.email, user.name);
      } catch (loginError: any) {
        setLoading(false);
        console.error("Login error:", loginError);
        setHasError(true);
        setErrorMessage(
          loginError?.message ||
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (err: any) {
      setLoading(false);
      setHasError(true);
      setErrorMessage(
        err.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="lp-root" onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <style>{`
        .lp-root {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: rgba(4, 11, 22, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: lp-overlay-in 0.2s ease both;
          box-sizing: border-box;
        }
        @keyframes lp-overlay-in { from { opacity: 0; } to { opacity: 1; } }

        .lp-card {
          width: 100%;
          max-width: 420px;
          max-height: calc(100vh - 32px);
          border-radius: 24px;
          overflow: hidden;
          overflow-y: auto;
          background: linear-gradient(135deg, #091526 0%, #030811 100%);
          border: 1px solid rgba(0, 184, 212, 0.25);
          box-shadow: 0 24px 64px rgba(6, 13, 26, 0.6), inset 0 1px 1px rgba(255,255,255,0.1);
          position: relative;
          z-index: 1;
          animation: lp-rise 0.35s cubic-bezier(0.22,1,0.36,1) both;
          display: flex;
          flex-direction: column;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .lp-card::-webkit-scrollbar { display: none; }
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lp-header {
          background: linear-gradient(135deg, rgba(0,180,216,0.1) 0%, rgba(13,34,68,0.2) 100%);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 24px 24px 18px;
          position: relative;
          flex-shrink: 0;
        }
        .lp-accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,184,212,0.4), transparent);
        }
        .lp-logo-row { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .lp-logo-icon {
          width: 34px; height: 34px;
          background: rgba(0,184,212,0.15);
          border: 1.5px solid rgba(0,184,212,0.35);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 12px rgba(0,184,212,0.25);
        }
        .lp-logo-name { font-size: 15px; font-weight: 800; color: white; letter-spacing: -0.01em; }
        .lp-logo-name span { color: #00B4D8; font-weight: 400; }
        .lp-title { font-size: 20px; font-weight: 900; color: white; margin: 0 0 4px; letter-spacing: -0.02em; line-height: 1.2; }
        .lp-sub   { font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.4; }

        .lp-close-btn {
          position: absolute; top: 16px; right: 16px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; padding: 0; flex-shrink: 0;
        }
        .lp-close-btn:hover { background: rgba(255,255,255,0.15); color: white; }

        .lp-body {
          padding: 20px 24px 28px;
          flex: 1;
        }
        .lp-form-card {
          background: transparent;
          border-radius: 0;
          border: none;
          padding: 0;
          box-shadow: none;
        }
        .lp-hint { font-size: 11px; color: #64748b; margin: 0 0 16px; line-height: 1.4; }

        .lp-label {
          display: block; font-size: 10px; font-weight: 800; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;
        }
        .lp-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(148, 163, 184, 0.6); width: 13px; height: 13px;
          pointer-events: none; display: flex; align-items: center;
        }
        .lp-input {
          width: 100%; box-sizing: border-box;
          padding: 10px 12px 10px 32px;
          background: rgba(10, 31, 61, 0.45); border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px; font-size: 13px; color: white;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }
        .lp-input::placeholder { color: rgba(148, 163, 184, 0.4); }
        .lp-input.err { border-color: #ef4444 !important; }
        .lp-input::-ms-reveal, .lp-input::-ms-clear { display: none !important; }

        .lp-eye-btn {
          background: none; border: none; cursor: pointer; padding: 2px;
          color: #94a3b8; display: flex; align-items: center; transition: color 0.15s;
        }
        .lp-eye-btn:hover { color: #00b8d4; }

        .lp-forgot-row { display: flex; justify-content: flex-end; margin-top: 5px; margin-bottom: 2px; }
        .lp-forgot-link {
          background: none; border: none; font-size: 11px; font-weight: 700;
          color: #00b8d4; cursor: pointer; padding: 0; transition: color 0.15s;
        }
        .lp-forgot-link:hover { color: #0096B7; text-decoration: underline; }

        .lp-confirm-block { margin-top: 12px; }
        .lp-match-msg { font-size: 11px; font-weight: 600; margin-top: 4px; line-height: 1.3; }

        .lp-submit {
          width: 100%; padding: 12px;
          background: linear-gradient(135deg, #00b8d4, #0097b2);
          color: white; border: none; border-radius: 10px;
          font-size: 14px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 18px;
          box-shadow: 0 4px 20px rgba(0,184,212,0.3);
          letter-spacing: 0.01em;
          -webkit-appearance: none;
        }
        .lp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,184,212,0.45); }
        .lp-submit:active:not(:disabled) { transform: translateY(0); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-toggle { text-align: center; margin-top: 16px; }
        .lp-toggle-btn {
          background: none; border: none; font-size: 12.5px; font-weight: 600;
          color: #94a3b8; cursor: pointer; padding: 4px 0; line-height: 1.4;
        }
        .lp-toggle-btn:hover { color: white; }
        .lp-toggle-btn span { color: #00b8d4; }

        .lp-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 16px;
          font-size: 11px; color: rgba(148, 163, 184, 0.5); font-weight: 600; letter-spacing: 0.02em;
        }
        .lp-trust-dot { width: 5px; height: 5px; border-radius: 50%; background: #00b8d4; opacity: 0.4; }

        .lp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: white;
          border-radius: 50%; animation: lp-spin 0.7s linear infinite;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }

        .lp-divider {
          height: 1px; background: rgba(255,255,255,0.06); margin: 14px 0;
        }

        @media (max-width: 480px) {
          .lp-root { padding: 12px; }
          .lp-card { max-width: 100%; border-radius: 20px; max-height: calc(100vh - 24px); }
          .lp-header { padding: 20px 20px 16px; }
          .lp-body { padding: 16px 20px 24px; }
          .lp-title { font-size: 18px; }
        }
      `}</style>

      <div className="lp-card">
        {/* ── Header ── */}
        <div className="lp-header">
          <div className="lp-logo-row">
            <div className="lp-logo-icon">
              <ShieldCheck size={17} color="white" />
            </div>
            <span className="lp-logo-name">Trust<span>Layer</span></span>
          </div>
          <h1 className="lp-title">{isSignUp ? "Create Your Account" : "Welcome Back"}</h1>
          <p className="lp-sub">
            {isSignUp ? "Sign up to get started with TrustLayer" : "Sign in to access your dashboard"}
          </p>
          <div className="lp-accent-bar" />
          {onClose && (
            <button className="lp-close-btn" onClick={onClose} type="button" aria-label="Close">
              <X size={13} />
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div className="lp-body">
          <div className="lp-form-card">
            {/* Account Created Success Banner */}
            {accountCreated && (
              <div
                style={{
                  background: "rgba(22,163,74,0.1)",
                  border: "1.5px solid rgba(22,163,74,0.3)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(22,163,74,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1.5 4L3.5 6L6.5 2"
                      stroke="#4ade80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: "#4ade80" }}>
                    Account created successfully!
                  </p>
                  <p style={{ margin: 0, fontSize: 11.5, color: "#86efac" }}>
                    Please sign in to continue
                  </p>
                </div>
              </div>
            )}

            {/* Error & Validation Banners */}
            {errorMessage && (
              <div
                style={{
                  background: "rgba(220,38,38,0.1)",
                  border: "1.5px solid rgba(220,38,38,0.25)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(220,38,38,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <AlertCircle size={14} color="#f87171" />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#f87171",
                    }}
                  >
                    Something went wrong
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: 11.5,
                      color: "#fca5a5",
                      lineHeight: 1.45,
                    }}
                  >
                    {errorMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fca5a5",
                    padding: 2,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {validationMessage && (
              <div
                style={{
                  background: "rgba(245,158,11,0.1)",
                  border: "1.5px solid rgba(245,158,11,0.25)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(245,158,11,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <AlertCircle size={14} color="#fbbf24" />
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#fbbf24",
                    }}
                  >
                    Check your details
                  </p>
                  <p
                    style={{
                      margin: "2px 0 0 0",
                      fontSize: 11.5,
                      color: "#fde047",
                      lineHeight: 1.45,
                    }}
                  >
                    {validationMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValidationMessage("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#fde047",
                    padding: 2,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            )}

            <p className="lp-hint">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} autoComplete="off">
              <input type="text"     style={{ display: "none" }} autoComplete="username"         readOnly />
              <input type="password" style={{ display: "none" }} autoComplete="current-password" readOnly />

              {/* Name — signup only */}
              {isSignUp && (
                <Field
                  label="Full Name"
                  icon={<User size={13} />}
                  value={name}
                  onChange={(v) => { setName(v); clearErrors(); }}
                  placeholder="Your full name"
                />
              )}

              {/* Email */}
              <Field
                label="Email Address"
                icon={<Mail size={13} />}
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); clearErrors(); }}
                placeholder="you@company.com"
                hasError={hasError}
              />

              {/* Password */}
              <Field
                label="Password"
                icon={<Lock size={13} />}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(v) => { setPassword(v); clearErrors(); }}
                placeholder="••••••••"
                hasError={hasError}
                noMargin={!isSignUp}
                rightSlot={<EyeBtn show={showPw} onToggle={() => setShowPw((v) => !v)} />}
              />

              {/* Forgot password — login only */}
              {!isSignUp && (
                <div className="lp-forgot-row">
                  <button type="button" className="lp-forgot-link" onClick={() => onForgotPassword?.()}>
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Strength meter — signup only */}
              {isSignUp && <PasswordStrength password={password} />}

              {/* Confirm password — signup only */}
              {isSignUp && (
                <div className="lp-confirm-block">
                  <label className="lp-label">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <span className="lp-input-icon"><Lock size={13} /></span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); clearErrors(); }}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className="lp-input"
                      style={{
                        paddingRight: 34,
                        borderColor: confirmBorderColor,
                        boxShadow: confirm.length > 0
                          ? `0 0 0 3px ${passwordsMatch ? "rgba(134,239,172,0.2)" : "rgba(252,165,165,0.2)"}`
                          : "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="lp-eye-btn"
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}
                    >
                      {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  {confirm.length > 0 && (
                    <p className="lp-match-msg" style={{ color: passwordsMatch ? "#16a34a" : "#dc2626" }}>
                      {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="lp-submit" disabled={loading}>
                {loading
                  ? <><div className="lp-spinner" />Processing…</>
                  : <><ShieldCheck style={{ width: 15, height: 15 }} />{isSignUp ? "Create Account" : "Sign In"}</>
                }
              </button>
            </form>
          </div>

          {/* Toggle */}
          <div className="lp-toggle">
            <button type="button" onClick={() => resetAndToggle(!isSignUp)} className="lp-toggle-btn">
              {isSignUp
                ? <>Already have an account? <span>Sign in</span></>
                : <>Don't have an account? <span>Sign up</span></>
              }
            </button>
          </div>

          {/* Trust badge */}
          <div className="lp-trust">
            <div className="lp-trust-dot" />
            Secured by TrustLayer
            <div className="lp-trust-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}