const fs = require('fs');

const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

console.log('Total matches count:', matches.length);

// Group by file
const files = {};
for (const m of matches) {
  files[m.file] = files[m.file] || [];
  files[m.file].push(m);
}

const fileList = Object.keys(files);
console.log('Total files count:', fileList.length);

// Let's print out all files and count of matches
fileList.forEach(f => {
  console.log(`${f}: ${files[f].length}`);
});
