import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail, Phone, MapPin, Clock, MessageCircle, ArrowRight,
  Headphones, Building2, Send, ArrowLeft, CheckCircle2,
} from "lucide-react";

const MAIL_BASE_URL = "https://email-middleware-qyrt.onrender.com";
const MAIL_API_KEY  = "averlon-mail-2026!";

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
  shadowMd:  'rgba(10,31,61,0.12)',
};

const inp = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: `1.5px solid ${C.border}`,
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: C.navy,
  background: '#f8fafc',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box' as const,
};

const lbl = {
  display: 'block' as const,
  fontSize: 12,
  fontWeight: 600,
  color: C.body,
  marginBottom: 6,
  letterSpacing: '0.02em',
  textTransform: 'uppercase' as const,
};

const infoCards = [
  {
    icon: <Mail size={20} color={C.teal} />,
    title: 'Email Us',
    lines: ['info@averlonworld.com'],
    sub: 'We reply within 24 hours',
    accent: C.teal,
  },
  {
    icon: <Phone size={20} color="#16a34a" />,
    title: 'Call Us',
    lines: ['+91 98924 40788'],
    sub: 'Mon–Sat, 9:30 AM–6:30 PM IST',
    accent: '#16a34a',
  },
  {
    icon: <MapPin size={20} color="#7c3aed" />,
    title: 'Office',
    lines: ['5th Floor, Lodha Supremus - II,', 'Phase - II, Unit No. A-533/A-515,', 'Road No. 22, Wagle Industrial Estate, Thane West, Maharashtra,', 'India — 400001'],
    accent: '#7c3aed',
  },
  {
    icon: <Clock size={20} color="#d97706" />,
    title: 'Support Hours',
    lines: ['Mon – Sat: 9:30 AM – 6:30 PM IST'],
    
    accent: '#d97706',
  },
];

interface ContactSupportProps {
  onBack?: () => void;
}

