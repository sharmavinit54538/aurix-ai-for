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
const brandRegex = /aurix/i;

const remainingMatches = [];

for (const f of files) {
  if (
    f.endsWith('.lock') ||
    f.endsWith('package-lock.json') ||
    f.includes('tmp-') ||
    f.includes('scratch_') ||
    f.includes('all_brand_matches.json') ||
    f.includes('title_matches.json') ||
    f.includes('text_matches.json') ||
    f.includes('code_matches.json')
  ) {
    continue;
  }

  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (brandRegex.test(l)) {
      remainingMatches.push({ file: f, line: idx + 1, text: l.trim() });
    }
  });
}

console.log(`Total remaining matches: ${remainingMatches.length}`);

// Categorize into code identifiers vs user-facing
const userFacing = [];
const internalCode = [];

for (const m of remainingMatches) {
  const t = m.text;
  if (
    t.startsWith('import ') ||
    t.includes('from "@/components/aurix') ||
    t.includes('from "./aurix-store"') ||
    t.includes('from "@/lib/aurix-store"') ||
    t.includes('useAurix') ||
    t.includes('aurix.get') ||
    t.includes('aurix.set') ||
    t.includes('aurix.reset') ||
    t.includes('aurix:tokens') ||
    t.includes('aurix:workspace:v1') ||
    t.includes('aurix:remember') ||
    t.includes('aurixManagers') ||
    t.includes('AurixManager') ||
    t.includes('AurixUser') ||
    t.includes('export const aurix') ||
    t.includes('export function useAurix') ||
    t.includes('aurix.hrms.v1') ||
    t.includes('aurix.compliance') ||
    t.includes('aurix.recruitment') ||
    t.includes('PROJ-AURIX-CORE') ||
    t.includes('proj_aurix_core') ||
    t.includes('X-Aurix-') ||
    t.includes('AURIX_SIDEBAR_EXPANDED') ||
    t.includes('aurix_live_cio_key')
  ) {
    internalCode.push(m);
  } else {
    userFacing.push(m);
  }
}

console.log(`Internal code/storage/import matches: ${internalCode.length}`);
console.log(`Potential user-facing matches: ${userFacing.length}`);

if (userFacing.length > 0) {
  console.log('\n--- POTENTIAL USER-FACING MATCHES ---');
  userFacing.forEach(m => console.log(`${m.file}:${m.line}: ${m.text}`));
}
