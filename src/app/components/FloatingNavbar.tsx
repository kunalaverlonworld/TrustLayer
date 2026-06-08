import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

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
}

export default function FloatingNavbar({ onLoginClick }: FloatingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // label → the exact id on the section element
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
      const offset = 80; // navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

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