export function ContactSupport({ onBack }: ContactSupportProps) {
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', company: '',
    inquiryType: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${MAIL_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': MAIL_API_KEY },
        body: JSON.stringify({
          to: formData.email,
          subject: 'We received your message — TrustLayer Support',
          html: `
          <div style="background:#edf5fb;padding:32px 16px;font-family:'Inter','Segoe UI',sans-serif;">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(10,31,61,0.10);">
            <div style="background:linear-gradient(135deg,#0a1f3d 0%,#0d2a52 40%,#00b8d4 100%);padding:40px 36px 32px;text-align:center;">
              <div style="width:48px;height:48px;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:800;font-size:16px;font-family:'Inter',sans-serif;">TL</span>
              </div>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:white;letter-spacing:-0.04em;font-family:'Inter',sans-serif;">We've got your message!</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;">Thank you for contacting TrustLayer support</p>
            </div>
            <div style="padding:32px 36px;">
              <p style="font-size:15px;color:#0a1f3d;font-weight:700;margin:0 0 6px;font-family:'Inter',sans-serif;">Hi ${formData.fullName}!</p>
              <p style="font-size:13px;color:#475569;line-height:1.65;margin:0 0 20px;font-family:'Inter',sans-serif;">Our <strong style="color:#0a1f3d;">TrustLayer</strong> support team will get back to you within <strong style="color:#00b8d4;">24 hours</strong>.</p>
              <div style="background:#e0f7fa;border:1.5px solid #b2ebf2;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#00b8d4;text-transform:uppercase;letter-spacing:0.06em;font-family:'Inter',sans-serif;">Your message</p>
                <p style="margin:0;font-size:13px;color:#334155;line-height:1.65;font-family:'Inter',sans-serif;">${formData.message}</p>
              </div>
              <div style="background:linear-gradient(135deg,#0a1f3d,#0d2a52);border-radius:12px;padding:18px 22px;text-align:center;">
                <p style="margin:0 0 4px;font-size:12px;color:rgba(255,255,255,0.6);font-family:'Inter',sans-serif;">Need urgent help?</p>
                <p style="margin:0;font-family:'Inter',sans-serif;">
                  <a href="mailto:info@averlonworld.com" style="color:#67e8f9;font-weight:700;text-decoration:none;font-size:13px;">info@averlonworld.com</a>
                  <span style="color:rgba(255,255,255,0.3);margin:0 8px;">|</span>
                  <span style="color:rgba(255,255,255,0.75);font-weight:600;font-size:13px;">+91 98924 40788</span>
                </p>
              </div>
            </div>
            <div style="text-align:center;padding:16px 36px 24px;background:#f8fafc;border-top:1px solid #e2eaf3;">
              <p style="margin:0;font-size:11px;color:#94a3b8;font-family:'Inter',sans-serif;">Warm regards,<br/><strong style="color:#64748b;">TrustLayer Support Team</strong></p>
            </div>
          </div>
          </div>`,
        }),
      });

      await fetch(`${MAIL_BASE_URL}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': MAIL_API_KEY },
        body: JSON.stringify({
          to: 'info@averlonworld.com',
          subject: `[TrustLayer Support] ${formData.subject} — ${formData.fullName}`,
          html: `
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(10,31,61,0.10);">
            <div style="background:linear-gradient(135deg,#0a1f3d 0%,#0d2a52 40%,#00b8d4 100%);padding:36px 36px 28px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border:1.5px solid rgba(255,255,255,0.3);border-radius:12px;padding:8px 16px;margin-bottom:12px;">
                <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.9);text-transform:uppercase;letter-spacing:0.08em;font-family:'Inter',sans-serif;">🔔 New Support Request</span>
              </div>
              <h1 style="margin:0;font-size:20px;font-weight:800;color:white;letter-spacing:-0.03em;font-family:'Inter',sans-serif;">${formData.subject}</h1>
              <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.60);font-family:'Inter',sans-serif;">TrustLayer — ${formData.inquiryType || 'General Inquiry'}</p>
            </div>
            <div style="padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:12px;color:#94a3b8;font-family:'Inter',sans-serif;width:130px;">Name</td><td style="font-size:13px;font-weight:600;color:#0a1f3d;font-family:'Inter',sans-serif;">${formData.fullName}</td></tr>
                <tr><td style="padding:6px 0;font-size:12px;color:#94a3b8;font-family:'Inter',sans-serif;">Email</td><td style="font-size:13px;font-weight:600;color:#0a1f3d;font-family:'Inter',sans-serif;">${formData.email}</td></tr>
                ${formData.phone ? `<tr><td style="padding:6px 0;font-size:12px;color:#94a3b8;font-family:'Inter',sans-serif;">Phone</td><td style="font-size:13px;font-weight:600;color:#0a1f3d;font-family:'Inter',sans-serif;">${formData.phone}</td></tr>` : ''}
                ${formData.company ? `<tr><td style="padding:6px 0;font-size:12px;color:#94a3b8;font-family:'Inter',sans-serif;">Company</td><td style="font-size:13px;font-weight:600;color:#0a1f3d;font-family:'Inter',sans-serif;">${formData.company}</td></tr>` : ''}
                <tr><td style="padding:6px 0;font-size:12px;color:#94a3b8;font-family:'Inter',sans-serif;">Type</td><td style="font-size:13px;font-weight:600;color:#0a1f3d;font-family:'Inter',sans-serif;">${formData.inquiryType}</td></tr>
              </table>
              <div style="background:#e0f7fa;border:1.5px solid #b2ebf2;border-radius:12px;padding:16px 20px;margin:20px 0 0;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#00b8d4;text-transform:uppercase;letter-spacing:0.06em;font-family:'Inter',sans-serif;">Message</p>
                <p style="margin:0;font-size:13px;color:#334155;line-height:1.65;font-family:'Inter',sans-serif;">${formData.message}</p>
              </div>
            </div>
          </div>`,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* ── Hero header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 55%, #0d3a5c 100%)`,
        padding: '100px 32px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        {/* Teal blob */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 340, height: 340,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,184,212,0.18) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 100, padding: '7px 16px',
                color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', marginBottom: 32,
                fontFamily: "'Inter', sans-serif",
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            >
              <ArrowLeft size={14} /> Back
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(0,184,212,0.15)',
              border: '1px solid rgba(0,184,212,0.35)',
              borderRadius: 100, padding: '5px 14px',
              marginBottom: 20,
            }}>
              <Headphones size={13} color={C.teal} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.teal, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Support Center
              </span>
            </div>

            <h1 style={{
              margin: '0 0 16px',
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
            }}>
              How can we <span style={{ color: C.teal }}>help you?</span>
            </h1>
            <p style={{
              margin: 0, fontSize: 17, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.6, maxWidth: 520,
            }}>
              Our team is ready to assist with any questions about TrustLayer — from onboarding to enterprise integrations.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Info cards row ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          transform: 'translateY(-36px)',
        }}>
          {infoCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              style={{
                background: C.bgCard,
                borderRadius: 16,
                padding: '20px 22px',
                border: `1px solid ${C.border}`,
                boxShadow: `0 4px 20px ${C.shadow}`,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: `${card.accent}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                {card.icon}
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: C.navy, letterSpacing: '-0.01em' }}>
                {card.title}
              </p>
              {card.lines.map(l => (
                <p key={l} style={{ margin: '1px 0', fontSize: 13, color: C.body, lineHeight: 1.5 }}>{l}</p>
              ))}
              
            </motion.div>
          ))}
        </div>

        {/* ── Main content: left sidebar + form ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 28,
          marginTop: 0,
          marginBottom: 80,
          alignItems: 'start',
        }}
          className="contact-grid"
        >
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* What to expect */}
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16,
              padding: '24px',
              boxShadow: `0 4px 20px ${C.shadow}`,
            }}>
              <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: '-0.02em' }}>
                What to expect
              </p>
              {[
                { step: '01', text: 'Fill out the form with your details' },
                { step: '02', text: 'Confirmation email sent instantly' },
                { step: '03', text: 'Team reviews & responds within 24h' },
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: C.tealLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: C.teal, letterSpacing: '0.02em',
                  }}>
                    {s.step}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>

            {/* Inquiry types */}
            

            {/* Company badge */}
            <div style={{
              background: `linear-gradient(135deg, ${C.navy}, ${C.navyLight})`,
              borderRadius: 16,
              padding: '22px',
              boxShadow: `0 4px 20px ${C.shadow}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Building2 size={16} color={C.teal} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white', letterSpacing: '-0.01em' }}>
                  Enterprise?
                </span>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                Need a custom plan or white-glove onboarding? Let's talk.
              </p>
              <button style={{
                width: '100%', padding: '9px', borderRadius: 100,
                border: '1.5px solid rgba(0,184,212,0.45)',
                background: 'rgba(0,184,212,0.10)',
                color: C.teal, fontSize: 12.5, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,184,212,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,184,212,0.10)')}
              >
                Contact Enterprise Sales
              </button>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '36px 40px',
              boxShadow: `0 8px 40px ${C.shadowMd}`,
            }}>
              {submitted ? (
                /* ── Success state ── */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%',
                    background: '#dcfce7', margin: '0 auto 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={32} color="#16a34a" />
                  </div>
                  <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em' }}>
                    Message sent!
                  </h2>
                  <p style={{ margin: '0 0 28px', fontSize: 14, color: C.body, lineHeight: 1.6 }}>
                    Thanks, <strong>{formData.fullName}</strong>. We'll get back to you at{' '}
                    <strong style={{ color: C.teal }}>{formData.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', company: '', inquiryType: '', subject: '', message: '' }); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 100,
                      border: `1.5px solid ${C.border}`, background: 'none',
                      cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                      fontSize: 13, fontWeight: 600, color: C.navy,
                    }}
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Form header */}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      background: C.tealLight, border: `1px solid rgba(0,184,212,0.25)`,
                      borderRadius: 100, padding: '4px 12px', marginBottom: 12,
                    }}>
                      <MessageCircle size={12} color={C.teal} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Message Us
                      </span>
                    </div>
                    <h2 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em' }}>
                      Send us a <span style={{ color: C.teal }}>Message</span>
                    </h2>
                    <p style={{ margin: 0, fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>
                      Fill out the form and our team will respond within 24 hours (Mon–Sat, 9 AM–8 PM IST).
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={lbl}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          name="fullName" value={formData.fullName} onChange={handleChange}
                          required placeholder="Aarav Sharma" style={inp}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={lbl}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          name="email" type="email" value={formData.email} onChange={handleChange}
                          required placeholder="aarav@company.com" style={inp}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={lbl}>Phone Number</label>
                        <input
                          name="phone" value={formData.phone} onChange={handleChange}
                          placeholder="+91 98765 43210" style={inp}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={lbl}>Company Name</label>
                        <input
                          name="company" value={formData.company} onChange={handleChange}
                          placeholder="Acme Corp" style={inp}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={lbl}>Inquiry Type <span style={{ color: '#ef4444' }}>*</span></label>
                        <select
                          name="inquiryType" value={formData.inquiryType} onChange={handleChange}
                          required style={{ ...inp, cursor: 'pointer' }}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <option value="">Select type</option>
                          <option value="technical">Technical Support</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="billing">Billing Question</option>
                          <option value="demo">Demo Request</option>
                          <option value="feature">Feature Request</option>
                          <option value="bug">Bug Report</option>
                          <option value="enterprise">Enterprise Custom Plan</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={lbl}>Subject <span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          name="subject" value={formData.subject} onChange={handleChange}
                          required placeholder="How can we help?" style={inp}
                          onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={lbl}>Message <span style={{ color: '#ef4444' }}>*</span></label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        required rows={5}
                        placeholder="Please describe your inquiry in detail…"
                        style={{ ...inp, resize: 'vertical' as const }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(0,184,212,0.12)`; }}
                        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setFormData({ fullName: '', email: '', phone: '', company: '', inquiryType: '', subject: '', message: '' })}
                        style={{
                          padding: '10px 20px', borderRadius: 100,
                          border: `1.5px solid ${C.border}`, background: 'none',
                          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                          fontSize: 13.5, fontWeight: 600, color: C.body,
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 8,
                          padding: '10px 26px', borderRadius: 100,
                          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13.5, fontWeight: 700, color: 'white',
                          background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                          boxShadow: '0 4px 14px rgba(0,184,212,0.30)',
                          opacity: loading ? 0.7 : 1,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(0,184,212,0.40)'; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(0,184,212,0.30)'; }}
                      >
                        <Send size={14} />
                        {loading ? 'Sending…' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}