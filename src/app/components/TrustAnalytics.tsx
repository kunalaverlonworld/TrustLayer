import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { TrendingDown, Zap, Target, Activity } from 'lucide-react';

const responsiveStyles = `
  .trust-section {
    padding: 80px 32px;
  }
  .trust-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px;
  }
  .trust-card {
    padding: 28px 24px;
  }
  .trust-value {
    font-size: 48px;
  }
  .trust-header {
    margin-bottom: 60px;
  }
  .trust-card-label {
    font-size: 15px;
  }
  .trust-card-desc {
    font-size: 12.5px;
  }
  .trust-icon-box {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    margin-bottom: 18px;
  }
  .trust-mini-bars {
    height: 36px;
    margin-top: 18px;
  }
  @media (max-width: 768px) {
    .trust-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin-bottom: 12px;
    }
    .trust-mini-bars {
      height: 28px;
      margin-top: 12px;
    }
    .trust-section {
      padding: 52px 16px;
    }
    .trust-grid {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .trust-card {
      padding: 18px 14px;
      border-radius: 16px !important;
    }
    .trust-value {
      font-size: 32px !important;
    }
    .trust-header {
      margin-bottom: 36px;
    }
    .trust-card-label {
      font-size: 13px;
    }
    .trust-card-desc {
      font-size: 11.5px;
    }
  }
  @media (max-width: 480px) {
    .trust-section {
      padding: 40px 12px;
    }
    .trust-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .trust-card {
      padding: 20px 18px;
    }
    .trust-value {
      font-size: 42px !important;
    }
    .trust-card-label {
      font-size: 14px;
    }
  }
`;

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

const metrics = [
  {
    icon: TrendingDown,
    value: '89%',
    numericValue: 89,
    suffix: '%',
    label: 'Reduced Hiring Ghosting',
    description: 'Candidates vetted with AI trust scoring',
    accent: C.teal,
    bg: C.tealLight,
    badgeLabel: 'Ghosting',
    stat: { label: 'Vetted this month', value: '1,284' },
    fill: 89,
    bars: [7, 9, 5, 8, 10, 6, 9, 7, 8, 10],
  },
  {
    icon: Zap,
    value: '3x',
    numericValue: 3,
    suffix: 'x',
    label: 'Faster HR Decisions',
    description: 'Real-time behavioral insights delivered instantly',
    accent: C.blue,
    bg: '#e3f2fd',
    badgeLabel: 'Speed',
    stat: { label: 'Avg. decision time', value: '4.2 hrs' },
    fill: 75,
    bars: [5, 8, 7, 9, 6, 10, 8, 9, 7, 10],
  },
  {
    icon: Target,
    value: '94%',
    numericValue: 94,
    suffix: '%',
    label: 'AI Prediction Accuracy',
    description: 'Ghosting risk detection with surgical precision',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    badgeLabel: 'Accuracy',
    stat: { label: 'False positive rate', value: '< 0.3%' },
    fill: 94,
    bars: [9, 7, 10, 8, 9, 6, 10, 7, 9, 8],
  },
  {
    icon: Activity,
    value: '24/7',
    numericValue: null,
    suffix: '',
    label: 'Real-Time Behaviour Tracking',
    description: 'Continuous candidate monitoring around the clock',
    accent: '#0891b2',
    bg: '#e0f2fe',
    badgeLabel: 'Live',
    stat: { label: 'Uptime SLA', value: '99.99%' },
    fill: 100,
    bars: [10, 8, 9, 7, 10, 9, 8, 10, 9, 7],
  },
];

// Animated counter hook
function useCounter(target: number | null, active: boolean, duration = 1.2) {
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    if (!active || target === null) return;
    const start = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setDisplay(String(current));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return display;
}

function MetricCard({ m, i, isInView }: { m: typeof metrics[0]; i: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false);
  const counter = useCounter(m.numericValue, isInView);

  const displayValue =
    m.numericValue !== null
      ? counter + m.suffix
      : m.value;

  return (
    <motion.div
      key={m.label}
      className="trust-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: 'white',
        border: `1.5px solid ${hovered ? m.accent : C.border}`,
        borderRadius: 22,
        boxShadow: hovered
          ? `0 24px 60px ${C.shadow}`
          : `0 2px 12px ${C.shadow}`,
        transition: 'box-shadow 0.3s, border-color 0.3s',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Radial background tint */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 130, height: 130,
        background: `radial-gradient(circle at top right, ${m.accent}18, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: 3,
          background: `linear-gradient(90deg, ${m.accent}, transparent)`,
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: m.bg,
        border: `1.5px solid ${m.accent}30`,
        borderRadius: 100,
        padding: '3px 10px',
        fontSize: 11, fontWeight: 700,
        letterSpacing: '.06em',
        color: m.accent,
        marginBottom: 14,
      }}>
        <m.icon size={11} />
        {m.badgeLabel}
      </div>

      {/* Icon */}
      <div className="trust-icon-box" style={{
        background: m.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1.5px solid ${m.accent}30`,
      }}>
        <m.icon size={22} color={m.accent} />
      </div>

      {/* Animated Value */}
      <motion.div
        className="trust-value"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
        style={{
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: m.accent,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {displayValue}
      </motion.div>

      <div className="trust-card-label" style={{ fontWeight: 700, color: C.navy, marginBottom: 5, letterSpacing: '-0.02em' }}>
        {m.label}
      </div>
      <div className="trust-card-desc" style={{ color: C.muted, lineHeight: 1.6 }}>
        {m.description}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          height: 4, background: m.bg, borderRadius: 100, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${m.fill}%` } : {}}
            transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', background: m.accent, borderRadius: 100 }}
          />
        </div>
      </div>

      {/* Divider + stat row */}
      <div style={{ height: 1, background: C.border, margin: '14px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: C.muted }}>{m.stat.label}</span>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: C.navy }}>{m.stat.value}</span>
      </div>

      {/* Mini bar chart */}
      <div className="trust-mini-bars" style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
        {m.bars.map((h, j) => (
          <motion.div
            key={j}
            initial={{ height: 0 }}
            animate={isInView ? { height: `${Math.round(h / 10 * 36)}px` } : {}}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 + j * 0.045, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1,
              minWidth: 0,
              borderRadius: 4,
              background: m.accent,
              opacity: hovered ? 0.5 : 0.25,
              transition: 'opacity 0.3s',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function TrustAnalytics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <>
      <style>{responsiveStyles}</style>
      <section ref={ref} className="trust-section" style={{
        background: C.bg,
        fontFamily: "'Inter', sans-serif",
      }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
          className="trust-header"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.tealLight,
              border: `1.5px solid ${C.teal}50`,
              borderRadius: 100,
              padding: '6px 16px',
              fontSize: 12, fontWeight: 700,
              color: C.tealDark,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: C.teal, display: 'inline-block',
              }}
            />
            AI-Powered Platform
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 46px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.navy, margin: '0 0 14px', lineHeight: 1.1,
          }}>
            Trust Intelligence at <span style={{ color: C.teal }}>Scale</span>
          </h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            Transform your hiring process with AI-powered behavioral analytics that eliminate uncertainty
          </p>
        </motion.div>

        {/* Cards */}
        <div className="trust-grid">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} i={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}