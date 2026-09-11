const fs = require('fs');
const path = require('path');

let modifiedFilesCount = 0;

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  for (const t of transforms) {
    if (typeof t === 'function') {
      content = t(content);
    } else if (t.from instanceof RegExp) {
      content = content.replace(t.from, t.to);
    } else {
      content = content.replaceAll(t.from, t.to);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    modifiedFilesCount++;
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'dist', 'build', '.gemini'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allFiles = walk('src');

// 1. Update all title occurrences in all route files and components
allFiles.forEach(file => {
  updateFile(file, [
    // Common route titles
    { from: /—\s*Aurix\s*HRMS/g, to: '— OFC360' },
    { from: /-\s*Aurix\s*HRMS/g, to: '- OFC360' },
    { from: /—\s*Aurix\s*AI/g, to: '— OFC360' },
    { from: /—\s*Aurix\s*Blog/g, to: '— OFC360' },
    { from: /—\s*Aurix/g, to: '— OFC360' },
    { from: /\|\s*Aurix/g, to: '| OFC360' },
    { from: /-\s*Aurix/g, to: '- OFC360' },
    { from: 'Recruitment Dashboard — Aurix', to: 'Recruitment Dashboard — OFC360' },
    { from: 'About — Aurix', to: 'About — OFC360' },
    { from: 'Blog — Aurix', to: 'Blog — OFC360' },
    { from: 'Contact — Aurix', to: 'Contact — OFC360' },
    { from: 'FAQ — Aurix', to: 'FAQ — OFC360' },
    { from: 'Features — Aurix', to: 'Features — OFC360' },
    { from: 'Pricing — Aurix', to: 'Pricing — OFC360' },
    { from: 'Privacy Policy — Aurix', to: 'Privacy Policy — OFC360' },
    { from: 'Terms & Conditions — Aurix', to: 'Terms & Conditions — OFC360' },
    { from: 'Aurix HR Enterprise Executive Dashboard', to: 'OFC360 Enterprise Executive Dashboard' },
    { from: 'Aurix HR Employee Self-Service Dashboard', to: 'OFC360 Employee Self-Service Dashboard' }
  ]);
});

// 2. Marketing / Site pages
updateFile('src/components/site/Navbar.tsx', [
  { from: '<span className="font-display text-xl font-bold tracking-tight">Aurix</span>', to: '<span className="font-display text-xl font-bold tracking-tight">OFC360</span>' }
]);

updateFile('src/components/site/Footer.tsx', [
  { from: '<span className="font-display text-xl font-bold">Aurix</span>', to: '<span className="font-display text-xl font-bold">OFC360</span>' },
  { from: /Aurix\s+Inc\.\s+All\s+rights\s+reserved\./g, to: 'OFC360 Inc. All rights reserved.' }
]);

updateFile('src/components/site/CTA.tsx', [
  { from: 'thousands of teams using Aurix to build', to: 'thousands of teams using OFC360 to build' }
]);

updateFile('src/components/site/FAQ.tsx', [
  { from: 'about Aurix.', to: 'about OFC360.' }
]);

updateFile('src/routes/about.tsx', [
  { from: /About\s+Aurix/g, to: 'About OFC360' },
  { from: 'The people building Aurix', to: 'The people building OFC360' },
  { from: /title:\s*"Aurix AI"/g, to: 'title: "OFC360"' },
  { from: /shipping with Aurix\./g, to: 'shipping with OFC360.' },
  { from: /team building Aurix\./g, to: 'team building OFC360.' },
  { from: /Aurix started in a small studio/g, to: 'OFC360 started in a small studio' },
  { from: /The first version of Aurix was/g, to: 'The first version of OFC360 was' },
  { from: /Today, Aurix is a team of/g, to: 'Today, OFC360 is a team of' },
  { from: /Software for work is stuck in 2012\. Aurix is a fresh take/g, to: 'Software for work is stuck in 2012. OFC360 is a fresh take' }
]);

updateFile('src/routes/faq.tsx', [
  { from: /Answers to common questions about Aurix/g, to: 'Answers to common questions about OFC360' },
  { from: /Everything you need to know about Aurix\./g, to: 'Everything you need to know about OFC360.' },
  { from: /What is Aurix\?/g, to: 'What is OFC360?' },
  { from: /Aurix is a unified workspace/g, to: 'OFC360 is a unified workspace' },
  { from: /Aurix is local-first\./g, to: 'OFC360 is local-first.' },
  { from: /Is Aurix SOC 2 certified\?/g, to: 'Is OFC360 SOC 2 certified?' },
  { from: /Does Aurix integrate with GitHub\?/g, to: 'Does OFC360 integrate with GitHub?' }
]);

updateFile('src/routes/features.tsx', [
  { from: /Explore everything Aurix can do/g, to: 'Explore everything OFC360 can do' },
  { from: /Every capability Aurix offers/g, to: 'Every capability OFC360 offers' },
  { from: /title:\s*"Aurix AI"/g, to: 'title: "OFC360"' },
  { from: /Aurix learns your team's rhythm/g, to: 'OFC360 learns your team\'s rhythm' },
  { from: /Build on top of Aurix/g, to: 'Build on top of OFC360' },
  { from: /Aurix is engineered to make every step/g, to: 'OFC360 is engineered to make every step' },
  { from: /Connect Aurix to the tools/g, to: 'Connect OFC360 to the tools' }
]);

updateFile('src/routes/pricing.tsx', [
  { from: /For individuals exploring Aurix\./g, to: 'For individuals exploring OFC360.' },
  { from: /"Aurix AI included"/g, to: '"OFC360 included"' },
  { from: /feature:\s*"Aurix AI"/g, to: 'feature: "OFC360"' }
]);

updateFile('src/routes/contact.tsx', [
  { from: /Get in touch with the Aurix team\./g, to: 'Get in touch with the OFC360 team.' },
  { from: /Talk to the Aurix team\./g, to: 'Talk to the OFC360 team.' },
  { from: /hoping to do with Aurix/g, to: 'hoping to do with OFC360' }
]);

updateFile('src/routes/privacy.tsx', [
  { from: /How Aurix collects, uses/g, to: 'How OFC360 collects, uses' },
  { from: /Aurix Inc\. \("Aurix", "we", "us"\)/g, to: 'OFC360 Inc. ("OFC360", "we", "us")' },
  { from: /privacy@aurix\.com/g, to: 'privacy@ofc360.com' },
  { from: /Aurix is not directed/g, to: 'OFC360 is not directed' },
  { from: /write to Aurix Inc\./g, to: 'write to OFC360 Inc.' }
]);

updateFile('src/routes/terms.tsx', [
  { from: /The terms that govern your use of Aurix\./g, to: 'The terms that govern your use of OFC360.' },
  { from: /accessing or using Aurix/g, to: 'accessing or using OFC360' },
  { from: /You may use Aurix only/g, to: 'You may use OFC360 only' },
  { from: /Aurix retains all rights/g, to: 'OFC360 retains all rights' },
  { from: /Aurix disclaims all warranties/g, to: 'OFC360 disclaims all warranties' },
  { from: /Aurix's liability is limited/g, to: 'OFC360\'s liability is limited' },
  { from: /legal@aurix\.com/g, to: 'legal@ofc360.com' }
]);

updateFile('src/lib/blog-data.ts', [
  { from: 'shipping-faster-with-aurix', to: 'shipping-faster-with-ofc360' },
  { from: 'How modern teams ship 3x faster with Aurix', to: 'How modern teams ship 3x faster with OFC360' },
  { from: /teams using Aurix structure/g, to: 'teams using OFC360 structure' }
]);

updateFile('src/routes/blog.$slug.tsx', [
  { from: 'future of work at Aurix.', to: 'future of work at OFC360.' }
]);

updateFile('src/routes/jobs.apply.$ukey.tsx', [
  { from: 'Aurix <span className="font-normal text-indigo-400/90 text-sm tracking-normal ml-1">Careers Portal</span>', to: 'OFC360 <span className="font-normal text-indigo-400/90 text-sm tracking-normal ml-1">Careers Portal</span>' }
]);

// 3. Auth & Onboarding
updateFile('src/features/auth/components/AuthShell.tsx', [
  { from: '<span className="font-display text-lg font-semibold tracking-tight">Aurix</span>', to: '<span className="font-display text-lg font-semibold tracking-tight">OFC360</span>' }
]);

updateFile('src/features/auth/pages/LoginPage.tsx', [
  { from: 'subtitle="Sign in to your Aurix workspace"', to: 'subtitle="Sign in to your OFC360 workspace"' },
  { from: 'New to Aurix?', to: 'New to OFC360?' }
]);

updateFile('src/routes/onboarding.tsx', [
  { from: '<span className="font-display text-lg font-semibold tracking-tight">Aurix</span>', to: '<span className="font-display text-lg font-semibold tracking-tight">OFC360</span>' },
  { from: 'placeholder="Aurix, Inc."', to: 'placeholder="OFC360, Inc."' },
  { from: 'placeholder="https://aurix.com"', to: 'placeholder="https://ofc360.com"' },
  { from: 'placeholder="hello@aurix.com"', to: 'placeholder="hello@ofc360.com"' },
  { from: 'Your Aurix workspace is ready', to: 'Your OFC360 workspace is ready' }
]);

updateFile('src/routes/employee-onboarding.tsx', [
  { from: 'Aurix HRMS', to: 'OFC360' }
]);

// 4. Portals & Dashboard Views
updateFile('src/features/portal/employee/EmployeeDashboard.tsx', [
  { from: 'ws.company?.name ?? "Aurix HR"', to: 'ws.company?.name ?? "OFC360"' },
  { from: '// Aurix HR —', to: '// OFC360 —' }
]);

updateFile('src/features/portal/manager/ManagerDashboard.tsx', [
  { from: 'ws.company?.name ?? "Aurix HR"', to: 'ws.company?.name ?? "OFC360"' },
  { from: '// Aurix HR —', to: '// OFC360 —' }
]);

updateFile('src/features/dashboard/ExecutiveDashboard.tsx', [
  { from: 'subtitle="Powered by Aurix AI"', to: 'subtitle="Powered by OFC360"' }
]);

updateFile('src/routes/dashboard.attendance.checkin.tsx', [
  { from: 'subtitle="Powered by Aurix AI"', to: 'subtitle="Powered by OFC360"' },
  { from: '5 years at Aurix!', to: '5 years at OFC360!' }
]);

updateFile('src/features/cto/pages/CtoSettingsPage.tsx', [
  { from: '"aurix-ai-enterprise"', to: '"ofc360-enterprise"' },
  { from: '"qdrant.internal.aurix.ai:6333"', to: '"qdrant.internal.ofc360.ai:6333"' },
  { from: 'defaultValue="Aurix AI Enterprise Technologies"', to: 'defaultValue="OFC360 Technologies"' }
]);

updateFile('src/features/cto/pages/CtoEngineeringPage.tsx', [
  { from: /repo:\s*"aurix-core-backend"/g, to: 'repo: "ofc360-core-backend"' },
  { from: /repo:\s*"aurix-enterprise-web"/g, to: 'repo: "ofc360-enterprise-web"' },
  { from: /repo:\s*"aurix-infra-terraform"/g, to: 'repo: "ofc360-infra-terraform"' }
]);

updateFile('src/features/cto/pages/CtoDevOpsPage.tsx', [
  { from: 'aurix-backend-production-deploy', to: 'ofc360-backend-production-deploy' },
  { from: 'aurix-frontend-vercel-deploy', to: 'ofc360-frontend-vercel-deploy' },
  { from: 'aurix-ai-inference-gpu-deploy', to: 'ofc360-ai-inference-gpu-deploy' },
  { from: 'aurix-postgres-migration-check', to: 'ofc360-postgres-migration-check' }
]);

updateFile('src/features/cto/pages/CtoDatabasePage.tsx', [
  { from: 'aurix_prod', to: 'ofc360_prod' },
  { from: 'aurix_cache', to: 'ofc360_cache' },
  { from: 'aurix_vectors', to: 'ofc360_vectors' }
]);

updateFile('src/routes/dashboard.payroll.copilot.tsx', [
  { from: /Aurix Copilot/g, to: 'OFC360 Copilot' }
]);

updateFile('src/routes/api/payroll-copilot.ts', [
  { from: 'You are Aurix Payroll Copilot', to: 'You are OFC360 Payroll Copilot' }
]);

updateFile('src/routes/dashboard.payroll.settings.tsx', [
  { from: 'company_name: "Aurix AI Enterprise"', to: 'company_name: "OFC360"' }
]);

updateFile('src/routes/dashboard.settings.company.tsx', [
  { from: 'placeholder="Aurix AI Technologies Pvt Ltd"', to: 'placeholder="OFC360 Technologies Pvt Ltd"' },
  { from: 'placeholder="contact@aurix.ai"', to: 'placeholder="contact@ofc360.ai"' },
  { from: 'placeholder="https://aurix.ai"', to: 'placeholder="https://ofc360.ai"' }
]);

updateFile('src/routes/dashboard.settings.general.tsx', [
  { from: 'appName: "Aurix HRMS"', to: 'appName: "OFC360"' },
  { from: 'appName: settings.appName || "Aurix HRMS"', to: 'appName: settings.appName || "OFC360"' },
  { from: 'placeholder="Aurix HRMS"', to: 'placeholder="OFC360"' }
]);

updateFile('src/routes/dashboard.settings.profile.tsx', [
  { from: 'placeholder="aarav@aurix.ai"', to: 'placeholder="aarav@ofc360.ai"' }
]);

updateFile('src/routes/dashboard.settings.notifications.tsx', [
  { from: 'inside the Aurix dashboard header', to: 'inside the OFC360 dashboard header' }
]);

updateFile('src/routes/dashboard.settings.integrations.tsx', [
  { from: 'Connect Aurix with your enterprise', to: 'Connect OFC360 with your enterprise' }
]);

// 5. Admin, Recruitment & Payroll
updateFile('src/features/admin/recruitment/pages/RecruitmentTemplatesPage.tsx', [
  { from: /Opportunities at Aurix/g, to: 'Opportunities at OFC360' },
  { from: /team at Aurix/g, to: 'team at OFC360' },
  { from: /Interview Scheduled with Aurix/g, to: 'Interview Scheduled with OFC360' },
  { from: /Job Offer from Aurix/g, to: 'Job Offer from OFC360' },
  { from: /position of \{\{job\.title\}\} at Aurix/g, to: 'position of {{job.title}} at OFC360' },
  { from: /application with Aurix/g, to: 'application with OFC360' },
  { from: /interview for the \{\{job\.title\}\} role at Aurix/g, to: 'interview for the {{job.title}} role at OFC360' },
  { from: /Welcome to Aurix!/g, to: 'Welcome to OFC360!' },
  { from: /Recruitment Team, Aurix/g, to: 'Recruitment Team, OFC360' },
  { from: /HR Operations Team, Aurix/g, to: 'HR Operations Team, OFC360' },
  { from: /The Aurix team/g, to: 'The OFC360 team' }
]);

updateFile('src/features/admin/recruitment/pages/RecruitmentCalendarPage.tsx', [
  { from: 'Syncing Google Calendar with Aurix AI...', to: 'Syncing Google Calendar with OFC360...' }
]);

updateFile('src/features/admin/recruitment/pages/RecruitmentImportExportPage.tsx', [
  { from: 'out of Aurix', to: 'out of OFC360' }
]);

updateFile('src/features/admin/recruitment/pages/NewJobPage.tsx', [
  { from: 'toast.info("Aurix AI is drafting job requirements...");', to: 'toast.info("OFC360 is drafting job requirements...");' },
  { from: 'toast.info("Aurix AI is refining description...");', to: 'toast.info("OFC360 is refining description...");' },
  { from: 'Aurix AI Copilot', to: 'OFC360 Copilot' },
  { from: 'Aurix AI is working...', to: 'OFC360 is working...' },
  { from: 'use Aurix AI to generate one', to: 'use OFC360 to generate one' }
]);

updateFile('src/features/admin/recruitment/pages/CandidateProfilePage.tsx', [
  { from: 'https://careers.aurix.com', to: 'https://careers.ofc360.com' }
]);

updateFile('src/features/admin/payroll/components/bonuses/BonusLetterModal.tsx', [
  { from: 'AURIX AI ENTERPRISE CORP', to: 'OFC360 ENTERPRISE CORP' },
  { from: 'continued success with Aurix AI', to: 'continued success with OFC360' },
  { from: 'Aurix HRMS Seal', to: 'OFC360 Seal' }
]);

updateFile('src/features/admin/payroll/components/advances/BankDisbursementModal.tsx', [
  { from: 'Aurix Corporate Bank Transfer Gateway', to: 'OFC360 Corporate Bank Transfer Gateway' }
]);

updateFile('src/features/admin/payroll/components/advances/AdvanceHubHeader.tsx', [
  { from: 'Aurix Loans v2026', to: 'OFC360 Loans v2026' }
]);

updateFile('src/features/admin/payroll/components/bank-transfers/BankHubHeader.tsx', [
  { from: 'Aurix Banking v2026', to: 'OFC360 Banking v2026' }
]);

updateFile('src/features/admin/payroll/components/bonuses/BonusHubHeader.tsx', [
  { from: 'Aurix Bonus v2026', to: 'OFC360 Bonus v2026' }
]);

// Payroll AI modules text
const payrollAiFiles = [
  'src/features/admin/payroll/components/advances/AdvanceHubCardGrid.tsx',
  'src/features/admin/payroll/components/advances/AdvanceHubModuleViews.tsx',
  'src/features/admin/payroll/components/advances/AIAdvanceInsights.tsx',
  'src/features/admin/payroll/components/advances/RightPolicyPanel.tsx',
  'src/features/admin/payroll/components/bank-transfers/BankHubCardGrid.tsx',
  'src/features/admin/payroll/components/bank-transfers/BankHubModuleViews.tsx',
  'src/features/admin/payroll/components/bonuses/AIBonusInsights.tsx',
  'src/features/admin/payroll/components/bonuses/BonusHubCardGrid.tsx',
  'src/features/admin/payroll/components/bonuses/BonusHubModuleViews.tsx',
  'src/features/admin/payroll/components/bonuses/RightPolicyPanel.tsx',
  'src/features/admin/payroll/components/deductions/AIDeductionInsights.tsx',
  'src/features/admin/payroll/components/deductions/RightPolicyPanel.tsx',
  'src/features/admin/payroll/components/reimbursements/ReimbursementHubCardGrid.tsx'
];

payrollAiFiles.forEach(file => {
  updateFile(file, [
    { from: 'Aurix AI Core', to: 'OFC360 Core' },
    { from: 'Aurix AI Financial Assistant', to: 'OFC360 Financial Assistant' },
    { from: 'Aurix AI Banking Intelligence', to: 'OFC360 Banking Intelligence' },
    { from: 'Aurix AI Bonus Intelligence', to: 'OFC360 Bonus Intelligence' },
    { from: 'Aurix AI Compensation', to: 'OFC360 Compensation' },
    { from: 'Aurix AI Deduction', to: 'OFC360 Deduction' },
    { from: 'Aurix AI Advance', to: 'OFC360 Advance' },
    { from: 'Aurix AI Variable Compensation Assistant', to: 'OFC360 Variable Compensation Assistant' },
    { from: 'Aurix AI Salary Advance Copilot', to: 'OFC360 Salary Advance Copilot' },
    { from: /🤖 Aurix AI/g, to: '🤖 OFC360' },
    { from: /Aurix AI:/g, to: 'OFC360:' },
    { from: /Aurix AI/g, to: 'OFC360' }
  ]);
});

// Documents & Exit letters
updateFile('src/pages/DocumentsPage.tsx', [
  { from: /AURIX TALENT LABS PRIVATE LIMITED/g, to: 'OFC360 PRIVATE LIMITED' },
  { from: /Aurix Talent Labs Private Limited/g, to: 'OFC360 Private Limited' },
  { from: /AURIX TALENT LABS/g, to: 'OFC360' },
  { from: /Aurix Talent Labs Pvt Ltd/g, to: 'OFC360 Pvt Ltd' },
  { from: /Aurix Talent Labs/g, to: 'OFC360' },
  { from: /www\.aurixtalentlabs\.com/g, to: 'www.ofc360.com' },
  { from: /hr@aurixtalentlabs\.com/g, to: 'hr@ofc360.com' },
  { from: /careers@aurixtalentlabs\.com/g, to: 'careers@ofc360.com' },
  { from: /aurix@gmail\.com/g, to: 'ofc360@gmail.com' }
]);

updateFile('src/pages/ExitManagementPage.tsx', [
  { from: /AURIX TALENT LABS/g, to: 'OFC360' },
  { from: /Aurix Talent Labs/g, to: 'OFC360' },
  { from: 'Aurix access ID Card', to: 'OFC360 access ID Card' },
  { from: 'How can Aurix HR retain', to: 'How can OFC360 retain' }
]);

updateFile('src/pages/VisitorsPage.tsx', [
  { from: 'AURIX-VISITOR', to: 'OFC360-VISITOR' }
]);

updateFile('src/pages/TimesheetsPage.tsx', [
  { from: 'Aurix AI Core Engine', to: 'OFC360 Core Engine' },
  { from: 'Aurix AI can analyze', to: 'OFC360 can analyze' }
]);

updateFile('src/features/admin/departments/utils/departmentExport.ts', [
  { from: '<title>Departments Directory - Aurix HRMS</title>', to: '<title>Departments Directory - OFC360</title>' },
  { from: 'aurix_departments_export_', to: 'ofc360_departments_export_' }
]);

updateFile('src/features/admin/managers/utils/managerExport.ts', [
  { from: '<title>Managers Directory - Aurix HRMS</title>', to: '<title>Managers Directory - OFC360</title>' },
  { from: 'aurix_managers_export_', to: 'ofc360_managers_export_' }
]);

updateFile('src/features/admin/departments/components/ImportDialog.tsx', [
  { from: 'aurix_departments_import_template.csv', to: 'ofc360_departments_import_template.csv' }
]);

updateFile('src/features/admin/managers/components/ImportDialog.tsx', [
  { from: 'aurix_managers_import_template.csv', to: 'ofc360_managers_import_template.csv' },
  { from: '@aurix.com', to: '@ofc360.com' }
]);

updateFile('src/features/admin/managers/components/ManagerFormDialog.tsx', [
  { from: 'john.doe@aurix.com', to: 'john.doe@ofc360.com' }
]);

updateFile('src/features/admin/performance/pages/PerformancePage.tsx', [
  { from: '<title>Performance Reviews Pool - Aurix HRMS</title>', to: '<title>Performance Reviews Pool - OFC360</title>' }
]);

updateFile('src/lib/ai/agents.ts', [
  { from: 'Aurix AI Insight 2.0', to: 'OFC360 Insight 2.0' }
]);

updateFile('src/lib/ai/hr-tools.ts', [
  { from: /@aurix\.io/g, to: '@ofc360.io' }
]);

console.log(`\nTotal files modified: ${modifiedFilesCount}`);
