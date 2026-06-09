import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Check, Star, Shield, Zap, Globe, FileText, BarChart3,
  Users, Phone, ArrowRight, Lock, Bell, Layers, Sparkles, Crown,
} from 'lucide-react';
import { LMS_PROXY } from '../services/config';

// Plans are fetched via the TrustLayer backend proxy (/api/lms/plans)
// to avoid CORS issues with calling the LMS directly from the browser.
const LMS_PRODUCT_ID = '6a26929078d2d302b575cc10'; // kept for fallback plan IDs

// ── Brand tokens ──────────────────────────────────────────────────────────────
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

const ALL_PLANS_INCLUDE = [
  { Icon: Shield,   text: 'Role-based access control'       },
  { Icon: Zap,      text: 'Real-time ghosting notifications' },
  { Icon: Globe,    text: 'REST & Webhook API access'        },
  { Icon: FileText, text: 'Document & offer management'      },
  { Icon: Layers,   text: 'Multi-workspace collaboration'    },
];

// ── Per-plan UI meta (icon + colour palette) keyed by lowercase plan name ────
interface PlanMeta {
  icon: any;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  ctaBg: string;
  ctaText: string;
  cardBorder: string;
  cardShadow: string;
  checkColor: string;
  popular?: boolean;
}

const PLAN_META: Record<string, PlanMeta> = {
  free: {
    icon: Star,
    accentColor: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    ctaBg: '#f0fdf4',
    ctaText: '#15803d',
    cardBorder: '1.5px solid #bbf7d0',
    cardShadow: '0 4px 16px rgba(22,163,74,0.08)',
    checkColor: '#16a34a',
  },
  basic: {
    icon: Star,
    accentColor: '#16a34a',
    badgeBg: '#f0fdf4',
    badgeText: '#15803d',
    ctaBg: '#f0fdf4',
    ctaText: '#15803d',
    cardBorder: '1.5px solid #bbf7d0',
    cardShadow: '0 4px 16px rgba(22,163,74,0.08)',
    checkColor: '#16a34a',
  },
  starter: {
    icon: Zap,
    accentColor: C.navyMid,
    badgeBg: C.navy,
    badgeText: '#fff',
    ctaBg: '#F1F5F9',
    ctaText: C.body,
    cardBorder: `1.5px solid ${C.border}`,
    cardShadow: `0 4px 16px ${C.shadow}`,
    checkColor: C.muted,
  },
  professional: {
    icon: Sparkles,
    accentColor: C.teal,
    badgeBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    badgeText: '#fff',
    ctaBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    ctaText: '#fff',
    cardBorder: `2px solid ${C.teal}`,
    cardShadow: '0 8px 40px rgba(0,184,212,0.18)',
    checkColor: C.teal,
    popular: true,
  },
  pro: {
    icon: Sparkles,
    accentColor: C.teal,
    badgeBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    badgeText: '#fff',
    ctaBg: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
    ctaText: '#fff',
    cardBorder: `2px solid ${C.teal}`,
    cardShadow: '0 8px 40px rgba(0,184,212,0.18)',
    checkColor: C.teal,
    popular: true,
  },
  business: {
    icon: BarChart3,
    accentColor: C.blue,
    badgeBg: `linear-gradient(135deg,#1e40af,${C.blue})`,
    badgeText: '#fff',
    ctaBg: `linear-gradient(135deg,#1e40af,${C.blue})`,
    ctaText: '#fff',
    cardBorder: '1.5px solid #bfdbfe',
    cardShadow: '0 8px 32px rgba(21,101,192,0.10)',
    checkColor: C.blue,
  },
  enterprise: {
    icon: Crown,
    accentColor: '#7c3aed',
    badgeBg: 'linear-gradient(135deg,#7c3aed,#9333ea)',
    badgeText: '#fff',
    ctaBg: '#F1F5F9',
    ctaText: C.body,
    cardBorder: '1.5px solid #ddd6fe',
    cardShadow: '0 4px 16px rgba(124,58,237,0.08)',
    checkColor: '#7c3aed',
  },
};

// Fallback meta for unknown plan names
const DEFAULT_META: PlanMeta = {
  icon: Star,
  accentColor: C.teal,
  badgeBg: C.navy,
  badgeText: '#fff',
  ctaBg: '#F1F5F9',
  ctaText: C.body,
  cardBorder: `1.5px solid ${C.border}`,
  cardShadow: `0 4px 16px ${C.shadow}`,
  checkColor: C.teal,
};

