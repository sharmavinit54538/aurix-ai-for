const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.git', 'dist', 'build', '.gemini'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('.');
const brandRegex = /(Aurix\s*HR|Aurix\s*AI|AurixHR|AURIX|Aurix|aurix)/i;

const allMatches = [];

for (const file of files) {
  if (file.endsWith('.lock') || file.endsWith('package-lock.json') || file.includes('tmp-') || file.includes('scratch_')) continue;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (brandRegex.test(line)) {
      allMatches.push({
        file,
        lineNum: idx + 1,
        text: line.trim()
      });
    }
  });
}

console.log(`Total occurrences: ${allMatches.length}`);

// Group by file category
const routes = allMatches.filter(m => m.file.includes('src\\routes') || m.file.includes('src/routes'));
const components = allMatches.filter(m => m.file.includes('src\\components') || m.file.includes('src/components'));
const features = allMatches.filter(m => m.file.includes('src\\features') || m.file.includes('src/features'));
const pages = allMatches.filter(m => m.file.includes('src\\pages') || m.file.includes('src/pages'));
const others = allMatches.filter(m => !routes.includes(m) && !components.includes(m) && !features.includes(m) && !pages.includes(m));

console.log(`Routes: ${routes.length} in ${new Set(routes.map(r => r.file)).size} files`);
console.log(`Components: ${components.length} in ${new Set(components.map(r => r.file)).size} files`);
console.log(`Features: ${features.length} in ${new Set(features.map(r => r.file)).size} files`);
console.log(`Pages: ${pages.length} in ${new Set(pages.map(r => r.file)).size} files`);
console.log(`Others: ${others.length} in ${new Set(others.map(r => r.file)).size} files`);

fs.writeFileSync('all_brand_matches.json', JSON.stringify(allMatches, null, 2));
console.log('Saved to all_brand_matches.json');
