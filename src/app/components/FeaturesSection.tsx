import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Brain, Users, Ghost, BarChart3, MessageSquare, Trophy, Shield, Plug } from 'lucide-react';

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

const features = [
  {
    icon: Brain,
    title: 'Candidate Trust Engine',
    description: 'Automatically tracks how candidates interact with your emails — whether they open, click, or ignore them. Each candidate gets a live trust score that drops if they go silent for too long.',
    accent: C.teal,
  },
  {
    icon: Users,
    title: 'Employee Behaviour Intelligence',
    description: 'Monitors current employees based on incidents logged by your HR team — both good and bad. Scores are updated on a rolling 90-day window so recent behaviour always matters most.',
    accent: C.blue,
  },
  {
    icon: Ghost,
    title: 'AI Ghosting Detection',
    description: 'Instantly flags candidates who stop responding — no email opens, no clicks, no replies. A penalty is automatically applied to their score so your team knows who to follow up with first.',
    accent: '#7c3aed',
  },
  {
    icon: BarChart3,
    title: 'Trust Intelligence Dashboard',
    description: 'A single view of all candidates with their live trust scores and risk levels — Low, Moderate, or High. Scores refresh every 10 seconds and you can drill into any profile for a full breakdown.',
    accent: '#0891b2',
  },
  {
    icon: MessageSquare,
    title: 'HR Feedback Portal',
    description: 'A simple form previous employers can fill in — no account needed. Their feedback covers five areas and is blended into the candidate\'s final trust score, giving you a fuller picture before you hire.',
    accent: '#0d9488',
  },
  {
    icon: Trophy,
    title: 'Predictive Trust Scoring',
    description: 'Every candidate and employee receives a score from 0 to 100 based on their behaviour. Scores above 80 are Low Risk, 60–79 are Moderate, and below 60 are High Risk — so decisions are always clear.',
    accent: '#d97706',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant Security',
    description: 'Each company\'s data is completely separated from others. Access is protected by secure login tokens, and team members only see what their role allows — HR, Manager, Admin, or Super Admin.',
    accent: '#059669',
  },
  {
    icon: Plug,
    title: 'Recruitment System Integration',
    description: 'Works alongside your existing hiring tools without replacing them. TrustLayer plugs in as an add-on that brings trust intelligence to your current recruitment workflow with no disruption.',
    accent: '#2563eb',
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="features" ref={ref} style={{
      background: 'white',
      padding: 'clamp(64px, 8vw, 96px) clamp(16px, 4vw, 32px)',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.tealLight, borderRadius: 100,
            padding: '6px 16px', marginBottom: 20,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.teal }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.tealDark }}>Platform Features</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 46px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.navy, margin: '0 0 16px',
          }}>
            Built for <span style={{ color: C.teal }}>Modern HR Teams</span>
          </h2>
          <p style={{ fontSize: 17, color: C.body, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            Enterprise-grade AI features designed to revolutionize recruitment and hiring
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 20,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 16px 48px ${C.shadow}` }}
              style={{
                background: 'white', border: `1.5px solid ${C.border}`,
                borderRadius: 18, padding: 'clamp(20px, 3vw, 28px) clamp(18px, 2.5vw, 24px)',
                cursor: 'default', boxShadow: `0 2px 8px ${C.shadow}`,
                transition: 'box-shadow 0.25s, transform 0.25s',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${f.accent}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18, border: `1.5px solid ${f.accent}30`,
              }}>
                <f.icon size={24} color={f.accent} />
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.navy, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
              <div style={{
                marginTop: 20, height: 3, borderRadius: 100,
                background: `linear-gradient(90deg, ${f.accent}40, transparent)`,
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}