import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import FloatingNavbar from './components/FloatingNavbar';
import HeroSection from './components/HeroSection';
import TrustAnalytics from './components/TrustAnalytics';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import DashboardShowcase from './components/DashboardShowcase';
import AITrustEngine from './components/AITrustEngine';
import SecuritySection from './components/SecuritySection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import { ContactSupport } from './components/ContactSupport';
import Footer from './components/Footer';
import './styles.css';
import LoginPage from './components/LoginPage';
import { loadSession, saveSession, clearSession, type AuthUser } from './services/authService';
import CheckoutModal from './components/CheckoutModal';
import { Toaster } from './components/ui/sonner';

// ── Loader ────────────────────────────────────────────────────────────────────
function Loader() {
  const wrapRef    = useRef(null);
  const poweredRef = useRef(null);
  const brandRef   = useRef(null);
  const cursorRef  = useRef(null);
  const lineRef    = useRef(null);
  const tagRef     = useRef(null);

  useEffect(() => {
    const POWERED = 'Powered by ';
    const BRAND   = 'Averlon';

    if (poweredRef.current) (poweredRef.current as HTMLSpanElement).textContent = '';
    if (brandRef.current)   (brandRef.current as HTMLSpanElement).textContent   = '';

    const tl = gsap.timeline();

    tl.fromTo(wrapRef.current,  { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.inOut' });
    tl.fromTo(lineRef.current,  { scaleX: 0 },  { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, '-=0.9');

    POWERED.split('').forEach(c =>
      tl.call(() => { if (poweredRef.current) (poweredRef.current as HTMLSpanElement).textContent += c; }, [], '+=0.055')
    );
    tl.call(() => {}, [], '+=0.2');
    BRAND.split('').forEach(c =>
      tl.call(() => { if (brandRef.current) (brandRef.current as HTMLSpanElement).textContent += c; }, [], '+=0.08')
    );

    tl.fromTo(tagRef.current,   { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.25');
    tl.to(cursorRef.current,    { opacity: 0, duration: 0.3, repeat: 3, yoyo: true }, '+=0.3');
    tl.to(wrapRef.current,      { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '+=0.2');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={wrapRef} style={{
      position: 'fixed', inset: 0, zIndex: 9999, opacity: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #060D1A, #0B1628, #0D1F3C)',
      margin: 0, padding: 0,
    }}>
      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        width: 'min(700px, 100vw)', height: 'min(400px, 60vw)',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,184,212,0.13), transparent 70%)',
        filter: 'blur(20px)', pointerEvents: 'none',
      }} />

      <div style={{
        textAlign: 'center',
        padding: '0 24px',
        width: '100%',
        maxWidth: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Typewriter row */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(20px, 6vw, 42px)',
          fontWeight: 300,
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'nowrap',
          width: '100%',
        }}>
          <span ref={poweredRef} style={{ color: '#475569', letterSpacing: '0.06em' }} />
          <span ref={brandRef} style={{
            background: 'linear-gradient(135deg, #00b8d4, #7dd3fc, #fff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontWeight: 700, letterSpacing: '0.04em',
          }} />
          <span ref={cursorRef} style={{
            display: 'inline-block', width: 2, height: '0.9em',
            background: '#00b8d4', marginLeft: 4,
            verticalAlign: 'middle', borderRadius: 1,
            boxShadow: '0 0 8px rgba(0,184,212,0.7)',
            animation: 'tl-blink 1.1s ease-in-out infinite',
            flexShrink: 0,
          }} />
        </div>

        {/* Divider line */}
        <div ref={lineRef} style={{
          marginTop: 16,
          height: 1,
          width: '100%',
          maxWidth: 360,
          background: 'linear-gradient(90deg, transparent, rgba(0,184,212,0.7), transparent)',
          transform: 'scaleX(0)', transformOrigin: 'center',
        }} />

        {/* Tagline */}
        <p ref={tagRef} style={{
          marginTop: 20,
          fontSize: 'clamp(9px, 2.5vw, 13px)',
          opacity: 0,
          color: '#94a3b8',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Empowering Businesses with Strength.
        </p>
      </div>

      <style>{`@keyframes tl-blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading]         = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin]     = useState(false);

  // Auth state — restored from sessionStorage on mount
  const [user, setUser] = useState<AuthUser | null>(() => loadSession());

  // Checkout state
  const [checkout, setCheckout] = useState<{
    open: boolean;
    planId?: string;
    cycle?: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  }>({ open: false });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const handleLoginSuccess = (authUser: AuthUser) => {
    setUser(authUser);
    setShowLogin(false);
    // If no active license, scroll to pricing so they can pick a plan
    if (!authUser.activeLicense) {
      setTimeout(() => {
        const el = document.getElementById('pricing');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }, 400);
    }
  };

  const handlePlanSelect = (
    planId: string,
    cycle: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly'
  ) => {
    if (!user) {
      // Not logged in — prompt login first, then they can come back
      setShowLogin(true);
      return;
    }
    setCheckout({ open: true, planId, cycle });
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  // Contact page view
  if (showContact) {
    return (
      <>
        {loading && <Loader />}
        <Toaster />
        <div className="min-h-screen">
          <FloatingNavbar
            onLoginClick={() => setShowLogin(true)}
            user={user}
            onLogout={handleLogout}
          />
          <div style={{ paddingTop: 68 }}>
            <ContactSupport onBack={() => setShowContact(false)} />
          </div>
          {showLogin && (
            <LoginPage
              onClose={() => setShowLogin(false)}
              onForgotPassword={() => setShowLogin(false)}
              onSuccess={handleLoginSuccess}
              onNavigateToPricing={() => {
                setShowLogin(false);
                setShowContact(false);
                setTimeout(() => {
                  const el = document.getElementById('pricing');
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                }, 100);
              }}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {loading && <Loader />}
      <Toaster />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a] text-white">
        <FloatingNavbar
          onLoginClick={() => setShowLogin(true)}
          user={user}
          onLogout={handleLogout}
        />

        {showLogin && (
          <LoginPage
            onClose={() => setShowLogin(false)}
            onForgotPassword={() => setShowLogin(false)}
            onSuccess={handleLoginSuccess}
            onNavigateToPricing={() => {
              setShowLogin(false);
              setTimeout(() => {
                const el = document.getElementById('pricing');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        <HeroSection onBookDemo={() => setShowContact(true)} />
        <TrustAnalytics />
        <FeaturesSection />
        <HowItWorks />
        <DashboardShowcase />
        <AITrustEngine />
        <SecuritySection />
        <PricingSection
          onContactClick={() => setShowContact(true)}
          onPlanSelect={handlePlanSelect}
        />
        <FAQSection onContactClick={() => setShowContact(true)} />
        <Footer />
      </div>

      <CheckoutModal
        isOpen={checkout.open}
        onClose={() => setCheckout({ open: false })}
        preselectedPlanId={checkout.planId}
        preselectedCycle={checkout.cycle}
        onNeedLogin={() => { setCheckout({ open: false }); setShowLogin(true); }}
        onSuccess={(planName, planId) => {
          if (user) {
            const updated = {
              ...user,
              activeLicense: {
                licenseType: planId,
                planName: planName,
              },
            };
            setUser(updated);
            saveSession(updated);
          }
        }}
      />
    </>
  );
}