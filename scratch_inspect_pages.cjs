const fs = require('fs');
const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));
const pageMatches = matches.filter(m => m.file.replace(/\\/g, '/').includes('src/pages'));
console.log('Page matches count:', pageMatches.length);
pageMatches.forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));
