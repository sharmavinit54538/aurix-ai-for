const fs = require('fs');
const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

const targets = [
  'src/features/auth',
  'src/components/site',
  'src/features/dashboard',
  'src/features/portal',
  'src/routes/onboarding.tsx',
  'src/routes/dashboard.settings'
];

matches.forEach(m => {
  const norm = m.file.replace(/\\/g, '/');
  if (targets.some(t => norm.includes(t))) {
    console.log(`${norm}:${m.lineNum}: ${m.text}`);
  }
});
