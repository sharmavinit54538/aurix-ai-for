const fs = require('fs');

const matches = JSON.parse(fs.readFileSync('all_brand_matches.json', 'utf8'));

// Filter out imports
const nonImports = matches.filter(m => !m.text.startsWith('import ') && !m.text.includes('from '));
console.log(`Non-imports: ${nonImports.length}`);

// Patterns
const titleMatches = [];
const textMatches = [];
const codeIdentifierMatches = [];

for (const m of nonImports) {
  if (m.text.includes('title:') || m.text.includes('<title>') || m.text.includes('document.title')) {
    titleMatches.push(m);
  } else if (
    m.text.includes('aurix.') ||
    m.text.includes('useAurix') ||
    m.text.includes('AurixManager') ||
    m.text.includes('Aurix') && (m.text.includes(': React') || m.text.includes('interface ') || m.text.includes('type '))
  ) {
    codeIdentifierMatches.push(m);
  } else {
    textMatches.push(m);
  }
}

console.log(`Title matches: ${titleMatches.length}`);
console.log(`Code identifier matches: ${codeIdentifierMatches.length}`);
console.log(`Other text/UI matches: ${textMatches.length}`);

console.log('\n--- SAMPLE TITLE MATCHES ---');
titleMatches.slice(0, 10).forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));

console.log('\n--- SAMPLE CODE IDENTIFIER MATCHES ---');
codeIdentifierMatches.slice(0, 10).forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));

console.log('\n--- ALL TEXT/UI MATCHES (first 40) ---');
textMatches.slice(0, 40).forEach(m => console.log(`${m.file}:${m.lineNum}: ${m.text}`));

fs.writeFileSync('text_matches.json', JSON.stringify(textMatches, null, 2));
fs.writeFileSync('title_matches.json', JSON.stringify(titleMatches, null, 2));
fs.writeFileSync('code_matches.json', JSON.stringify(codeIdentifierMatches, null, 2));
