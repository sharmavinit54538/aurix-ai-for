import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  handleSessionExpired,
  resetSessionExpiredFlag,
  refreshAccessToken,
} from "./tokens";
import { getApiBaseUrl, API_BASE_URL, BASE_URL } from "./baseUrl";
import { normalizeApiPath } from "./normalizeApiPath";
import {
  isHrOnboardingCompletedInStorage,
  isInviteTokenActivated,
  markHrOnboardingCompletedInStorage,
  markInviteTokenActivated,
} from "@/lib/onboarding-once";

export { handleSessionExpired, resetSessionExpiredFlag, refreshAccessToken };
export { getApiBaseUrl, API_BASE_URL, BASE_URL };

declare module "axios" {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
  }
}

export function clearApiCache(_urlPattern?: string) {
  // No-op in standalone client mode
}

const MOCK_DEPARTMENTS = [
  { id: "dept-1", name: "Engineering", department_name: "Engineering", code: "ENG", department_code: "ENG", head_name: "Alex Vance", manager_name: "Alex Vance", employee_count: 22, currentEmployeeCount: 22, attendance_rate: 97, productivity_rate: 94, open_positions: 3, budget: 850000, location: "San Francisco", status: "active", created_at: "2025-01-15T09:00:00Z" },
  { id: "dept-2", name: "Product & Design", department_name: "Product & Design", code: "PRD", department_code: "PRD", head_name: "Sarah Chen", manager_name: "Sarah Chen", employee_count: 10, currentEmployeeCount: 10, attendance_rate: 96, productivity_rate: 92, open_positions: 2, budget: 420000, location: "New York", status: "active", created_at: "2025-02-10T09:00:00Z" },
  { id: "dept-3", name: "AI Research", department_name: "AI Research", code: "AIR", department_code: "AIR", head_name: "Marcus Sterling", manager_name: "Marcus Sterling", employee_count: 8, currentEmployeeCount: 8, attendance_rate: 98, productivity_rate: 96, open_positions: 2, budget: 610000, location: "San Francisco", status: "active", created_at: "2025-03-05T09:00:00Z" },
  { id: "dept-4", name: "Operations & People", department_name: "Operations & People", code: "OPS", department_code: "OPS", head_name: "Elena Rostova", manager_name: "Elena Rostova", employee_count: 8, currentEmployeeCount: 8, attendance_rate: 95, productivity_rate: 91, open_positions: 1, budget: 310000, location: "Remote", status: "active", created_at: "2025-04-12T09:00:00Z" },
];

let MOCK_EMPLOYEES: Record<string, any>[] = [
  {
    id: "emp-1",
    user_id: "emp-1",
    employee_id: "EMP-1001",
    employee_code: "EMP-1001",
    employeeId: "EMP-1001",
    first_name: "Alex",
    last_name: "Vance",
    full_name: "Alex Vance",
    fullName: "Alex Vance",
    name: "Alex Vance",
    email: "alex.vance@aurix.ai",
    company_email: "alex.vance@aurix.ai",
    personal_email: "alex.vance.personal@gmail.com",
    phone: "+91 98201 10001",
    gender: "Male",
    date_of_birth: "1989-04-12",
    department: "Engineering",
    department_name: "Engineering",
    designation: "VP of Engineering",
    manager_name: "Direct Leadership",
    reporting_manager_name: "Direct Leadership",
    role: "hr_admin",
    status: "ACTIVE",
    presence_status: "online",
    joining_date: "2025-01-15",
    employment_type: "Full-time",
    work_mode: "Hybrid",
    probation_period_months: 3,
    shift: "General Shift (09:30 - 18:30)",
    office_location: "Bengaluru · Global HQ",
    work_location: "Bengaluru · Global HQ",
    location: "Bengaluru · Global HQ",
    ctc: "₹36,00,000 / year",
    salary: 300000,
    send_onboarding_invite: true,
    created_at: "2025-01-15T09:00:00Z",
  },
  {
    id: "emp-2",
    user_id: "emp-2",
    employee_id: "EMP-1002",
    employee_code: "EMP-1002",
    employeeId: "EMP-1002",
    first_name: "Sarah",
    last_name: "Chen",
    full_name: "Sarah Chen",
    fullName: "Sarah Chen",
    name: "Sarah Chen",
    email: "sarah.chen@aurix.ai",
    company_email: "sarah.chen@aurix.ai",
    personal_email: "sarah.chen@gmail.com",
    phone: "+91 98201 10002",
    gender: "Female",
    date_of_birth: "1992-08-24",
    department: "Product",
    department_name: "Product",
    designation: "Head of Product",
    manager_name: "Alex Vance",
    reporting_manager_name: "Alex Vance",
    role: "manager",
    status: "ACTIVE",
    presence_status: "online",
    joining_date: "2025-03-10",
    employment_type: "Full-time",
    work_mode: "Office / On-Site",
    probation_period_months: 3,
    shift: "General Shift (09:30 - 18:30)",
    office_location: "Mumbai · Corporate Hub",
    work_location: "Mumbai · Corporate Hub",
    location: "Mumbai · Corporate Hub",
    ctc: "₹28,00,000 / year",
    salary: 233333,
    send_onboarding_invite: true,
    created_at: "2025-03-10T09:00:00Z",
  },
  {
    id: "emp-3",
    user_id: "emp-3",
    employee_id: "EMP-1003",
    employee_code: "EMP-1003",
    employeeId: "EMP-1003",
    first_name: "Marcus",
    last_name: "Sterling",
    full_name: "Marcus Sterling",
    fullName: "Marcus Sterling",
    name: "Marcus Sterling",
    email: "marcus.s@aurix.ai",
    company_email: "marcus.s@aurix.ai",
    personal_email: "marcus.sterling@gmail.com",
    phone: "+91 98201 10003",
    gender: "Male",
    date_of_birth: "1994-11-05",
    department: "Engineering",
    department_name: "Engineering",
    designation: "Senior Software Engineer",
    manager_name: "Alex Vance",
    reporting_manager_name: "Alex Vance",
    role: "employee",
    status: "ACTIVE",
    presence_status: "away",
    joining_date: "2025-06-01",
    employment_type: "Full-time",
    work_mode: "Hybrid",
    probation_period_months: 6,
    shift: "General Shift (09:30 - 18:30)",
    office_location: "Bengaluru · Global HQ",
    work_location: "Bengaluru · Global HQ",
    location: "Bengaluru · Global HQ",
    ctc: "₹18,00,000 / year",
    salary: 150000,
    send_onboarding_invite: true,
    created_at: "2025-06-01T09:00:00Z",
  },
  {
    id: "emp-4",
    user_id: "emp-4",
    employee_id: "EMP-1004",
    employee_code: "EMP-1004",
    employeeId: "EMP-1004",
    first_name: "Elena",
    last_name: "Rostova",
    full_name: "Elena Rostova",
    fullName: "Elena Rostova",
    name: "Elena Rostova",
    email: "elena.r@aurix.ai",
    company_email: "elena.r@aurix.ai",
    personal_email: "elena.rostova@gmail.com",
    phone: "+91 98201 10004",
    gender: "Female",
    date_of_birth: "1991-02-19",
    department: "HR",
    department_name: "HR",
    designation: "People Operations Lead",
    manager_name: "Alex Vance",
    reporting_manager_name: "Alex Vance",
    role: "hr_admin",
    status: "ACTIVE",
    presence_status: "online",
    joining_date: "2025-08-20",
    employment_type: "Full-time",
    work_mode: "Remote / WFH",
    probation_period_months: 3,
    shift: "General Shift (09:30 - 18:30)",
    office_location: "Remote · Pan-India",
    work_location: "Remote · Pan-India",
    location: "Remote · Pan-India",
    ctc: "₹16,00,000 / year",
    salary: 133333,
    send_onboarding_invite: true,
    created_at: "2025-08-20T09:00:00Z",
  },
];

