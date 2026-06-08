import { motion } from 'motion/react';
import { ArrowRight, Calendar } from 'lucide-react';

const C = {
  bg:        '#edf5fb',
  bgCard:    '#ffffff',
  navy:      '#0a1f3d',
  teal:      '#00b8d4',
  tealDark:  '#0097b2',
  tealLight: '#e0f7fa',
  blue:      '#1565c0',
  body:      '#475569',
  muted:     '#94a3b8',
  border:    '#e2eaf3',
  shadow:    'rgba(10,31,61,0.08)',
};

export default function FinalCTA() {
  return (
    <section style={{
      background: C.navy,
      padding: '100px 32px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: -80, left: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(0,184,212,0.15) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -80, right: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(21,101,192,0.20) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          

          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 58px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: 'white', margin: '0 0 22px', lineHeight: 1.08,
          }}>
            Build Smarter Hiring Decisions{' '}
            <span style={{ color: C.teal }}>with TrustLayer.</span>
          </h2>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.65, margin: '0 auto 44px', maxWidth: 560,
          }}>
            Join forward-thinking HR teams using AI-powered intelligence to prevent ghosting and build reliable hiring pipelines.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '15px 32px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: 15, fontWeight: 700, color: 'white',
                background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                boxShadow: '0 8px 32px rgba(0,184,212,0.40)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 14px 40px rgba(0,184,212,0.50)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(0,184,212,0.40)'; }}
            >
              Start Free Trial <ArrowRight size={16} />
            </button>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '14px 30px', borderRadius: 100, cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: 15, fontWeight: 600, color: 'white',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.22)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.5)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Calendar size={16} /> Schedule Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 28 }}>
            {[ 'No credit card required', 'Cancel anytime'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.62)', fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}