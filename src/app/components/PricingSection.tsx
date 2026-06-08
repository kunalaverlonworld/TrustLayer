import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check, Star, Shield, Zap, Globe, FileText, BarChart3,
  Users, Phone, ArrowRight, Lock, Bell, Layers,
} from 'lucide-react';

// ── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        'linear-gradient(180deg,#F0F7FF 0%,#fff 50%,#F0F7FF 100%)',
  navy:      '#0a1f3d',
  navyMid:   '#0d2d5e',
  teal:      '#00b8d4',
  tealDark:  '#0097b2',
  tealLight: '#e0f7fa',
  blue:      '#1565c0',
  body:      '#475569',
  muted:     '#94a3b8',
  border:    '#e2eaf3',
  shadow:    'rgba(10,31,61,0.08)',
};

// ── Module pill strip ─────────────────────────────────────────────────────────
const MODULE_HIGHLIGHTS = [
  { icon: Shield,    label: 'Trust Scoring',  desc: 'AI-powered reliability ratings'  },
  { icon: Users,     label: 'Candidate Hub',  desc: 'End-to-end pipeline visibility'  },
  { icon: BarChart3, label: 'Analytics',      desc: 'Real-time dashboards & exports'  },
  { icon: Bell,      label: 'Ghost Alerts',   desc: 'Predictive no-show detection'    },
  { icon: FileText,  label: 'Integrations',   desc: 'ATS & HRIS connectors'           },
  { icon: Lock,      label: 'Access Control', desc: 'Role-based permissions'          },
];

// ── Plan definitions ──────────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  unit: string;
  minNote: string;
  popular: boolean;
  isEnterprise: boolean;
  features: string[];
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  ctaBg: string;
  ctaText: string;
  cardBorder: string;
  cardShadow: string;
  checkColor: string;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Try all features free for 7 days — no credit card required',
    monthly: 0, yearly: 0,
    unit: '/user/day', minNote: 'Up to 5 candidates',
    popular: false, isEnterprise: false,
    cta: 'Get Started Free',
    features: [
      'Up to 5 candidates tracked',
      'Basic trust scoring',
      'Email support',
      '7-day free trial',
      'Single team workspace',
      'Core dashboard',
      'Standard API access',
    ],
    accentColor: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    ctaBg: '#f0fdf4',
    ctaText: '#15803d',
    cardBorder: `1.5px solid #bbf7d0`,
    cardShadow: `0 4px 16px rgba(22,163,74,0.08)`,
    checkColor: '#16a34a',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal for small hiring teams getting started',
    monthly: 4100, yearly: 39350,
    unit: '/mo', minNote: 'Up to 100 candidates',
    popular: false, isEnterprise: false,
    cta: 'Get Started',
    features: [
      'Up to 100 candidates tracked',
      'Basic trust scoring',
      'Email support',
      '7-day data retention',
      'Standard API access',
      'Single team workspace',
      'Core dashboard with KPI cards',
    ],
    accentColor: C.navyMid,
    badgeBg: C.navy,
    badgeText: '#fff',
    ctaBg: '#F1F5F9',
    ctaText: C.body,
    cardBorder: `1.5px solid ${C.border}`,
    cardShadow: `0 4px 16px ${C.shadow}`,
    checkColor: C.muted,
  },
  {
    id: 'pro',
    name: 'Professional',
    tagline: 'For growing teams that need deeper pipeline control',
    monthly: 12500, yearly: 120000,
    unit: '/mo', minNote: 'Up to 1,000 candidates',
    popular: true, isEnterprise: false,
    cta: 'Get Started',
    features: [
      'Up to 1,000 candidates tracked',
      'Advanced AI trust scoring',
      'Priority support (email + chat)',
      '90-day data retention',
      'Full API access',
      'Multiple team workspaces',
      'Custom integrations',
      'Advanced analytics dashboard',
      'Ghosting prediction alerts',
    ],
    accentColor: C.teal,
    badgeBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    badgeText: '#fff',
    ctaBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    ctaText: '#fff',
    cardBorder: `2px solid ${C.teal}`,
    cardShadow: `0 8px 40px rgba(0,184,212,0.18)`,
    checkColor: C.teal,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Comprehensive hiring ops for scaling organisations',
    monthly: 29200, yearly: 280300,
    unit: '/mo', minNote: 'Up to 10,000 candidates',
    popular: false, isEnterprise: false,
    cta: 'Get Started',
    features: [
      'Everything in Professional',
      'Unlimited workspaces & sub-teams',
      'Custom AI model fine-tuning',
      'Background verification stage',
      'Advanced role permissions',
      'Salary & offer visibility controls',
      'ERP / ATS user import',
      'Dedicated account manager',
      'Unlimited data retention',
    ],
    accentColor: C.blue,
    badgeBg: `linear-gradient(135deg,#1e40af,${C.blue})`,
    badgeText: '#fff',
    ctaBg: `linear-gradient(135deg,#1e40af,${C.blue})`,
    ctaText: '#fff',
    cardBorder: `1.5px solid #bfdbfe`,
    cardShadow: `0 8px 32px rgba(21,101,192,0.10)`,
    checkColor: C.blue,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Starting from ₹5/user/day · 100+ users',
    monthly: null, yearly: null,
    unit: '', minNote: 'Unlimited candidates',
    popular: false, isEnterprise: true,
    cta: 'Contact Sales',
    features: [
      'Everything in Business',
      'Unlimited candidates tracked',
      'Custom AI model training',
      'SSO & SAML authentication',
      'White-label branding options',
      'SLA-backed uptime guarantee',
      'On-premise deployment option',
      'Advanced security & audit logs',
      '24/7 dedicated enterprise support',
      'Custom feature development',
    ],
    accentColor: '#7c3aed',
    badgeBg: 'linear-gradient(135deg,#7c3aed,#9333ea)',
    badgeText: '#fff',
    ctaBg: '#F1F5F9',
    ctaText: C.body,
    cardBorder: `1.5px solid #ddd6fe`,
    cardShadow: `0 4px 16px rgba(124,58,237,0.08)`,
    checkColor: '#7c3aed',
  },
];

