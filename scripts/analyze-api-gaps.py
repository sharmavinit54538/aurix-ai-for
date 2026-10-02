import os
import re
import json

backend_json = r"c:\Users\Dell\OneDrive\Desktop\ofcb\apiofc360\categorized_endpoints_clean.json"
backend_endpoints = []

if os.path.exists(backend_json):
    with open(backend_json, "r", encoding="utf-8") as f:
        data = json.load(f)
        for cat, eps in data.items():
            for ep in eps:
                backend_endpoints.append({
                    "method": ep.get("method", "").upper(),
                    "path": ep.get("path", ""),
                    "category": cat
                })

def normalize_path(path):
    # normalize path params like ${id} or :id or {id}
    p = re.sub(r'\$\{[^}]+\}', '{param}', path)
    p = re.sub(r'\{[^}]+\}', '{param}', p)
    p = re.sub(r'/[0-9a-fA-F-]{36}', '/{param}', p)
    p = re.sub(r'/\d+', '/{param}', p)
    return p.rstrip('/')

backend_norm = set()
backend_by_path = {}
for ep in backend_endpoints:
    norm_p = normalize_path(ep['path'])
    m = ep['method']
    backend_norm.add((m, norm_p))
    if norm_p not in backend_by_path:
        backend_by_path[norm_p] = set()
    backend_by_path[norm_p].add(m)

frontend_calls = []
src_dir = 'src'

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            filepath = os.path.join(root, f).replace('\\', '/')
            try:
                content = open(filepath, 'r', encoding='utf-8', errors='ignore').read()
            except Exception:
                continue
            
            # Match apiInstance.get/post/put/patch/delete('...', ...)
            matches = re.finditer(r'apiInstance\.(get|post|put|patch|delete)\s*(?:<[^>]+>)?\s*\(\s*([`\'"])(.*?)\2', content)
            for m in matches:
                method = m.group(1).upper()
                raw_path = m.group(3)
                # Clean up query params if present
                clean_path = raw_path.split('?')[0]
                frontend_calls.append({
                    'file': filepath,
                    'method': method,
                    'raw_path': raw_path,
                    'clean_path': clean_path,
                    'norm_path': normalize_path(clean_path)
                })

print(f"Total frontend API calls found: {len(frontend_calls)}")

# Classify gaps
gaps = []
seen = set()

for call in frontend_calls:
    key = (call['file'], call['method'], call['norm_path'])
    if key in seen:
        continue
    seen.add(key)
    
    m = call['method']
    p = call['norm_path']
    
    # Check exact match
    if (m, p) in backend_norm:
        continue
    
    # Check method mismatch
    if p in backend_by_path:
        methods = backend_by_path[p]
        decision = "FRONTEND_FIX"
        notes = f"Method mismatch: Frontend uses {m}, backend expects {list(methods)}"
        gaps.append({**call, 'decision': decision, 'notes': notes})
    else:
        # Check if path prefix exists or needs FRONTEND_FIX / BACKEND_ADD / REMOVE_DEAD
        decision = "BACKEND_ADD"
        notes = "No matching backend route currently registered"
        
        # Categorize known items per master prompt
        if 'aiHub.api.ts' in call['file'] or 'analytics.api.ts' in call['file']:
            notes = "AI Hub / Analytics route reconciliation"
        elif 'attendanceApi.ts' in call['file']:
            notes = "Attendance module route reconciliation"
        elif 'settings' in call['file']:
            notes = "Settings / config API route reconciliation"
        elif 'profileApi.ts' in call['file']:
            notes = "Profile / user me route reconciliation"
        elif 'payroll' in call['file']:
            notes = "Payroll v1 vs v2 route reconciliation"
            
        gaps.append({**call, 'decision': decision, 'notes': notes})

print(f"Identified {len(gaps)} gaps/reconciliations.")

with open('docs/API_GAPS.md', 'w', encoding='utf-8') as out:
    out.write('# API Contract Gaps & Reconciliation\n\n')
    out.write('Total unique calls checked against backend route catalog. Decisions: `FRONTEND_FIX` | `BACKEND_ADD` | `REMOVE_DEAD`.\n\n')
    out.write('| File | Method | Path | Decision | Notes |\n')
    out.write('| :--- | :--- | :--- | :--- | :--- |\n')
    for g in gaps:
        out.write(f'| `{g["file"]}` | `{g["method"]}` | `{g["clean_path"]}` | `{g["decision"]}` | {g["notes"]} |\n')

print("Wrote docs/API_GAPS.md successfully.")
