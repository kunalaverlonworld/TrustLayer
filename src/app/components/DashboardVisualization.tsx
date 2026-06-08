import { motion } from 'motion/react';
import { TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

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

const trustScores = [
  { name: 'Sarah Johnson', score: 92, status: 'high' },
  { name: 'Michael Chen',  score: 78, status: 'medium' },
  { name: 'Emma Davis',    score: 45, status: 'low' },
];

const scoreColor = (s: string) =>
  s === 'high' ? '#16a34a' : s === 'medium' ? '#d97706' : '#dc2626';

const metrics = [
  { label: 'Active Candidates', value: '1,247', change: '+12%' },
  { label: 'Trust Score Avg',   value: '87.4',  change: '+5.2%' },
  { label: 'Risk Alerts',       value: '23',    change: '-8%' },
];

export default function DashboardVisualization() {
  return (
    <div style={{ position: 'relative', fontFamily: "'Inter', sans-serif" }}>
      {/* Main card */}
      <motion.div
        whileHover={{ y: -4, boxShadow: `0 24px 64px ${C.shadow}` }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'white', borderRadius: 22,
          border: `1.5px solid ${C.border}`,
          boxShadow: `0 4px 24px ${C.shadow}`,
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.02em' }}>
              Candidate Trust Monitor
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Real-time behavioral analysis</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: C.tealLight, border: `1.5px solid ${C.teal}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={18} color={C.teal} />
          </div>
        </div>

        {/* Scores */}
        {trustScores.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            style={{
              background: C.bg, borderRadius: 12, padding: '14px 16px',
              marginBottom: 10, border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{c.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: scoreColor(c.status) }}>{c.score}</span>
                {c.status === 'high' && <CheckCircle size={15} color="#16a34a" />}
                {c.status === 'low'  && <AlertTriangle size={15} color="#dc2626" />}
              </div>
            </div>
            <div style={{ width: '100%', height: 5, background: C.border, borderRadius: 100, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.score}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                style={{ height: '100%', background: scoreColor(c.status), borderRadius: 100 }}
              />
            </div>
          </motion.div>
        ))}

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 16 }}>
          {metrics.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: C.navy, letterSpacing: '-0.04em' }}>{m.value}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{m.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: m.change.startsWith('+') ? '#16a34a' : '#dc2626', marginTop: 2 }}>
                {m.change}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating AI prediction badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: 'absolute', top: -16, right: -16,
          background: 'white', borderRadius: 14, padding: '12px 16px',
          boxShadow: `0 6px 24px ${C.shadow}`,
          border: `1.5px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
          minWidth: 160,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: C.tealLight, border: `1.5px solid ${C.teal}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TrendingUp size={15} color={C.teal} />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>AI Prediction</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: C.navy, letterSpacing: '-0.03em' }}>94.2%</div>
          <div style={{ fontSize: 10.5, color: C.muted }}>Hiring Success Rate</div>
        </div>
      </motion.div>

      {/* Floating risk alert */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        style={{
          position: 'absolute', bottom: -16, left: -16,
          background: 'white', borderRadius: 14, padding: '12px 16px',
          boxShadow: `0 6px 24px ${C.shadow}`,
          border: `1.5px solid #fecaca`,
          display: 'flex', alignItems: 'center', gap: 10,
          minWidth: 196,
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: '#fef2f2', border: '1.5px solid #fecaca',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <AlertTriangle size={15} color="#dc2626" />
          </motion.div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Risk Alert</div>
          <div style={{ fontSize: 12, color: C.body, marginTop: 2 }}>3 candidates show ghosting patterns</div>
        </div>
      </motion.div>
    </div>
  );
}