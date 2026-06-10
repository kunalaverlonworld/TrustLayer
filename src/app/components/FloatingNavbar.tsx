import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, User, CreditCard } from 'lucide-react';

const C = {
  bg:       '#edf5fb',
  bgCard:   '#ffffff',
  navy:     '#0a1f3d',
  teal:     '#00b8d4',
  tealDark: '#0097b2',
  body:     '#475569',
  muted:    '#94a3b8',
  border:   '#e2eaf3',
  shadow:   'rgba(10,31,61,0.08)',
};

interface FloatingNavbarProps {
  onLoginClick?: () => void;
  onDashboardClick?: () => void;
}

interface User {
  name: string;
  email: string;
  customerId: string;
  source: string;
}

// Read active license status — checks sessionStorage first, then localStorage backup
function getActiveLicense(): { planName: string; licenseType: string } | null {
  try {
    const raw = sessionStorage.getItem('tl_auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.activeLicense) return user.activeLicense;
    }
    // Fallback: plan persisted to localStorage across logout
    const planRaw = localStorage.getItem('tl_active_license');
    return planRaw ? JSON.parse(planRaw) : null;
  } catch {
    return null;
  }
}

export default function FloatingNavbar({ onLoginClick, onDashboardClick }: FloatingNavbarProps) {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [user, setUser]                 = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasLicense, setHasLicense]     = useState(false);
  const [showProfile, setShowProfile]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    // Read license status
    setHasLicense(!!getActiveLicense());

    // Listen for login and plan-purchase events
    const refreshUser = () => {
      const stored = localStorage.getItem('user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch {}
      }
      setHasLicense(!!getActiveLicense());
    };

    window.addEventListener('userLoggedIn', refreshUser);
    window.addEventListener('userLoggedOut', () => { setUser(null); setHasLicense(false); });
    window.addEventListener('planActivated', refreshUser); // fired after checkout success
    return () => {
      window.removeEventListener('userLoggedIn', refreshUser);
      window.removeEventListener('userLoggedOut', () => {});
      window.removeEventListener('planActivated', refreshUser);
    };
  }, []);

  const links: { label: string; id: string }[] = [
    { label: 'Features',  id: 'features'  },
    { label: 'AI Engine', id: 'ai-engine' },
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Security',  id: 'security'  },
    { label: 'Pricing',   id: 'pricing'   },
    { label: 'FAQ',       id: 'faq'       },
  ];

  const scroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    onDashboardClick?.();
  };

  const handleManagePlan = () => {
    setDropdownOpen(false);
    const el = document.getElementById('pricing');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };

  const handleMyProfile = () => {
    setDropdownOpen(false);
    setShowProfile(true);
  };

  // Helper — initials avatar
  const initials = user ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          borderBottom: scrolled ? `1px solid ${C.border}` : '1px solid transparent',
          boxShadow: scrolled ? `0 2px 24px ${C.shadow}` : 'none',
          transition: 'all 0.3s ease',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '0 32px',
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px rgba(0,184,212,0.30)`,
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>TL</span>
            </div>
            <span style={{ color: C.navy, fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>TrustLayer</span>
          </motion.div>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => scroll(link.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: 500, color: C.body,
                  padding: '4px 0', position: 'relative', transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                onMouseLeave={e => (e.currentTarget.style.color = C.body)}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }} className="nav-desktop">
            {user ? (
              <>
                {/* User dropdown button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 600, color: C.navy,
                    padding: '8px 12px', borderRadius: 100,
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.2s',
                    backgroundColor: dropdownOpen ? C.border : 'transparent',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = C.teal;
                    e.currentTarget.style.backgroundColor = C.border;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = C.navy;
                    if (!dropdownOpen) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{user.name}</span>
                  <ChevronDown size={16} style={{ 
                    transition: 'transform 0.2s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 60, right: 0,
                        background: 'white',
                        borderRadius: 16,
                        border: `1px solid ${C.border}`,
                        boxShadow: '0 16px 48px rgba(10,31,61,0.13)',
                        overflow: 'hidden',
                        minWidth: 240,
                      }}
                    >
                      {/* User header */}
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(135deg,#f0f7ff,#e8f4fb)',
                        borderBottom: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 800, color: 'white', flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(0,184,212,0.3)',
                        }}>{initials}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email}
                          </div>
                          {hasLicense && (
                            <div style={{
                              marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
                              color: 'white', fontSize: 9, fontWeight: 800,
                              padding: '2px 8px', borderRadius: 99, letterSpacing: '0.05em',
                            }}>
                              ✦ {(getActiveLicense()?.planName || 'Active').toUpperCase()} PLAN
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: '6px 0' }}>

                        {/* My Profile */}
                        <button
                          onClick={handleMyProfile}
                          style={{
                            width: '100%', textAlign: 'left',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13.5, fontWeight: 500, color: C.body,
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={14} color={C.teal} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: C.navy }}>My Profile</div>
                            <div style={{ fontSize: 11, color: C.muted }}>View account details</div>
                          </div>
                        </button>

                        {/* Manage Plan */}
                        <button
                          onClick={handleManagePlan}
                          style={{
                            width: '100%', textAlign: 'left',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13.5, fontWeight: 500, color: C.body,
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f0fff4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCard size={14} color='#10b981' />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: C.navy }}>Manage Plan</div>
                            <div style={{ fontSize: 11, color: C.muted }}>Upgrade or change plan</div>
                          </div>
                        </button>

                        {/* Dashboard — only with active license */}
                        {hasLicense && (
                          <button
                            onClick={handleDashboard}
                            style={{
                              width: '100%', textAlign: 'left',
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 13.5, fontWeight: 500, color: C.body,
                              padding: '10px 16px',
                              display: 'flex', alignItems: 'center', gap: 10,
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          >
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <LayoutDashboard size={14} color='#3b82f6' />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: C.navy }}>Dashboard</div>
                              <div style={{ fontSize: 11, color: C.muted }}>Open AI analytics</div>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Sign out */}
                      <div style={{ borderTop: `1px solid ${C.border}`, padding: '6px 0' }}>
                        <button
                          onClick={handleSignOut}
                          style={{
                            width: '100%', textAlign: 'left',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13.5, fontWeight: 500, color: '#ef4444',
                            padding: '10px 16px',
                            display: 'flex', alignItems: 'center', gap: 10,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fff5f5')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LogOut size={14} color='#ef4444' />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>Sign Out</div>
                            <div style={{ fontSize: 11, color: '#fca5a5' }}>End your session</div>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 600, color: C.navy,
                    padding: '8px 16px', borderRadius: 100,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.navy)}
                >
                  Login
                </button>
                <button
                  onClick={onLoginClick}
                  style={{
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 700, color: 'white',
                    padding: '9px 22px', borderRadius: 100,
                    boxShadow: '0 4px 14px rgba(0,184,212,0.30)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,184,212,0.40)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,184,212,0.30)'; }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.navy, display: 'none' }}
            className="nav-mobile-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: 'fixed', top: 76, left: 16, right: 16, zIndex: 99,
              background: 'white', borderRadius: 16, padding: 24,
              boxShadow: `0 8px 40px ${C.shadow}`,
              border: `1px solid ${C.border}`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => scroll(link.id)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15, fontWeight: 500, color: C.body,
                  padding: '11px 0',
                  borderBottom: `1px solid ${C.border}`,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.teal)}
                onMouseLeave={e => (e.currentTarget.style.color = C.body)}
              >
                {link.label}
              </button>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {user ? (
                <>
                  <div style={{
                    padding: '12px 0',
                    fontSize: 14, fontWeight: 600, color: C.navy,
                  }}>
                    Hi, {user.name}
                  </div>
                  {hasLicense && (
                    <button
                      onClick={handleDashboard}
                      style={{
                        background: 'none', border: `1.5px solid ${C.border}`, cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 14, fontWeight: 600, color: C.navy,
                        padding: '10px', borderRadius: 100, transition: 'border-color 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <LayoutDashboard size={15} color={C.teal} />
                      Dashboard
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    style={{
                      background: 'none', border: `1.5px solid #ef4444`, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14, fontWeight: 600, color: '#ef4444',
                      padding: '10px', borderRadius: 100,
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    style={{
                      background: 'none', border: `1.5px solid ${C.border}`, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14, fontWeight: 600, color: C.navy,
                      padding: '10px', borderRadius: 100, transition: 'border-color 0.2s',
                    }}
                  >
                    Login
                  </button>
                  <button style={{
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                    border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14, fontWeight: 700, color: 'white',
                    padding: '10px', borderRadius: 100,
                  }}>
                    Get Started
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>

      {/* ── Profile Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfile(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(10,31,61,0.45)', backdropFilter: 'blur(6px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24, fontFamily: "'Inter', sans-serif",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white', borderRadius: 20,
                boxShadow: '0 24px 80px rgba(10,31,61,0.18)',
                width: '100%', maxWidth: 420, overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg,#0a1f3d,#1565c0)',
                padding: '32px 24px 24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                position: 'relative',
              }}>
                <button
                  onClick={() => setShowProfile(false)}
                  style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                    color: 'white', borderRadius: 8, width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><X size={16} /></button>

                {/* Avatar */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#00b8d4,#0097b2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: 'white',
                  boxShadow: '0 8px 24px rgba(0,184,212,0.4)',
                  border: '3px solid rgba(255,255,255,0.3)',
                }}>{initials}</div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{user?.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{user?.email}</div>
                </div>

                {hasLicense && (
                  <div style={{
                    background: 'linear-gradient(135deg,#00b8d4,#0097b2)',
                    color: 'white', fontSize: 10, fontWeight: 800,
                    padding: '4px 14px', borderRadius: 99, letterSpacing: '0.08em',
                    boxShadow: '0 4px 12px rgba(0,184,212,0.4)',
                  }}>
                    ✦ {(getActiveLicense()?.planName || 'Active').toUpperCase()} PLAN
                  </div>
                )}
              </div>

              {/* Details */}
              <div style={{ padding: '24px' }}>
                {[
                  { label: 'Full Name',   value: user?.name  || '—' },
                  { label: 'Email',       value: user?.email || '—' },
                  { label: 'Account ID',  value: user?.customerId ? `#${user.customerId.slice(-8).toUpperCase()}` : '—' },
                  { label: 'Current Plan', value: getActiveLicense()?.planName || 'No active plan' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0a1f3d', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                  </div>
                ))}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button
                    onClick={() => { setShowProfile(false); handleManagePlan(); }}
                    style={{
                      flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                      background: 'linear-gradient(135deg,#00b8d4,#0097b2)',
                      border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <CreditCard size={14} /> Manage Plan
                  </button>
                  <button
                    onClick={() => { setShowProfile(false); handleSignOut(); }}
                    style={{
                      flex: 1, padding: '11px', borderRadius: 12, cursor: 'pointer',
                      background: '#fff5f5', border: '1.5px solid #fecdd3',
                      color: '#ef4444', fontSize: 13, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}