import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, LayoutDashboard, User, LogOut, Settings, CreditCard } from 'lucide-react';
import type { AuthUser } from '../services/authService';

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
  user?: AuthUser | null;
  onLogout?: () => void;
}

export default function FloatingNavbar({ onLoginClick, user, onLogout }: FloatingNavbarProps) {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  // User initials avatar
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const dropdownItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      onClick: () => {
        window.open('https://app.trustlayer.io/dashboard', '_blank');
        setDropdownOpen(false);
      },
    },
    {
      icon: CreditCard,
      label: 'My Plan',
      onClick: () => {
        const el = document.getElementById('pricing');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        setDropdownOpen(false);
      },
    },
    {
      icon: User,
      label: 'Profile',
      onClick: () => { setDropdownOpen(false); },
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => { setDropdownOpen(false); },
    },
  ];

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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }} className="nav-desktop">
            {user ? (
              /* ── Logged-in user dropdown ── */
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'none', border: `1.5px solid ${C.border}`,
                    borderRadius: 100, cursor: 'pointer', padding: '5px 12px 5px 5px',
                    fontFamily: "'Inter', sans-serif",
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxShadow: dropdownOpen ? `0 0 0 3px rgba(0,184,212,0.12)` : 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
                  onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = C.border; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ color: 'white', fontWeight: 800, fontSize: 11 }}>{initials}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name || user.email}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{
                      color: C.muted,
                      transition: 'transform 0.2s',
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        width: 220, background: 'white',
                        borderRadius: 14, border: `1px solid ${C.border}`,
                        boxShadow: `0 8px 32px rgba(10,31,61,0.12)`,
                        overflow: 'hidden', zIndex: 200,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {/* User info header */}
                      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.border}`, background: '#f8fbff' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </div>
                        {user.activeLicense && (
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 5, padding: '2px 8px', borderRadius: 20,
                            background: 'rgba(0,184,212,0.10)', fontSize: 10,
                            fontWeight: 700, color: C.tealDark,
                          }}>
                            {user.activeLicense.planName} Plan
                          </div>
                        )}
                      </div>

                      {/* Menu items */}
                      <div style={{ padding: '6px 0' }}>
                        {dropdownItems.map(item => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.label}
                              onClick={item.onClick}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                width: '100%', padding: '9px 14px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 13, fontWeight: 500, color: C.body,
                                textAlign: 'left', transition: 'background 0.15s, color 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#f0f9fc'; e.currentTarget.style.color = C.teal; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.body; }}
                            >
                              <Icon size={15} style={{ flexShrink: 0 }} />
                              {item.label}
                            </button>
                          );
                        })}

                        {/* Divider + Logout */}
                        <div style={{ height: 1, background: C.border, margin: '6px 0' }} />
                        <button
                          onClick={() => { onLogout?.(); setDropdownOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            width: '100%', padding: '9px 14px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 13, fontWeight: 600, color: '#ef4444',
                            textAlign: 'left', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                        >
                          <LogOut size={15} style={{ flexShrink: 0 }} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Guest buttons ── */
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
                  {/* Mobile user info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ color: 'white', fontWeight: 800, fontSize: 12 }}>{initials}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{user.email}</div>
                    </div>
                  </div>
                  {dropdownItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.label} onClick={() => { item.onClick(); setMobileOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          background: 'none', border: `1.5px solid ${C.border}`, cursor: 'pointer',
                          fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                          color: C.body, padding: '10px 14px', borderRadius: 10,
                        }}
                      >
                        <Icon size={15} />{item.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => { onLogout?.(); setMobileOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#fff5f5', border: '1.5px solid #fecaca', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                      color: '#ef4444', padding: '10px 14px', borderRadius: 10,
                    }}
                  >
                    <LogOut size={15} />Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onLoginClick?.(); setMobileOpen(false); }}
                    style={{
                      background: 'none', border: `1.5px solid ${C.border}`, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14, fontWeight: 600, color: C.navy,
                      padding: '10px', borderRadius: 100, transition: 'border-color 0.2s',
                    }}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { onLoginClick?.(); setMobileOpen(false); }}
                    style={{
                      background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                      border: 'none', cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14, fontWeight: 700, color: 'white',
                      padding: '10px', borderRadius: 100,
                    }}
                  >
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
    </>
  );
}