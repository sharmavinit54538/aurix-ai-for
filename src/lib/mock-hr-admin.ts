import type {
  AurixUser,
  Company,
  Employee,
  HR,
  HRDocument,
  Manager,
} from "./aurix-store";

export const MOCK_HR_ADMIN_TOKEN = "mock-demo-hr-admin-token";
export const MOCK_EMPLOYEE_TOKEN = "mock-demo-employee-token";
export const MOCK_MANAGER_TOKEN = "mock-demo-manager-token";
export const MOCK_HR_SEED_KEY = "ofc360:mock_hr_admin_seeded_v2";

export function isMockDemoToken(token?: string | null): boolean {
  return Boolean(token && token.startsWith("mock-demo-"));
}

export const MOCK_HR_ADMIN_USER: AurixUser = {
  id: "hr-admin-101",
  fullName: "Aarav Sharma",
  email: "hr@aurix.ai",
  phone: "+91 98765 43210",
  role: "hr_admin",
  companyId: "comp-ofc360-01",
  company_name: "OFC360 Enterprise",
  companyName: "OFC360 Enterprise",
  emailVerified: true,
  onboardingComplete: true,
  documentVerificationStatus: "VERIFIED",
  documentsVerified: true,
  documentsVerifiedAt: "2026-01-15T09:00:00.000Z",
  createdAt: "2026-01-01T09:00:00.000Z",
};

export const MOCK_EMPLOYEE_USER: AurixUser = {
  id: "emp-102",
  fullName: "Kabir Mehta",
  email: "employee@aurix.ai",
  phone: "+91 98765 43211",
  role: "employee",
  companyId: "comp-ofc360-01",
  company_name: "OFC360 Enterprise",
  companyName: "OFC360 Enterprise",
  emailVerified: true,
  onboardingComplete: true,
  documentVerificationStatus: "VERIFIED",
  documentsVerified: true,
  documentsVerifiedAt: "2026-01-15T09:00:00.000Z",
  createdAt: "2026-01-10T09:00:00.000Z",
};

export const MOCK_MANAGER_USER: AurixUser = {
  id: "mgr-103",
  fullName: "Riya Verma",
  email: "manager@aurix.ai",
  phone: "+91 98765 43212",
  role: "manager",
  companyId: "comp-ofc360-01",
  company_name: "OFC360 Enterprise",
  companyName: "OFC360 Enterprise",
  emailVerified: true,
  onboardingComplete: true,
  documentVerificationStatus: "VERIFIED",
  documentsVerified: true,
  documentsVerifiedAt: "2026-01-15T09:00:00.000Z",
  createdAt: "2026-01-05T09:00:00.000Z",
};

export const MOCK_HR_ADMIN_COMPANY: Company = {
  id: "comp-ofc360-01",
  name: "OFC360 Enterprise",
  industry: "Enterprise SaaS & AI",
  size: "201–500",
  website: "https://ofc360.com",
  email: "hr@aurix.ai",
  phone: "+91 80 4567 8900",
  address: "Prestige Tech Park, Outer Ring Road, Bellandur",
  city: "Bengaluru",
  state: "Karnataka",
  country: "India",
  timezone: "Asia/Kolkata",
  currency: "INR",
  signatoryName: "Aarav Sharma",
  signatoryDesignation: "VP of People & HR Operations",
};

export const MOCK_HRS: HR[] = [
  {
    id: "hr-1",
    fullName: "Aarav Sharma",
    email: "hr@aurix.ai",
    phone: "+91 98765 43210",
    department: "Human Resources",
    designation: "VP of People & HR Operations",
  },
  {
    id: "hr-2",
    fullName: "Meera Nair",
    email: "meera.nair@aurix.ai",
    phone: "+91 98765 43220",
    department: "Human Resources",
    designation: "Senior HR Business Partner",
  },
];