const MOCK_JOBS = [
  { id: "job-1", title: "Senior Staff AI Engineer", job_title: "Senior Staff AI Engineer", department: "AI Research", department_name: "AI Research", location: "San Francisco / Hybrid", employment_type: "Full-time", status: "OPEN", vacancies: 2, applicant_count: 24, applications_count: 24, created_at: "2026-10-15T10:00:00Z" },
  { id: "job-2", title: "Distributed Systems Architect", job_title: "Distributed Systems Architect", department: "Engineering", department_name: "Engineering", location: "Remote", employment_type: "Full-time", status: "OPEN", vacancies: 1, applicant_count: 18, applications_count: 18, created_at: "2026-10-20T10:00:00Z" },
  { id: "job-3", title: "Senior Product Designer", job_title: "Senior Product Designer", department: "Product & Design", department_name: "Product & Design", location: "New York", employment_type: "Full-time", status: "OPEN", vacancies: 1, applicant_count: 31, applications_count: 31, created_at: "2026-11-01T10:00:00Z" },
];

const MOCK_ASSETS = [
  { id: "ast-1", name: "MacBook Pro 16 M3 Max", asset_tag: "AST-1001", category: "Laptop", status: "assigned", assigned_to: "Alex Vance", assignedTo: "Alex Vance" },
  { id: "ast-2", name: "MacBook Pro 16 M3 Pro", asset_tag: "AST-1002", category: "Laptop", status: "assigned", assigned_to: "Sarah Chen", assignedTo: "Sarah Chen" },
  { id: "ast-3", name: "Studio Display 27 5K", asset_tag: "AST-1003", category: "Monitor", status: "available" },
  { id: "ast-4", name: "ThinkPad X1 Carbon Gen 12", asset_tag: "AST-1004", category: "Laptop", status: "assigned", assigned_to: "Marcus Sterling", assignedTo: "Marcus Sterling" },
];

let MOCK_EXITS: Record<string, any>[] = [
  {
    id: "ext-1",
    employee: "Ryan Cooper",
    employee_name: "Ryan Cooper",
    employeeId: "EMP-1088",
    role: "Backend Engineer",
    dept: "Engineering",
    department: "Engineering",
    manager: "Alex Vance",
    resignDate: "2026-10-30",
    resignation_date: "2026-10-30",
    lastWorkingDay: "2026-11-30",
    exit_date: "2026-11-30",
    noticeDays: 30,
    reason: "Relocating for higher education",
    stage: "Clearance Pending",
    status: "IN_PROGRESS",
    isResignationApproved: true,
    assetsToReturn: [
      { assetId: "AST-1091", name: "MacBook Pro 14 M3", status: "Pending" },
      { assetId: "ID-1088", name: "Office Access Badge", status: "Returned" },
    ],
    clearances: [
      { dept: "Engineering Handover", owner: "Alex Vance", status: "Cleared" },
      { dept: "IT & Security", owner: "IT Desk", status: "Pending" },
      { dept: "Finance & Payroll", owner: "Payroll Desk", status: "Pending" },
      { dept: "HR Operations", owner: "Elena Rostova", status: "Pending" },
    ],
    settlement: {
      baseSalaryEarned: 112000,
      leaveEncashment: 18500,
      bonusProrata: 0,
      incentives: 0,
      taxDeduction: 9500,
      recoveryAmount: 0,
      netPayable: 121000,
      paymentStatus: "Pending",
    },
    interview: { status: "Scheduled", rating: 0, feedback: "", attritionReason: "Higher Education" },
    deactivated: false,
    timeline: [
      { id: "tl-1", time: "2026-10-30", label: "Resignation Submitted", by: "Ryan Cooper" },
      { id: "tl-2", time: "2026-11-01", label: "Resignation Approved", by: "Alex Vance" },
    ],
  },
  {
    id: "ext-2",
    employee: "Nina Patel",
    employee_name: "Nina Patel",
    employeeId: "EMP-1042",
    role: "Product Designer",
    dept: "Product & Design",
    department: "Product & Design",
    manager: "Sarah Chen",
    resignDate: "2026-09-15",
    resignation_date: "2026-09-15",
    lastWorkingDay: "2026-10-15",
    exit_date: "2026-10-15",
    noticeDays: 30,
    reason: "Career growth opportunity",
    stage: "Completed",
    status: "COMPLETED",
    isResignationApproved: true,
    assetsToReturn: [{ assetId: "AST-1042", name: "MacBook Pro 16", status: "Returned" }],
    clearances: [
      { dept: "Product Handover", owner: "Sarah Chen", status: "Cleared" },
      { dept: "IT & Security", owner: "IT Desk", status: "Cleared" },
      { dept: "Finance & Payroll", owner: "Payroll Desk", status: "Cleared" },
      { dept: "HR Operations", owner: "Elena Rostova", status: "Cleared" },
    ],
    settlement: {
      baseSalaryEarned: 98000,
      leaveEncashment: 14000,
      bonusProrata: 8000,
      incentives: 0,
      taxDeduction: 8500,
      recoveryAmount: 0,
      netPayable: 111500,
      paymentStatus: "Paid",
    },
    interview: { status: "Completed", rating: 4.5, feedback: "Great team culture.", attritionReason: "Career Growth" },
    deactivated: true,
    timeline: [
      { id: "tl-3", time: "2026-09-15", label: "Resignation Submitted", by: "Nina Patel" },
      { id: "tl-4", time: "2026-10-15", label: "Exit & Settlement Completed", by: "Elena Rostova" },
    ],
  },
];

function getDefaultMondayStr(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(now);
  mon.setDate(diff);
  return mon.toISOString().slice(0, 10);
}

const DEFAULT_WEEK_DATE = getDefaultMondayStr();
const PREV_WEEK_DATE = (() => {
  const d = new Date(DEFAULT_WEEK_DATE);
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
})();

let MOCK_WEEKLY_TIMESHEETS: Record<string, { id: string; week_start_date: string; status: string; entries: any[]; submitted_at?: string; approved_by_id?: string | null; rejection_reason?: string | null }> = {
  [DEFAULT_WEEK_DATE]: {
    id: "ts-current",
    week_start_date: DEFAULT_WEEK_DATE,
    status: "DRAFT",
    entries: [
      {
        id: "ts-row-1",
        project_id: "proj_engineering",
        monday_hours: 8,
        tuesday_hours: 8,
        wednesday_hours: 7.5,
        thursday_hours: 8,
        friday_hours: 8,
        saturday_hours: 0,
        sunday_hours: 0,
        description: "Platform API delivery & code reviews",
      },
    ],
    approved_by_id: null,
  },
  [PREV_WEEK_DATE]: {
    id: "ts-prev-1",
    week_start_date: PREV_WEEK_DATE,
    status: "APPROVED",
    submitted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    approved_by_id: "emp-1",
    entries: [
      {
        id: "ts-row-prev-1",
        project_id: "proj_client_work",
        monday_hours: 8,
        tuesday_hours: 8,
        wednesday_hours: 8,
        thursday_hours: 8,
        friday_hours: 8,
        saturday_hours: 0,
        sunday_hours: 0,
        description: "Enterprise onboarding sprint & QA",
      },
    ],
  },
};

let MOCK_PENDING_TIMESHEETS: any[] = [
  {
    id: "ts-pend-1",
    employee: { fullName: "Marcus Sterling", department: "Engineering" },
    week_start_date: DEFAULT_WEEK_DATE,
    status: "PENDING",
    entries: [
      {
        id: "pe-1",
        project_id: "proj_engineering",
        monday_hours: 8,
        tuesday_hours: 8,
        wednesday_hours: 8,
        thursday_hours: 8,
        friday_hours: 8,
        saturday_hours: 0,
        sunday_hours: 0,
        description: "Core microservices optimization",
      },
    ],
  },
];

