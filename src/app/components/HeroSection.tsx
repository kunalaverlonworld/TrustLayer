import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Target, TrendingUp, Zap,
  ArrowRight, CheckCircle, AlertTriangle, Users, Play,
} from 'lucide-react';

const C = {
  bg:         '#edf5fb',
  bgCard:     '#ffffff',
  navy:       '#0a1f3d',
  navyMid:    '#0d2d5e',
  teal:       '#00b8d4',
  tealDark:   '#0097b2',
  tealLight:  '#e0f7fa',
  blue:       '#1565c0',
  blueLight:  '#e3f2fd',
  body:       '#475569',
  muted:      '#94a3b8',
  border:     '#e2eaf3',
  shadow:     'rgba(10,31,61,0.08)',
};

const injectStyles = () => {
  if (document.getElementById('tl-hero-styles')) return;
  const el = document.createElement('style');
  el.id = 'tl-hero-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    .tl-root { font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }

    @keyframes tl-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes tl-blink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
    @keyframes tl-bar { from { width: 0; } to { width: var(--w); } }
    @keyframes tl-blob1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.05); } 66% { transform: translate(-20px,15px) scale(0.97); } }
    @keyframes tl-blob2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-25px,20px) scale(1.04); } 66% { transform: translate(20px,-15px) scale(0.98); } }

    .tl-float  { animation: tl-float 5s ease-in-out infinite; }
    .tl-blink  { animation: tl-blink 1.8s ease-in-out infinite; }
    .tl-blob1  { animation: tl-blob1 12s ease-in-out infinite; }
    .tl-blob2  { animation: tl-blob2 15s ease-in-out infinite; }
    .tl-bar { animation: tl-bar 1.2s cubic-bezier(.16,1,.3,1) forwards; width:0; }
    .tl-bar-d1 { animation-delay: 0.5s; }
    .tl-bar-d2 { animation-delay: 0.65s; }
    .tl-bar-d3 { animation-delay: 0.8s; }
    .tl-bar-d4 { animation-delay: 0.95s; }

    .tl-cta-primary {
      display:inline-flex; align-items:center; gap:8px;
      padding:14px 28px;
      background: linear-gradient(135deg, #00b8d4 0%, #0097b2 100%);
      color:white; font-weight:700; font-size:15px;
      border:none; border-radius:100px; cursor:pointer;
      font-family:'Inter',sans-serif; letter-spacing:-0.01em;
      box-shadow: 0 6px 24px rgba(0,184,212,0.35);
      transition: transform .2s, box-shadow .2s;
    }
    .tl-cta-primary:hover { transform:translateY(-2px); box-shadow: 0 12px 32px rgba(0,184,212,0.45); }
    .tl-cta-secondary {
      display:inline-flex; align-items:center; gap:8px;
      padding:13px 26px; background:transparent; color:#0a1f3d;
      font-weight:600; font-size:15px;
      border:2px solid #cbd5e1; border-radius:100px; cursor:pointer;
      font-family:'Inter',sans-serif; letter-spacing:-0.01em;
      transition: border-color .2s, color .2s, background .2s;
    }
    .tl-cta-secondary:hover { border-color:#00b8d4; color:#00b8d4; background:#e0f7fa30; }

    .tl-feat-chip {
      display:inline-flex; align-items:center; gap:7px;
      padding:8px 14px; background:white; border:1.5px solid #e2eaf3;
      border-radius:100px; font-size:13px; font-weight:500; color:#334155;
      box-shadow:0 2px 8px rgba(10,31,61,0.05);
      transition: border-color .2s, transform .2s, box-shadow .2s;
      white-space:nowrap;
    }
    .tl-feat-chip:hover { border-color:#00b8d4; transform:translateY(-1px); box-shadow:0 6px 18px rgba(0,184,212,0.12); }

    .tl-card {
      background:white; border-radius:20px;
      box-shadow: 0 2px 8px rgba(10,31,61,0.06), 0 24px 64px rgba(10,31,61,0.12);
      border:1px solid rgba(226,234,243,0.9);
    }
    .tl-row:hover { background:#f0fbff !important; }

    .tl-badge-float {
      background:white; border-radius:14px; padding:12px 16px;
      box-shadow:0 4px 20px rgba(10,31,61,0.12);
      border:1px solid #e2eaf3;
      display:flex; align-items:center; gap:10px;
      font-family:'Inter',sans-serif;
    }

    /* ── RESPONSIVE ── */
    .tl-hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
    .tl-right-col { display:block; position:relative; }
    .tl-hero-chips { display:flex; flex-wrap:wrap; gap:8px; }
    .tl-stats-row { display:flex; gap:28px; padding-top:4px; }
    .tl-cta-row { display:flex; gap:12px; flex-wrap:wrap; }

    @media (max-width: 1024px) {
      .tl-hero-grid { grid-template-columns: 1fr !important; gap:40px !important; }
      .tl-right-col { max-width:520px; margin:0 auto; width:100%; }
    }
    @media (max-width: 768px) {
      .tl-badge-float-tr { display:none !important; }
      .tl-badge-float-br { display:none !important; }
      .tl-badge-float-mr { display:none !important; }
    }
    @media (max-width: 640px) {
      .tl-hero-chips { display:none !important; }
      .tl-stats-row { gap:18px !important; }
      .tl-cta-primary { font-size:14px !important; padding:12px 22px !important; }
      .tl-cta-secondary { font-size:14px !important; padding:11px 20px !important; }
    }
  `;
  document.head.appendChild(el);
};

/* Doc-aligned: candidates from documentation examples */
const CANDIDATES = [
  { name:'Priya Mehta',  role:'Senior Engineer',  score:92, risk:'Low',      init:'PM', hue:'#00b8d4' },
  { name:'Arjun Shah',   role:'Product Manager',  score:67, risk:'Moderate', init:'AS', hue:'#7c3aed' },
  { name:'Neha Kapoor',  role:'UX Designer',      score:38, risk:'High',     init:'NK', hue:'#ef4444' },
  { name:'Raj Patel',    role:'DevOps Lead',       score:85, risk:'Low',      init:'RP', hue:'#059669' },
];

const RISK: Record<string,{bg:string,color:string,border:string}> = {
  Low:      { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
  Moderate: { bg:'#fffbeb', color:'#d97706', border:'#fde68a' },
  High:     { bg:'#fef2f2', color:'#dc2626', border:'#fecaca' },
};

function DashboardCard() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % CANDIDATES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="tl-card" style={{ width:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{
        background:'linear-gradient(135deg, #0a1f3d 0%, #0d2d5e 100%)',
        padding:'16px 20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background:'rgba(0,184,212,0.20)', border:'1px solid rgba(0,184,212,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Shield size={16} color="#00b8d4" />
          </div>
          <div>
            <div style={{ color:'white', fontSize:13, fontWeight:700, letterSpacing:'-0.01em' }}>
              Trust Intelligence Dashboard
            </div>
            {/* Doc-aligned: "Dual-Track Engine" matches 1.6 Two-Track Model */}
            <div style={{ color:'rgba(255,255,255,0.48)', fontSize:10.5, marginTop:2 }}>
              Behavioural AI · Dual-Track Engine · 10s Refresh
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div className="tl-blink" style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80' }} />
          <span style={{ color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:500 }}>Live</span>
        </div>
      </div>

      {/* Stats — doc aligned: risk thresholds ≥80 Low, ≥60 Moderate, <60 High */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        background:'#f8fbff', borderBottom:`1px solid ${C.border}`,
      }}>
        {[
          { label:'Tracked',   val:'247',  color:C.navy },
          { label:'Avg Score', val:'73',   color:C.teal },
          { label:'High Risk', val:'18',   color:'#dc2626' },
          { label:'Low Risk',  val:'156',  color:'#16a34a' },
        ].map((s, i) => (
          <div key={i} style={{
            padding:'13px 0', textAlign:'center',
            borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ color:s.color, fontSize:19, fontWeight:800, letterSpacing:'-0.03em' }}>{s.val}</div>
            <div style={{ color:C.muted, fontSize:10, fontWeight:500, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Candidate rows */}
      <div style={{ padding:'4px 0' }}>
        {CANDIDATES.map((c, i) => {
          const rs = RISK[c.risk];
          const isActive = i === active;
          return (
            <div key={c.name} className="tl-row" style={{
              display:'grid', gridTemplateColumns:'40px 1fr 80px 72px',
              alignItems:'center', gap:12, padding:'10px 18px',
              background: isActive ? '#f0fbff' : 'transparent',
              transition:'background 0.4s ease', cursor:'default',
            }}>
              <div style={{
                width:40, height:40, borderRadius:11,
                background:`${c.hue}15`, border:`1.5px solid ${c.hue}40`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:800, color:c.hue,
              }}>{c.init}</div>
              <div>
                <div style={{ color:C.navy, fontSize:12.5, fontWeight:700, lineHeight:1.3 }}>{c.name}</div>
                <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>{c.role}</div>
              </div>
              <div>
                <div style={{ marginBottom:5 }}>
                  <span style={{ color:C.navy, fontSize:11.5, fontWeight:700 }}>{c.score}/100</span>
                </div>
                <div style={{ height:5, background:'#e2eaf3', borderRadius:3, overflow:'hidden' }}>
                  <div className={`tl-bar tl-bar-d${i+1}`} style={{
                    '--w':`${c.score}%`, height:'100%',
                    background:`linear-gradient(90deg, ${c.hue}, ${c.hue}bb)`, borderRadius:3,
                  } as React.CSSProperties} />
                </div>
              </div>
              <div style={{
                background:rs.bg, color:rs.color,
                fontSize:10.5, fontWeight:700, padding:'5px 9px', borderRadius:100,
                border:`1px solid ${rs.border}`, textAlign:'center',
                display:'flex', alignItems:'center', gap:4, justifyContent:'center',
                whiteSpace:'nowrap',
              }}>
                {c.risk === 'High' && <AlertTriangle size={9} />}
                {c.risk === 'Low'  && <CheckCircle size={9} />}
                {c.risk}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animated insight footer — doc-aligned explanations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
          transition={{ duration:0.3 }}
          style={{
            margin:'0 14px 14px', padding:'10px 14px',
            background:'#f0fbff', border:'1px solid #b2ebf2', borderRadius:10,
            display:'flex', alignItems:'flex-start', gap:8,
          }}
        >
          <Zap size={12} color={C.teal} style={{ marginTop:2, flexShrink:0 }} />
          <span style={{ color:C.body, fontSize:11, lineHeight:1.6 }}>
            {active === 0 && <><strong style={{color:C.teal}}>Priya Maheshwari</strong> — responded in 1.2h.  Click detected (+0.10 bonus). Score:  <strong>92/100</strong> → Low Risk ✓</>}
            {active === 1 && <><strong style={{color:'#7c3aed'}}>Arjun Shah</strong> — 2 opens, 0 clicks. HR feedback (40% weight) blended. Score: <strong>67/100</strong> → Moderate Risk</>}
            {active === 2 && <><strong style={{color:'#dc2626'}}>Neha Kapoor</strong> — Ghosting detected: 0 opens, 0 clicks. −20 penalty applied. Score: <strong>38/100</strong> → High Risk ⚠</>}
            {active === 3 && <><strong style={{color:'#059669'}}>Raj Patel</strong> — 3 opens + 1 click. HR feedback blended at 40% weight. Score: <strong>85/100</strong> → Low Risk ✓</>}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface HeroSectionProps {
  onBookDemo?: () => void;
}

export default function HeroSection({ onBookDemo }: HeroSectionProps) {
  useEffect(() => { injectStyles(); }, []);

  const features = [
    { icon: Zap,        label:'AI Trust Scoring',        desc:'0–100 behavioural score' },
    { icon: Target,     label:'Ghosting Prevention',      desc:'−20 penalty auto-applied' },
    { icon: Shield,     label:'Dual-Track Engine',        desc:'Candidates + Employees' },
    { icon: TrendingUp, label:'Real-Time Risk Detection', desc:'Low / Moderate / High' },
  ];

  return (
    <div className="tl-root">
      <section style={{
        background:`linear-gradient(160deg, #edf5fb 0%, #f0f8fc 50%, #e8f4fd 100%)`,
        minHeight:'100vh', paddingTop:100, paddingBottom:80,
        position:'relative', overflow:'hidden',
      }}>
        <div className="tl-blob1" style={{
          position:'absolute', top:'-10%', right:'-5%', width:600, height:600, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,184,212,0.08) 0%, transparent 70%)', pointerEvents:'none',
        }} />
        <div className="tl-blob2" style={{
          position:'absolute', bottom:'5%', left:'-8%', width:500, height:500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(21,101,192,0.07) 0%, transparent 70%)', pointerEvents:'none',
        }} />

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(16px, 4vw, 32px)' }}>
          <div className="tl-hero-grid">

            {/* LEFT */}
            <motion.div
              initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
              style={{ display:'flex', flexDirection:'column', gap:28 }}
            >
              

              <motion.h1
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.22, duration:0.75, ease:[0.16,1,0.3,1] }}
                style={{
                  fontSize:'clamp(34px,4.5vw,60px)', fontWeight:900,
                  lineHeight:1.07, letterSpacing:'-0.04em', color:C.navy, margin:0,
                }}
              >
                Stop Candidate<br />
                Ghosting{' '}
                <span style={{ color:C.teal }}>Before It<br />Happens.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.32 }}
                style={{ fontSize:16.5, color:C.body, lineHeight:1.72, margin:0, maxWidth:460 }}
              >
                AI-powered behavioural trust intelligence for HR teams. Every candidate gets a{' '}
                <strong style={{color:C.navy}}>0–100 Trust Score</strong> computed from email engagement
                signals and optional HR feedback — updated in real time, every 10 seconds.
              </motion.p>

              <motion.div
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42 }}
                className="tl-cta-row"
              >
                <button className="tl-cta-primary" onClick={onBookDemo}>
                  Book a Demo <ArrowRight size={16} />
                </button>
                <button
                  className="tl-cta-secondary"
                  onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play size={14} />View Features
                </button>
              </motion.div>

            
            </motion.div>

            {/* RIGHT */}
            <motion.div className="tl-right-col"
              initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:0.8, delay:0.2, ease:[0.16,1,0.3,1] }}
            >
              <div style={{
                position:'absolute', inset:-60,
                background:'radial-gradient(ellipse at center, rgba(0,184,212,0.09) 0%, transparent 65%)',
                pointerEvents:'none',
              }} />
              <div className="tl-float" style={{ position:'relative', zIndex:1 }}>
                <DashboardCard />
              </div>

              <motion.div className="tl-badge-float tl-badge-float-tr"
                initial={{ opacity:0, scale:0.8, y:-10 }} animate={{ opacity:1, scale:1, y:0 }}
                transition={{ delay:1.1, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ position:'absolute', top:-20, right:-20, zIndex:10, minWidth:130 }}
              >
                <div style={{
                  width:38, height:38, borderRadius:10, background:'#f0fdf4',
                  border:'1.5px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <CheckCircle size={20} color="#16a34a" />
                </div>
                <div>
                  <div style={{ color:'#16a34a', fontSize:22, fontWeight:900, lineHeight:1, letterSpacing:'-0.03em' }}>92</div>
                  <div style={{ color:C.muted, fontSize:10.5, marginTop:2 }}>Trust Score · Low Risk</div>
                </div>
              </motion.div>

              <motion.div className="tl-badge-float tl-badge-float-br"
                initial={{ opacity:0, scale:0.8, y:10 }} animate={{ opacity:1, scale:1, y:0 }}
                transition={{ delay:1.3, duration:0.6, ease:[0.16,1,0.3,1] }}
                style={{ position:'absolute', bottom:-38, left:-44, zIndex:10, minWidth:200 }}
              >
                <div style={{
                  width:38, height:38, borderRadius:10, background:'#fef2f2',
                  border:'1.5px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <AlertTriangle size={18} color="#dc2626" />
                </div>
                <div>
                  <div style={{ color:'#dc2626', fontSize:12, fontWeight:700, lineHeight:1.3 }}>Ghosting Detected</div>
                  <div style={{ color:C.muted, fontSize:10.5, marginTop:2 }}>−20 penalty · High Risk</div>
                </div>
              </motion.div>

              <motion.div className="tl-badge-float tl-badge-float-mr"
                initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:1.5, duration:0.5 }}
                style={{ position:'absolute', top:'94%', right:-24, transform:'translateY(-50%)', zIndex:10, minWidth:148 }}
              >
                <div style={{
                  width:38, height:38, borderRadius:10, background:C.tealLight,
                  border:`1.5px solid rgba(0,184,212,0.35)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <Users size={18} color={C.teal} />
                </div>
                <div>
                  <div style={{ color:C.navy, fontSize:22, fontWeight:900, lineHeight:1, letterSpacing:'-0.03em' }}>247</div>
                  <div style={{ color:C.muted, fontSize:10.5, marginTop:2 }}>Active Candidates</div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        <div style={{ position:'absolute', bottom:0, left:0, right:0, lineHeight:0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width:'100%', height:60, display:'block' }}>
            <path d="M0,40 C360,70 1080,10 1440,40 L1440,60 L0,60 Z" fill="white" />
          </svg>
        </div>
      </section>
    </div>
  );
}