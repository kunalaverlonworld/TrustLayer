import { useState, useEffect, useRef } from 'react';
import {
  X, Check, CreditCard, Shield, Lock, Star,
  Zap, ArrowRight, ShieldCheck, Building2, Phone,
  MapPin, Hash, ChevronDown,
} from 'lucide-react';
import { loadSession } from '../services/authService';
import { createOrder, verifyPayment, getActiveLicense } from '../services/paymentService';
import { loadRazorpay } from '../utils/loadRazorpay';

// ── Constants ─────────────────────────────────────────────────────────────────
const PRODUCT_ID = '6a26929078d2d302b575cc10';
const LMS_API_KEY = 'my-secret-key-123';
const LMS_BASE   = 'https://license-system-v6ht.onrender.com';

// ── Brand tokens (matches TrustLayer palette) ─────────────────────────────────
const C = {
  navy:      '#0a1f3d',
  navyMid:   '#0d2d5e',
  teal:      '#00b8d4',
  tealDark:  '#0097b2',
  body:      '#475569',
  muted:     '#94a3b8',
  border:    '#e2eaf3',
  shadow:    'rgba(10,31,61,0.08)',
  bg:        '#f0f7ff',
};

// ── Types ─────────────────────────────────────────────────────────────────────
type BillingCycle = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

interface CheckoutPlan {
  id: string;
  licenseTypeId: string;
  name: string;
  price: number;
  includedUsers: number;
  features: { featureSlug: string; uiLabel: string }[];
  popular: boolean;
  isFree: boolean;
  discountConfig: Record<BillingCycle, number>;
}

const FALLBACK_CHECKOUT_PLANS: CheckoutPlan[] = [
  {
    id:             '6a26929078d2d302b575cc10-free',
    licenseTypeId:  '6a26929078d2d302b575cc10-free',
    name:           'Basic',
    price:          0,
    includedUsers:  1,
    features: [
      { featureSlug: 'candidates', uiLabel: 'Up to 5 candidates tracked' },
      { featureSlug: 'scoring', uiLabel: 'Basic trust scoring' },
      { featureSlug: 'support', uiLabel: 'Email support' },
      { featureSlug: 'trial', uiLabel: '7-day free trial' },
      { featureSlug: 'workspace', uiLabel: 'Single team workspace' },
      { featureSlug: 'dashboard', uiLabel: 'Core dashboard' },
      { featureSlug: 'api', uiLabel: 'Standard API access' }
    ],
    popular:        false,
    isFree:         true,
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
  },
  {
    id:             '6a26929078d2d302b575cc10-starter',
    licenseTypeId:  '6a26929078d2d302b575cc10-starter',
    name:           'Starter',
    price:          4100,
    includedUsers:  1,
    features: [
      { featureSlug: 'candidates', uiLabel: 'Up to 100 candidates tracked' },
      { featureSlug: 'scoring', uiLabel: 'Basic trust scoring' },
      { featureSlug: 'support', uiLabel: 'Email support' },
      { featureSlug: 'retention', uiLabel: '7-day data retention' },
      { featureSlug: 'api', uiLabel: 'Standard API access' },
      { featureSlug: 'workspace', uiLabel: 'Single team workspace' },
      { featureSlug: 'dashboard', uiLabel: 'Core dashboard with KPI cards' }
    ],
    popular:        false,
    isFree:         false,
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
  },
  {
    id:             '6a26929078d2d302b575cc10-pro',
    licenseTypeId:  '6a26929078d2d302b575cc10-pro',
    name:           'Professional',
    price:          12500,
    includedUsers:  1,
    features: [
      { featureSlug: 'candidates', uiLabel: 'Up to 1,000 candidates tracked' },
      { featureSlug: 'scoring', uiLabel: 'Advanced AI trust scoring' },
      { featureSlug: 'support', uiLabel: 'Priority support (email + chat)' },
      { featureSlug: 'retention', uiLabel: '90-day data retention' },
      { featureSlug: 'api', uiLabel: 'Full API access' },
      { featureSlug: 'workspaces', uiLabel: 'Multiple team workspaces' },
      { featureSlug: 'integrations', uiLabel: 'Custom integrations' },
      { featureSlug: 'analytics', uiLabel: 'Advanced analytics dashboard' },
      { featureSlug: 'alerts', uiLabel: 'Ghosting prediction alerts' }
    ],
    popular:        true,
    isFree:         false,
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
  },
  {
    id:             '6a26929078d2d302b575cc10-business',
    licenseTypeId:  '6a26929078d2d302b575cc10-business',
    name:           'Business',
    price:          29200,
    includedUsers:  1,
    features: [
      { featureSlug: 'pro', uiLabel: 'Everything in Professional' },
      { featureSlug: 'workspaces', uiLabel: 'Unlimited workspaces & sub-teams' },
      { featureSlug: 'tuning', uiLabel: 'Custom AI model fine-tuning' },
      { featureSlug: 'verification', uiLabel: 'Background verification stage' },
      { featureSlug: 'permissions', uiLabel: 'Advanced role permissions' },
      { featureSlug: 'retention', uiLabel: 'Unlimited data retention' }
    ],
    popular:        false,
    isFree:         false,
    discountConfig: { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
  }
];

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-selected plan licenseType id from PricingSection */
  preselectedPlanId?: string;
  /** Pre-selected billing cycle from PricingSection */
  preselectedCycle?: BillingCycle;
  /** Triggered when user needs to log in first */
  onNeedLogin?: () => void;
  onSuccess?: (planName: string, planId: string) => void;
}

