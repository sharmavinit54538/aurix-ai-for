const fs = require('fs');
const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

const adminMatches = matches.filter(m => m.file.replace(/\\/g, '/').includes('src/features/admin'));
console.log('Total admin matches:', adminMatches.length);

const grouped = {};
adminMatches.forEach(m => {
  const norm = m.file.replace(/\\/g, '/');
  grouped[norm] = grouped[norm] || [];
  grouped[norm].push(m);
});

Object.entries(grouped).forEach(([file, list]) => {
  console.log(`=== ${file} (${list.length}) ===`);
  list.forEach(l => console.log(`  L${l.lineNum}: ${l.text}`));
});