// ── Plan sort order ───────────────────────────────────────────────────────────
const PLAN_ORDER: Record<string, number> = {
  free: 1, basic: 1,
  starter: 2,
  professional: 3, pro: 3,
  business: 4,
  enterprise: 5,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type BillingCycle = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

interface Feature {
  featureSlug: string;
  uiLabel: string;
}

interface Plan {
  licenseType: string;   // LT _id, used as React key
  name: string;
  description: string;
  price: number;         // base price (monthly)
  isFree: boolean;
  isEnterprise: boolean;
  features: Feature[];
  discountConfig: Record<BillingCycle, number>;
  meta: PlanMeta;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const BILLING_MONTHS: Record<BillingCycle, number> = {
  monthly: 1, quarterly: 3, 'half-yearly': 6, yearly: 12,
};

const BILLING_LABELS: Record<BillingCycle, string> = {
  monthly:      'Monthly',
  quarterly:    'Quarterly',
  'half-yearly':'Half-Yearly',
  yearly:       'Yearly',
};

const BILLING_UNIT: Record<BillingCycle, string> = {
  monthly:      '/user/month',
  quarterly:    '/user/quarter',
  'half-yearly':'/user/half-year',
  yearly:       '/user/year',
};

function computePrice(plan: Plan, cycle: BillingCycle): number {
  if (plan.isFree) return 0;
  const months = BILLING_MONTHS[cycle];
  const discount = plan.discountConfig?.[cycle] ?? 0;
  return plan.price * months * (1 - discount / 100);
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      className="rounded-2xl bg-white animate-pulse"
      style={{ border: `1.5px solid ${C.border}`, height: 520 }}
    >
      <div className="p-6 space-y-4">
        <div className="h-5 w-24 rounded-full bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
        <div className="h-10 w-32 rounded bg-slate-200 mt-4" />
        <div className="h-10 w-full rounded-xl bg-slate-200 mt-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2">
            <div className="h-4 w-4 rounded-full bg-slate-200 flex-shrink-0" />
            <div className="h-3 flex-1 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component props ───────────────────────────────────────────────────────────
interface PricingSectionProps {
  onContactClick?: () => void;
  onPlanSelect?: (planId: string, cycle: BillingCycle) => void;
}

// ── Fallback plans (shown when LMS returns empty or is unreachable) ─────────
// TODO: Replace licenseType values with real MongoDB _id from LMS admin panel
//       once plans are published for product 6a26929078d2d302b575cc10
const FALLBACK_PLANS: Plan[] = [
  {
    licenseType:    '6a26929078d2d302b575cc10',
    name:           'Basic',
    description:    'Try all features free for 7 days — no credit card required',
    price:          0,
    isFree:         true,
    isEnterprise:   false,
    features: [
      { featureSlug: 'candidates', uiLabel: 'Up to 5 candidates tracked' },
      { featureSlug: 'scoring',    uiLabel: 'Basic trust scoring' },
      { featureSlug: 'support',    uiLabel: 'Email support' },
      { featureSlug: 'trial',      uiLabel: '7-day free trial' },
      { featureSlug: 'workspace',  uiLabel: 'Single team workspace' },
      { featureSlug: 'dashboard',  uiLabel: 'Core dashboard' },
      { featureSlug: 'api',        uiLabel: 'Standard API access' },
    ],
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
    meta: PLAN_META['basic'] || DEFAULT_META,
  },
  {
    licenseType:    '6a26929078d2d302b575cc11',
    name:           'Starter',
    description:    'Ideal for small hiring teams getting started',
    price:          4100,
    isFree:         false,
    isEnterprise:   false,
    features: [
      { featureSlug: 'candidates', uiLabel: 'Up to 100 candidates tracked' },
      { featureSlug: 'scoring',    uiLabel: 'Basic trust scoring' },
      { featureSlug: 'support',    uiLabel: 'Email support' },
      { featureSlug: 'retention',  uiLabel: '7-day data retention' },
      { featureSlug: 'api',        uiLabel: 'Standard API access' },
      { featureSlug: 'workspace',  uiLabel: 'Single team workspace' },
      { featureSlug: 'dashboard',  uiLabel: 'Core dashboard with KPI cards' },
    ],
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
    meta: PLAN_META['starter'] || DEFAULT_META,
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function PricingSection({ onContactClick, onPlanSelect }: PricingSectionProps) {
  const [cycle, setCycle]   = useState<BillingCycle>('monthly');
  const [plans, setPlans]   = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // ── Fetch plans from LMS ───────────────────────────────────────────────────
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${LMS_PROXY}/plans`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const mapped: Plan[] = (data.licenses ?? [])
          .filter((lic: any) => lic && lic.licenseType)
          .map((lic: any) => {
            const lt  = lic.licenseType;
            const name = lt.name ?? 'Unnamed Plan';
            const key = name.toLowerCase();
            const meta = PLAN_META[key] ?? DEFAULT_META;

            return {
              licenseType:    lt._id ?? lic._id ?? '',
              name:           name,
              description:    lt.description ?? `Best for ${name} users`,
              price:          lt.price?.amount ?? 0,
              isFree:         (lt.price?.amount ?? 0) === 0,
              isEnterprise:   key === 'enterprise',
              features:       lt.features ?? [],
              discountConfig: lt.discountConfig ?? {
                monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20,
              },
              meta,
            };
          });

        if (mapped.length > 0) {
          // Sort by PLAN_ORDER
          mapped.sort((a, b) => {
            const ak = a.name.toLowerCase();
            const bk = b.name.toLowerCase();
            return (PLAN_ORDER[ak] ?? 999) - (PLAN_ORDER[bk] ?? 999);
          });
          setPlans(mapped);
        } else {
          console.warn('LMS returned no licenses, using high-fidelity fallback plans.');
          setPlans(FALLBACK_PLANS);
        }
      } catch (err: any) {
        console.error('Failed to load TrustLayer plans from LMS, using fallback plans:', err);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ── Discount badge on tabs ─────────────────────────────────────────────────
  const discountFor = (c: BillingCycle) => {
    const ref = plans.find(p => !p.isFree && !p.isEnterprise);
    return ref?.discountConfig?.[c] ?? 0;
  };

  // ── CTA handler ────────────────────────────────────────────────────────────
  const handleCTA = (plan: Plan) => {
    if (plan.isEnterprise) {
      onContactClick?.();
    } else {
      onPlanSelect?.(plan.licenseType, cycle);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

          {/* ── Billing cycle tabs ── */}
          <div
            className="inline-flex items-center rounded-full p-1 flex-wrap gap-1 justify-center"
            style={{
              background: 'white',
              border: `1.5px solid ${C.border}`,
              boxShadow: `0 2px 10px ${C.shadow}`,
            }}
          >
            {(['monthly', 'quarterly', 'half-yearly', 'yearly'] as BillingCycle[]).map((c) => {
              const pct = discountFor(c);
              return (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className="relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background:
                      cycle === c
                        ? `linear-gradient(135deg,${C.teal},${C.tealDark})`
                        : 'transparent',
                    color: cycle === c ? 'white' : C.body,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {BILLING_LABELS[c]}
                  {pct > 0 && (
                    <span
                      className="absolute -top-2 -right-1 text-white font-bold rounded-full"
                      style={{ background: '#16a34a', fontSize: 9, padding: '2px 5px' }}
                    >
                      -{pct}%
                    </span>
                  )}
                </button>
              );
            })}
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

        {/* ── Error state ── */}
        {error && (
          <div
            className="text-center py-12 rounded-2xl mb-12"
            style={{ border: `1.5px dashed ${C.border}`, color: C.muted }}
          >
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-semibold underline"
              style={{ color: C.teal, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Plan cards ── */}
        <div
          className="grid gap-5 items-stretch mb-12"
          style={{
            gridTemplateColumns: loading
              ? 'repeat(auto-fill, minmax(200px, 1fr))'
              : `repeat(${Math.min(plans.length, 5)}, minmax(0, 1fr))`,
          }}
        >
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : plans.map((plan, i) => {
                const { meta } = plan;
                const Icon = meta.icon;
                const price = computePrice(plan, cycle);
                const discount = plan.discountConfig?.[cycle] ?? 0;

                return (
                  <motion.div
                    key={plan.licenseType}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="relative bg-white rounded-2xl flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
                    style={{ border: meta.cardBorder, boxShadow: meta.cardShadow }}
                  >
                    {/* Most popular badge */}
                    {meta.popular && (
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
                      {/* Name badge + icon */}
                      <div className="mb-3 flex items-center gap-2">
                        <div
                          className="p-1.5 rounded-lg"
                          style={{ background: `${meta.accentColor}15` }}
                        >
                          <Icon style={{ width: 16, height: 16, color: meta.accentColor }} />
                        </div>
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: meta.badgeBg, color: meta.badgeText }}
                        >
                          {plan.name}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs mb-5 leading-relaxed" style={{ color: C.muted }}>
                        {plan.description}
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
                        ) : plan.isFree ? (
                          <>
                            <div className="text-4xl font-extrabold" style={{ color: '#16a34a' }}>
                              Free
                            </div>
                            <div className="text-xs mt-1" style={{ color: C.muted }}>
                              No credit card required
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1 flex-wrap">
                              <span className="text-4xl font-extrabold" style={{ color: meta.accentColor }}>
                                ₹{price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                              <span className="text-xs leading-tight" style={{ color: C.muted }}>
                                {BILLING_UNIT[cycle]}
                              </span>
                            </div>
                            {discount > 0 && (
                              <div
                                className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a' }}
                              >
                                Save {discount}%
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* CTA button */}
                      <button
                        onClick={() => handleCTA(plan)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold mb-6 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        style={{
                          background: meta.ctaBg,
                          color: meta.ctaText,
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
                        ) : plan.isFree ? (
                          <>
                            Get Started Free
                            <ArrowRight style={{ width: 14, height: 14 }} />
                          </>
                        ) : (
                          <>
                            Buy Now
                            <ArrowRight style={{ width: 14, height: 14 }} />
                          </>
                        )}
                      </button>

                      {/* Features */}
                      {plan.features.length > 0 && (
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
                            {plan.features.map((feat) => (
                              <div key={feat.featureSlug} className="flex items-start gap-2.5">
                                <Check
                                  style={{
                                    width: 16, height: 16, flexShrink: 0,
                                    marginTop: 2, color: meta.checkColor,
                                  }}
                                />
                                <span className="text-xs leading-snug" style={{ color: '#64748b' }}>
                                  {feat.uiLabel}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
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
            Need a custom plan?{' '}
            <button
              onClick={() => onContactClick?.()}
              style={{
                color: C.teal, background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 600, textDecoration: 'underline',
              }}
            >
              Contact our sales team
            </button>
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