let MOCK_EXPENSES: Record<string, any>[] = [
  {
    id: "exp-101",
    employee_name: "Marcus Sterling",
    employee: "Marcus Sterling",
    category: "travel",
    amount: 14800,
    currency: "INR",
    date: "2026-11-04",
    description: "Bengaluru to Mumbai round-trip flight for enterprise client workshop",
    receipt_name: "indigo_flight_blrmum.pdf",
    status: "pending",
    submitted_at: "2026-11-05T09:15:00Z",
  },
  {
    id: "exp-102",
    employee_name: "Sarah Chen",
    employee: "Sarah Chen",
    category: "client",
    amount: 6450,
    currency: "INR",
    date: "2026-11-02",
    description: "Executive partner dinner & Q4 roadmap briefing",
    receipt_name: "partner_dinner_invoice.pdf",
    status: "approved",
    submitted_at: "2026-11-03T11:30:00Z",
  },
  {
    id: "exp-103",
    employee_name: "Kabir Mehta",
    employee: "Kabir Mehta",
    category: "training",
    amount: 9200,
    currency: "INR",
    date: "2026-10-22",
    description: "Kubernetes Security & Cloud Architecture certification exam",
    receipt_name: "cncf_exam_receipt.pdf",
    status: "paid",
    paid_at: "2026-10-29T16:00:00Z",
    submitted_at: "2026-10-23T08:45:00Z",
  },
  {
    id: "exp-106",
    employee_name: "Kabir Mehta",
    employee: "Kabir Mehta",
    category: "travel",
    amount: 3850,
    currency: "INR",
    date: "2026-11-06",
    description: "Airport cab & metro pass for Bengaluru customer sprint",
    receipt_name: "uber_blr_nov06.pdf",
    status: "pending",
    submitted_at: "2026-11-07T09:30:00Z",
  },
  {
    id: "exp-107",
    employee_name: "Kabir Mehta",
    employee: "Kabir Mehta",
    category: "meals",
    amount: 2150,
    currency: "INR",
    date: "2026-11-03",
    description: "Late evening deployment dinner with platform team",
    receipt_name: "dinner_bill_nov03.jpg",
    status: "changes-requested",
    manager_note: "Please upload the itemized GST bill instead of the card slip.",
    submitted_at: "2026-11-04T11:15:00Z",
  },
  {
    id: "exp-104",
    employee_name: "Elena Rostova",
    employee: "Elena Rostova",
    category: "lodging",
    amount: 18500,
    currency: "INR",
    date: "2026-10-18",
    description: "2-night hotel stay for Delhi HR compliance summit",
    receipt_name: "hotel_stay_del.pdf",
    status: "paid",
    paid_at: "2026-10-25T14:20:00Z",
    submitted_at: "2026-10-19T10:10:00Z",
  },
  {
    id: "exp-105",
    employee_name: "Priya Nair",
    employee: "Priya Nair",
    category: "supplies",
    amount: 3250,
    currency: "INR",
    date: "2026-11-08",
    description: "USB-C dock and ergonomic peripherals for remote onboarding kit",
    receipt_name: "peripherals_bill.pdf",
    status: "changes-requested",
    manager_note: "Please attach GST tax invoice copy.",
    submitted_at: "2026-11-09T13:05:00Z",
  },
];

const MOCK_ORGANIZATIONS = [
  {
    id: "org-1",
    name: "AURIX AI Enterprise",
    domain: "aurix.ai",
    plan: "Enterprise",
    status: "active",
    access_status: "active",
    payment_status: "paid",
    user_count: 52,
    userCount: 52,
    employee_count: 48,
    employeeCount: 48,
    mrr: 4800,
    hr_admin: { name: "Alex Vance", email: "alex.vance@aurix.ai", phone: "+1 555-0199" },
    created_at: "2025-01-10T08:00:00Z",
    createdAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "org-2",
    name: "NovaTech Robotics",
    domain: "novatech.io",
    plan: "Enterprise",
    status: "active",
    access_status: "active",
    payment_status: "paid",
    user_count: 44,
    userCount: 44,
    employee_count: 40,
    employeeCount: 40,
    mrr: 4200,
    hr_admin: { name: "Priya Nair", email: "priya.nair@novatech.io", phone: "+1 555-0211" },
    created_at: "2025-04-18T10:30:00Z",
    createdAt: "2025-04-18T10:30:00Z",
  },
  {
    id: "org-3",
    name: "Vertex Cloud Systems",
    domain: "vertexcloud.dev",
    plan: "Growth",
    status: "active",
    access_status: "active",
    payment_status: "paid",
    user_count: 34,
    userCount: 34,
    employee_count: 31,
    employeeCount: 31,
    mrr: 2400,
    hr_admin: { name: "Daniel Kim", email: "d.kim@vertexcloud.dev", phone: "+1 555-0345" },
    created_at: "2025-08-05T14:15:00Z",
    createdAt: "2025-08-05T14:15:00Z",
  },
  {
    id: "org-4",
    name: "Helios BioLabs",
    domain: "heliosbio.com",
    plan: "Trial",
    status: "trial",
    access_status: "trial",
    payment_status: "trial",
    user_count: 18,
    userCount: 18,
    employee_count: 15,
    employeeCount: 15,
    mrr: 0,
    hr_admin: { name: "claire.dupont@heliosbio.com", email: "claire.dupont@heliosbio.com", phone: "+1 555-0412" },
    created_at: "2026-10-28T11:00:00Z",
    createdAt: "2026-10-28T11:00:00Z",
  },
];

const MOCK_PLATFORM_USERS = [
  {
    id: "usr-1",
    name: "Alex Vance",
    email: "alex.vance@aurix.ai",
    phone: "+1 555-0199",
    role: "super_admin",
    organization_id: "org-1",
    company_id: "org-1",
    company_name: "AURIX AI Enterprise",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-01-10T08:00:00Z",
    last_login: "2026-11-11T18:30:00Z",
  },
  {
    id: "usr-2",
    name: "Elena Rostova",
    email: "elena.r@aurix.ai",
    phone: "+1 555-0174",
    role: "hr_admin",
    organization_id: "org-1",
    company_id: "org-1",
    company_name: "AURIX AI Enterprise",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-02-14T09:15:00Z",
    last_login: "2026-11-11T16:10:00Z",
  },
  {
    id: "usr-3",
    name: "Sarah Chen",
    email: "sarah.chen@aurix.ai",
    phone: "+1 555-0142",
    role: "manager",
    organization_id: "org-1",
    company_id: "org-1",
    company_name: "AURIX AI Enterprise",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-03-10T10:00:00Z",
    last_login: "2026-11-11T14:45:00Z",
  },
  {
    id: "usr-4",
    name: "Priya Nair",
    email: "priya.nair@novatech.io",
    phone: "+1 555-0211",
    role: "hr_admin",
    organization_id: "org-2",
    company_id: "org-2",
    company_name: "NovaTech Robotics",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-04-18T10:30:00Z",
    last_login: "2026-11-10T21:00:00Z",
  },
  {
    id: "usr-5",
    name: "Marcus Sterling",
    email: "marcus.s@aurix.ai",
    phone: "+1 555-0188",
    role: "employee",
    organization_id: "org-1",
    company_id: "org-1",
    company_name: "AURIX AI Enterprise",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-06-01T11:20:00Z",
    last_login: "2026-11-11T12:05:00Z",
  },
  {
    id: "usr-6",
    name: "Daniel Kim",
    email: "d.kim@vertexcloud.dev",
    phone: "+1 555-0345",
    role: "hr_admin",
    organization_id: "org-3",
    company_id: "org-3",
    company_name: "Vertex Cloud Systems",
    status: "Active",
    is_active: true,
    is_verified: true,
    created_at: "2025-08-05T14:15:00Z",
    last_login: "2026-11-09T19:20:00Z",
  },
];

const MOCK_AUDIT_LOGS = [
  {
    id: "aud-1",
    timestamp: "2026-11-11T22:15:00Z",
    actorEmail: "alex.vance@aurix.ai",
    action: "organization.subscription.verified",
    organizationId: "org-1",
    details: "Enterprise tier entitlements verified for AURIX AI Enterprise",
  },
  {
    id: "aud-2",
    timestamp: "2026-11-11T19:40:00Z",
    actorEmail: "elena.r@aurix.ai",
    action: "payroll.cycle.approved",
    organizationId: "org-1",
    details: "Approved November payroll disbursement batch for 48 employees",
  },
  {
    id: "aud-3",
    timestamp: "2026-11-11T15:10:00Z",
    actorEmail: "priya.nair@novatech.io",
    action: "user.role.updated",
    organizationId: "org-2",
    details: "Promoted 2 team leads to Department Manager role",
  },
  {
    id: "aud-4",
    timestamp: "2026-11-10T23:05:00Z",
    actorEmail: "alex.vance@aurix.ai",
    action: "platform.settings.updated",
    organizationId: null,
    details: "Updated global MFA policy and AI token hourly rate limits",
  },
];

