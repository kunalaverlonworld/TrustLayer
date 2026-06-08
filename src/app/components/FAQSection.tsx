import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Zap, ArrowRight, MessageCircle } from 'lucide-react';

const C = {
  bg:        '#edf5fb',
  bgCard:    '#ffffff',
  navy:      '#0a1f3d',
  navyLight: '#0d2a52',
  teal:      '#00b8d4',
  tealDark:  '#0097b2',
  tealLight: '#e0f7fa',
  body:      '#475569',
  muted:     '#94a3b8',
  border:    '#e2eaf3',
  shadow:    'rgba(10,31,61,0.08)',
};

const categories = [
  {
    label: "Technical",
    faqs: [
      {
        q: "What are the system requirements for TrustLayer?",
        a: "TrustLayer requires Node.js 20.x LTS on the backend and a modern browser for the React 19 frontend. You will also need a MongoDB instance (Atlas or self-hosted) and a valid Resend API key for email delivery.",
      },
      {
        q: "How does the trust score pipeline update work?",
        a: "The Trust Intelligence Dashboard polls for updates every 10 seconds. For candidates, scores are recalculated live by pulling fresh interaction data from the Recruitment API on each request. For employees, scores recalculate immediately whenever an incident is logged via POST /api/employees/:id/incidents.",
      },
      {
        q: "Is candidate data encrypted and securely stored?",
        a: "TrustLayer does not store candidate profiles at all — only derived signals (engagement scores, ghosting flags, open/click counts) are persisted in the TrustMetrics collection. All personally identifiable information is fetched live from your Recruitment API on each request and never written to TrustLayer's database.",
      },
      {
        q: "Where is the platform hosted?",
        a: "TrustLayer is a self-hostable Node.js + MongoDB application. You can deploy it on any cloud provider (AWS, GCP, Azure, Railway, Render, etc.) or on-premise. The frontend is a Vite-built React SPA that can be served from any static host or CDN.",
      },
      {
        q: "Can TrustLayer work without the Recruitment API?",
        a: "The employee trust track (incident-based scoring) works fully standalone with no external API needed. The candidate trust track requires a connected Recruitment API. Without RECRUITMENT_API_URL configured, the candidate dashboard will return an error.",
      },
    ],
  },
  {
    label: "General",
    faqs: [
      {
        q: "What problem does TrustLayer solve?",
        a: "TrustLayer addresses two costly HR problems: candidates who ghost after receiving job offers, and employees who show disengagement or policy-violation patterns before departure. It provides a normalised Trust Score (0-100) and Risk Level (Low / Moderate / High) so HR can act proactively rather than reactively.",
      },
      {
        q: "Can a candidate also be tracked as an employee?",
        a: "Not automatically. The two tracks use separate data paths — TrustMetrics.applicationId for candidates and Employee.currentTrustScore for employees. A candidate who is later hired would need to be manually added as an Employee record to begin the employee trust track.",
      },
      {
        q: "How is multi-tenancy enforced?",
        a: "Every JWT token contains a companyId. All database queries include this companyId as a mandatory filter, and MongoDB compound indexes always lead with companyId. This ensures strict data isolation at both the application and database layers — no company can access another company's data.",
      },
      {
        q: "What happens to an employee trust score after 90 days of no incidents?",
        a: "The score converges back toward the 70-point neutral baseline as incidents age out of the 90-day rolling window. Both positive and negative incidents age out over time, so prolonged inactivity eventually returns all employees to Moderate risk territory.",
      },
    ],
  },
  {
    label: "Billing & Pricing",
    faqs: [
      {
        q: "What subscription plans are available?",
        a: "TrustLayer offers Basic, Pro, and Enterprise subscription tiers. Plan data is stored on each company record and is available for feature gating, but all plans currently have full platform access. Contact our sales team for custom enterprise pricing and white-glove onboarding.",
      },
      {
        q: "Is there a free trial?",
        a: "Yes — you can start a free trial with no credit card required. The trial gives you full access to all platform features so you can evaluate TrustLayer candidate and employee trust tracking against your real hiring pipeline.",
      },
      {
        q: "Can I cancel at any time?",
        a: "Absolutely. There are no long-term contracts. You can cancel your subscription at any time from your account settings, and your data will remain accessible until the end of your billing period.",
      },
    ],
  },
  {
    label: "Features & Data",
    faqs: [
      {
        q: "How is the candidate trust score calculated?",
        a: "The score is built from time-to-interaction (how quickly a candidate opened or clicked an email after it was sent), an optional click bonus, a repeated-opens bonus, and a 20-point ghosting penalty if zero interaction is detected. If HR feedback from a previous employer has been submitted, it blends in at 40% weight with the interaction score at 60%.",
      },
      {
        q: "What is the HR Feedback Portal?",
        a: "A public, no-login page automatically linked in an email sent to a candidate's previous employers. The previous employer submits a five-dimension evaluation (reliability, communication, commitment, rehire willingness, offer outcome) on a 1-5 scale. The resulting score is normalised to 0-100 and contributes 40% to the final trust score.",
      },
      {
        q: "How are employee incident types configured?",
        a: "Incident types have configurable impact values (positive or negative). SuperAdmin users can seed a default library of 10 pre-built types, and companies can create their own custom types. When an incident is logged, the impact value is snapshotted — future changes to the incident type will not retroactively affect past incidents.",
      },
      {
        q: "How is employeeId uniqueness guaranteed?",
        a: "Employee IDs are generated via an atomic MongoDB findOneAndUpdate with $inc on a Counter document scoped to each company. Concurrent requests are guaranteed to receive different sequence numbers. The format is COMPANYCODE-EMP-00001 padded to 5 digits.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${open ? C.teal : C.border}`,
        background: open ? '#f0fbfd' : C.bgCard,
        transition: 'border-color 0.2s, background 0.2s',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
          padding: '14px 18px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: C.navy, lineHeight: 1.4 }}>{q}</span>
        <span style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
          background: open ? C.teal : C.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s, transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <ChevronDown size={13} color={open ? 'white' : C.muted} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              margin: 0, padding: '0 18px 16px',
              fontSize: 13.5, color: C.body, lineHeight: 1.65,
              fontFamily: "'Inter', sans-serif",
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryAccordion({ cat, defaultOpen }: { cat: typeof categories[0]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      borderRadius: 14,
      border: `1.5px solid ${open ? C.teal : C.border}`,
      background: C.bgCard,
      overflow: 'hidden',
      transition: 'border-color 0.25s',
      boxShadow: open ? '0 4px 24px rgba(0,184,212,0.10)' : '0 2px 12px rgba(10,31,61,0.08)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 22px', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: open ? C.teal : C.navy }}>
          {cat.label}
        </span>
        <span style={{
          width: 30, height: 30, borderRadius: '50%',
          background: open ? C.teal : C.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s, transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <ChevronDown size={15} color={open ? 'white' : C.muted} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 16px 16px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {cat.faqs.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQSectionProps {
  onContactClick?: () => void;
}

export default function FAQSection({ onContactClick }: FAQSectionProps) {
  return (
    <section
      id="faq"
      style={{
        background: C.bg,
        padding: '100px 32px 80px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: C.tealLight,
            border: '1px solid rgba(0,184,212,0.25)',
            borderRadius: 100, padding: '5px 14px',
            marginBottom: 18,
          }}>
            <Zap size={12} color={C.teal} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              FAQ
            </span>
          </div>

          <h2 style={{
            margin: '0 0 16px',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 900,
            color: C.navy,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
          }}>
            Frequently Asked{' '}
            <span style={{ color: C.teal }}>Questions</span>
          </h2>
          <p style={{
            margin: '0 auto', fontSize: 15.5, color: C.body, lineHeight: 1.65, maxWidth: 480,
          }}>
            Find answers to common questions about TrustLayer features, pricing, and implementation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}
        >
          {categories.map((cat, i) => (
            <CategoryAccordion key={cat.label} cat={cat} defaultOpen={i === 0} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #00b8d4 0%, #0097b2 100%)',
            borderRadius: 16,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={20} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                Still have questions?
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>
                Our team is here to help. We will get back to you within 24 hours.
              </p>
            </div>
          </div>

          <button
            onClick={onContactClick}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 100,
              border: '2px solid white',
              background: 'white',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5, fontWeight: 700,
              color: '#00b8d4',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.88)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
          >
            Contact Support <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}