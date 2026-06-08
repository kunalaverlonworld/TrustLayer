import { useState } from "react";
import { Mail, Lock, ShieldCheck, User, Eye, EyeOff, X } from "lucide-react";

// ─── Password strength ────────────────────────────────────────────────────────

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
  onLoginSuccess?: (user: { name: string; email: string }) => void;
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
  const [showPw, setShowPw]             = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const resetAndToggle = (signUp: boolean) => {
    setIsSignUp(signUp); setHasError(false); setErrorMessage("");
    setPassword(""); setConfirm(""); setName("");
    setShowPw(false); setShowConfirm(false);
  };

  const passwordsMatch     = confirm.length > 0 && password === confirm;
  const confirmBorderColor = confirm.length === 0 ? "#E2EEF9" : passwordsMatch ? "#86efac" : "#fca5a5";
  const strengthScore      = getStrengthScore(password);
  const passwordValid      = strengthScore === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasError(false); setErrorMessage("");
    if (!email || !password) { setHasError(true); setErrorMessage("Email and password are required"); return; }
    if (isSignUp) {
      if (!name.trim()) { setHasError(true); setErrorMessage("Full name is required"); return; }
      if (!passwordValid) { setHasError(true); setErrorMessage("Password does not meet requirements"); return; }
      if (!passwordsMatch) { setHasError(true); setErrorMessage("Passwords do not match"); return; }
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      if (onLoginSuccess) {
        onLoginSuccess({
          name: isSignUp ? name : email.split("@")[0],
          email,
        });
      }
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
          background: rgba(10, 31, 61, 0.60);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: lp-overlay-in 0.2s ease both;
          box-sizing: border-box;
        }
        @keyframes lp-overlay-in { from { opacity: 0; } to { opacity: 1; } }

        /* ── Card: scrollable, full responsiveness ── */
        .lp-card {
          width: 100%;
          max-width: 420px;
          max-height: calc(100vh - 32px);
          border-radius: 20px;
          overflow: hidden;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(13,34,68,0.25), 0 4px 16px rgba(13,34,68,0.10);
          position: relative;
          z-index: 1;
          animation: lp-rise 0.35s cubic-bezier(0.22,1,0.36,1) both;
          display: flex;
          flex-direction: column;
          /* hide scrollbar visually */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .lp-card::-webkit-scrollbar { display: none; }
        @keyframes lp-rise {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Header ── */
        .lp-header {
          background: linear-gradient(135deg, #00B4D8 0%, #0096B7 40%, #0D2244 100%);
          padding: 20px 20px 16px;
          position: relative;
          flex-shrink: 0;
        }
        .lp-accent-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        }
        .lp-logo-row { display: flex; align-items: center; gap: 9px; margin-bottom: 12px; }
        .lp-logo-icon {
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lp-logo-name { font-size: 15px; font-weight: 800; color: white; letter-spacing: -0.01em; }
        .lp-logo-name span { color: rgba(255,255,255,0.6); font-weight: 400; }
        .lp-title { font-size: 18px; font-weight: 800; color: white; margin: 0 0 3px; letter-spacing: -0.02em; line-height: 1.2; }
        .lp-sub   { font-size: 11.5px; color: rgba(255,255,255,0.58); margin: 0; line-height: 1.4; }

        /* ── Close button ── */
        .lp-close-btn {
          position: absolute; top: 12px; right: 12px;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; padding: 0; flex-shrink: 0;
        }
        .lp-close-btn:hover { background: rgba(255,255,255,0.28); }

        /* ── Body ── */
        .lp-body {
          background: #F0F5FA;
          padding: 16px 16px 20px;
          flex: 1;
        }
        .lp-form-card {
          background: white;
          border-radius: 14px;
          border: 1px solid #E2EEF9;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(13,34,68,0.05);
        }
        .lp-hint { font-size: 11px; color: #94a3b8; margin: 0 0 12px; line-height: 1.4; }
        .lp-hint.err { color: #ef4444; font-weight: 700; }

        /* ── Form elements ── */
        .lp-label {
          display: block; font-size: 10px; font-weight: 800; color: #334155;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;
        }
        .lp-input-icon {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; width: 13px; height: 13px;
          pointer-events: none; display: flex; align-items: center;
        }
        .lp-input {
          width: 100%; box-sizing: border-box;
          padding: 8px 12px 8px 30px;
          background: #F8FBFF; border: 1.5px solid #E2EEF9;
          border-radius: 9px; font-size: 13px; color: #0D2244;
          outline: none; transition: border-color 0.15s, box-shadow 0.15s;
          -webkit-appearance: none;
        }
        .lp-input::placeholder { color: #B0C4D8; }
        .lp-input.err { border-color: #ef4444 !important; }
        .lp-input::-ms-reveal, .lp-input::-ms-clear { display: none !important; }

        /* ── Eye button ── */
        .lp-eye-btn {
          background: none; border: none; cursor: pointer; padding: 2px;
          color: #94a3b8; display: flex; align-items: center; transition: color 0.15s;
        }
        .lp-eye-btn:hover { color: #0096B7; }

        /* ── Forgot row ── */
        .lp-forgot-row { display: flex; justify-content: flex-end; margin-top: 3px; margin-bottom: 2px; }
        .lp-forgot-link {
          background: none; border: none; font-size: 11px; font-weight: 700;
          color: #00B4D8; cursor: pointer; padding: 0; transition: color 0.15s;
        }
        .lp-forgot-link:hover { color: #0096B7; text-decoration: underline; }

        /* ── Confirm password row ── */
        .lp-confirm-block { margin-top: 10px; }
        .lp-match-msg { font-size: 11px; font-weight: 600; margin-top: 4px; line-height: 1.3; }

        /* ── Submit ── */
        .lp-submit {
          width: 100%; padding: 11px;
          background: linear-gradient(135deg, #00B4D8, #0096B7);
          color: white; border: none; border-radius: 9px;
          font-size: 13px; font-weight: 800; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 14px;
          box-shadow: 0 4px 14px rgba(0,180,216,0.35);
          letter-spacing: 0.01em;
          -webkit-appearance: none;
        }
        .lp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,180,216,0.50); }
        .lp-submit:active:not(:disabled) { transform: translateY(0); }
        .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Toggle ── */
        .lp-toggle { text-align: center; margin-top: 12px; }
        .lp-toggle-btn {
          background: none; border: none; font-size: 12px; font-weight: 600;
          color: #0D2244; cursor: pointer; padding: 4px 0; line-height: 1.4;
        }
        .lp-toggle-btn:hover { color: #0096B7; }
        .lp-toggle-btn span { color: #00B4D8; }

        /* ── Trust badge ── */
        .lp-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 12px;
          font-size: 10.5px; color: #94a3b8; font-weight: 600; letter-spacing: 0.02em;
        }
        .lp-trust-dot { width: 5px; height: 5px; border-radius: 50%; background: #00B4D8; opacity: 0.5; }

        /* ── Spinner ── */
        .lp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4); border-top-color: white;
          border-radius: 50%; animation: lp-spin 0.7s linear infinite;
        }
        @keyframes lp-spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .lp-divider {
          height: 1px; background: #E2EEF9; margin: 12px 0;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 480px) {
          .lp-root { padding: 12px; }
          .lp-card { max-width: 100%; border-radius: 16px; max-height: calc(100vh - 24px); }
          .lp-header { padding: 16px 16px 14px; }
          .lp-body { padding: 14px 14px 18px; }
          .lp-form-card { padding: 14px; }
          .lp-title { font-size: 17px; }
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
            <p className={`lp-hint${hasError ? " err" : ""}`}>
              {hasError && errorMessage ? errorMessage : "Enter your credentials to continue"}
            </p>

            <form onSubmit={handleSubmit} autoComplete="off">
              <input type="text"     style={{ display: "none" }} autoComplete="username"         readOnly />
              <input type="password" style={{ display: "none" }} autoComplete="current-password" readOnly />

              {/* Name — signup only */}
              {isSignUp && (
                <Field
                  label="Full Name"
                  icon={<User size={13} />}
                  value={name}
                  onChange={setName}
                  placeholder="Your full name"
                />
              )}

              {/* Email */}
              <Field
                label="Email Address"
                icon={<Mail size={13} />}
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); setHasError(false); setErrorMessage(""); }}
                placeholder="you@company.com"
                hasError={hasError}
              />

              {/* Password */}
              <Field
                label="Password"
                icon={<Lock size={13} />}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(v) => { setPassword(v); setHasError(false); setErrorMessage(""); }}
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
                      onChange={(e) => setConfirm(e.target.value)}
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