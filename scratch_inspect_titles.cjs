const fs = require('fs');
const titleMatches = JSON.parse(fs.readFileSync('title_matches.json', 'utf8'));
console.log('Total title matches:', titleMatches.length);

titleMatches.forEach((m, idx) => {
  if (idx < 50) {
    console.log(`${m.file}:${m.lineNum}: ${m.text}`);
  }
});
