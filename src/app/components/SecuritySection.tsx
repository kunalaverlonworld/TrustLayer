import { motion } from 'motion/react';
import { Shield, Lock, Database, Key, Server, Users } from 'lucide-react';

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
  { icon: Lock,     title: 'JWT Authentication',      description: 'Industry-standard token-based authentication for secure access control.',                accent: C.teal },
  { icon: Users,    title: 'Role-Based Access',        description: 'Granular permissions and access controls for different user roles.',                      accent: C.blue },
  { icon: Database, title: 'Multi-Tenant Isolation',   description: 'Complete data separation between organizations and teams.',                               accent: '#7c3aed' },
  { icon: Key,      title: 'Secure APIs',              description: 'Encrypted API endpoints with rate limiting and monitoring.',                               accent: '#0891b2' },
  { icon: Server,   title: 'Enterprise Infrastructure', description: 'Cloud-native architecture with 99.9% uptime guarantee.',                                 accent: '#059669' },
  { icon: Shield,   title: 'Data Protection',          description: 'End-to-end encryption and GDPR-compliant data handling.',                                 accent: '#d97706' },
];

const badges = [
  'SOC 2 Type II Certified',
  'GDPR Compliant',
  'ISO 27001 Certified',
];

export default function SecuritySection() {
  return (
    <section id="security" style={{
      background: 'white',
      padding: '96px 32px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.tealLight, borderRadius: 100,
            padding: '6px 16px', marginBottom: 20,
          }}>
            <Shield size={13} color={C.tealDark} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.tealDark }}>Enterprise Security</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 3.5vw, 46px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.navy, margin: '0 0 16px',
          }}>
            Built for <span style={{ color: C.teal }}>Enterprise Security</span>
          </h2>
          <p style={{ fontSize: 17, color: C.body, maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>
            Military-grade security infrastructure designed for the most demanding enterprise requirements
          </p>
        </motion.div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20, marginBottom: 48,
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: `0 16px 48px ${C.shadow}` }}
              style={{
                background: C.bg, borderRadius: 18,
                border: `1.5px solid ${C.border}`, padding: '28px 26px',
                boxShadow: `0 2px 10px ${C.shadow}`,
                transition: 'box-shadow 0.25s, transform 0.25s',
                cursor: 'default',
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${f.accent}18`,
                border: `1.5px solid ${f.accent}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
                transition: 'transform 0.2s',
              }}>
                <f.icon size={22} color={f.accent} />
              </div>
              <h3 style={{ fontSize: 15.5, fontWeight: 700, color: C.navy, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.65, margin: 0 }}>
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>

      
        
      </div>
    </section>
  );
}