const BILLING_MONTHS: Record<BillingCycle, number> = {
  monthly: 1, quarterly: 3, 'half-yearly': 6, yearly: 12,
};
const BILLING_LABELS: Record<BillingCycle, string> = {
  monthly: 'Monthly', quarterly: 'Quarterly', 'half-yearly': 'Half-Yearly', yearly: 'Yearly',
};
const BILLING_UNIT: Record<BillingCycle, string> = {
  monthly: '1 month', quarterly: '3 months', 'half-yearly': '6 months', yearly: '12 months',
};

// ── Modal helper ──────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,31,61,0.55)', backdropFilter: 'blur(8px)',
        padding: 16, fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{
        background: 'white', borderRadius: 24, padding: '40px 36px 36px',
        maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 32px 80px rgba(10,31,61,0.22)',
        border: '1px solid #e2eaf3',
        animation: 'tl-modal-in 0.32s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {children}
      </div>
    </div>
  );
}

function ModalIcon({ color, bg, children }: { color: string; bg: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
      background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 0 12px ${bg.replace(')', ', 0.15)').replace('rgb', 'rgba')}`,
      animation: 'tl-pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
    }}>
      <div style={{ color, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function InputField({
  label, icon, type = 'text', value, onChange, placeholder, readOnly, required,
}: {
  label: string; icon?: React.ReactNode; type?: string; value: string;
  onChange?: (v: string) => void; placeholder?: string; readOnly?: boolean; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 800, color: C.body,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5,
      }}>
        {label}{required && <span style={{ color: C.teal, marginLeft: 2 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
            color: focused ? C.teal : C.muted, width: 14, height: 14,
            display: 'flex', alignItems: 'center', pointerEvents: 'none',
            transition: 'color 0.15s',
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          required={required}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: icon ? '9px 12px 9px 32px' : '9px 12px',
            background: readOnly ? '#f8fbff' : (focused ? 'white' : '#f8fbff'),
            border: `1.5px solid ${focused ? C.teal : C.border}`,
            borderRadius: 10, fontSize: 13, color: C.navy,
            outline: 'none',
            boxShadow: focused ? `0 0 0 3px rgba(0,184,212,0.10)` : 'none',
            transition: 'all 0.15s',
            cursor: readOnly ? 'default' : 'text',
          }}
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CheckoutModal({
  isOpen, onClose, preselectedPlanId, preselectedCycle, onNeedLogin, onSuccess,
}: CheckoutModalProps) {
  const user      = loadSession();
  const userEmail = user?.email ?? null;

  const [plans, setPlans]           = useState<CheckoutPlan[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activePlanId, setActivePlanId] = useState<string>('');
  const [cycle, setCycle]           = useState<BillingCycle>(preselectedCycle ?? 'monthly');
  const [processing, setProcessing] = useState(false);
  const [planTabOpen, setPlanTabOpen] = useState(false);

  // Existing license state
  const [existingLicenseName, setExistingLicenseName]     = useState('');
  const [existingIsFreePlan, setExistingIsFreePlan]       = useState(false);

  // Modal visibility
  const [showSuccess, setShowSuccess]               = useState(false);
  const [showAlreadyActive, setShowAlreadyActive]   = useState(false);
  const [showUpgrade, setShowUpgrade]               = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'warn' } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    companyName: '', email: userEmail ?? '', phone: '',
    address: '', city: '', state: '', pincode: '', gstNumber: '',
  });

  const showToast = (msg: string, type: 'error' | 'warn' = 'error') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  // Sync email from user
  useEffect(() => {
    if (userEmail) setForm(f => ({ ...f, email: userEmail }));
  }, [userEmail]);

  // Sync preselected cycle
  useEffect(() => {
    if (preselectedCycle) setCycle(preselectedCycle);
  }, [preselectedCycle]);

  // Auth guard
  useEffect(() => {
    if (!isOpen) return;
    if (!userEmail) {
      showToast('Please log in to continue.', 'warn');
      onClose();
      onNeedLogin?.();
    }
  }, [isOpen]);

  // Fetch active license
  useEffect(() => {
    if (!isOpen || !userEmail) return;
    getActiveLicense(userEmail, PRODUCT_ID).then(data => {
      if (data?.activeLicense?.status === 'active') {
        const lt   = data.activeLicense.licenseTypeId ?? data.activeLicense.licenseType ?? {};
        const name = lt.name ?? 'Current';
        const amt  = lt.price?.amount ?? null;
        setExistingLicenseName(name);
        setExistingIsFreePlan(Number(amt) === 0);
      }
    }).catch(() => {});
  }, [isOpen, userEmail]);

  // Fetch plans
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`${LMS_BASE}/api/license/public/licenses-by-product/${PRODUCT_ID}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        const mapped: CheckoutPlan[] = (data.licenses ?? [])
          .filter((lic: any) => lic && lic.licenseType)
          .map((lic: any) => {
            const lt   = lic.licenseType;
            const name = lt.name ?? 'Unnamed Plan';
            const key  = name.toLowerCase();
            const feats: { featureSlug: string; uiLabel: string }[] = (lt.features ?? []).map((f: any) => ({
              featureSlug: f.featureSlug ?? f.featureKey ?? '',
              uiLabel:     f.uiLabel ?? f.displayName ?? '',
            }));
            return {
              id:             lic._id ?? '',
              licenseTypeId:  lt._id ?? '',
              name:           name,
              price:          lt.price?.amount ?? 0,
              includedUsers:  1,
              features:       feats,
              popular:        key === 'professional' || key === 'pro',
              isFree:         (lt.price?.amount ?? 0) === 0,
              discountConfig: lt.discountConfig ?? { monthly: 0, quarterly: 5, 'half-yearly': 10, yearly: 20 },
            };
          });

        const finalPlans = mapped.length > 0 ? mapped : FALLBACK_CHECKOUT_PLANS;

        // Sort: free first, enterprise last
        const ORDER: Record<string, number> = { free: 1, basic: 1, starter: 2, professional: 3, pro: 3, business: 4, enterprise: 5 };
        finalPlans.sort((a, b) => (ORDER[a.name.toLowerCase()] ?? 99) - (ORDER[b.name.toLowerCase()] ?? 99));
        setPlans(finalPlans);

        // Set active plan
        const match = finalPlans.find(p => p.id === preselectedPlanId || p.licenseTypeId === preselectedPlanId);
        setActivePlanId(match?.id ?? finalPlans[0]?.id ?? '');
      })
      .catch((err) => {
        console.warn('Failed to fetch licenses from LMS in checkout modal, using fallbacks:', err);
        setPlans(FALLBACK_CHECKOUT_PLANS);
        const match = FALLBACK_CHECKOUT_PLANS.find(p => p.id === preselectedPlanId || p.licenseTypeId === preselectedPlanId);
        setActivePlanId(match?.id ?? FALLBACK_CHECKOUT_PLANS[0]?.id ?? '');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlan     = plans.find(p => p.id === activePlanId) ?? plans[0];
  if (!currentPlan && !loading) return null;

  // ── Price calc ───────────────────────────────────────────────────────────────
  const pricePerUser    = currentPlan?.price ?? 0;
  const userCount       = currentPlan?.includedUsers ?? 1;
  const isFreePlan      = (pricePerUser === 0);
  const months          = BILLING_MONTHS[cycle];
  const subtotal        = pricePerUser * userCount * months;
  const discountPct     = currentPlan?.discountConfig?.[cycle] ?? 0;
  const discountAmt     = subtotal * (discountPct / 100);
  const afterDiscount   = subtotal - discountAmt;
  const gstAmt          = isFreePlan ? 0 : Math.round(afterDiscount * 0.18 * 100) / 100;
  const totalDue        = isFreePlan ? 0 : Math.round((afterDiscount + gstAmt) * 100) / 100;

  const setField = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) { showToast('Session expired. Please log in again.', 'warn'); onNeedLogin?.(); return; }
    if (!form.companyName || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      showToast('Please fill in all required billing fields.', 'warn'); return;
    }

    // Already on free plan, trying free again → show upgrade
    if (existingLicenseName && existingIsFreePlan && isFreePlan) {
      setShowUpgrade(true); return;
    }
    // Already on paid plan → show already active
    if (existingLicenseName && !existingIsFreePlan) {
      setShowAlreadyActive(true); return;
    }

    setProcessing(true);
    try {
      if (isFreePlan) {
        // ── Free plan: activate directly via LMS free-assignment endpoint ──────
        // The LMS assigns the free license to the user by email + licenseId
        const res = await fetch(
          `${LMS_BASE}/api/payment/create-order`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': LMS_API_KEY },
            body: JSON.stringify({
              userId:       user?._id,
              licenseId:    currentPlan.id,
              billingCycle: cycle,
              amount:       0,  // free plan
            }),
          }
        );
        // For free plans the LMS may return success or an order — either way show success
        const resData = await res.json();
        if (!res.ok) {
          const msg: string = resData?.message ?? '';
          if (msg.toLowerCase().includes('already')) { setShowUpgrade(true); return; }
          throw new Error(msg || 'Free plan activation failed');
        }
        onSuccess?.(currentPlan.name, currentPlan.id);
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); onClose(); }, 3000);
        return;
      }

      // ── Paid plan: create Razorpay order then open checkout ─────────────────
      const order = await createOrder({
        userId:       user?._id ?? '',
        licenseId:    currentPlan.id,
        billingCycle: cycle,
        amount:       Math.round(totalDue * 100),  // paise
      });

      if (!order?.orderId || !order?.key) throw new Error('Invalid payment order. Please try again.');

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Payment gateway failed to load. Please check your connection.');

      const rzp = new (window as any).Razorpay({
        key:         order.key,
        amount:      Math.round(totalDue * 100),
        currency:    order.currency ?? 'INR',
        order_id:    order.orderId,
        name:        'TrustLayer',
        description: `${currentPlan.name} — ${BILLING_LABELS[cycle]}`,
        prefill:     { name: form.companyName, email: userEmail, contact: form.phone },
        theme:       { color: C.teal },
        handler: async (response: any) => {
          try {
            await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              transactionId:       order.transactionId,
            });
            onSuccess?.(currentPlan.name, currentPlan.id);
            setShowSuccess(true);
            setTimeout(() => { setShowSuccess(false); onClose(); }, 3000);
          } catch {
            showToast('Payment verification failed. Please contact support.');
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? err?.message ?? '';
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('subscription')) {
        isFreePlan ? setShowUpgrade(true) : setShowAlreadyActive(true);
      } else {
        showToast(msg || 'Checkout failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const paidPlans = plans.filter(p => !p.isFree && p.name.toLowerCase() !== 'enterprise');

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes tl-modal-in {
          from { opacity: 0; transform: scale(0.90) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);     }
        }
        @keyframes tl-pop-in {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes tl-slide-in {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes tl-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        .tl-co-overlay {
          position: fixed; inset: 0; z-index: 200; overflow-y: auto;
          background: rgba(10,31,61,0.5); backdrop-filter: blur(6px);
          font-family: 'Inter', sans-serif;
        }
        .tl-co-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }
        .tl-co-card {
          background: white; border-radius: 20px;
          border: 1px solid #e2eaf3;
          box-shadow: 0 2px 16px rgba(10,31,61,0.06);
        }
        .tl-plan-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid #e2eaf3; background: #f8fbff;
          cursor: pointer; font-family: 'Inter', sans-serif;
          font-size: 13px; font-weight: 500; color: #475569;
          transition: all 0.18s;
        }
        .tl-plan-btn.active { border-color: #00b8d4; background: #f0fdff; color: #0a1f3d; font-weight: 600; }
        .tl-plan-btn:hover  { border-color: #00b8d4; color: #0a1f3d; }
        .tl-cycle-btn {
          padding: 8px 12px; font-size: 12px; font-weight: 500;
          border-radius: 10px; border: 1.5px solid #e2eaf3;
          background: white; color: #64748b; cursor: pointer;
          transition: all 0.18s; text-align: center; font-family: 'Inter', sans-serif;
        }
        .tl-cycle-btn:hover  { border-color: #00b8d4; color: #00b8d4; }
        .tl-cycle-btn.active { border-color: #00b8d4; background: linear-gradient(135deg,#f0fdff,#e0f7fa); color: #0097b2; font-weight: 600; box-shadow: 0 0 0 3px rgba(0,184,212,0.08); }
        .tl-pay-btn {
          width: 100%; padding: 14px 24px;
          background: linear-gradient(135deg, #00b8d4, #0097b2);
          color: white; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s; letter-spacing: 0.01em; font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 14px rgba(0,184,212,0.30);
        }
        .tl-pay-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(0,184,212,0.42); }
        .tl-pay-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .tl-spinner {
          width: 16px; height: 16px; border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: white; border-radius: 50%;
          animation: tl-spin 0.7s linear infinite;
        }
        @keyframes tl-spin { to { transform: rotate(360deg); } }
        .tl-divider { height: 1px; background: linear-gradient(to right, transparent, #e2eaf3, transparent); margin: 14px 0; }
        .tl-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; }
        .tl-close-btn {
          padding: 8px; border: 1.5px solid #e2eaf3; border-radius: 10px;
          background: white; color: #94a3b8; cursor: pointer;
          transition: all 0.18s; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .tl-close-btn:hover { border-color: #cbd5e1; color: #475569; background: #f8fafc; }
        .tl-step-circle {
          width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #00b8d4, #0097b2);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; font-weight: 800;
        }
        .tl-security-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 12px; background: white; border: 1px solid #e2eaf3;
          border-radius: 100px; font-size: 11.5px; color: #64748b; font-weight: 500;
        }
        @media (max-width: 820px) {
          .tl-co-grid { grid-template-columns: 1fr !important; }
          .tl-co-summary-col { position: static !important; }
        }
      `}</style>

      {/* ── Overlay + scroll container ── */}
      <div className="tl-co-overlay">
        <div style={{ minHeight: '100vh', padding: '24px 16px 48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 1060, animation: 'tl-slide-in 0.4s ease both' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,184,212,0.30)',
                  }}>
                    <ShieldCheck style={{ width: 16, height: 16, color: 'white' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.tealDark, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    TrustLayer Checkout
                  </span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em', margin: 0 }}>
                  Complete Your Order
                </h1>
                <p style={{ fontSize: 13, color: C.body, marginTop: 3 }}>
                  Activate your plan and start building trust in your hiring pipeline
                </p>
              </div>
              <button className="tl-close-btn" onClick={onClose} title="Close">
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                <div style={{ width: 36, height: 36, border: `3px solid ${C.border}`, borderTopColor: C.teal, borderRadius: '50%', animation: 'tl-spin 0.8s linear infinite' }} />
              </div>
            )}

            {!loading && currentPlan && (
              <div className="tl-co-grid">

                {/* ── LEFT COLUMN ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Step 1 — Plan selector */}
                  <div className="tl-co-card" style={{ padding: '20px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div className="tl-step-circle">1</div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Selected Plan</span>
                    </div>

                    {/* Plan quick-select dropdown */}
                    {plans.length > 1 && (
                      <div style={{ position: 'relative', marginBottom: 14 }}>
                        <button
                          type="button"
                          className="tl-plan-btn active"
                          onClick={() => setPlanTabOpen(o => !o)}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: C.teal }}>{currentPlan.name}</span>
                            {currentPlan.popular && (
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100,
                                background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: 'white',
                              }}>Popular</span>
                            )}
                          </span>
                          <ChevronDown style={{ width: 15, height: 15, transform: planTabOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                        </button>
                        {planTabOpen && (
                          <div style={{
                            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                            background: 'white', border: `1.5px solid ${C.border}`,
                            borderRadius: 14, overflow: 'hidden', zIndex: 10,
                            boxShadow: '0 8px 32px rgba(10,31,61,0.10)',
                          }}>
                            {plans.filter(p => p.name.toLowerCase() !== 'enterprise').map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => { setActivePlanId(p.id); setPlanTabOpen(false); }}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  width: '100%', padding: '11px 16px',
                                  background: p.id === activePlanId ? '#f0fdff' : 'white',
                                  border: 'none', borderBottom: `1px solid ${C.border}`,
                                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                  fontSize: 13, color: p.id === activePlanId ? C.tealDark : C.body,
                                  fontWeight: p.id === activePlanId ? 700 : 500,
                                  transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => { if (p.id !== activePlanId) (e.currentTarget as HTMLElement).style.background = '#f8fbff'; }}
                                onMouseLeave={e => { if (p.id !== activePlanId) (e.currentTarget as HTMLElement).style.background = 'white'; }}
                              >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  {p.name}
                                  {p.popular && (
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 100, background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: 'white' }}>
                                      Popular
                                    </span>
                                  )}
                                </span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.teal }}>
                                  {p.isFree ? 'Free' : `₹${p.price}/mo`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Plan details card */}
                    <div style={{
                      background: 'linear-gradient(135deg, #f0fdff, #e8f8fb)',
                      border: `1.5px solid rgba(0,184,212,0.2)`,
                      borderRadius: 14, padding: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.02em' }}>
                            {currentPlan.name}
                          </div>
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                            {currentPlan.isFree ? 'No credit card required' : `₹${currentPlan.price}/user/month`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {currentPlan.isFree ? (
                            <span style={{ fontSize: 28, fontWeight: 800, color: '#16a34a' }}>Free</span>
                          ) : (
                            <span style={{ fontSize: 28, fontWeight: 800, color: C.teal }}>
                              ₹{currentPlan.price.toLocaleString('en-IN')}
                              <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>/mo</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {currentPlan.features.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {currentPlan.features.slice(0, 4).map(f => (
                            <div key={f.featureSlug} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              <div style={{ width: 16, height: 16, background: '#dcfce7', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Check style={{ width: 10, height: 10, color: '#16a34a' }} />
                              </div>
                              <span style={{ fontSize: 12, color: C.body }}>{f.uiLabel}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 — Billing form */}
                  <div className="tl-co-card" style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                      <div className="tl-step-circle">2</div>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Billing Information</span>
                        <p style={{ fontSize: 12, color: C.muted, marginTop: 1, marginBottom: 0 }}>Your company and contact details</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} id="tl-checkout-form">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
                        <InputField label="Company Name" icon={<Building2 style={{ width: 13, height: 13 }} />} value={form.companyName} onChange={v => setField('companyName', v)} placeholder="TrustLayer Inc." required />
                        <InputField label="Email Address" value={form.email} readOnly placeholder="you@company.com" />
                        <InputField label="Phone Number" icon={<Phone style={{ width: 13, height: 13 }} />} value={form.phone} onChange={v => setField('phone', v)} placeholder="+91 98765 43210" type="tel" required />
                        <InputField label="Street Address" icon={<MapPin style={{ width: 13, height: 13 }} />} value={form.address} onChange={v => setField('address', v)} placeholder="123, MG Road" required />
                        <InputField label="City" value={form.city} onChange={v => setField('city', v)} placeholder="Bengaluru" required />
                        <InputField label="State" value={form.state} onChange={v => setField('state', v)} placeholder="Karnataka" required />
                        <InputField label="Pincode" value={form.pincode} onChange={v => setField('pincode', v)} placeholder="560001" required />
                        <InputField label="GST Number (Optional)" icon={<Hash style={{ width: 13, height: 13 }} />} value={form.gstNumber} onChange={v => setField('gstNumber', v)} placeholder="22AAAAA0000A1Z5" />
                      </div>
                    </form>
                  </div>

                  {/* Security pills */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '6px 0' }}>
                    {[
                      { icon: <Shield style={{ width: 12, height: 12, color: C.teal }} />, text: 'SSL Secured' },
                      { icon: <Lock style={{ width: 12, height: 12, color: C.teal }} />,   text: '256-bit Encryption' },
                      { icon: <Check style={{ width: 12, height: 12, color: C.teal }} />,  text: 'PCI Compliant' },
                    ].map(item => (
                      <div key={item.text} className="tl-security-pill">
                        {item.icon} {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── RIGHT COLUMN — Order summary ── */}
                <div className="tl-co-card tl-co-summary-col" style={{ padding: 22, position: 'sticky', top: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div className="tl-step-circle">3</div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Order Summary</span>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                    {[currentPlan.name, BILLING_LABELS[cycle]].map(t => (
                      <span key={t} style={{ padding: '4px 10px', background: '#f0fdff', border: '1px solid rgba(0,184,212,0.25)', color: C.tealDark, borderRadius: 7, fontSize: 11.5, fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>

                  {/* Billing cycle selector */}
                  <p style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Billing Cycle
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                    {(['monthly', 'quarterly', 'half-yearly', 'yearly'] as BillingCycle[]).map(c => {
                      const pct = currentPlan.discountConfig?.[c] ?? 0;
                      return (
                        <button
                          key={c}
                          type="button"
                          className={`tl-cycle-btn${cycle === c ? ' active' : ''}`}
                          onClick={() => setCycle(c)}
                        >
                          {BILLING_LABELS[c]}
                          {pct > 0 && <span style={{ marginLeft: 3, color: '#059669', fontWeight: 700 }}>−{pct}%</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="tl-divider" />

                  {/* Price breakdown */}
                  <div style={{ marginBottom: 4 }}>
                    <div className="tl-summary-row">
                      <span style={{ fontSize: 12.5, color: C.muted }}>Price per user / month</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>₹{pricePerUser.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="tl-summary-row">
                      <span style={{ fontSize: 12.5, color: C.muted }}>Billing period</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{BILLING_UNIT[cycle]}</span>
                    </div>
                    <div className="tl-summary-row">
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.body }}>Subtotal</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                    </div>
                    {discountPct > 0 && (
                      <div className="tl-summary-row">
                        <span style={{ fontSize: 12.5, color: '#059669', fontWeight: 500 }}>Discount ({discountPct}%)</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>−₹{Math.round(discountAmt).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {!isFreePlan && (
                      <div className="tl-summary-row">
                        <span style={{ fontSize: 12.5, color: C.muted }}>GST (18%)</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>₹{gstAmt.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div style={{
                    background: 'linear-gradient(135deg, #f0fdff, #e8f8fb)',
                    border: '1.5px solid rgba(0,184,212,0.20)',
                    borderRadius: 14, padding: '14px 16px', margin: '14px 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.body }}>Total Due</span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: C.navy, letterSpacing: '-0.03em' }}>
                      ₹{totalDue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    type="submit"
                    form="tl-checkout-form"
                    className="tl-pay-btn"
                    disabled={processing}
                  >
                    {processing ? (
                      <><div className="tl-spinner" /> Processing…</>
                    ) : isFreePlan ? (
                      <><Zap style={{ width: 16, height: 16 }} /> Activate Free Plan</>
                    ) : (
                      <><CreditCard style={{ width: 16, height: 16 }} /> Proceed to Payment <ArrowRight style={{ width: 14, height: 14 }} /></>
                    )}
                  </button>

                  {/* Trust bullets */}
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {['Secure payment processing', 'Cancel anytime, no lock-in', 'Instant plan activation'].map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.muted }}>
                        <Check style={{ width: 11, height: 11, color: '#22c55e', flexShrink: 0 }} /> {t}
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: 10, color: '#cbd5e1', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                    By continuing you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 400, padding: '11px 20px', borderRadius: 100, fontFamily: "'Inter', sans-serif",
          fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
          background: toast.type === 'error' ? '#fee2e2' : '#fef9c3',
          color: toast.type === 'error' ? '#dc2626' : '#854d0e',
          border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#fde047'}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
          animation: 'tl-toast-in 0.25s ease both',
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Success Modal ── */}
      {showSuccess && (
        <Modal>
          <ModalIcon color="#16a34a" bg="linear-gradient(135deg,#dcfce7,#bbf7d0)">
            <Check style={{ width: 32, height: 32 }} />
          </ModalIcon>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: '#f0fdff', border: '1px solid #a5f3fc', color: C.tealDark, marginBottom: 14 }}>
            <Check style={{ width: 10, height: 10 }} /> {currentPlan?.name} Activated
          </div>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em', margin: '0 0 10px' }}>
            You're all set! 🎉
          </h3>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.65, margin: '0 0 6px' }}>
            Your <strong style={{ color: C.teal }}>{currentPlan?.name}</strong> plan is now active. Start building trust in your hiring pipeline.
          </p>
          <p style={{ fontSize: 12, color: C.muted }}>Closing automatically…</p>
        </Modal>
      )}

      {/* ── Already Active (paid plan) Modal ── */}
      {showAlreadyActive && (
        <Modal onClose={() => setShowAlreadyActive(false)}>
          <ModalIcon color={C.teal} bg="linear-gradient(135deg,#e0f7fa,#b2ebf2)">
            <ShieldCheck style={{ width: 32, height: 32 }} />
          </ModalIcon>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: '#f0fdff', border: '1px solid #a5f3fc', color: C.tealDark, marginBottom: 14 }}>
            <Check style={{ width: 10, height: 10 }} /> {existingLicenseName} Plan Active
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em', margin: '0 0 10px' }}>
            Plan Already Active ✅
          </h3>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.65, margin: '0 0 6px' }}>
            You already have an active <strong style={{ color: C.teal }}>{existingLicenseName}</strong> plan on your account.
          </p>
          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            Head to your dashboard to continue using TrustLayer.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={() => { setShowAlreadyActive(false); onClose(); }}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#f8fbff', color: C.body, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Close
            </button>
            <button onClick={() => { setShowAlreadyActive(false); onClose(); }}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: 'white', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,184,212,0.30)' }}>
              Go to Dashboard
            </button>
          </div>
        </Modal>
      )}

      {/* ── Upgrade Modal (free plan user trying free again) ── */}
      {showUpgrade && (
        <Modal onClose={() => setShowUpgrade(false)}>
          <ModalIcon color="#d97706" bg="linear-gradient(135deg,#fef3c7,#fde68a)">
            <Zap style={{ width: 32, height: 32 }} />
          </ModalIcon>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', marginBottom: 14 }}>
            <Check style={{ width: 10, height: 10 }} /> {existingLicenseName} Plan Active
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            You're on the Free Plan
          </h3>
          <p style={{ fontSize: 14, color: C.body, lineHeight: 1.65, margin: '0 0 4px' }}>
            You can't activate the same free plan again. Upgrade to unlock the full power of TrustLayer.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '18px 0 20px' }}>
            {paidPlans.map(p => (
              <button key={p.id}
                onClick={() => { setActivePlanId(p.id); setExistingLicenseName(''); setExistingIsFreePlan(false); setShowUpgrade(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: 12,
                  border: `1.5px solid ${p.id === activePlanId ? C.teal : C.border}`,
                  background: p.id === activePlanId ? '#f0fdff' : '#f8fbff',
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: C.navy }}>
                  {p.popular && <Star style={{ width: 13, height: 13, color: '#f59e0b' }} fill="#f59e0b" />}
                  {p.name}
                  {p.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: 'white' }}>Popular</span>}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>₹{p.price}<span style={{ fontSize: 10, fontWeight: 400, color: C.muted }}>/mo</span></span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setShowUpgrade(false); onClose(); }}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#f8fbff', color: C.body, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Go Back
            </button>
            <button onClick={() => {
              const first = paidPlans[0];
              if (first) { setActivePlanId(first.id); setExistingLicenseName(''); setExistingIsFreePlan(false); }
              setShowUpgrade(false);
            }}
              style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: 'white', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,184,212,0.30)' }}>
              Upgrade Plan →
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
