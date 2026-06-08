import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Brain, Users, Network, Zap, Target, TrendingUp, Shield, Eye, BarChart2, Clock } from 'lucide-react';

const C = {
  bg:          '#edf5fb',
  bgCard:      '#ffffff',
  navy:        '#0a1f3d',
  teal:        '#00b8d4',
  tealDark:    '#0097b2',
  tealLight:   '#e0f7fa',
  blue:        '#1565c0',
  blueLight:   '#e3f2fd',
  body:        '#475569',
  muted:       '#94a3b8',
  border:      '#e2eaf3',
  shadow:      'rgba(10,31,61,0.07)',
  purple:      '#7c3aed',
  purpleLight: '#f5f3ff',
};

const candidateSignals = [
  { label: 'Response Time Patterns', pct: 92 },
  { label: 'Email Engagement',        pct: 87 },
  { label: 'Interview Attendance',    pct: 95 },
  { label: 'Communication Quality',   pct: 78 },
  { label: 'Schedule Reliability',    pct: 89 },
  { label: 'Application Completion',  pct: 96 },
];

const employeeSignals = [
  { label: 'Work Pattern Analysis',   pct: 91 },
  { label: 'Feedback Responsiveness', pct: 84 },
  { label: 'Team Collaboration',      pct: 88 },
  { label: 'Performance Metrics',     pct: 93 },
  { label: 'Engagement Levels',       pct: 76 },
  { label: 'Retention Indicators',    pct: 82 },
];

const orbitIcons  = [Zap, Target, TrendingUp, Shield, Eye, BarChart2];
const orbitAngles = [0, 60, 120, 180, 240, 300];
const ORBIT_R = 88;
const CX = 130;
const CY = 130;
const ICON_HALF = 18;

function orbitPos(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    left: Math.cos(rad) * ORBIT_R + CX - ICON_HALF,
    top:  Math.sin(rad) * ORBIT_R + CY - ICON_HALF,
  };
}

