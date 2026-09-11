const fs = require('fs');
const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

const toastOrNotify = [];
const emptyOrError = [];

for (const m of matches) {
  const line = m.text.toLowerCase();
  if (line.includes('toast') || line.includes('alert') || line.includes('notify') || line.includes('notification')) {
    toastOrNotify.push(m);
  }
  if (line.includes('empty') || line.includes('error') || line.includes('not found') || line.includes('failed')) {
    emptyOrError.push(m);
  }
}

console.log('Toast/notify matches:', toastOrNotify.length);
toastOrNotify.forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));

console.log('\nEmpty/error matches:', emptyOrError.length);
emptyOrError.forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));
