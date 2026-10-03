import fs from "fs";
import path from "path";

/**
 * CI-friendly script: check-api-contract.ts
 *
 * Extracts all `apiInstance.*` calls across the codebase and verifies them
 * against `openapi.json` (backend contract) and `scripts/backend-add-allowlist.json`.
 * Fails the build (exits with code 1) on unexpected or undocumented routes.
 */

const projectRoot = process.cwd();
const openapiPath = path.resolve(projectRoot, "openapi.json");
const allowlistPath = path.resolve(projectRoot, "scripts/backend-add-allowlist.json");

if (!fs.existsSync(openapiPath)) {
  console.error(`[CONTRACT CHECK] Error: openapi.json not found at ${openapiPath}`);
  process.exit(1);
}

const openapi = JSON.parse(fs.readFileSync(openapiPath, "utf-8"));
const openapiPaths: string[] = Object.keys(openapi.paths || {});

let allowlist: string[] = [];
if (fs.existsSync(allowlistPath)) {
  allowlist = JSON.parse(fs.readFileSync(allowlistPath, "utf-8"));
}

function normalizePath(p: string): string {
  let clean = p.trim().split("?")[0];
  if (!clean.startsWith("/")) clean = "/" + clean;
  if (!clean.startsWith("/api/")) clean = "/api/v1" + clean;
  clean = clean.replace(/\$\{[^}]+\}/g, "{param}");
  clean = clean.replace(/\{[^}]+\}/g, "{param}");
  clean = clean.replace(/\/[0-9a-fA-F-]{36}/g, "/{param}");
  clean = clean.replace(/\/\d+/g, "/{param}");
  return clean.replace(/\/+$/, "");
}

const registeredRoutes = new Set<string>();
for (const p of openapiPaths) {
  registeredRoutes.add(normalizePath(p));
}

const allowedRoutes = new Set<string>();
for (const p of allowlist) {
  allowedRoutes.add(normalizePath(p));
}

function walkDir(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.resolve(projectRoot, "src");
const files = walkDir(srcDir);
const callRegex = /apiInstance\.(get|post|put|patch|delete)\s*(?:<[^>]+>)?\s*\(\s*([`'"])(.*?)\2/g;

interface ApiCallRecord {
  file: string;
  line: number;
  method: string;
  rawPath: string;
  normPath: string;
}

const extractedCalls: ApiCallRecord[] = [];

for (const file of files) {
  // Skip test files
  if (
    file.includes("__tests__") ||
    file.includes(".test.") ||
    file.includes(".spec.") ||
    file.includes("testing")
  ) {
    continue;
  }

  const content = fs.readFileSync(file, "utf-8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    let match;
    while ((match = callRegex.exec(lineText)) !== null) {
      const method = match[1].toUpperCase();
      const rawPath = match[3];
      const norm = normalizePath(rawPath);
      extractedCalls.push({
        file: path.relative(projectRoot, file).replace(/\\/g, "/"),
        line: i + 1,
        method,
        rawPath,
        normPath: norm,
      });
    }
  }
}

const unknownCalls: ApiCallRecord[] = [];
for (const call of extractedCalls) {
  const isRegistered = registeredRoutes.has(call.normPath);
  const isAllowed = allowedRoutes.has(call.normPath);

  if (!isRegistered && !isAllowed) {
    unknownCalls.push(call);
  }
}

console.log("=================================================");
console.log("             OFC360 API CONTRACT CHECK           ");
console.log("=================================================");
console.log(`Backend OpenAPI Routes:    ${registeredRoutes.size}`);
console.log(`Allow-listed BACKEND_ADD:  ${allowedRoutes.size}`);
console.log(`Frontend API Calls Checked:${extractedCalls.length}`);
console.log("-------------------------------------------------");

if (unknownCalls.length > 0) {
  console.error(`FAIL: Found ${unknownCalls.length} unknown API call(s) not in OpenAPI or Allow-list:\n`);
  for (const u of unknownCalls) {
    console.error(`  - [${u.method}] ${u.rawPath}`);
    console.error(`    Normalized: ${u.normPath}`);
    console.error(`    Location:   ${u.file}:${u.line}\n`);
  }
  process.exit(1);
} else {
  console.log("PASS: All frontend API calls match backend routes or allow-listed pending additions.\n");
  process.exit(0);
}