export const MOCK_MANAGERS: Manager[] = [
  {
    id: "mgr-103",
    fullName: "Riya Verma",
    email: "manager@aurix.ai",
    phone: "+91 98765 43212",
    department: "Engineering",
    designation: "Engineering Manager",
    team: ["emp-102", "emp-104", "emp-105"],
    shiftStart: "09:30",
    shiftEnd: "18:30",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "mgr-104",
    fullName: "Vikram Malhotra",
    email: "vikram.m@aurix.ai",
    phone: "+91 98765 43213",
    department: "Product & Design",
    designation: "Director of Product",
    team: ["emp-106", "emp-107"],
    shiftStart: "10:00",
    shiftEnd: "19:00",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "emp-102",
    employeeId: "OFC-EMP-001",
    fullName: "Kabir Mehta",
    email: "employee@aurix.ai",
    phone: "+91 98765 43211",
    department: "Engineering",
    designation: "Senior Full-Stack Engineer",
    joiningDate: "2024-03-15",
    managerName: "Riya Verma",
    shift: "General (09:30 - 18:30)",
    status: "Active",
    location: "Bengaluru",
    bloodGroup: "O+",
    salary: "2400000",
    ctc: "2400000",
  },
  {
    id: "emp-104",
    employeeId: "OFC-EMP-002",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@aurix.ai",
    phone: "+91 98765 43214",
    department: "Engineering",
    designation: "Staff Backend Architect",
    joiningDate: "2023-08-01",
    managerName: "Riya Verma",
    shift: "General (09:30 - 18:30)",
    status: "Active",
    location: "Bengaluru",
    bloodGroup: "A+",
    salary: "3200000",
    ctc: "3200000",
  },
  {
    id: "emp-105",
    employeeId: "OFC-EMP-003",
    fullName: "Rohan Deshmukh",
    email: "rohan.d@aurix.ai",
    phone: "+91 98765 43215",
    department: "Product & Design",
    designation: "Lead Product Designer",
    joiningDate: "2024-06-10",
    managerName: "Vikram Malhotra",
    shift: "Flexible (10:00 - 19:00)",
    status: "Active",
    location: "Mumbai",
    bloodGroup: "B+",
    salary: "2100000",
    ctc: "2100000",
  },
  {
    id: "emp-106",
    employeeId: "OFC-EMP-004",
    fullName: "Sneha Kulkarni",
    email: "sneha.k@aurix.ai",
    phone: "+91 98765 43216",
    department: "Sales & GTM",
    designation: "Enterprise Account Executive",
    joiningDate: "2024-01-22",
    managerName: "Vikram Malhotra",
    shift: "General (09:30 - 18:30)",
    status: "Active",
    location: "Gurugram",
    bloodGroup: "AB+",
    salary: "1850000",
    ctc: "1850000",
  },
  {
    id: "emp-107",
    employeeId: "OFC-EMP-005",
    fullName: "Devansh Patel",
    email: "devansh.p@aurix.ai",
    phone: "+91 98765 43217",
    department: "Finance & Legal",
    designation: "Payroll & Compliance Specialist",
    joiningDate: "2024-09-02",
    managerName: "Aarav Sharma",
    shift: "General (09:30 - 18:30)",
    status: "Active",
    location: "Bengaluru",
    bloodGroup: "O-",
    salary: "1450000",
    ctc: "1450000",
  },
  {
    id: "emp-108",
    employeeId: "OFC-EMP-006",
    fullName: "Priya Krishnan",
    email: "priya.k@aurix.ai",
    phone: "+91 98765 43218",
    department: "AI & Data Science",
    designation: "Applied ML Scientist",
    joiningDate: "2025-01-12",
    managerName: "Riya Verma",
    shift: "General (09:30 - 18:30)",
    status: "Active",
    location: "Hyderabad",
    bloodGroup: "B+",
    salary: "2850000",
    ctc: "2850000",
  },
];

