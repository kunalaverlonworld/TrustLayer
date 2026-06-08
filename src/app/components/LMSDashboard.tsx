import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Award, BarChart3, Settings, Play, Lock, Code, Sparkles, PlusCircle, CheckCircle, LogOut } from 'lucide-react';

interface LMSDashboardProps {
  user: { name: string; email: string };
  plan: { id: string; name: string; price: string };
  onLogout: () => void;
  onUpgradePlan: () => void;
}

const coursesData = [
  { id: 1, title: 'Introduction to HTML & Vanilla CSS', duration: '4h 15m', level: 'Beginner', isFree: true, progress: 85 },
  { id: 2, title: 'Mastering React & TypeScript Hooks', duration: '8h 30m', level: 'Intermediate', isFree: false, progress: 20 },
  { id: 3, title: 'State Management with Redux Toolkit', duration: '6h 10m', level: 'Intermediate', isFree: false, progress: 0 },
  { id: 4, title: 'Node.js Microservices & API Gateway', duration: '12h 45m', level: 'Advanced', isFree: false, progress: 0 },
  { id: 5, title: 'System Design: Scale to Millions', duration: '10h 20m', level: 'Advanced', isFree: false, progress: 0 },
];

export default function LMSDashboard({ user, plan, onLogout, onUpgradePlan }: LMSDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'sandbox' | 'analytics' | 'admin'>('overview');
  const [customCourseTitle, setCustomCourseTitle] = useState('');
  const [customCourses, setCustomCourses] = useState<string[]>([]);
  const [sandboxCode, setSandboxCode] = useState('// Write TypeScript code here\nfunction greet(name: string) {\n  return `Hello, ${name}! Welcome to TrustLayer LMS.`;\n}\n\nconsole.log(greet("student"));');
  const [sandboxOutput, setSandboxOutput] = useState('Output will display here when run...');
  const [running, setRunning] = useState(false);

  const isBasic = plan.id === 'basic';
  const isPro = plan.id === 'pro';
  const isEnterprise = plan.id === 'enterprise';

  const runCode = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      if (sandboxCode.includes('greet')) {
        setSandboxOutput('> Transpiling TypeScript...\n> Executing Node.js process...\n\nHello, student! Welcome to TrustLayer LMS.');
      } else {
        setSandboxOutput('> Transpiling TypeScript...\n> Executing...\n\nProcess completed successfully (0 errors).');
      }
    }, 800);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCourseTitle.trim()) {
      setCustomCourses([...customCourses, customCourseTitle.trim()]);
      setCustomCourseTitle('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040814',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Dashboard Top Header */}
      <header style={{
        background: 'rgba(13, 26, 46, 0.5)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1a2d4a',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00d4f5, #0097b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 13, fontWeight: 800 }}>TL</span>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            TrustLayer <span style={{ color: '#00d4f5', fontWeight: 400 }}>LMS Dashboard</span>
          </h1>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#00d4f5', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
              <Sparkles size={10} /> {plan.name} Plan
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              color: '#f87171',
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Sidebar Nav */}
        <nav style={{
          width: '100%',
          maxWidth: 240,
          background: 'rgba(6, 13, 26, 0.7)',
          borderRight: '1px solid #1a2d4a',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }} className="lms-sidebar">
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 'none',
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              color: activeTab === 'overview' ? '#00d4f5' : '#94a3b8',
              background: activeTab === 'overview' ? 'rgba(0, 212, 245, 0.08)' : 'transparent',
              textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <BookOpen size={16} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 'none',
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
              color: activeTab === 'courses' ? '#00d4f5' : '#94a3b8',
              background: activeTab === 'courses' ? 'rgba(0, 212, 245, 0.08)' : 'transparent',
              textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <Award size={16} /> My Courses
          </button>

          {/* Sandbox - requires Pro/Enterprise */}
          <button
            onClick={() => {
              if (isBasic) return;
              setActiveTab('sandbox');
            }}
            style={{
              display: 'flex', alignItems: 'center', justifySelf: 'space-between', gap: 10, width: '100%', border: 'none',
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              cursor: isBasic ? 'not-allowed' : 'pointer',
              color: isBasic ? '#475569' : activeTab === 'sandbox' ? '#00d4f5' : '#94a3b8',
              background: activeTab === 'sandbox' ? 'rgba(0, 212, 245, 0.08)' : 'transparent',
              textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <Code size={16} /> <span>Coding Sandbox</span>
            {isBasic && <Lock size={12} style={{ marginLeft: 'auto', color: '#64748b' }} />}
          </button>

          {/* Analytics - requires Pro/Enterprise */}
          <button
            onClick={() => {
              if (isBasic) return;
              setActiveTab('analytics');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 'none',
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              cursor: isBasic ? 'not-allowed' : 'pointer',
              color: isBasic ? '#475569' : activeTab === 'analytics' ? '#00d4f5' : '#94a3b8',
              background: activeTab === 'analytics' ? 'rgba(0, 212, 245, 0.08)' : 'transparent',
              textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <BarChart3 size={16} /> <span>Analytics Tracker</span>
            {isBasic && <Lock size={12} style={{ marginLeft: 'auto', color: '#64748b' }} />}
          </button>

          {/* Custom Builder / Admin Settings - requires Enterprise */}
          <button
            onClick={() => {
              if (!isEnterprise) return;
              setActiveTab('admin');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%', border: 'none',
              padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              cursor: !isEnterprise ? 'not-allowed' : 'pointer',
              color: !isEnterprise ? '#475569' : activeTab === 'admin' ? '#00d4f5' : '#94a3b8',
              background: activeTab === 'admin' ? 'rgba(0, 212, 245, 0.08)' : 'transparent',
              textAlign: 'left', transition: 'all 0.2s',
            }}
          >
            <Settings size={16} /> <span>Custom Builder</span>
            {!isEnterprise && <Lock size={12} style={{ marginLeft: 'auto', color: '#64748b' }} />}
          </button>

          {/* Upgrade Banner */}
          {!isEnterprise && (
            <div style={{
              marginTop: 'auto',
              background: 'linear-gradient(135deg, rgba(0, 212, 245, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%)',
              border: '1px solid rgba(0, 212, 245, 0.2)',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00d4f5', marginBottom: 4 }}>Level Up Skills</div>
              <p style={{ fontSize: 10.5, color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.4 }}>Upgrade your account to unlock interactive sandboxes and telemetry tracking.</p>
              <button
                onClick={onUpgradePlan}
                style={{
                  background: '#00d4f5',
                  border: 'none',
                  borderRadius: 6,
                  color: '#040814',
                  fontSize: 11,
                  fontWeight: 700,
                  width: '100%',
                  padding: '6px 0',
                  cursor: 'pointer',
                }}
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </nav>

        {/* Content Pane */}
        <main style={{ flex: 1, padding: 32, minWidth: '320px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Dashboard Overview</h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>A snapshot of your active courses, grades, and platform features.</p>

              {/* Status Metrics Cards */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
                <div style={{
                  flex: '1 1 200px', background: '#0d1a2e', border: '1px solid #1a2d4a',
                  borderRadius: 14, padding: '20px 24px',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Active Courses</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#00d4f5' }}>{isBasic ? '1' : '5'}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{isBasic ? '4 locked' : 'All unlocked'}</div>
                </div>

                <div style={{
                  flex: '1 1 200px', background: '#0d1a2e', border: '1px solid #1a2d4a',
                  borderRadius: 14, padding: '20px 24px',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Interactive Sandbox</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isBasic ? '#f87171' : '#4ade80', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isBasic ? '❌ Locked (Upgrade Pro)' : '✅ Active (Unlocked)'}
                  </div>
                </div>

                <div style={{
                  flex: '1 1 200px', background: '#0d1a2e', border: '1px solid #1a2d4a',
                  borderRadius: 14, padding: '20px 24px',
                }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Analytics SLA</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: isBasic ? '#f87171' : isPro ? '#facc15' : '#4ade80', marginTop: 12 }}>
                    {isBasic ? '❌ Basic Tracking' : isPro ? '📊 Core Telemetry' : '🚀 Advanced Org Analytics'}
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div style={{
                background: 'rgba(0, 212, 245, 0.03)', border: '1px solid rgba(0, 212, 245, 0.15)',
                borderRadius: 16, padding: '24px',
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#00d4f5', margin: '0 0 10px' }}>Your Plan Capabilities:</h3>
                <ul style={{ paddingLeft: 20, fontSize: 13.5, color: '#cbd5e1', lineHeight: 1.6 }}>
                  <li><strong>Active Plan:</strong> {plan.name}</li>
                  <li><strong>Courses Availability:</strong> {isBasic ? 'Foundations course only' : 'All courses unlocked'}</li>
                  <li><strong>Interactive Sandlabs:</strong> {isBasic ? 'Inactive' : 'Available with Node.js transpile sandbox'}</li>
                  <li><strong>Analytics Telemetry:</strong> {isBasic ? 'No' : isPro ? 'Personal Core Analytics' : 'Organization Full Analytics'}</li>
                  <li><strong>Custom Path Builder:</strong> {isEnterprise ? 'Available (Create custom paths)' : 'Enterprise exclusive'}</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === 'courses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>My Courses</h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>Browse lessons and track your progress in real time.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {coursesData.map(course => {
                  const locked = isBasic && !course.isFree;
                  return (
                    <div
                      key={course.id}
                      style={{
                        background: '#0d1a2e',
                        border: locked ? '1px solid #1a2d4a' : '1px solid rgba(0, 212, 245, 0.2)',
                        borderRadius: 16,
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 16,
                        opacity: locked ? 0.6 : 1,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                            background: course.isFree ? 'rgba(74, 222, 128, 0.1)' : 'rgba(0, 212, 245, 0.1)',
                            color: course.isFree ? '#4ade80' : '#00d4f5',
                            padding: '3px 8px', borderRadius: 4,
                          }}>
                            {course.level}
                          </span>
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{course.duration}</span>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 12px' }}>{course.title}</h3>

                        {/* Progress Bar */}
                        {!locked && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                              <div style={{ width: `${course.progress}%`, height: '100%', background: '#00d4f5' }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#00d4f5' }}>{course.progress}% Complete</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div>
                        {locked ? (
                          <button
                            onClick={onUpgradePlan}
                            style={{
                              background: '#334155', border: 'none', borderRadius: 8, color: '#94a3b8',
                              padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 6,
                            }}
                          >
                            <Lock size={13} /> Unlock (Upgrade Pro)
                          </button>
                        ) : (
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #00d4f5, #0097b2)', border: 'none',
                              borderRadius: 8, color: '#040814', padding: '8px 20px', fontSize: 13,
                              fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                            }}
                          >
                            <Play size={13} /> {course.progress > 0 ? 'Resume' : 'Start'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: SANDBOX */}
          {activeTab === 'sandbox' && !isBasic && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Coding Sandbox</h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>Write code, practice programming concepts, and simulate real-time executions in the browser.</p>

              <div style={{
                background: '#0d1a2e', border: '1px solid #1a2d4a', borderRadius: 16,
                padding: '24px', display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00d4f5', display: 'block', marginBottom: 8 }}>
                    Code Editor (TypeScript / JavaScript)
                  </label>
                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    style={{
                      width: '100%', height: 160, background: '#060d1a', border: '1.5px solid #1a2d4a',
                      borderRadius: 10, color: '#a7f3d0', fontFamily: 'monospace', fontSize: 13,
                      padding: 14, resize: 'vertical', outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={runCode}
                    disabled={running}
                    style={{
                      background: 'linear-gradient(135deg, #00d4f5, #0097b2)', border: 'none',
                      borderRadius: 8, color: '#040814', padding: '10px 24px', fontSize: 13,
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    {running ? 'Executing...' : <><Play size={13} fill="#040814" /> Run Sandbox Code</>}
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', display: 'block', marginBottom: 8 }}>
                    Console Output
                  </label>
                  <pre style={{
                    margin: 0, padding: 14, background: '#030712', borderRadius: 10,
                    border: '1.5px solid #111827', color: '#38bdf8', fontSize: 13, fontFamily: 'monospace',
                    minHeight: 100, whiteSpace: 'pre-wrap',
                  }}>
                    {sandboxOutput}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ANALYTICS TRACKER */}
          {activeTab === 'analytics' && !isBasic && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Analytics Tracker</h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>Real-time telemetry and course tracking diagnostics.</p>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
                {/* Score Summary */}
                <div style={{
                  flex: '1 1 300px', background: '#0d1a2e', border: '1px solid #1a2d4a',
                  borderRadius: 16, padding: '24px',
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Learning Performance</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Overall Progress Score:</span>
                    <span style={{ fontWeight: 700, color: '#00d4f5' }}>78 / 100</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Avg Quiz Grade:</span>
                    <span style={{ fontWeight: 700, color: '#4ade80' }}>92%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>Time to Completion Index:</span>
                    <span style={{ fontWeight: 700, color: '#a78bfa' }}>Optimal</span>
                  </div>
                </div>

                {/* Telemetry log - Enterprise exclusive features */}
                {isEnterprise && (
                  <div style={{
                    flex: '1 1 300px', background: '#0d1a2e', border: '1px solid #1a2d4a',
                    borderRadius: 16, padding: '24px',
                  }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#a78bfa', marginBottom: 16 }}>Enterprise Telemetry Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, fontFamily: 'monospace' }}>
                      <div style={{ color: '#22d3ee', background: 'rgba(34,211,238,0.05)', padding: 6, borderRadius: 4 }}>
                        [14:23:10] Sync: candidate telemetry pushed successfully to organization.
                      </div>
                      <div style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.05)', padding: 6, borderRadius: 4 }}>
                        [14:21:40] Metric: lesson HTML-1 duration clocked at 2h 12m.
                      </div>
                      <div style={{ color: '#4ade80', background: 'rgba(74,222,128,0.05)', padding: 6, borderRadius: 4 }}>
                        [14:15:02] Grade: candidate "student_user" achieved 95% in React Quiz.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: ADMIN / CUSTOM PATHS */}
          {activeTab === 'admin' && isEnterprise && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Enterprise Custom Builder</h2>
              <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 24px' }}>Build custom training curriculums for your teams.</p>

              <div style={{
                background: '#0d1a2e', border: '1px solid #1a2d4a', borderRadius: 16,
                padding: '24px', marginBottom: 24,
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#a78bfa', margin: '0 0 16px' }}>Add New Learning Path</h3>
                <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="e.g. Custom Angular Foundations for DevOps team"
                    value={customCourseTitle}
                    onChange={(e) => setCustomCourseTitle(e.target.value)}
                    style={{
                      flex: 1, background: '#060d1a', border: '1.5px solid #1a2d4a',
                      borderRadius: 8, color: '#fff', padding: '10px 14px', fontSize: 14,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#a78bfa', border: 'none', borderRadius: 8, color: '#040814',
                      padding: '0 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <PlusCircle size={15} /> Add Path
                  </button>
                </form>
              </div>

              {/* Created Paths */}
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Active Custom Paths</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#090d1f', border: '1px solid rgba(167,139,250,0.2)', padding: '12px 16px', borderRadius: 10 }}>
                    <CheckCircle size={16} color="#a78bfa" />
                    <span style={{ fontSize: 13.5 }}>Senior Engineering Onboarding Checklist</span>
                  </div>
                  {customCourses.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#090d1f', border: '1px solid rgba(167,139,250,0.2)', padding: '12px 16px', borderRadius: 10 }}>
                      <CheckCircle size={16} color="#a78bfa" />
                      <span style={{ fontSize: 13.5 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
