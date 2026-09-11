const fs = require('fs');

function update(file, replacements) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) {
    if (typeof from === 'string') {
      content = content.replaceAll(from, to);
    } else {
      content = content.replace(from, to);
    }
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Cleaned:', file);
}

update('src/features/admin/recruitment/pages/CandidateProfilePage.tsx', [
  ['Standard Aurix Health Insurance', 'Standard OFC360 Health Insurance']
]);

update('src/features/admin/recruitment/pages/CareerSitePage.tsx', [
  ['useState("Aurix")', 'useState("OFC360")'],
  [/aurix\.careers/g, 'ofc360.careers']
]);

update('src/features/admin/recruitment/pages/JobDetailPage.tsx', [
  ['Aurix Inc. is a high-growth HR Technology', 'OFC360 Inc. is a high-growth HR Technology'],
  [/careers\.aurix\.com/g, 'careers.ofc360.com'],
  [/aurix\.com\/portal/g, 'ofc360.com/portal']
]);

update('src/features/admin/recruitment/pages/RecruitmentCopilotPage.tsx', [
  ['The Aurix team', 'The OFC360 team']
]);

update('src/features/attendance/pages/HolidaysPage.tsx', [
  ['aurix_holidays_', 'ofc360_holidays_'],
  ['days off by Aurix.', 'days off by OFC360.']
]);

update('src/pages/AIInsightsPage.tsx', [
  ['Aurix Intelligence', 'OFC360 Intelligence'],
  ['I’m Aurix AI', 'I’m OFC360 AI'],
  ['I\'m Aurix AI', 'I\'m OFC360 AI'],
  ['Aurix AI Assistant', 'OFC360 Assistant'],
  ['Ask Aurix AI anything...', 'Ask OFC360 anything...']
]);

update('src/pages/AssetsPage.tsx', [
  ['AURIX HRMS ASSET', 'OFC360 ASSET'],
  ['Company: Aurix Talent Labs', 'Company: OFC360']
]);

update('src/pages/ChatAssistantPage.tsx', [
  ['I\'m Aurix AI', 'I\'m OFC360 AI'],
  ['I’m Aurix AI', 'I’m OFC360 AI'],
  ['Ask Aurix AI…', 'Ask OFC360…']
]);

update('src/pages/DocumentGeneratorPage.tsx', [
  ['at Aurix Inc.', 'at OFC360 Inc.']
]);

update('src/pages/DocumentsPage.tsx', [
  ['Aurix Corporate Legal Representative', 'OFC360 Corporate Legal Representative'],
  ['Aurix Corporate Handbook', 'OFC360 Corporate Handbook'],
  ['Aurix HR Vault', 'OFC360 Vault'],
  ['legal@aurixtalentlabs.com', 'legal@ofc360.com']
]);

update('src/routes/about.tsx', [
  ['Aurix is on a mission to give every team', 'OFC360 is on a mission to give every team']
]);

update('src/routes/blog.index.tsx', [
  ['from the Aurix team', 'from the OFC360 team'],
  ['team building Aurix', 'team building OFC360']
]);

update('src/routes/blog.tsx', [
  ['from the Aurix team', 'from the OFC360 team'],
  ['team building Aurix', 'team building OFC360']
]);

update('src/routes/contact.tsx', [
  ['hello@aurix.com', 'hello@ofc360.com'],
  ['sales@aurix.com', 'sales@ofc360.com']
]);

update('src/routes/dashboard.manager.tsx', [
  ['Aurix HR Manager Dashboard', 'OFC360 Manager Dashboard']
]);

update('src/routes/privacy.tsx', [
  ['Aurix Inc. ("Aurix", "we", "us")', 'OFC360 Inc. ("OFC360", "we", "us")'],
  ['Aurix Inc. (\'Aurix\', \'we\', \'us\')', 'OFC360 Inc. (\'OFC360\', \'we\', \'us\')']
]);

update('README.md', [
  ['# aurix-ai-for', '# OFC360']
]);

console.log('Finished cleaning remaining user-facing references.');