export const MOCK_HR_DOCUMENTS: HRDocument[] = [
  {
    id: "doc-101",
    name: "Kabir_Mehta_PAN_Verification.pdf",
    employeeId: "emp-102",
    employeeName: "Kabir Mehta",
    category: "Employee Documents",
    type: "PAN Card",
    uploadedBy: "Kabir Mehta",
    uploadDate: "2026-10-18",
    status: "Verified",
    fileSize: "412 KB",
    fileType: "pdf",
  },
  {
    id: "doc-102",
    name: "Ananya_Iyer_Employment_Contract_2026.pdf",
    employeeId: "emp-104",
    employeeName: "Ananya Iyer",
    category: "Employment",
    type: "Employment Contract",
    uploadedBy: "Aarav Sharma",
    uploadDate: "2026-10-24",
    status: "Verified",
    fileSize: "1.2 MB",
    fileType: "pdf",
  },
  {
    id: "doc-103",
    name: "Priya_Krishnan_Degree_Certificate.pdf",
    employeeId: "emp-108",
    employeeName: "Priya Krishnan",
    category: "Education",
    type: "Degree Certificate",
    uploadedBy: "Priya Krishnan",
    uploadDate: "2026-11-02",
    status: "Pending",
    fileSize: "840 KB",
    fileType: "pdf",
  },
  {
    id: "doc-104",
    name: "OFC360_POSH_Compliance_Policy_FY26.pdf",
    category: "Company Documents",
    type: "Policy Document",
    uploadedBy: "Aarav Sharma",
    uploadDate: "2026-11-05",
    expiryDate: "2026-12-20",
    status: "Verified",
    fileSize: "2.4 MB",
    fileType: "pdf",
  },
];

const MOCK_DEPARTMENTS_API = [
  {
    id: "dept-eng",
    department_code: "ENG-01",
    department_name: "Engineering",
    name: "Engineering",
    head_name: "Riya Verma",
    employee_count: 112,
    currentEmployeeCount: 112,
    attendance_rate: 96,
    productivity_rate: 94,
    open_positions: 6,
    budget: 54000000,
    status: "ACTIVE",
  },
  {
    id: "dept-prod",
    department_code: "PRD-02",
    department_name: "Product & Design",
    name: "Product & Design",
    head_name: "Vikram Malhotra",
    employee_count: 42,
    currentEmployeeCount: 42,
    attendance_rate: 95,
    productivity_rate: 92,
    open_positions: 3,
    budget: 21000000,
    status: "ACTIVE",
  },
  {
    id: "dept-sales",
    department_code: "SLS-03",
    department_name: "Sales & GTM",
    name: "Sales & GTM",
    head_name: "Karan Oberoi",
    employee_count: 54,
    currentEmployeeCount: 54,
    attendance_rate: 92,
    productivity_rate: 95,
    open_positions: 4,
    budget: 24500000,
    status: "ACTIVE",
  },
  {
    id: "dept-ai",
    department_code: "AID-04",
    department_name: "AI & Data Science",
    name: "AI & Data Science",
    head_name: "Dr. Siddharth Rao",
    employee_count: 34,
    currentEmployeeCount: 34,
    attendance_rate: 97,
    productivity_rate: 96,
    open_positions: 3,
    budget: 22000000,
    status: "ACTIVE",
  },
  {
    id: "dept-hr",
    department_code: "HR-05",
    department_name: "Human Resources",
    name: "Human Resources",
    head_name: "Aarav Sharma",
    employee_count: 18,
    currentEmployeeCount: 18,
    attendance_rate: 98,
    productivity_rate: 95,
    open_positions: 1,
    budget: 8500000,
    status: "ACTIVE",
  },
  {
    id: "dept-fin",
    department_code: "FIN-06",
    department_name: "Finance & Legal",
    name: "Finance & Legal",
    head_name: "Neha Gupta",
    employee_count: 24,
    currentEmployeeCount: 24,
    attendance_rate: 96,
    productivity_rate: 93,
    open_positions: 1,
    budget: 11200000,
    status: "ACTIVE",
  },
];

