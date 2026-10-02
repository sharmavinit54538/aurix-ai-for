# Route Inventory & Data Source Mapping

This inventory maps every TanStack route file to its rendering component and primary data sources (API, Redux, localStorage/useHrms, Static/Hardcoded).

| Route File | Component | Data Source |
| :--- | :--- | :--- |
| `src/routes/__root.tsx` | `PageSkeleton` | Static/Hardcoded |
| `src/routes/about.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/ai.analytics-center.tsx` | `fetchAIInsightsDashboard` | API, Redux |
| `src/routes/ai.attendance-monitor.tsx` | `AIModulePage, AIChart, AIKpi, AIFeature` | API |
| `src/routes/ai.brain.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/ai.chat-assistant.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/ai.compliance-monitor.tsx` | `fetchComplianceDashboard` | API, Redux |
| `src/routes/ai.document-generator.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/ai.employee-health.tsx` | `fetchEmployeeHealthDashboard` | API, Redux |
| `src/routes/ai.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/ai.leave-assistant.tsx` | `fetchLeaveAssistantDashboard` | API, Redux |
| `src/routes/ai.meeting-intelligence.tsx` | `fetchMeetingIntelligenceDashboard` | API, Redux |
| `src/routes/ai.performance-coach.tsx` | `fetchPerformanceCoachDashboard` | API, Redux |
| `src/routes/ai.policy-assistant.tsx` | `askPolicyQuestion,
  fetchPolicyAssistantDashboard,` | API, Redux |
