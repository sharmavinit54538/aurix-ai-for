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

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditLogExportParams {
  format?: string;
  search?: string;
  module?: string;
  startDate?: string;
  endDate?: string;
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

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number | string;
  currency?: string;
  billingCycle?: string;
  seats?: number;
  features: string[];
  current?: boolean;
  isPopular?: boolean;
  description?: string;
}

export interface UpgradeSubscriptionPayload {
  planId: string;
  billingCycle?: string;
  paymentMethodId?: string;
}

export interface CancelSubscriptionPayload {
  reason?: string;
  feedback?: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  current: boolean;
  location?: string;
  browser?: string;
  os?: string;
}

export interface PasswordPolicy {
  minLength: number;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  requireUppercase: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  passwordExpirationDays: number;
  activeSessions?: ActiveSession[];
  ipWhitelisting?: string[];
  passwordPolicy?: PasswordPolicy;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  slackAlerts: boolean;
  weeklyDigest: boolean;
  marketingEmails?: boolean;
  securityAlerts?: boolean;
}

export interface BrandingSettings {
  companyName: string;
  portalTitle?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  customCss?: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  icon?: string;
  config?: Record<string, unknown>;
  lastSync?: string;
  status?: string;
}

export interface TestEmailPayload {
  email?: string;
}

export interface TestSmsPayload {
  phone?: string;
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

  security: SecuritySettings | null;
  notifications: NotificationSettings | null;
  branding: BrandingSettings | null;
  integrations: IntegrationItem[];
  billing: BillingData | null;
  subscriptionPlans: SubscriptionPlan[];
  auditLogs: AuditLogResponse | null;

  generalSettings: GeneralSettings | null;
  companySettings: CompanySettings | null;
  roles: Role[];
  permissions: PermissionItem[];
  profile: ProfileSettings | null;

  operationLoading: Record<string, boolean>;
  operationErrors: Record<string, string | null>;
  operationSuccess: Record<string, boolean>;
}