const MOCK_JOBS_API = [
  {
    id: "job-101",
    title: "Senior Distributed Systems Engineer",
    department: "Engineering",
    location: "Bengaluru · Hybrid",
    employment_type: "Full-time",
    status: "OPEN",
    applicant_count: 48,
    posted_at: "2026-11-01",
  },
  {
    id: "job-102",
    title: "Staff Applied AI Engineer (LLMs)",
    department: "AI & Data Science",
    location: "Bengaluru · Hybrid",
    employment_type: "Full-time",
    status: "OPEN",
    applicant_count: 37,
    posted_at: "2026-11-03",
  },
  {
    id: "job-103",
    title: "Principal Product Designer",
    department: "Product & Design",
    location: "Mumbai · Remote",
    employment_type: "Full-time",
    status: "OPEN",
    applicant_count: 29,
    posted_at: "2026-11-05",
  },
  {
    id: "job-104",
    title: "Enterprise Account Executive — APAC",
    department: "Sales & GTM",
    location: "Gurugram · On-site",
    employment_type: "Full-time",
    status: "OPEN",
    applicant_count: 22,
    posted_at: "2026-11-07",
  },
  {
    id: "job-105",
    title: "Frontend Platform Architect (React/TS)",
    department: "Engineering",
    location: "Bengaluru · Hybrid",
    employment_type: "Full-time",
    status: "OPEN",
    applicant_count: 54,
    posted_at: "2026-11-09",
  },
];

const MOCK_ASSETS_API = [
  { id: "ast-1", name: "MacBook Pro 16 M3 Max", category: "Laptops", serial_number: "MBP-2026-001", status: "assigned", assigned_to: "Kabir Mehta" },
  { id: "ast-2", name: "MacBook Pro 14 M3 Pro", category: "Laptops", serial_number: "MBP-2026-002", status: "assigned", assigned_to: "Ananya Iyer" },
  { id: "ast-3", name: "Dell UltraSharp 27 4K Monitor", category: "Monitors", serial_number: "DLL-2026-104", status: "assigned", assigned_to: "Rohan Deshmukh" },
  { id: "ast-4", name: "iPhone 16 Pro (Enterprise)", category: "Mobile Devices", serial_number: "IPH-2026-042", status: "assigned", assigned_to: "Sneha Kulkarni" },
  { id: "ast-5", name: "MacBook Air 15 M3", category: "Laptops", serial_number: "MBA-2026-088", status: "available", assigned_to: null },
  { id: "ast-6", name: "ThinkPad X1 Carbon Gen 12", category: "Laptops", serial_number: "TPX-2026-019", status: "under-repair", assigned_to: null },
];

const MOCK_EXITS_API = [
  {
    id: "exit-101",
    employee_id: "emp-201",
    employee_name: "Arjun Kapoor",
    department: "Sales & GTM",
    designation: "Account Manager",
    status: "IN_PROGRESS",
    resignation_date: "2026-10-15",
    exit_date: "2026-11-30",
    reason: "Higher Studies",
  },
  {
    id: "exit-102",
    employee_id: "emp-202",
    employee_name: "Pooja Hegde",
    department: "Engineering",
    designation: "QA Automation Engineer",
    status: "PENDING",
    resignation_date: "2026-11-02",
    exit_date: "2026-12-15",
    reason: "Relocation",
  },
  {
    id: "exit-103",
    employee_id: "emp-203",
    employee_name: "Nikhil Sinha",
    department: "Product & Design",
    designation: "UX Researcher",
    status: "COMPLETED",
    resignation_date: "2026-09-01",
    exit_date: "2026-10-15",
    reason: "Career Transition",
  },
];