| `src/routes/ai.recruiter.tsx` | `fetchRecruiterDashboard` | API, Redux |
| `src/routes/ai.tsx` | `DashboardShell` | API, Redux |
| `src/routes/ai.workforce-insights.tsx` | `fetchWorkforceInsightsDashboard` | API, Redux |
| `src/routes/ai.workforce-planning.tsx` | `AIModulePage, type AIChart, type AIKpi, type AIFeature, type AIRow` | API, localStorage/useHrms |
| `src/routes/api/ai-brain.ts` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/auth/forgot-password.tsx` | `ForgotPasswordPage` | Static/Hardcoded |
| `src/routes/auth/login.tsx` | `LoginPage` | Static/Hardcoded |
| `src/routes/auth/register.tsx` | `RegisterPage` | Static/Hardcoded |
| `src/routes/auth/reset-password.tsx` | `ResetPasswordPage` | Static/Hardcoded |
| `src/routes/auth/verify-email.tsx` | `VerifyEmailPage` | Static/Hardcoded |
| `src/routes/auth/verify-reset-otp.tsx` | `VerifyResetOtpPage` | Static/Hardcoded |
| `src/routes/blog.$slug.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/blog.index.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/blog.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/contact.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/dashboard.ai-hub.assistant.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.ai-hub.automation.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.ai-hub.document-generator.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.ai-hub.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.ai-hub.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.ai-insights.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.analytics.ai-insights.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.analytics.index.tsx` | `ModuleHubView, type ModuleItem` | Static/Hardcoded |
| `src/routes/dashboard.analytics.reports.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.analytics.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.asset-management.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.assets.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.checkin.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.holidays.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.rosters.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.shifts.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.attendance.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.audit-logs.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.billing.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.departments.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.documents.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.employee.payroll.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.employee.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.employees.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.ai-insights.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.business.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.finance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.operations.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.organization.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.reports.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.sales.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.settings.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.ceo.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.executive.cfo.tsx` | `CfoDashboardPage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.analytics.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.cloud-network.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.cyber-security.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.digital-transformation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.infrastructure.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.it-governance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.it-operations.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.settings.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cio.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.executive.cmo.tsx` | `CmoDashboardPage` | Static/Hardcoded |
| `src/routes/dashboard.executive.coo.tsx` | `CooDashboardPage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.ai.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.analytics.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.database.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.developers.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.devops.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.engineering.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.infrastructure.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.monitoring.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.projects.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.security.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.settings.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.executive.cto.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.executive.index.tsx` | `ExecutiveHubPage` | localStorage/useHrms |
| `src/routes/dashboard.executives.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.exit-management.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.exit.tsx` | `PageHeader` | API, Redux, localStorage/useHrms |
| `src/routes/dashboard.expenses.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.forbidden.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.hierarchy.tsx` | `EmployeeHierarchyView` | API, Redux |
| `src/routes/dashboard.hr-operations.command-center.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.exit-management.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.index.tsx` | `ModuleHubView, type ModuleItem` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.offboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.onboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.timeline.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.hr-operations.visitor-management.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr-ops.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.hr.tsx` | `PageHeader` | API, Redux |
| `src/routes/dashboard.index.tsx` | `getDefaultDashboardPath` | Static/Hardcoded |
| `src/routes/dashboard.it-admin.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.leaves.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.manager.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.managers.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.notifications.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.offboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.onboarding-checklist.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.compensation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.full-and-final.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.payments.$batchId.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.payments.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.payslips.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.periods.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.reports.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.approval.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.employees.$employeeId.payslip.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.employees.$employeeId.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.finalize.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.payment.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.preview.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.processing.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.review.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.payroll.runs.$runId.validation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.salary-structure.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.statutory.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.payroll.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.payroll.variable-inputs.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.people.index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.performance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.reports.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.resources.asset-management.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.resources.assets.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.resources.documents.tsx` | `getDefaultDashboardPath` | Static/Hardcoded |
| `src/routes/dashboard.resources.index.tsx` | `ModuleHubView, type ModuleItem` | Static/Hardcoded |
| `src/routes/dashboard.resources.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.roles.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.settings.audit-logs.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.billing.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.company.tsx` | `SettingsLayout` | Static/Hardcoded |
| `src/routes/dashboard.settings.general.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.index.tsx` | `SettingsLayout, type SettingsSectionKey` | Static/Hardcoded |
| `src/routes/dashboard.settings.integrations.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.notifications.tsx` | `SettingsLayout` | Static/Hardcoded |
| `src/routes/dashboard.settings.profile.tsx` | `SettingsLayout` | Static/Hardcoded |
| `src/routes/dashboard.settings.roles-permissions.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.security.tsx` | `AccessDeniedView` | Static/Hardcoded |
| `src/routes/dashboard.settings.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.super-admin.activity.tsx` | `SuperAdminActivityPage` | API |
| `src/routes/dashboard.super-admin.analytics.tsx` | `SuperAdminAnalyticsPage` | API |
| `src/routes/dashboard.super-admin.audit-logs.tsx` | `SuperAdminAuditLogsPage` | API |
| `src/routes/dashboard.super-admin.index.tsx` | `SuperAdminOverviewPage` | API |
| `src/routes/dashboard.super-admin.organizations.tsx` | `SuperAdminOrganizationsPage` | API |
| `src/routes/dashboard.super-admin.platform-config.tsx` | `SuperAdminPlatformConfigPage` | API |
| `src/routes/dashboard.super-admin.settings.tsx` | `SuperAdminSettingsPage` | API |
| `src/routes/dashboard.super-admin.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.super-admin.users.tsx` | `SuperAdminUsersPage` | API |
| `src/routes/dashboard.talent.index.tsx` | `ModuleHubView, type ModuleItem` | Static/Hardcoded |
| `src/routes/dashboard.talent.performance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.talent.recruitment.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.talent.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard.timeline.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.timesheets.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.travel.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.tsx` | `DashboardShell` | API, Redux |
| `src/routes/dashboard.visitors.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.attendance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.departments.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.index.tsx` | `ModuleHubView, type ModuleItem` | Static/Hardcoded |
| `src/routes/dashboard.workforce.leaves.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.people.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.timesheets.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard.workforce.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard/recruitment.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/ai-interview.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/ai-screening.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/ai.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/analytics.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/automation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/calendar.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/candidates.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/candidates/$candidateId.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/candidates/index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/career-site.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/communication.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/compensation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/compliance.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/crm.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/employee-onboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/hiring-manager.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/import-export.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/interviews.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/jobs/$jobId.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/jobs/$jobId/publish.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/jobs/index.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/jobs/new.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/kt-probation.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/notifications.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/offers.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/onboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/pipeline.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/preboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/referrals.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/reports.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/requisitions.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/resume-intelligence.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/scorecards.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/search.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/sourcing.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/talent-pool.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/templates.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/vendors.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/verification.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/dashboard/recruitment/workforce-planning.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/employee-onboarding.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/faq.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/features.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/forgot-password.tsx` | `ForgotPasswordPage` | Static/Hardcoded |
| `src/routes/index.tsx` | `LayoutDashboard, Sparkles` | Static/Hardcoded |
| `src/routes/jobs.apply.$ukey.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/login.tsx` | `LoginPage` | Static/Hardcoded |
| `src/routes/onboarding.tsx` | `lazyFeaturePage` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.approval.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.employee.$employeeId.payslip.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.employee.$employeeId.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.finalize.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.preview.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.processing.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.review.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/payroll.runs.$runId.validation.tsx` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/pricing.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/privacy.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/register.tsx` | `RegisterPage` | Static/Hardcoded |
| `src/routes/reset-password.tsx` | `ResetPasswordPage` | Static/Hardcoded |
| `src/routes/sitemap[.]xml.ts` | `Inline/RouteComponent` | Static/Hardcoded |
| `src/routes/terms.tsx` | `SiteLayout` | Static/Hardcoded |
| `src/routes/verify-email.tsx` | `VerifyEmailPage` | Static/Hardcoded |
| `src/routes/verify-reset-otp.tsx` | `VerifyResetOtpPage` | Static/Hardcoded |
