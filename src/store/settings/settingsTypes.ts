export interface GeneralSettings {
  appName: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  fiscalYearStart: string;
  workDaysPerWeek: number;
}

export interface CompanySettings {
  id?: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  country: string;
  taxId: string;
  registrationNumber: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem?: boolean;
}

export interface PermissionItem {
  id: string;
  name: string;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  ip: string;
  status: string;
  details: string;
}

export interface AuditLogResponse {
  items: AuditLog[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: string;
  status: string;
  pdfUrl?: string;
}

export interface BillingData {
  currentPlan: string;
  billingCycle: string;
  amount: string;
  nextBillingDate: string;
  seats: number;
  usedSeats: number;
  paymentMethod: string;
  invoices: InvoiceItem[];
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  passwordExpirationDays: number;
  activeSessions: ActiveSession[];
}

export interface NotificationSettings {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  slackAlerts: boolean;
  weeklyDigest: boolean;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  icon?: string;
}

export interface ProfileSettings {
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  bio: string;
  role?: string;
}

export interface SettingsState {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  lastUpdated: string | null;

  generalSettings: GeneralSettings | null;
  companySettings: CompanySettings | null;
  roles: Role[];
  permissions: PermissionItem[];
  auditLogs: AuditLogResponse | null;
  billing: BillingData | null;
  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
  integrations: IntegrationItem[];
  profile: ProfileSettings | null;
}
