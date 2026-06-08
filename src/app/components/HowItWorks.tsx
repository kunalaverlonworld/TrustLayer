// NOTE: This is the upgraded HowItWorks.tsx
// For full GSAP ScrollTrigger experience, use the HowItWorks.html preview file
// This TSX version uses framer-motion with enhanced design as a drop-in replacement

import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Plug, Activity, Brain, Sparkles } from 'lucide-react';

const C = {
  bg:        '#060d1a',
  bgCard:    '#0d1a2e',
  bgCardBorder: '#1a2d4a',
  navy:      '#0a1f3d',
  teal:      '#00d4f5',
  tealDark:  '#0097b2',
  tealLight: '#e0f7fa',
  blue:      '#4f8ef7',
  purple:    '#a78bfa',
  cyan:      '#22d3ee',
  body:      '#94a3b8',
  muted:     '#475569',
  border:    '#1e3352',
  white:     '#f0f8ff',
};

const steps = [
  {
    number: '01',
    icon: Plug,
    title: 'Connect Platform',
    description: 'Integrate with your existing ATS and recruitment tools in minutes with our secure, zero-downtime API.',
    accent: C.teal,
    glow: 'rgba(0,212,245,0.3)',
    tag: 'Setup',
  },
  {
    number: '02',
    icon: Activity,
    title: 'Track Behaviour',
    description: 'Our AI monitors engagement patterns, response times, and 50+ behavioral communication signals in real time.',
    accent: C.blue,
    glow: 'rgba(79,142,247,0.3)',
    tag: 'Analysis',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Calculate Trust Score',
    description: 'Machine learning models synthesize behavioral signals into a precise, explainable trust score per candidate.',
    accent: C.purple,
    glow: 'rgba(167,139,250,0.3)',
    tag: 'Intelligence',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Smarter Decisions',
    description: 'Get actionable predictions and ranked insights to confidently prioritize the most reliable candidates.',
    accent: C.cyan,
    glow: 'rgba(34,211,238,0.3)',
    tag: 'Output',
  },
];

function StepCard({ step, index, isInView }: { step: typeof steps[0]; index: number; isInView: boolean }) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', flex: '1 1 0' }}
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div style={{
          position: 'absolute',
          top: 44,
          left: 'calc(50% + 44px)',
          right: 'calc(-50% + 44px)',
          height: 1,
          background: `linear-gradient(90deg, ${step.accent}60, ${steps[index+1].accent}40)`,
          zIndex: 0,
          display: 'flex',
          alignItems: 'center',
        }}>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
            style={{
              height: '100%',
              width: '100%',
              background: `linear-gradient(90deg, ${step.accent}, ${steps[index+1].accent})`,
              transformOrigin: 'left',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, position: 'relative' }}>
        {/* Icon node */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.15, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.12 }}
          style={{
            width: 88, height: 88, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${step.accent}22, ${step.accent}08)`,
            border: `1.5px solid ${step.accent}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 32,
            boxShadow: `0 0 32px ${step.glow}, 0 0 0 8px ${step.accent}08`,
            position: 'relative',
            cursor: 'default',
          }}
        >
          <Icon size={30} color={step.accent} />
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5 + index * 0.15 }}
            style={{
              position: 'absolute', top: -10, right: -10,
              background: step.accent,
              color: C.bg, fontSize: 10, fontWeight: 900,
              width: 26, height: 26, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 12px ${step.glow}`,
            }}
          >
            {index + 1}
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          whileHover={{ y: -8, boxShadow: `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${step.glow}` }}
          style={{
            background: C.bgCard,
            borderRadius: 20,
            border: `1px solid ${C.bgCardBorder}`,
            padding: '28px 24px',
            width: '100%',
            boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
            textAlign: 'center',
            transition: 'box-shadow 0.3s, transform 0.3s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glow bar */}
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: `linear-gradient(90deg, transparent, ${step.accent}80, transparent)`,
          }} />

          {/* Tag */}
          <div style={{
            display: 'inline-block',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            color: step.accent,
            background: `${step.accent}15`,
            border: `1px solid ${step.accent}30`,
            borderRadius: 100,
            padding: '3px 12px',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}>
            {step.tag}
          </div>

          <div style={{
            fontSize: 42, fontWeight: 900, color: step.accent,
            letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 12,
            textShadow: `0 0 30px ${step.glow}`,
          }}>
            {step.number}
          </div>

          <h3 style={{
            fontSize: 15, fontWeight: 700, color: C.white,
            margin: '0 0 10px', letterSpacing: '-0.02em',
          }}>
            {step.title}
          </h3>

          <p style={{ fontSize: 13, color: C.body, lineHeight: 1.65, margin: 0 }}>
            {step.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <section ref={ref} style={{
      background: C.bg,
      padding: '100px 32px',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,245,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,245,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,245,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-block',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              color: C.teal, textTransform: 'uppercase',
              background: `${C.teal}15`,
              border: `1px solid ${C.teal}30`,
              borderRadius: 100, padding: '6px 18px',
              marginBottom: 24,
            }}
          >
            How It Works
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 54px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.white, margin: '0 0 18px',
            lineHeight: 1.1,
          }}>
            Four steps to{' '}
            <span style={{
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              smarter hiring
            </span>
          </h2>

          <p style={{ fontSize: 17, color: C.body, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            From integration to intelligence — TrustLayer works in four elegant steps
          </p>
        </motion.div>

        {/* Desktop: Horizontal cards */}
        <div className="hiw-desktop" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Mobile: Vertical */}
        <div className="hiw-mobile" style={{ display: 'none', flexDirection: 'column', gap: 20 }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ display: 'flex', gap: 16 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: `${step.accent}15`,
                    border: `1.5px solid ${step.accent}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${step.glow}`,
                  }}>
                    <Icon size={22} color={step.accent} />
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 1, flex: 1, marginTop: 8, background: `linear-gradient(180deg, ${step.accent}60, ${steps[i+1].accent}30)` }} />
                  )}
                </div>
                <div style={{
                  background: C.bgCard, border: `1px solid ${C.bgCardBorder}`,
                  borderRadius: 16, padding: '20px 22px', flex: 1,
                  marginBottom: i < steps.length - 1 ? 8 : 0,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                    background: `linear-gradient(90deg, transparent, ${step.accent}80, transparent)`,
                  }} />
                  <div style={{ fontSize: 30, fontWeight: 900, color: step.accent, letterSpacing: '-0.05em', marginBottom: 6 }}>
                    {step.number}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, margin: '0 0 8px' }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: C.body, lineHeight: 1.65, margin: 0 }}>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .hiw-desktop { display: none !important; }
          .hiw-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  );
}