const ALL_PLANS_INCLUDE = [
  { Icon: Shield,  text: 'Role-based access control'        },
  { Icon: Zap,     text: 'Real-time ghosting notifications'  },
  { Icon: Globe,   text: 'REST & Webhook API access'         },
  { Icon: FileText,text: 'Document & offer management'       },
  { Icon: Layers,  text: 'Multi-workspace collaboration'     },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function PricingSection() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const displayPrice = (plan: Plan) => {
    if (plan.isEnterprise) return null;
    return period === 'monthly' ? plan.monthly : plan.yearly;
  };

  const displayUnit = (plan: Plan) => {
    if (plan.isEnterprise) return '';
    return period === 'monthly' ? '/mo' : '/yr';
  };

  return (
    <section
      id="pricing"
      className="relative py-16 lg:py-24 overflow-hidden"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle,rgba(0,184,212,0.07) 0%,transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle,rgba(21,101,192,0.07) 0%,transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(0,184,212,0.10)',
              border: '1px solid rgba(0,184,212,0.25)',
              color: C.tealDark,
            }}
          >
            Transparent Pricing
          </div>
          <h2
            className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight"
            style={{ color: C.navy, letterSpacing: '-0.03em' }}
          >
            Simple, Transparent{' '}
            <span style={{ color: C.teal }}>Pricing</span>
          </h2>
          <p className="text-base max-w-xl mx-auto mb-7" style={{ color: C.body }}>
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center rounded-full p-1"
            style={{
              background: 'white',
              border: `1.5px solid ${C.border}`,
              boxShadow: `0 2px 10px ${C.shadow}`,
            }}
          >
            {(['monthly', 'yearly'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background:
                    period === p
                      ? `linear-gradient(135deg,${C.teal},${C.tealDark})`
                      : 'transparent',
                  color: period === p ? 'white' : C.body,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
                {p === 'yearly' && (
                  <span
                    className="absolute -top-2.5 -right-1 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#16a34a', fontSize: 10 }}
                  >
                    −20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Module pill strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {MODULE_HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-sm font-semibold"
              style={{
                border: `1.5px solid ${C.border}`,
                boxShadow: `0 2px 8px ${C.shadow}`,
                color: C.navy,
              }}
            >
              <Icon style={{ width: 14, height: 14, color: C.teal, flexShrink: 0 }} />
              <span>{label}</span>
              <span className="text-xs font-normal hidden sm:inline" style={{ color: C.muted }}>
                · {desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Plan cards ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch mb-12">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-white rounded-2xl flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
              style={{ border: plan.cardBorder, boxShadow: plan.cardShadow }}
            >
              {/* Most popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div
                    className="flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap text-white"
                    style={{
                      background: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
                      boxShadow: '0 4px 14px rgba(0,184,212,0.40)',
                    }}
                  >
                    <Star style={{ width: 12, height: 12, fill: 'white', flexShrink: 0 }} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Name badge */}
                <div className="mb-3">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: plan.badgeBg, color: plan.badgeText }}
                  >
                    {plan.name}
                  </span>
                </div>

                {/* Tagline */}
                <p className="text-xs mb-5 leading-relaxed" style={{ color: C.muted }}>
                  {plan.tagline}
                </p>

                {/* Price block */}
                <div className="mb-4" style={{ minHeight: 72 }}>
                  {plan.isEnterprise ? (
                    <>
                      <div className="text-2xl font-extrabold" style={{ color: '#7c3aed' }}>
                        Custom Quote
                      </div>
                      <div className="text-xs mt-1" style={{ color: C.muted }}>
                        Contact us for pricing
                      </div>
                      <div
                        className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}
                      >
                        <Users style={{ width: 12, height: 12 }} />
                        Unlimited users
                      </div>
                    </>
                  ) : plan.id === 'basic' ? (
                    <>
                      <div className="text-4xl font-extrabold" style={{ color: '#16a34a' }}>
                        Free
                      </div>
                      <div className="text-xs mt-1" style={{ color: C.muted }}>
                        No credit card required
                      </div>
                      <div
                        className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(22,163,74,0.08)', color: '#15803d' }}
                      >
                        <Users style={{ width: 12, height: 12 }} />
                        {plan.minNote}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-4xl font-extrabold" style={{ color: plan.accentColor }}>
                          {displayPrice(plan) === 0 ? '₹0' : `₹${(displayPrice(plan) ?? 0).toLocaleString('en-IN')}`}
                        </span>
                        <span className="text-xs leading-tight" style={{ color: C.muted }}>
                          {displayUnit(plan)}
                        </span>
                      </div>
                      <div
                        className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(0,184,212,0.08)', color: C.tealDark }}
                      >
                        <Users style={{ width: 12, height: 12 }} />
                        {plan.minNote}
                      </div>
                    </>
                  )}
                </div>

                {/* CTA */}
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-bold mb-6 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                  style={{
                    background: plan.ctaBg,
                    color: plan.ctaText,
                    fontFamily: "'Inter', sans-serif",
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {plan.isEnterprise ? (
                    <>
                      <Phone style={{ width: 14, height: 14 }} />
                      Contact Sales
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight style={{ width: 14, height: 14 }} />
                    </>
                  )}
                </button>

                {/* Features */}
                <div className="flex-1 flex flex-col min-h-0">
                  <p className="text-xs font-bold mb-3 flex-shrink-0" style={{ color: C.navy }}>
                    Includes:
                  </p>
                  <div
                    className="overflow-y-auto pr-1 space-y-2.5"
                    style={{
                      height: 220,
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#CBD5E1 transparent',
                    }}
                  >
                    {plan.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2.5">
                        <Check
                          style={{
                            width: 16, height: 16, flexShrink: 0,
                            marginTop: 2, color: plan.checkColor,
                          }}
                        />
                        <span className="text-xs leading-snug" style={{ color: '#64748b' }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Footer strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl px-8 py-6"
          style={{
            background: 'rgba(0,184,212,0.04)',
            border: '1.5px solid rgba(0,184,212,0.15)',
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest text-center mb-4"
            style={{ color: C.tealDark }}
          >
            All Plans Include
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {ALL_PLANS_INCLUDE.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs" style={{ color: C.body }}>
                <Icon style={{ width: 14, height: 14, flexShrink: 0, color: C.teal }} />
                {text}
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4" style={{ color: C.muted }}>
            Free trial available on Basic plan · No credit card required
          </p>
        </motion.div>

      </div>

      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 99px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </section>
  );
}