let platformSettingsState: Record<string, string | number | boolean> = {
  emailSenderName: "OFC360 Enterprise HR",
  emailSenderAddress: "notifications@ofc360.com",
  securityAlertEmail: "security@ofc360.com",
  allowNewRegistrations: true,
  enforceMfaGlobally: true,
  sessionTimeoutMinutes: 120,
  defaultTrialDays: 14,
  maintenanceMode: false,
  aiTokenRateLimitPerHour: 250000,
  autoBackupIntervalHours: 6,
};

export function buildMockPayload(rawUrl: string, method = "GET", reqData?: any, params?: any): any {
  const url = normalizeApiPath(rawUrl || "").toLowerCase();
  const upperMethod = (method || "GET").toUpperCase();

  // ─── Authentication Endpoints ──────────────────────────────────────────
  if (url.includes("/auth/login")) {
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};
    const rawEmail = String(body.identifier || body.email || "employee@aurix.ai").trim().toLowerCase();

    const matchedEmp = MOCK_EMPLOYEES.find(
      (e) =>
        String(e.company_email || "").toLowerCase() === rawEmail ||
        String(e.personal_email || "").toLowerCase() === rawEmail ||
        String(e.email || "").toLowerCase() === rawEmail,
    );

    let matchedUser = matchedEmp
      ? {
          id: String(matchedEmp.id),
          name: String(matchedEmp.full_name || matchedEmp.name || "Employee"),
          email: String(matchedEmp.company_email || matchedEmp.email || rawEmail),
          phone: String(matchedEmp.phone || "+91 98201 11223"),
          role: String(matchedEmp.role || "employee"),
          is_verified: true,
          onboarding_completed: true,
          company_id: "org-1",
          company_name: "AURIX AI Enterprise",
        }
      : {
          id: "emp-3",
          name: "Marcus Sterling",
          email: rawEmail || "employee@aurix.ai",
          phone: "+91 98201 10003",
          role: "employee",
          is_verified: true,
          onboarding_completed: true,
          company_id: "org-1",
          company_name: "AURIX AI Enterprise",
        };

    if (!matchedEmp) {
      if (rawEmail.includes("hr") || rawEmail.includes("admin") || rawEmail.includes("alex")) {
        matchedUser = {
          id: "emp-1",
          name: "Alex Vance",
          email: rawEmail,
          phone: "+91 98201 10001",
          role: rawEmail.includes("super") ? "super_admin" : "hr_admin",
          is_verified: true,
          onboarding_completed: true,
          company_id: "org-1",
          company_name: "AURIX AI Enterprise",
        };
      } else if (rawEmail.includes("manager") || rawEmail.includes("sarah")) {
        matchedUser = {
          id: "emp-2",
          name: "Sarah Chen",
          email: rawEmail,
          phone: "+91 98201 10002",
          role: "manager",
          is_verified: true,
          onboarding_completed: true,
          company_id: "org-1",
          company_name: "AURIX AI Enterprise",
        };
      }
    }

    const tokenPayload = btoa(
      JSON.stringify({
        sub: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role,
        company_name: matchedUser.company_name,
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      }),
    );
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenPayload}.mock_sig`;

    return {
      access_token: accessToken,
      accessToken,
      refresh_token: "mock_refresh_token_aurix",
      refreshToken: "mock_refresh_token_aurix",
      user: matchedUser,
    };
  }

  if (url.includes("/auth/register")) {
    markHrOnboardingCompletedInStorage(false);
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};
    return {
      success: true,
      message: "Registration successful! Please verify your email.",
      user: {
        id: `usr-${Date.now()}`,
        name: body.name || "HR Admin",
        email: body.email || "hr@company.com",
        role: "hr_admin",
        company_name: body.company_name || "Workspace",
        is_verified: false,
        onboarding_completed: false,
      },
    };
  }

  // ─── Super Admin Endpoints ─────────────────────────────────────────────
  if (url.includes("/super-admin/statistics") || url.includes("/super-admin/dashboard")) {
    return {
      kpis: {
        total_organizations: MOCK_ORGANIZATIONS.length,
        active_organizations: 3,
        total_users: 148,
        total_hr_admins: 14,
        total_employees: 112,
        total_managers: 15,
        total_executives: 4,
        total_it_admins: 2,
        total_super_admins: 1,
        active_users: 142,
        inactive_users: 6,
        paid_organizations: 3,
        complimentary_organizations: 0,
        free_organizations: 0,
        trial_organizations: 1,
        suspended_organizations: 0,
        expired_organizations: 0,
        total_employees_count: 134,
        total_workforce_managed: 134,
        active_security_incidents: 0,
        dau: 96,
        mau: 142,
      },
      financials: {
        total_revenue: 136800,
        mrr: 11400,
        arr: 136800,
        monthly_recurring_revenue: 11400,
        annual_recurring_revenue: 136800,
        revenue_growth: 14.8,
        pending_payments: 0,
        failed_payments: 0,
      },
      charts: {
        revenue_trend: [
          { month: "Jun", revenue: 8800, mrr: 8800 },
          { month: "Jul", revenue: 9400, mrr: 9400 },
          { month: "Aug", revenue: 9900, mrr: 9900 },
          { month: "Sep", revenue: 10500, mrr: 10500 },
          { month: "Oct", revenue: 11000, mrr: 11000 },
          { month: "Nov", revenue: 11400, mrr: 11400 },
        ],
        subscription_distribution: [
          { plan: "Enterprise", count: 2 },
          { plan: "Growth", count: 1 },
          { plan: "Trial", count: 1 },
        ],
        status_distribution: [
          { name: "Active", value: 3, color: "#10b981" },
          { name: "Trial", value: 1, color: "#3b82f6" },
        ],
      },
      unpaid_active_customers: [],
    };
  }

  if (url.includes("/super-admin/system-health")) {
    return {
      status: "ONLINE",
      services: [
        { name: "PostgreSQL Primary Cluster", status: "ONLINE", response_time: "4ms", is_healthy: true, latency: "4ms" },
        { name: "Redis Cache & Session Store", status: "ONLINE", response_time: "2ms", is_healthy: true, latency: "2ms" },
        { name: "OFC360 Neural AI Engine", status: "ONLINE", response_time: "14ms", is_healthy: true, latency: "14ms" },
        { name: "Realtime Event Bus", status: "ONLINE", response_time: "3ms", is_healthy: true, latency: "3ms" },
      ],
    };
  }

  if (url.includes("/super-admin/organizations")) {
    if (upperMethod === "POST" && !url.includes("/access/")) {
      const created = {
        id: `org-${Date.now()}`,
        name: reqData?.name || "New Organization",
        domain: reqData?.domain || "company.com",
        plan: reqData?.plan || "Enterprise",
        status: reqData?.status || "active",
        userCount: 1,
        employeeCount: reqData?.employeeCount || 10,
        hr_admin: {
          name: reqData?.hrAdminName || "HR Admin",
          email: reqData?.hrAdminEmail || "hr@company.com",
        },
        created_at: new Date().toISOString(),
      };
      return created;
    }
    if (upperMethod !== "GET") {
      return { success: true, message: "Organization updated successfully." };
    }
    const page = Number(params?.page ?? 1);
    if (page > 1) {
      return { items: [], total: MOCK_ORGANIZATIONS.length };
    }
    const matchDetail = /\/super-admin\/organizations\/([^/?]+)/.exec(url);
    if (matchDetail) {
      const org = MOCK_ORGANIZATIONS.find((o) => o.id === matchDetail[1]) || MOCK_ORGANIZATIONS[0];
      return {
        id: org.id,
        name: org.name,
        domain: org.domain,
        hr_admin: org.hr_admin,
        primaryHrAdmin: org.hr_admin,
        hr_admins: [org.hr_admin],
        owner: org.hr_admin,
        subscription: {
          plan: org.plan,
          access_status: org.access_status,
          access_type: "subscription",
          payment_status: org.payment_status,
          access_source: "stripe",
          access_granted_by: "system",
          access_granted_at: org.created_at,
          access_expires_at: null,
          access_grant_reason: null,
          mrr: org.mrr,
        },
        stats: {
          user_count: org.userCount,
          employee_count: org.employeeCount,
          employeeCount: org.employeeCount,
          total_spent: org.mrr * 12,
        },
        users: MOCK_PLATFORM_USERS.filter((u) => u.organization_id === org.id),
        audit_logs: MOCK_AUDIT_LOGS,
      };
    }
    return { items: MOCK_ORGANIZATIONS, total: MOCK_ORGANIZATIONS.length };
  }

  if (url.includes("/super-admin/users") || url.includes("/super-admin/hr-admins")) {
    if (upperMethod === "POST" && (url.endsWith("/users") || url.endsWith("/hr-admins"))) {
      return {
        id: `usr-${Date.now()}`,
        name: reqData?.name || "New Platform User",
        email: reqData?.email || "user@aurix.ai",
        phone: reqData?.phone || "+1 555-0100",
        role: reqData?.role || (url.includes("hr-admins") ? "hr_admin" : "employee"),
        organization_id: reqData?.organization_id || reqData?.companyId || "org-1",
        company_name: "AURIX AI Enterprise",
        status: "Active",
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
      };
    }
    if (upperMethod !== "GET") {
      return { success: true, is_active: true, message: "User status updated successfully." };
    }
    const page = Number(params?.page ?? 1);
    if (page > 1) {
      return { items: [], total: MOCK_PLATFORM_USERS.length };
    }
    let filtered = [...MOCK_PLATFORM_USERS];
    if (url.includes("/hr-admins")) {
      filtered = filtered.filter((u) => u.role === "hr_admin");
    } else if (params?.role) {
      filtered = filtered.filter((u) => u.role === String(params.role).toLowerCase());
    }
    return { items: filtered, total: filtered.length };
  }

  if (url.includes("/super-admin/audit-logs")) {
    if (upperMethod === "DELETE") {
      return { success: true, message: "Audit logs pruned successfully." };
    }
    const page = Number(params?.page ?? 1);
    if (page > 1) {
      return { items: [], total: MOCK_AUDIT_LOGS.length };
    }
    return { items: MOCK_AUDIT_LOGS, total: MOCK_AUDIT_LOGS.length };
  }

  if (url.includes("/super-admin/settings")) {
    if (upperMethod === "PATCH" || upperMethod === "PUT") {
      const incoming = typeof reqData === "string" ? JSON.parse(reqData) : reqData || {};
      platformSettingsState = { ...platformSettingsState, ...incoming };
      return { settings: { ...platformSettingsState } };
    }
    return { ...platformSettingsState };
  }

  if (url.includes("/super-admin/security/sessions")) {
    if (upperMethod !== "GET") {
      return { success: true, message: "Session terminated." };
    }
    return {
      items: [
        {
          id: "sess-1",
          userName: "Alex Vance",
          userEmail: "alex.vance@aurix.ai",
          ipAddress: "192.0.2.14",
          location: "San Francisco, US",
          browser: "Chrome 131",
          os: "macOS Sequoia",
          startedAt: "2026-11-11T20:00:00Z",
          status: "active",
        },
        {
          id: "sess-2",
          userName: "Elena Rostova",
          userEmail: "elena.r@aurix.ai",
          ipAddress: "198.51.100.42",
          location: "New York, US",
          browser: "Safari 18",
          os: "macOS Sequoia",
          startedAt: "2026-11-11T18:30:00Z",
          status: "active",
        },
      ],
    };
  }

  if (url.includes("/super-admin/security/events") || url.includes("/super-admin/security/alerts")) {
    return [
      {
        id: "sec-1",
        timestamp: "2026-11-11T14:20:00Z",
        type: "MFA Policy Verification",
        severity: "LOW",
        sourceIp: "192.0.2.14",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        details: "Scheduled hardware key attestation completed across admin accounts.",
        status: "Resolved",
      },
    ];
  }

  if (url.includes("/super-admin/security")) {
    return {
      security_score: 98,
      active_sessions_count: 2,
      jwt_algorithm: "RS256",
      mfa_enforced: true,
      failed_logins_24h: 0,
    };
  }

  if (url.includes("/super-admin/subscriptions")) {
    return [
      {
        id: "sub-1",
        companyId: "org-1",
        companyName: "AURIX AI Enterprise",
        plan: "Enterprise",
        billingCycle: "Monthly",
        amount: 4800,
        nextBillingDate: "2026-12-01",
        status: "active",
        activeLicenses: 48,
        maxLicenses: 100,
        autoRenew: true,
      },
      {
        id: "sub-2",
        companyId: "org-2",
        companyName: "NovaTech Robotics",
        plan: "Enterprise",
        billingCycle: "Monthly",
        amount: 4200,
        nextBillingDate: "2026-12-01",
        status: "active",
        activeLicenses: 40,
        maxLicenses: 100,
        autoRenew: true,
      },
    ];
  }

  if (url.includes("/super-admin/plans")) {
    return [
      { id: "plan-starter", name: "Starter", price: 900, billing_cycle: "monthly", max_employees: 25, is_active: true },
      { id: "plan-growth", name: "Growth", price: 2400, billing_cycle: "monthly", max_employees: 100, is_active: true },
      { id: "plan-enterprise", name: "Enterprise", price: 4800, billing_cycle: "monthly", max_employees: 500, is_active: true },
    ];
  }

  if (url.includes("/super-admin/entitlements")) {
    return {
      payroll_enabled: true,
      ai_copilot_enabled: true,
      face_attendance_enabled: true,
      advanced_analytics_enabled: true,
      multi_org_enabled: true,
    };
  }

  if (url.includes("/super-admin/billing")) {
    return [
      {
        id: "inv-101",
        amount: 4800,
        currency: "USD",
        gateway: "Stripe",
        invoice_number: "INV-2026-1101",
        status: "Paid",
        organization_name: "AURIX AI Enterprise",
        companyName: "AURIX AI Enterprise",
        payment_date: "2026-11-01",
      },
      {
        id: "inv-102",
        amount: 4200,
        currency: "USD",
        gateway: "Stripe",
        invoice_number: "INV-2026-1102",
        status: "Paid",
        organization_name: "NovaTech Robotics",
        companyName: "NovaTech Robotics",
        payment_date: "2026-11-01",
      },
    ];
  }

  if (url.includes("/super-admin/onboarding")) {
    return [
      {
        id: "onb-1",
        companyName: "Helios BioLabs",
        contactName: "Claire Dupont",
        email: "claire.dupont@heliosbio.com",
        tier: "Enterprise Trial",
        progressPercentage: 80,
        currentStep: "Payroll Configuration",
        status: "in_progress",
        submittedAt: "2026-10-28T11:00:00Z",
        notes: "Migrating 15 employees from legacy HR sheets",
      },
    ];
  }

  if (url.includes("/super-admin/analytics/ai-usage")) {
    return {
      tokens_consumed_24h: 142800,
      total_prompts: 640,
      active_ai_users: 38,
      quota_remaining: 857200,
    };
  }

  if (url.includes("/super-admin/analytics")) {
    return {
      module_usage: [
        { name: "Workforce & Directory", usage: 96 },
        { name: "Payroll & Compliance", usage: 92 },
        { name: "Attendance & Shifts", usage: 89 },
        { name: "AI Copilot & Insights", usage: 84 },
        { name: "Recruitment & ATS", usage: 78 },
      ],
      storage: {
        total_used_gb: 42.8,
        total_allocated_gb: 500,
        documents_count: 1840,
      },
    };
  }

  if (url.includes("/super-admin/announcements")) {
    return [
      {
        id: "sa-ann-1",
        title: "OFC360 v2.4 Enterprise Release Deployed",
        content: "Next-generation AI Workforce Planning and zero-latency Payroll Analytics are now live across all tenants.",
        target_audience: "all",
        created_at: "2026-11-10T09:00:00Z",
      },
    ];
  }

  // ─── Connect / Collaboration Endpoints ─────────────────────────────────
  if (url.includes("/connect/calls/ice-servers")) {
    return {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      ice_servers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
  }
  if (url.includes("/connect/colleagues")) {
    return { items: MOCK_EMPLOYEES, colleagues: MOCK_EMPLOYEES, total: MOCK_EMPLOYEES.length };
  }
  if (url.includes("/connect/channels")) {
    return {
      items: [
        { id: "ch-general", name: "general", description: "Company-wide announcements and team updates", is_private: false, member_count: 48, unread_count: 0 },
        { id: "ch-eng", name: "engineering", description: "Architecture, releases & platform engineering", is_private: false, member_count: 22, unread_count: 2 },
        { id: "ch-people", name: "people-ops", description: "HR policies, culture & onboarding", is_private: false, member_count: 14, unread_count: 0 },
      ],
    };
  }
  if (url.includes("/connect/conversations")) {
    return { items: [] };
  }
  if (url.includes("/connect/meetings")) {
    return { items: [] };
  }
  if (url.includes("/connect/notifications")) {
    return { items: [] };
  }
  if (url.includes("/connect/files")) {
    return { items: [] };
  }
  if (url.includes("/connect/calls/history")) {
    return { items: [] };
  }

  // ─── HR Admin & Employee Onboarding Endpoints ──────────────────────────
  if (url.includes("/onboarding/validate")) {
    const queryObj = new URLSearchParams(rawUrl.split("?")[1] || "");
    const inviteToken = String(params?.token || queryObj.get("token") || "").trim();
    if (inviteToken && isInviteTokenActivated(inviteToken)) {
      return {
        success: false,
        already_activated: true,
        onboarding_completed: true,
        message: "Onboarding already completed. This invitation link has already been used.",
      };
    }
    return {
      employee_id: "EMP-3655",
      first_name: "Kabir",
      last_name: "Mehta",
      personal_email: "kabir.mehta@ofc360.com",
      phone: "+91 98201 11223",
      department: "Engineering",
      designation: "Senior Software Engineer",
      joining_date: "2026-11-15",
    };
  }
  if (url.includes("/onboarding/activate")) {
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};
    const inviteToken = String(body.token || params?.token || "").trim();
    if (inviteToken && isInviteTokenActivated(inviteToken)) {
      return {
        success: false,
        already_activated: true,
        onboarding_completed: true,
        message: "Account already activated. Onboarding can only be completed once.",
      };
    }
    if (inviteToken) {
      markInviteTokenActivated(inviteToken);
    }
    return {
      access_token: "mock_emp_access_token",
      refresh_token: "mock_emp_refresh_token",
      user: {
        id: "emp-kabir",
        fullName: "Kabir Mehta",
        email: "kabir.mehta@ofc360.com",
        role: "employee",
        emailVerified: true,
        onboardingComplete: true,
        onboarding_completed: true,
      },
    };
  }
  if (url.includes("/onboarding/status")) {
    const completed = isHrOnboardingCompletedInStorage();
    return {
      current_step: completed ? 5 : 1,
      onboarding_completed: completed,
    };
  }
  if (url.includes("/onboarding/progress")) {
    const completed = isHrOnboardingCompletedInStorage();
    return {
      current_step: completed ? 5 : 1,
      onboarding_completed: completed,
      company_profile: {
        company_name: "AURIX AI Enterprise",
        industry: "Software & AI",
        company_size: "51–200",
        email: "hello@aurix.ai",
        phone: "+91 98201 10001",
        website: "https://aurix.ai",
        address: "Prestige Tech Park, Outer Ring Road",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        timezone: "Asia/Kolkata",
      },
    };
  }
  if (url.includes("/onboarding/")) {
    const isCompleting = url.includes("/complete");
    if (isCompleting) {
      markHrOnboardingCompletedInStorage(true);
    }
    return {
      success: true,
      onboarding_completed: isCompleting || isHrOnboardingCompletedInStorage(),
    };
  }

  // ─── Employee DigiLocker Document Verification Endpoints ───────────────
  if (url.includes("/employee/document-verification/digilocker/initiate")) {
    return {
      authorizationUrl: "/verify-documents/callback?code=dl_auth_code_verified&state=dl_state_verified",
    };
  }
  if (url.includes("/employee/document-verification/digilocker/callback")) {
    return {
      status: "VERIFIED",
      verifiedAt: new Date().toISOString(),
      documents: [
        { id: "aadhaar", status: "VERIFIED" },
        { id: "pan", status: "VERIFIED" },
        { id: "driving_licence", status: "VERIFIED" },
        { id: "education_certificate", status: "VERIFIED" },
      ],
    };
  }
  if (url.includes("/employee/document-verification/status")) {
    return {
      status: "NOT_STARTED",
      documents: [],
    };
  }

  // ─── Core HRMS Endpoints ───────────────────────────────────────────────
  if (url.includes("/departments")) {
    return { items: MOCK_DEPARTMENTS, total: MOCK_DEPARTMENTS.length };
  }
  if (url.includes("/hierarchy")) {
    return {
      total_nodes: 48,
      growth_mom: 8.4,
      history: [
        { month: "Jun", headcount: 38 },
        { month: "Jul", headcount: 40 },
        { month: "Aug", headcount: 42 },
        { month: "Sep", headcount: 44 },
        { month: "Oct", headcount: 46 },
        { month: "Nov", headcount: 48 },
      ],
      nodes: MOCK_EMPLOYEES,
    };
  }
  if (url.includes("/jobs")) {
    return { items: MOCK_JOBS, total: MOCK_JOBS.length };
  }
  if (url.includes("/assets")) {
    return { items: MOCK_ASSETS, total: MOCK_ASSETS.length };
  }
  if (url.includes("/exits")) {
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};
    const singleMatch = /\/exits\/([^/?]+)$/.exec(url);
    if (singleMatch) {
      const targetId = singleMatch[1];
      if (upperMethod === "DELETE") {
        MOCK_EXITS = MOCK_EXITS.filter((ex) => String(ex.id).toLowerCase() !== targetId);
        return { success: true };
      }
      if (upperMethod === "PATCH" || upperMethod === "PUT") {
        let updated: Record<string, any> | undefined;
        MOCK_EXITS = MOCK_EXITS.map((ex) => {
          if (String(ex.id).toLowerCase() !== targetId) return ex;
          updated = { ...ex, ...body, id: ex.id };
          return updated;
        });
        return updated || { success: true };
      }
      const found = MOCK_EXITS.find((ex) => String(ex.id).toLowerCase() === targetId);
      return found || MOCK_EXITS[0];
    }

    if (upperMethod === "POST") {
      const created = {
        id: body.id && !String(body.id).startsWith("ex-") ? body.id : `ext-${Date.now()}`,
        employee: body.employee || body.employee_name || "Employee",
        employee_name: body.employee || body.employee_name || "Employee",
        employeeId: body.employeeId || body.employee_id || "EMP-NEW",
        role: body.role || "Employee",
        dept: body.dept || body.department || "Operations",
        department: body.dept || body.department || "Operations",
        manager: body.manager || "Alex Vance",
        resignDate: body.resignDate || body.resignation_date || new Date().toISOString().slice(0, 10),
        resignation_date: body.resignDate || body.resignation_date || new Date().toISOString().slice(0, 10),
        lastWorkingDay: body.lastWorkingDay || body.exit_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        exit_date: body.lastWorkingDay || body.exit_date || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        noticeDays: Number(body.noticeDays ?? 30),
        reason: body.reason || "Personal reasons",
        handoverNotes: body.handoverNotes || "",
        stage: body.stage || "Resignation Submitted",
        status: body.status || "RESIGNATION_SUBMITTED",
        isResignationApproved: Boolean(body.isResignationApproved),
        assetsToReturn: Array.isArray(body.assetsToReturn) ? body.assetsToReturn : [],
        clearances: Array.isArray(body.clearances)
          ? body.clearances
          : [
              { dept: "Manager Handover", owner: body.manager || "Reporting Manager", status: "Pending" },
              { dept: "IT & Assets", owner: "IT Desk", status: "Pending" },
              { dept: "Finance Settlement", owner: "Payroll Team", status: "Pending" },
              { dept: "HR Operations", owner: "Elena Rostova", status: "Pending" },
            ],
        settlement: body.settlement || {
          baseSalaryEarned: 0,
          leaveEncashment: 0,
          bonusProrata: 0,
          incentives: 0,
          taxDeduction: 0,
          recoveryAmount: 0,
          netPayable: 0,
          paymentStatus: "Pending",
        },
        interview: body.interview || { status: "Pending", rating: 0, feedback: "", attritionReason: body.reason || "Voluntary" },
        deactivated: Boolean(body.deactivated),
        timeline: Array.isArray(body.timeline)
          ? body.timeline
          : [{ id: `tl-${Date.now()}`, time: new Date().toISOString().slice(0, 10), label: "Resignation Submitted", by: body.employee || "Employee" }],
      };
      MOCK_EXITS = [created, ...MOCK_EXITS];
      return created;
    }

    return { items: MOCK_EXITS, total: MOCK_EXITS.length };
  }
  if (url.includes("/timesheets")) {
    const queryObj = new URLSearchParams(rawUrl.split("?")[1] || "");
    const weekStart = String(params?.week_start_date || queryObj.get("week_start_date") || DEFAULT_WEEK_DATE);

    const reviewMatch = /\/timesheets\/([^/?]+)\/review/.exec(url);
    if (reviewMatch && upperMethod === "POST") {
      const targetId = reviewMatch[1];
      const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};
      const nextStatus = String(body.status || "APPROVED").toUpperCase();
      MOCK_PENDING_TIMESHEETS = MOCK_PENDING_TIMESHEETS.map((item) =>
        String(item.id).toLowerCase() === targetId
          ? { ...item, status: nextStatus, rejection_reason: body.rejection_reason || null }
          : item,
      );
      return { success: true, status: nextStatus };
    }

    if (url.includes("/timesheets/weekly/submit") && upperMethod === "POST") {
      const current = MOCK_WEEKLY_TIMESHEETS[weekStart] || {
        id: `ts-${weekStart}`,
        week_start_date: weekStart,
        status: "DRAFT",
        entries: [],
      };
      const submitted = {
        ...current,
        status: "PENDING",
        submitted_at: new Date().toISOString(),
        approved_by_id: null,
      };
      MOCK_WEEKLY_TIMESHEETS[weekStart] = submitted;
      if (!MOCK_PENDING_TIMESHEETS.some((p) => p.week_start_date === weekStart)) {
        MOCK_PENDING_TIMESHEETS = [
          {
            id: submitted.id,
            employee: { fullName: "Kabir Mehta", department: "Engineering" },
            week_start_date: weekStart,
            status: "PENDING",
            entries: submitted.entries,
          },
          ...MOCK_PENDING_TIMESHEETS,
        ];
      }
      return submitted;
    }

    if (url.includes("/timesheets/weekly")) {
      if (upperMethod === "POST") {
        const entries = typeof reqData === "string" ? JSON.parse(reqData || "[]") : reqData || [];
        const normalizedEntries = Array.isArray(entries)
          ? entries.map((e: any, idx: number) => ({ id: e.id || `ts-row-${Date.now()}-${idx}`, ...e }))
          : [];
        const saved = {
          id: MOCK_WEEKLY_TIMESHEETS[weekStart]?.id || `ts-${weekStart}`,
          week_start_date: weekStart,
          status: "DRAFT",
          entries: normalizedEntries,
          approved_by_id: null,
        };
        MOCK_WEEKLY_TIMESHEETS[weekStart] = saved;
        return saved;
      }
      return (
        MOCK_WEEKLY_TIMESHEETS[weekStart] || {
          id: `ts-${weekStart}`,
          week_start_date: weekStart,
          status: "DRAFT",
          entries: [],
        }
      );
    }

    if (url.includes("/timesheets/history")) {
      const historyList = Object.values(MOCK_WEEKLY_TIMESHEETS);
      return { items: historyList, total: historyList.length };
    }

    if (url.includes("/timesheets/pending")) {
      return { items: MOCK_PENDING_TIMESHEETS, total: MOCK_PENDING_TIMESHEETS.length };
    }

    if (url.includes("/timesheets/ai-suggest")) {
      return [
        {
          id: `ai-row-${Date.now()}`,
          projectId: "proj_engineering",
          hours: [8, 8, 8, 8, 6, 0, 0],
          description: "Synced commits & sprint standup tasks",
        },
      ];
    }
  }
  if (url.includes("/internal/dashboard")) {
    return {
      pinned_announcements: [
        { id: "ann-1", title: "Q4 Strategic Townhall & AI Roadmap", author_name: "Alex Vance" },
        { id: "ann-2", title: "Annual Performance Appraisal Window Open", author_name: "Elena Rostova" },
      ],
      news_articles: [
        { id: "news-1", title: "Engineering deploys next-gen inference cluster", author_name: "Marcus Sterling" },
      ],
    };
  }
  if (url.includes("/payroll/salary-structures")) {
    return {
      items: [
        { id: "ss-1", name: "Executive Band", gross_salary: 1450000 },
        { id: "ss-2", name: "Senior Engineering Band", gross_salary: 1850000 },
        { id: "ss-3", name: "Product & Ops Band", gross_salary: 950000 },
      ],
    };
  }
  if (url.includes("/payroll/dashboard")) {
    return {
      summary: {
        total_gross: 4250000,
        processed_count: 45,
        paid_count: 42,
        pending_count: 3,
      },
      recent_runs: [
        { id: "run-9", period_name: "Sep", gross_payroll: 3980000 },
        { id: "run-10", period_name: "Oct", gross_payroll: 4120000 },
        { id: "run-11", period_name: "Nov", gross_payroll: 4250000 },
      ],
    };
  }
  if (url.includes("/employees")) {
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};

    if (upperMethod === "POST" && (url.endsWith("/employees") || url.includes("/employees?"))) {
      const firstName = String(body.first_name || "").trim();
      const lastName = String(body.last_name || "").trim();
      const fullName = `${firstName} ${lastName}`.trim() || String(body.full_name || "New Employee");
      const empCode = String(body.employee_id || body.employee_code || `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
      const companyEmail = String(body.company_email || body.email || body.personal_email || "");
      const personalEmail = String(body.personal_email || body.email || companyEmail);
      const sendInvite = body.send_onboarding_invite !== undefined ? Boolean(body.send_onboarding_invite) : true;
      const newEmp: Record<string, any> = {
        id: `emp-${Date.now()}`,
        user_id: `emp-${Date.now()}`,
        employee_id: empCode,
        employee_code: empCode,
        employeeId: empCode,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        fullName,
        name: fullName,
        email: companyEmail || personalEmail,
        company_email: companyEmail,
        personal_email: personalEmail,
        phone: String(body.phone || ""),
        gender: String(body.gender || "Male"),
        date_of_birth: String(body.date_of_birth || ""),
        department: String(body.department || "Engineering"),
        department_name: String(body.department || "Engineering"),
        designation: String(body.designation || "Software Engineer"),
        manager_name: String(body.manager_name || body.reporting_manager_name || "Alex Vance"),
        reporting_manager_name: String(body.reporting_manager_name || body.manager_name || "Alex Vance"),
        joining_date: String(body.joining_date || new Date().toISOString().split("T")[0]),
        employment_type: String(body.employment_type || "Full-time"),
        work_mode: String(body.work_mode || "Office / On-Site"),
        probation_period_months: body.probation_period_months !== undefined ? Number(body.probation_period_months) : 3,
        shift: String(body.shift || "General Shift (09:30 - 18:30)"),
        office_location: String(body.office_location || body.work_location || "Bengaluru · Global HQ"),
        work_location: String(body.work_location || body.office_location || "Bengaluru · Global HQ"),
        location: String(body.office_location || body.work_location || "Bengaluru · Global HQ"),
        ctc: String(body.ctc || "₹12,00,000 / year"),
        salary: body.salary || 100000,
        role: String(body.role || "employee"),
        send_onboarding_invite: sendInvite,
        status: sendInvite ? "INVITED" : "ACTIVE",
        presence_status: "online",
        activation_token: sendInvite ? `onb_${Date.now()}` : undefined,
        activation_token_expires_at: sendInvite
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
        created_at: new Date().toISOString(),
      };
      MOCK_EMPLOYEES = [newEmp, ...MOCK_EMPLOYEES];
      return newEmp;
    }

    const actionMatch = /\/employees\/([^/?]+)\/(deactivate|activate-by-admin|send-invite|reset-password)/.exec(url);
    if (actionMatch && upperMethod === "POST") {
      const targetId = actionMatch[1];
      const actionType = actionMatch[2];
      MOCK_EMPLOYEES = MOCK_EMPLOYEES.map((emp) => {
        if (String(emp.id).toLowerCase() !== targetId) return emp;
        if (actionType === "deactivate") return { ...emp, status: "DISABLED" };
        if (actionType === "activate-by-admin") return { ...emp, status: "ACTIVE" };
        if (actionType === "send-invite") {
          return {
            ...emp,
            status: "INVITED",
            activation_token: `onb_${Date.now()}`,
            activation_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }
        return emp;
      });
      return { success: true };
    }

    const idMatch = /\/employees\/([^/?]+)$/.exec(url);
    if (idMatch) {
      const targetId = idMatch[1];
      if (upperMethod === "PUT" || upperMethod === "PATCH") {
        MOCK_EMPLOYEES = MOCK_EMPLOYEES.map((emp) => {
          if (String(emp.id).toLowerCase() !== targetId) return emp;
          const firstName = body.first_name !== undefined ? String(body.first_name).trim() : emp.first_name;
          const lastName = body.last_name !== undefined ? String(body.last_name).trim() : emp.last_name;
          const fullName = `${firstName || ""} ${lastName || ""}`.trim() || body.full_name || emp.full_name;
          const empCode = body.employee_id || body.employee_code || emp.employee_id;
          return {
            ...emp,
            ...body,
            employee_id: empCode,
            employee_code: empCode,
            employeeId: empCode,
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            fullName,
            name: fullName,
            email: body.company_email || body.personal_email || emp.email,
            updated_at: new Date().toISOString(),
          };
        });
        return MOCK_EMPLOYEES.find((e) => String(e.id).toLowerCase() === targetId) || { success: true };
      }
      if (upperMethod === "DELETE") {
        MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter((emp) => String(emp.id).toLowerCase() !== targetId);
        return { success: true };
      }
      if (upperMethod === "GET") {
        const found = MOCK_EMPLOYEES.find((emp) => String(emp.id).toLowerCase() === targetId);
        return found || MOCK_EMPLOYEES[0];
      }
    }

    // GET /employees list with optional query params
    const queryObj = new URLSearchParams(rawUrl.split("?")[1] || "");
    const search = (params?.search || queryObj.get("search") || "").toLowerCase().trim();
    const dept = (params?.department || queryObj.get("department") || "all").toLowerCase();
    const roleFilter = (params?.role || queryObj.get("role") || "all").toLowerCase();

    let filtered = [...MOCK_EMPLOYEES];
    if (search) {
      filtered = filtered.filter(
        (e) =>
          String(e.full_name || "").toLowerCase().includes(search) ||
          String(e.company_email || "").toLowerCase().includes(search) ||
          String(e.personal_email || "").toLowerCase().includes(search) ||
          String(e.employee_id || "").toLowerCase().includes(search) ||
          String(e.designation || "").toLowerCase().includes(search),
      );
    }
    if (dept && dept !== "all") {
      filtered = filtered.filter((e) => String(e.department || "").toLowerCase() === dept);
    }
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter((e) => String(e.role || "").toLowerCase() === roleFilter);
    }

    return {
      items: filtered,
      total: filtered.length,
      page: 1,
      limit: 50,
      pages: 1,
      total_pages: 1,
      has_next: false,
      has_previous: false,
    };
  }
  if (url.includes("/managers")) {
    const managers = MOCK_EMPLOYEES.filter((e) => e.role === "manager" || e.role === "hr_admin" || e.role === "executive");
    return { items: managers.length > 0 ? managers : MOCK_EMPLOYEES.slice(0, 2), total: managers.length || 2 };
  }
  if (url.includes("/leaves")) {
    return {
      items: [
        { id: "lv-1", employee_name: "Marcus Sterling", leave_type: "Annual Leave", start_date: "2026-11-20", end_date: "2026-11-22", days: 3, status: "pending", reason: "Family trip" },
      ],
      balances: [
        { leave_type: "Annual Leave", total: 20, used: 6, available: 14 },
        { leave_type: "Sick Leave", total: 12, used: 2, available: 10 },
      ],
      total: 1,
    };
  }
  if (url.includes("/expenses")) {
    const body = typeof reqData === "string" ? JSON.parse(reqData || "{}") : reqData || {};

    const actionMatch = /\/expenses\/([^/?]+)\/(approve|reject|request-changes|mark-paid|status)/.exec(url);
    if (actionMatch && (upperMethod === "POST" || upperMethod === "PATCH" || upperMethod === "PUT")) {
      const targetId = actionMatch[1];
      const action = actionMatch[2];
      let updatedItem: Record<string, any> | undefined;
      MOCK_EXPENSES = MOCK_EXPENSES.map((exp) => {
        if (String(exp.id).toLowerCase() !== targetId) return exp;
        if (action === "approve") {
          updatedItem = { ...exp, status: "approved" };
        } else if (action === "reject") {
          updatedItem = { ...exp, status: "rejected" };
        } else if (action === "request-changes") {
          updatedItem = {
            ...exp,
            status: "changes-requested",
            manager_note: body.note || body.manager_note || exp.manager_note || "Please review receipt details.",
          };
        } else if (action === "mark-paid") {
          updatedItem = { ...exp, status: "paid", paid_at: new Date().toISOString() };
        } else {
          updatedItem = { ...exp, status: String(body.status || exp.status).toLowerCase() };
        }
        return updatedItem;
      });
      return updatedItem || MOCK_EXPENSES[0];
    }

    const singleMatch = /\/expenses\/([^/?]+)$/.exec(url);
    if (singleMatch) {
      const targetId = singleMatch[1];
      if (upperMethod === "DELETE") {
        MOCK_EXPENSES = MOCK_EXPENSES.filter((exp) => String(exp.id).toLowerCase() !== targetId);
        return { success: true };
      }
      if (upperMethod === "PATCH" || upperMethod === "PUT") {
        let updatedItem: Record<string, any> | undefined;
        MOCK_EXPENSES = MOCK_EXPENSES.map((exp) => {
          if (String(exp.id).toLowerCase() !== targetId) return exp;
          updatedItem = {
            ...exp,
            category: body.category ? String(body.category).toLowerCase() : exp.category,
            amount: body.amount !== undefined ? Number(body.amount) : exp.amount,
            date: body.date || exp.date,
            description: body.description ?? exp.description,
            receipt_name: body.receiptName || body.receipt_name || exp.receipt_name,
            status: "pending",
            manager_note: undefined,
            submitted_at: new Date().toISOString(),
          };
          return updatedItem;
        });
        return updatedItem || MOCK_EXPENSES[0];
      }
    }

    if (upperMethod === "POST") {
      const created = {
        id: `exp-${Date.now()}`,
        employee_name: body.employee || body.employee_name || "Employee",
        employee: body.employee || body.employee_name || "Employee",
        category: String(body.category || "other").toLowerCase(),
        amount: Number(body.amount ?? 0),
        currency: String(body.currency || "INR"),
        date: String(body.date || new Date().toISOString().slice(0, 10)),
        description: String(body.description || "Expense claim"),
        receipt_name: body.receiptName || body.receipt_name || undefined,
        status: "pending",
        submitted_at: new Date().toISOString(),
      };
      MOCK_EXPENSES = [created, ...MOCK_EXPENSES];
      return created;
    }

    return { items: MOCK_EXPENSES, total: MOCK_EXPENSES.length };
  }

  if (reqData !== undefined) {
    try {
      return typeof reqData === "string" ? JSON.parse(reqData) : reqData;
    } catch {
      return { success: true };
    }
  }

  return { items: [], total: 0 };
}

function wrapMockResponse(payload: any, config: any) {
  const isPlainObj = typeof payload === "object" && payload !== null && !Array.isArray(payload);
  const envelope = isPlainObj
    ? {
        success: true,
        status: 200,
        data: payload,
        items: Array.isArray(payload.items) ? payload.items : [],
        total: typeof payload.total === "number" ? payload.total : 0,
        ...payload,
      }
    : {
        success: true,
        status: 200,
        data: payload,
        items: Array.isArray(payload) ? payload : [],
        total: Array.isArray(payload) ? payload.length : 0,
      };

  return {
    data: envelope,
    status: 200,
    statusText: "OK",
    headers: {},
    config: config || {},
  };
}

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  adapter: async (config: InternalAxiosRequestConfig) => {
    const payload = buildMockPayload(config.url || "", config.method || "get", config.data, config.params);
    return wrapMockResponse(payload, config);
  },
});

export default apiInstance;
