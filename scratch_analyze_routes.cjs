const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const routeFiles = walk('src/routes');
const aurixRegex = /aurix/i;

const titleOnly = [];
const complexMatches = [];

for (const f of routeFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (aurixRegex.test(content)) {
    const lines = content.split('\n');
    const matchedLines = [];
    lines.forEach((l, idx) => {
      if (aurixRegex.test(l)) {
        matchedLines.push({ line: idx + 1, text: l.trim() });
      }
    });

    const isOnlyTitle = matchedLines.every(m => 
      m.text.includes('title:') || 
      m.text.includes('<title>') || 
      m.text.includes('og:title')
    );

    if (isOnlyTitle) {
      titleOnly.push({ file: f, lines: matchedLines });
    } else {
      complexMatches.push({ file: f, lines: matchedLines });
    }
  }
}

console.log(`Routes with title only matches: ${titleOnly.length}`);
console.log(`Routes with other matches: ${complexMatches.length}`);

console.log('\n--- COMPLEX ROUTE MATCHES ---');
complexMatches.forEach(m => {
  console.log(`\n=== ${m.file} ===`);
  m.lines.forEach(l => console.log(`  L${l.line}: ${l.text}`));
});
