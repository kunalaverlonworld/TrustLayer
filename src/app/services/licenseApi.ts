// Local/Mock implementation of the LMS licensing system to avoid external connection
// Users and licenses are stored locally in localStorage.

interface MockLicense {
  status: string;
  licenseType: {
    name: string;
  };
}

const staticPlans = [
  {
    _id: 'plan_basic',
    licenseType: {
      _id: 'lt_basic',
      name: 'Basic LMS',
      description: 'Perfect for individuals starting their self-paced learning journey.',
      price: { amount: 9 },
      features: [
        'Access to 1 Foundational Course',
        'Standard Dashboard Tracker',
        'Mobile & Desktop Access',
        'Community Forum Access',
      ],
    },
  },
  {
    _id: 'plan_pro',
    licenseType: {
      _id: 'lt_pro',
      name: 'Professional',
      description: 'The most popular plan for deep skills acquisition with full interactive assets.',
      price: { amount: 29 },
      features: [
        'Access to All 12+ Professional Courses',
        'Interactive Code & Lab Sandbox',
        'Core Skill Telemetry & Analytics',
        'Downloadable Certificates',
        'Priority Email Support',
      ],
    },
  },
  {
    _id: 'plan_enterprise',
    licenseType: {
      _id: 'lt_enterprise',
      name: 'Enterprise Telemetry',
      description: 'Advanced telemetry and management tools for organizations and coaching teams.',
      price: { amount: 99 },
      features: [
        'Unlimited Students / Sub-accounts',
        'Advanced Team Performance Telemetry',
        'Custom Curriculum & Lesson Builder',
        'Dedicated Customer Success Manager',
        '99.9% SLA & SOC2 Compliance Vetting',
        'Live API Integration Hooks',
      ],
    },
  },
];

export async function syncCustomer(fullName: string, email: string, passwordString: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const usersRaw = localStorage.getItem('lms_mock_users') || '[]';
  const users = JSON.parse(usersRaw);
  
  if (users.some((u: any) => u.email === email)) {
    throw new Error('User with this email already exists.');
  }
  
  users.push({ fullName, email, password: passwordString });
  localStorage.setItem('lms_mock_users', JSON.stringify(users));
  
  return { success: true };
}

export async function loginCustomer(email: string, passwordString: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const usersRaw = localStorage.getItem('lms_mock_users') || '[]';
  const users = JSON.parse(usersRaw);
  
  let match = users.find((u: any) => u.email === email);
  
  if (!match) {
    // Auto-create user if they don't exist yet, to prevent any login blocks during testing
    const newUser = { fullName: email.split('@')[0], email, password: passwordString };
    users.push(newUser);
    localStorage.setItem('lms_mock_users', JSON.stringify(users));
    return { customer: newUser };
  }
  
  if (match.password !== passwordString) {
    // Fallback: update password for convenience if it's a test login bypass
    match.password = passwordString;
    localStorage.setItem('lms_mock_users', JSON.stringify(users));
  }
  
  return { customer: match };
}

export async function checkCustomerExists(email: string): Promise<boolean> {
  const usersRaw = localStorage.getItem('lms_mock_users') || '[]';
  const users = JSON.parse(usersRaw);
  return users.some((u: any) => u.email === email);
}

export async function checkActiveLicense(email: string): Promise<MockLicense | null> {
  const key = `lms_active_license_${email}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export async function getLicensesByProduct() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return staticPlans;
}

export async function purchaseLicense(companyName: string, email: string, licenseId: string, billingCycle: string = 'monthly') {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const selectedPlan = staticPlans.find((p) => p._id === licenseId);
  if (!selectedPlan) {
    throw new Error('Selected license plan not found.');
  }
  
  const key = `lms_active_license_${email}`;
  const licenseData: MockLicense = {
    status: 'active',
    licenseType: {
      name: selectedPlan.licenseType.name,
    },
  };
  
  localStorage.setItem(key, JSON.stringify(licenseData));
  return { success: true };
}
