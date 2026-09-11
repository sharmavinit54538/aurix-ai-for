const fs = require('fs');
const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

const otherFiles = matches.filter(m => {
  const norm = m.file.replace(/\\/g, '/');
  return !norm.includes('src/features/admin') &&
         !norm.includes('src/pages') &&
         !norm.includes('src/routes') &&
         !m.text.startsWith('import ') &&
         !m.text.includes('from ');
});

const grouped = {};
otherFiles.forEach(m => {
  const norm = m.file.replace(/\\/g, '/');
  grouped[norm] = grouped[norm] || [];
  grouped[norm].push(m);
});

Object.entries(grouped).forEach(([file, list]) => {
  console.log(`=== ${file} (${list.length}) ===`);
  list.forEach(l => console.log(`  L${l.lineNum}: ${l.text}`));
});
