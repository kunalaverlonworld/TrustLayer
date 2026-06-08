import { motion } from 'motion/react';
import { Check, Flame, Shield, Award } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (plan: { id: string; name: string; price: string }) => void;
  onLogout: () => void;
  userName: string;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic LMS',
    price: '$9',
    period: '/mo',
    desc: 'Perfect for individuals starting their self-paced learning journey.',
    icon: Award,
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.15)',
    features: [
      'Access to 1 Foundational Course',
      'Standard Dashboard Tracker',
      'Mobile & Desktop Access',
      'Community Forum Access',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$29',
    period: '/mo',
    desc: 'The most popular plan for deep skills acquisition with full interactive assets.',
    icon: Flame,
    color: '#00d4f5',
    glow: 'rgba(0,212,245,0.25)',
    popular: true,
    features: [
      'Access to All 12+ Professional Courses',
      'Interactive Code & Lab Sandbox',
      'Core Skill Telemetry & Analytics',
      'Downloadable Certificates',
      'Priority Email Support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Telemetry',
    price: '$99',
    period: '/mo',
    desc: 'Advanced telemetry and management tools for organizations and coaching teams.',
    icon: Shield,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.15)',
    features: [
      'Unlimited Students / Sub-accounts',
      'Advanced Team Performance Telemetry',
      'Custom Curriculum & Lesson Builder',
      'Dedicated Customer Success Manager',
      '99.9% SLA & SOC2 Compliance Vetting',
      'Live API Integration Hooks',
    ],
  },
];

export default function PlanSelection({ onSelectPlan, onLogout, userName }: PlanSelectionProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060D1A 0%, #0D1F3C 100%)',
      fontFamily: "'Inter', sans-serif",
      color: '#fff',
      padding: '80px 24px 100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blur effects */}
      <div style={{
        position: 'absolute', top: '-10%', left: '10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,212,245,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
            color: '#00d4f5', textTransform: 'uppercase',
            background: 'rgba(0,212,245,0.1)',
            border: '1px solid rgba(0,212,245,0.25)',
            borderRadius: 100, padding: '6px 18px',
            marginBottom: 16,
          }}>
            LMS Plan Selection
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Choose a plan to activate your learning dashboard
          </h2>
          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            maxWidth: 600,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}>
            Welcome, <strong style={{ color: '#00d4f5' }}>{userName}</strong>! Please select one of our curated plans to view the features dashboard and start learning.
          </p>

          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 100,
              color: '#94a3b8',
              padding: '6px 18px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            Log Out Account
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 28,
          alignItems: 'stretch',
        }}>
          {plans.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${p.glow}` }}
                style={{
                  background: 'rgba(13, 26, 46, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 24,
                  border: p.popular ? `2px solid ${p.color}` : '1px solid #1a2d4a',
                  padding: 36,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border 0.3s, box-shadow 0.3s',
                }}
              >
                {/* Popular Ribbon */}
                {p.popular && (
                  <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: p.color,
                    color: '#060D1A',
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 12px',
                    borderRadius: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    Popular Plan
                  </div>
                )}

                {/* Card Icon */}
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: `${p.color}15`,
                  border: `1.5px solid ${p.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 24,
                  boxShadow: `0 0 20px ${p.glow}`,
                }}>
                  <Icon size={24} color={p.color} />
                </div>

                {/* Plan Header */}
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px', minHeight: 40 }}>
                  {p.desc}
                </p>

                {/* Pricing */}
                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 28 }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: '#94a3b8', marginLeft: 4 }}>{p.period}</span>
                </div>

                {/* Features List */}
                <div style={{ flex: 1, marginBottom: 36 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: p.color, marginBottom: 16 }}>
                    What's Included:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: '#cbd5e1', lineHeight: 1.4 }}>
                        <Check size={16} color={p.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Selection Button */}
                <button
                  onClick={() => onSelectPlan({ id: p.id, name: p.name, price: p.price })}
                  style={{
                    width: '100%',
                    background: p.popular ? p.color : 'transparent',
                    border: p.popular ? 'none' : `1.5px solid ${p.color}60`,
                    color: p.popular ? '#060D1A' : p.color,
                    padding: '12px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => {
                    if (p.popular) {
                      e.currentTarget.style.filter = 'brightness(1.1)';
                    } else {
                      e.currentTarget.style.background = `${p.color}15`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (p.popular) {
                      e.currentTarget.style.filter = '';
                    } else {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  Activate {p.name}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
