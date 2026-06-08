import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const responsiveStyles = `
  .dash-section {
    padding: 96px 32px;
  }
  .dash-card {
    padding: 32px;
  }
  .dash-middle-row {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .dash-charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .dash-header {
    margin-bottom: 56px;
  }
  .dash-header p {
    font-size: 17px;
  }
  @media (max-width: 900px) {
    .dash-middle-row {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 768px) {
    .dash-section {
      padding: 64px 16px;
    }
    .dash-card {
      padding: 20px 16px;
      border-radius: 18px !important;
    }
    .dash-charts-row {
      grid-template-columns: 1fr;
    }
    .dash-header {
      margin-bottom: 36px;
    }
    .dash-header p {
      font-size: 15px;
    }
  }
  @media (max-width: 480px) {
    .dash-section {
      padding: 48px 12px;
    }
    .dash-card {
      padding: 16px 12px;
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

const chartData = [
  { name: 'Mon', value: 65 }, { name: 'Tue', value: 72 }, { name: 'Wed', value: 68 },
  { name: 'Thu', value: 85 }, { name: 'Fri', value: 78 }, { name: 'Sat', value: 92 },
  { name: 'Sun', value: 88 },
];

const candidates = [
  { name: 'Sarah Johnson',  role: 'Senior Developer', score: 92, risk: 'low' },
  { name: 'Michael Chen',   role: 'Product Manager',  score: 78, risk: 'medium' },
  { name: 'Emma Davis',     role: 'UX Designer',      score: 45, risk: 'high' },
  { name: 'James Wilson',   role: 'DevOps Engineer',  score: 88, risk: 'low' },
  { name: 'Lisa Anderson',  role: 'Data Scientist',   score: 56, risk: 'medium' },
];

const activities = [
  { time: '2m ago',  event: 'Sarah Johnson completed interview',           type: 'success' },
  { time: '15m ago', event: 'Ghosting risk detected for Emma Davis',        type: 'warning' },
  { time: '1h ago',  event: 'Trust score updated for 12 candidates',       type: 'info' },
  { time: '3h ago',  event: 'Michael Chen schedule confirmed',             type: 'success' },
];

const riskColor = (risk: string) =>
  risk === 'low' ? '#16a34a' : risk === 'medium' ? '#d97706' : '#dc2626';

export default function DashboardShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <>
      <style>{responsiveStyles}</style>
      <section id="dashboard" ref={ref} className="dash-section" style={{
        background: C.bg,
        fontFamily: "'Inter', sans-serif",
      }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="dash-header"
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            fontSize: 'clamp(30px, 3.5vw, 46px)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: C.navy, margin: '0 0 16px',
          }}>
            Enterprise <span style={{ color: C.teal }}>Analytics Dashboard</span>
          </h2>
          <p style={{ fontSize: 17, color: C.body, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Real-time insights and predictive intelligence in one powerful platform
          </p>
        </motion.div>

        {/* Dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{
            background: 'white', borderRadius: 24,
            border: `1.5px solid ${C.border}`,
            boxShadow: `0 4px 32px ${C.shadow}`,
          }}
          className="dash-card"
        >
          {/* Top metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Active Candidates', value: '1,247', icon: TrendingUp, color: C.teal,    bg: C.tealLight },
              { label: 'Avg Trust Score',   value: '87.4',  icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
              { label: 'Risk Alerts',        value: '23',    icon: AlertTriangle, color: '#dc2626', bg: '#fef2f2' },
              { label: 'Pending Reviews',    value: '156',   icon: Clock, color: '#d97706', bg: '#fffbeb' },
            ].map((m, i) => (
              <motion.div key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35 + i * 0.08 }}
                style={{
                  background: m.bg, borderRadius: 14,
                  padding: '18px 20px',
                  border: `1.5px solid ${m.color}25`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <m.icon size={15} color={m.color} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.body }}>{m.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: m.color, letterSpacing: '-0.04em' }}>
                  {m.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Middle row */}
          <div className="dash-middle-row">
            {/* Candidate table */}
            <div style={{
              background: C.bg, borderRadius: 16,
              border: `1.5px solid ${C.border}`, padding: 22,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Candidate Trust Monitor</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: C.teal,
                  background: C.tealLight, padding: '3px 10px', borderRadius: 100,
                  border: `1px solid ${C.teal}30`,
                }}>● Live</span>
              </div>
              {candidates.map((c, i) => (
                <motion.div key={c.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    background: 'white', border: `1px solid ${C.border}`,
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 14,
                  }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>{c.role}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: riskColor(c.risk), minWidth: 36, textAlign: 'right' }}>
                    {c.score}
                  </div>
                  <div style={{ width: 64, height: 6, borderRadius: 100, background: C.border, flexShrink: 0, overflow: 'hidden' }}>
                    <div style={{ width: `${c.score}%`, height: '100%', borderRadius: 100, background: riskColor(c.risk), transition: 'width 1s ease' }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Activity feed */}
            <div style={{
              background: C.bg, borderRadius: 16,
              border: `1.5px solid ${C.border}`, padding: 22,
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 18 }}>
                Recent Activity
              </div>
              {activities.map((a, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.75 + i * 0.08 }}
                  style={{ display: 'flex', gap: 12, marginBottom: 16 }}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: a.type === 'success' ? '#16a34a' : a.type === 'warning' ? '#dc2626' : C.blue,
                  }} />
                  <div>
                    <div style={{ fontSize: 13, color: C.body, lineHeight: 1.5 }}>{a.event}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{a.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="dash-charts-row">
            <div style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Trust Score Trend</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tealFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.teal} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={C.teal} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={C.teal} strokeWidth={2} fill="url(#tealFill)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: C.bg, borderRadius: 16, border: `1.5px solid ${C.border}`, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Risk Distribution</div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[{ name: 'Low', value: 65 }, { name: 'Medium', value: 25 }, { name: 'High', value: 10 }]}>
                  <XAxis dataKey="name" stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.muted} fontSize={11} tickLine={false} axisLine={false} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={C.teal} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  );
}