const MOCK_PAYROLL_CYCLES = [
  {
    id: "cyc-2026-11",
    name: "November 2026 Payroll",
    month: "November",
    year: 2026,
    periodMonth: 11,
    periodYear: 2026,
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    payDate: "2026-11-30",
    status: "Validated",
    isCurrent: true,
    isLocked: false,
    employeeCount: 284,
    totalGrossPay: 12840000,
    totalNetPay: 10914000,
    runId: "run-2026-11",
    createdAt: "2026-11-01T09:00:00Z",
    updatedAt: "2026-11-12T14:30:00Z",
  },
  {
    id: "cyc-2026-10",
    name: "October 2026 Payroll",
    month: "October",
    year: 2026,
    periodMonth: 10,
    periodYear: 2026,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    payDate: "2026-10-31",
    status: "Paid",
    isCurrent: false,
    isLocked: true,
    employeeCount: 278,
    totalGrossPay: 12520000,
    totalNetPay: 10642000,
    runId: "run-2026-10",
    createdAt: "2026-10-01T09:00:00Z",
    updatedAt: "2026-10-31T18:00:00Z",
  },
  {
    id: "cyc-2026-09",
    name: "September 2026 Payroll",
    month: "September",
    year: 2026,
    periodMonth: 9,
    periodYear: 2026,
    startDate: "2026-09-01",
    endDate: "2026-09-30",
    payDate: "2026-09-30",
    status: "Paid",
    isCurrent: false,
    isLocked: true,
    employeeCount: 272,
    totalGrossPay: 12180000,
    totalNetPay: 10353000,
    runId: "run-2026-09",
    createdAt: "2026-09-01T09:00:00Z",
    updatedAt: "2026-09-30T18:00:00Z",
  },
];

const MOCK_PAYROLL_DASHBOARD = {
  period: MOCK_PAYROLL_CYCLES[0],
  active_run: {
    id: "run-2026-11",
    periodId: "cyc-2026-11",
    periodName: "November 2026 Payroll",
    status: "Validated",
    employeeCount: 284,
    grossPayroll: 12840000,
    totalDeductions: 1926000,
    netPayroll: 10914000,
    employerCost: 13680000,
  },
  status: "Validated",
  summary: {
    employeeCount: 284,
    total_gross: 12840000,
    grossPayroll: 12840000,
    totalDeductions: 1926000,
    netPayroll: 10914000,
    employerCost: 13680000,
    processed_count: 268,
    pending_count: 16,
    paid_count: 278,
  },
  readiness: {
    attendanceLocked: true,
    salaryStructuresAssigned: true,
    statutoryConfigured: true,
    bankDetailsVerified: true,
  },
  issues: {
    errors: [],
    warnings: [
      {
        id: "iss-1",
        employeeId: "OFC-EMP-006",
        employeeName: "Priya Krishnan",
        department: "AI & Data Science",
        severity: "warning",
        category: "Tax Regime",
        message: "Investment proof declaration pending final verification for Q3",
      },
    ],
  },
  recentRuns: [
    {
      id: "run-2026-06",
      periodId: "cyc-2026-06",
      periodName: "Jun",
      status: "Paid",
      employeeCount: 254,
      grossPayroll: 114.5,
      totalDeductions: 17.2,
      netPayroll: 97.3,
      employerCost: 121.8,
      runDate: "2026-06-30",
    },
    {
      id: "run-2026-07",
      periodId: "cyc-2026-07",
      periodName: "Jul",
      status: "Paid",
      employeeCount: 260,
      grossPayroll: 117.2,
      totalDeductions: 17.6,
      netPayroll: 99.6,
      employerCost: 124.5,
      runDate: "2026-07-31",
    },
    {
      id: "run-2026-08",
      periodId: "cyc-2026-08",
      periodName: "Aug",
      status: "Paid",
      employeeCount: 266,
      grossPayroll: 119.8,
      totalDeductions: 18.0,
      netPayroll: 101.8,
      employerCost: 127.4,
      runDate: "2026-08-31",
    },
    {
      id: "run-2026-09",
      periodId: "cyc-2026-09",
      periodName: "Sep",
      status: "Paid",
      employeeCount: 272,
      grossPayroll: 121.8,
      totalDeductions: 18.3,
      netPayroll: 103.5,
      employerCost: 129.6,
      runDate: "2026-09-30",
    },
    {
      id: "run-2026-10",
      periodId: "cyc-2026-10",
      periodName: "Oct",
      status: "Paid",
      employeeCount: 278,
      grossPayroll: 125.2,
      totalDeductions: 18.8,
      netPayroll: 106.4,
      employerCost: 133.1,
      runDate: "2026-10-31",
    },
    {
      id: "run-2026-11",
      periodId: "cyc-2026-11",
      periodName: "Nov",
      status: "Validated",
      employeeCount: 284,
      grossPayroll: 128.4,
      totalDeductions: 19.3,
      netPayroll: 109.1,
      employerCost: 136.8,
      runDate: "2026-11-13",
    },
  ],
};