/* ── Signal row with animated bar ── */
function SignalBar({ label, pct, color, delay, isInView }: {
  label: string; pct: number; color: string; delay: number; isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      style={{ marginBottom: 10 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: C.body, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: `${color}18`, borderRadius: 100, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : {}}
          transition={{ duration: 0.9, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: color, borderRadius: 100 }}
        />
      </div>
    </motion.div>
  );
}

/* ── Neural Net SVG — fixed viewBox, clean layout ── */
function NeuralSVG({ isInView }: { isInView: boolean }) {
  const inputY  = [20, 44, 68, 92, 116, 140];
  const hiddenY = [32, 68, 104, 140];
  const outY    = 80;

  return (
    <div style={{
      background: C.bg,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '16px',
      marginBottom: 22,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
        Neural Trust Model
      </div>
      <svg width="100%" viewBox="0 0 280 165" style={{ display: 'block', overflow: 'visible' }}>
        {/* Layer labels */}
        <text x={28}  y={158} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="Inter">Input</text>
        <text x={140} y={158} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="Inter">Hidden</text>
        <text x={248} y={158} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="Inter">Output</text>

        {/* Input→Hidden connections */}
        {inputY.map((iy, i) => hiddenY.map((hy, j) => (
          <motion.line key={`ih-${i}-${j}`}
            x1={28} y1={iy} x2={140} y2={hy}
            stroke={C.teal} strokeWidth={0.6}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.18 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        )))}

        {/* Hidden→Output connections */}
        {hiddenY.map((hy, j) => (
          <motion.line key={`ho-${j}`}
            x1={140} y1={hy} x2={248} y2={outY}
            stroke={C.blue} strokeWidth={0.8}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        ))}

        {/* Input nodes */}
        {inputY.map((cy, i) => (
          <motion.circle key={`in-${i}`}
            cx={28} cy={cy} r={7}
            fill={C.teal}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.85 } : {}}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.3, type: 'spring', stiffness: 260 }}
          />
        ))}

        {/* Hidden nodes */}
        {hiddenY.map((cy, j) => (
          <motion.circle key={`h-${j}`}
            cx={140} cy={cy} r={10}
            fill={C.tealDark}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5 + j * 0.1, duration: 0.35, type: 'spring', stiffness: 220 }}
          />
        ))}

        {/* Output node */}
        <motion.circle cx={248} cy={outY} r={18}
          fill={C.blue}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.0, duration: 0.4, type: 'spring' }}
        />
        <motion.text x={248} y={77} textAnchor="middle"
          fill="white" fontSize={9} fontWeight={800} fontFamily="Inter"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >94.2%</motion.text>
        <motion.text x={248} y={88} textAnchor="middle"
          fill="rgba(255,255,255,0.75)" fontSize={7.5} fontFamily="Inter"
          initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        >Trust</motion.text>
      </svg>

      {/* Score strip */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {[
          { label: 'Reliability', val: '94%', color: C.teal },
          { label: 'Risk Level',  val: 'Low',  color: '#10b981' },
          { label: 'Confidence', val: '98%', color: C.blue },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '7px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Radial diagram — fixed sizing ── */
function RadialDiagram({ isInView }: { isInView: boolean }) {
  const SIZE = 260;
  return (
    <div style={{
      background: C.bg,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      padding: '16px',
      marginBottom: 22,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
        Behaviour Network
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
          {/* SVG rings + spokes */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle cx={CX} cy={CY} r={ORBIT_R + 4} fill="none" stroke={C.border} strokeWidth={1} strokeDasharray="3 4"/>
            <circle cx={CX} cy={CY} r={50} fill="none" stroke={C.border} strokeWidth={1} opacity={0.5}/>
            {orbitAngles.map((deg, i) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              return (
                <motion.line key={i}
                  x1={CX} y1={CY}
                  x2={Math.cos(rad) * ORBIT_R + CX}
                  y2={Math.sin(rad) * ORBIT_R + CY}
                  stroke={C.purple} strokeWidth={1}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.2 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                />
              );
            })}
          </svg>

          {/* Center node */}
          

          {/* Orbit icons */}
          {orbitAngles.map((deg, idx) => {
            const Icon = orbitIcons[idx];
            const pos  = orbitPos(deg);
            return (
              <motion.div key={idx}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + idx * 0.1, type: 'spring', stiffness: 220 }}
                style={{
                  position: 'absolute',
                  left: pos.left, top: pos.top,
                  width: 36, height: 36, borderRadius: 10,
                  background: 'white',
                  border: `1.5px solid ${C.border}`,
                  boxShadow: `0 2px 8px ${C.shadow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                <Icon size={15} color={C.purple} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Patterns',  val: '12K+', color: C.purple },
          { label: 'Accuracy',  val: '91%',  color: '#7c3aed' },
          { label: 'Real-time', val: '24/7', color: '#0891b2' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: C.bgCard, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '7px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Card wrapper ── */
function EngineCard({
  accentColor, children, delay, isInView,
}: {
  accentColor: string;
  children: React.ReactNode;
  delay: number;
  isInView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1.5px solid ${hovered ? accentColor + '60' : C.border}`,
        borderRadius: 24,
        padding: '32px 28px',
        boxShadow: hovered
          ? `0 24px 60px rgba(10,31,61,0.12)`
          : `0 4px 20px ${C.shadow}`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: accentColor,
        borderRadius: '24px 24px 0 0',
      }} />
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 160, height: 160,
        background: `radial-gradient(circle at top right, ${accentColor}10, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      {children}
    </motion.div>
  );
}

/* ── Card header ── */
function CardHeader({ icon: Icon, title, subtitle, accentColor, bg, borderColor }: {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string; subtitle: string;
  accentColor: string; bg: string; borderColor: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
      <div style={{
        width: 52, height: 52, borderRadius: 15, flexShrink: 0,
        background: bg, border: `1.5px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} color={accentColor} />
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 3 }}>{subtitle}</div>
      </div>
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: C.muted, marginBottom: 12,
    }}>{text}</div>
  );
}

/* ── Main export ── */
export default function AITrustEngine() {
  const ref      = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="ai-engine" ref={ref} style={{
      background: 'white',
      padding: 'clamp(64px, 8vw, 96px) clamp(16px, 4vw, 32px)',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${C.border} 1px, transparent 1px)`,
        backgroundSize: '28px 28px', opacity: 0.65,
      }} />

      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 60 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: C.tealLight, borderRadius: 100,
              padding: '6px 16px', marginBottom: 20,
              border: `1px solid ${C.teal}30`,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal, display: 'inline-block' }}
            />
            <Brain size={13} color={C.tealDark} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.tealDark, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              Powered by AI
            </span>
          </motion.div>

          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.navy, margin: '0 0 14px', lineHeight: 1.1,
          }}>
            AI <span style={{ color: C.teal }}>Trust Intelligence</span>
          </h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Advanced ML models analyze behavioral patterns to predict reliability and prevent ghosting
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { icon: Clock,    label: 'Processing Time', val: '< 2s' },
              { icon: Shield,   label: 'Data Security',   val: 'SOC 2' },
              { icon: Eye,      label: 'Signals Tracked', val: '200+' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 100, padding: '7px 16px',
                fontSize: 13, color: C.body,
              }}>
                <s.icon size={13} color={C.teal} />
                <span style={{ fontWeight: 700, color: C.navy }}>{s.val}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* Card 1 — Candidate */}
          <EngineCard
            accentColor={C.teal}
            delay={0.1}
            isInView={isInView}
          >
            <CardHeader
              icon={Brain}
              title="Candidate Trust Engine"
              subtitle="Predictive hiring intelligence"
              accentColor={C.teal}
              bg={C.tealLight}
              borderColor={`${C.teal}40`}
            />
            <NeuralSVG isInView={isInView} />
            <SectionLabel text="Behavioural Signals" />
            <div>
              {candidateSignals.map((s, i) => (
                <SignalBar
                  key={s.label} label={s.label} pct={s.pct}
                  color={C.teal} delay={isInView ? 1.1 + i * 0.08 : 99}
                  isInView={isInView}
                />
              ))}
            </div>
          </EngineCard>

          {/* Card 2 — Employee */}
          <EngineCard
            accentColor={C.purple}
            delay={0.2}
            isInView={isInView}
          >
            <CardHeader
              icon={Users}
              title="Employee Behaviour Engine"
              subtitle="Workforce analytics & insights"
              accentColor={C.purple}
              bg={C.purpleLight}
              borderColor={`${C.purple}40`}
            />
            <RadialDiagram isInView={isInView} />
            <SectionLabel text="Intelligence Metrics" />
            <div>
              {employeeSignals.map((s, i) => (
                <SignalBar
                  key={s.label} label={s.label} pct={s.pct}
                  color={C.purple} delay={isInView ? 1.3 + i * 0.08 : 99}
                  isInView={isInView}
                />
              ))}
            </div>
          </EngineCard>

        </div>
      </div>
    </section>
  );
}