/**
 * Returns structured mock API responses for HR Admin demo mode when backend endpoints
 * are unauthenticated or unreachable.
 */
export function getMockApiResponse(
  method: string,
  rawUrl: string,
  _params?: unknown,
  _body?: unknown
): unknown {
  const url = rawUrl.toLowerCase();

  if (url.includes("/auth/me")) {
    return {
      success: true,
      data: {
        id: MOCK_HR_ADMIN_USER.id,
        name: MOCK_HR_ADMIN_USER.fullName,
        email: MOCK_HR_ADMIN_USER.email,
        phone: MOCK_HR_ADMIN_USER.phone,
        role: MOCK_HR_ADMIN_USER.role,
        company_id: MOCK_HR_ADMIN_USER.companyId,
        company_name: MOCK_HR_ADMIN_USER.companyName,
        is_verified: true,
        onboarding_completed: true,
        documents_verified: true,
        document_verification_status: "VERIFIED",
      },
    };
  }

  if (url.includes("/departments")) {
    return {
      success: true,
      data: {
        items: MOCK_DEPARTMENTS_API,
        total: MOCK_DEPARTMENTS_API.length,
      },
    };
  }

  if (url.includes("/hierarchy")) {
    return {
      success: true,
      data: {
        total_nodes: 284,
        growth_mom: 8.4,
        history: [
          { month: "Jun", value: 242 },
          { month: "Jul", value: 251 },
          { month: "Aug", value: 260 },
          { month: "Sep", value: 268 },
          { month: "Oct", value: 276 },
          { month: "Nov", value: 284 },
        ],
        nodes: MOCK_EMPLOYEES.map((e) => ({
          id: e.id,
          name: e.fullName,
          title: e.designation,
          department: e.department,
          email: e.email,
        })),
      },
    };
  }

  if (url.includes("/jobs") || url.includes("/requisitions")) {
    return {
      success: true,
      data: {
        items: MOCK_JOBS_API,
        total: MOCK_JOBS_API.length,
      },
    };
  }

  if (url.includes("/assets")) {
    return {
      success: true,
      data: {
        items: MOCK_ASSETS_API,
        total: MOCK_ASSETS_API.length,
      },
    };
  }

  if (url.includes("/exits")) {
    return {
      success: true,
      data: {
        items: MOCK_EXITS_API,
        total: MOCK_EXITS_API.length,
      },
    };
  }

  if (url.includes("/internal/dashboard") || url.includes("/announcements")) {
    const announcements = [
      {
        id: "ann-101",
        title: "FY26 Q3 Townhall & Product Roadmap Keynote — Nov 20",
        content: "Join leadership live at 4:00 PM IST for our quarterly product & people update.",
        category: "Company Update",
        priority: "high",
        author_name: "Aarav Sharma (VP People)",
        created_at: "2026-11-12T10:00:00Z",
        is_pinned: true,
      },
      {
        id: "ann-102",
        title: "Annual Health Checkup & Wellness Reimbursement Window Open",
        content: "Submit preventive health checkup claims up to ₹15,000 under Employee Benefits.",
        category: "Benefits & Wellness",
        priority: "normal",
        author_name: "Meera Nair (HRBP)",
        created_at: "2026-11-10T09:30:00Z",
        is_pinned: true,
      },
    ];
    return {
      success: true,
      data: {
        pinned_announcements: announcements,
        recent_announcements: announcements,
        items: announcements,
        news_articles: [
          {
            id: "news-1",
            title: "OFC360 crosses 280+ team members across 4 cities",
            author_name: "Executive Office",
          },
        ],
      },
    };
  }

  if (url.includes("/notifications")) {
    return {
      success: true,
      data: {
        items: [
          {
            id: "notif-1",
            title: "November Payroll Validated & Ready for Approval",
            body: "284 employee salary records processed with 0 blocking errors.",
            priority: "high",
            category: "payroll_run",
            isRead: false,
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          },
          {
            id: "notif-2",
            title: "3 Pending Leave Approvals in Engineering",
            body: "Kabir Mehta and 2 others requested privilege leave for next week.",
            priority: "high",
            category: "leave_request",
            isRead: false,
            createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
          },
        ],
        unreadCount: 2,
        total: 2,
      },
    };
  }

  if (url.includes("/payroll/dashboard")) {
    return {
      success: true,
      data: MOCK_PAYROLL_DASHBOARD,
    };
  }

  if (url.includes("/payroll/cycles")) {
    return {
      success: true,
      data: {
        items: MOCK_PAYROLL_CYCLES,
        total: MOCK_PAYROLL_CYCLES.length,
        page: 1,
        totalPages: 1,
      },
    };
  }

  if (url.includes("/payroll/salary-structures")) {
    return {
      success: true,
      data: {
        items: [
          {
            id: "struct-1",
            name: "Standard Executive & Engineering CTC Structure",
            code: "STD-ENG-2026",
            description: "40% Basic, 50% HRA, 12% PF, 10% Performance Bonus, Special Allowance",
            isActive: true,
            gross_salary: 12840000,
          },
        ],
        total: 1,
      },
    };
  }

  if (url.includes("/payroll/employees/compensation")) {
    return {
      success: true,
      data: {
        items: MOCK_EMPLOYEES.map((e, i) => ({
          id: `comp-${e.id}`,
          employeeId: e.id,
          employeeCode: e.employeeId,
          employeeName: e.fullName,
          department: e.department,
          designation: e.designation,
          structureName: "Standard Executive & Engineering CTC",
          annualCtcPaise: Number(e.ctc || 2400000) * 100,
          monthlyGrossPaise: Math.round((Number(e.ctc || 2400000) * 100) / 12),
          effectiveFrom: e.joiningDate,
          status: "active",
          revisionCount: i + 1,
        })),
        total: MOCK_EMPLOYEES.length,
        page: 1,
        totalPages: 1,
      },
    };
  }

  if (url.includes("/payroll/payment-batches")) {
    return {
      success: true,
      data: {
        items: [
          {
            id: "batch-2026-10",
            batchNumber: "PAY-BATCH-2026-10",
            runId: "run-2026-10",
            periodName: "October 2026 Payroll",
            status: "reconciled",
            paymentMode: "NEFT",
            totalEmployees: 278,
            totalAmountPaise: 1064200000,
            paidCount: 278,
            failedCount: 0,
            heldCount: 0,
            createdAt: "2026-10-30T11:00:00Z",
          },
        ],
        total: 1,
      },
    };
  }

  if (url.includes("/employees")) {
    return {
      success: true,
      data: {
        items: MOCK_EMPLOYEES.map((e) => ({
          id: e.id,
          employee_id: e.employeeId,
          employee_code: e.employeeId,
          full_name: e.fullName,
          name: e.fullName,
          email: e.email,
          phone: e.phone,
          department: e.department,
          designation: e.designation,
          joining_date: e.joiningDate,
          manager_name: e.managerName,
          status: "ACTIVE",
          location: e.location,
        })),
        total: MOCK_EMPLOYEES.length,
        page: 1,
        totalPages: 1,
      },
    };
  }

  if (method.toUpperCase() !== "GET") {
    return {
      success: true,
      message: "Action completed in HR Admin Demo Mode",
      data: {},
    };
  }

  return {
    success: true,
    data: {
      items: [],
      total: 0,
    },
  };
}
