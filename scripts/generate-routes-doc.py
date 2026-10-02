import os
import re

routes_dir = 'src/routes'
routes = []

for root, _, files in os.walk(routes_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts')) and not f.endswith('.d.ts'):
            path = os.path.join(root, f).replace('\\', '/')
            try:
                content = open(path, 'r', encoding='utf-8', errors='ignore').read()
            except Exception:
                continue
            
            # Find imported page/component or component definition
            imports = re.findall(r'import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+[\'\"]([^\'\"]+)[\'\"]', content)
            component = 'Inline/RouteComponent'
            imported_files = []
            for brace_imp, default_imp, mod_path in imports:
                target = brace_imp or default_imp
                if any(k in target for k in ['Page', 'View', 'Dashboard', 'Layout', 'Screen']):
                    component = target.strip()
                    imported_files.append((target.strip(), mod_path))
            
            has_api = 'apiInstance' in content or 'Api.' in content or 'fetch' in content or 'axios' in content
            has_redux = 'useAppSelector' in content or 'useSelector' in content or 'useAppDispatch' in content or 'dispatch(' in content
            has_local = 'localStorage' in content or 'useHrms' in content or 'hrms.' in content
            
            for comp_name, mod_path in imported_files:
                resolved_paths = [
                    os.path.normpath(os.path.join(os.path.dirname(path), mod_path) + ext).replace('\\', '/')
                    for ext in ['', '.tsx', '.ts', '/index.tsx', '/index.ts']
                ]
                if mod_path.startswith('@/'):
                    clean_mod = mod_path.replace('@/', 'src/')
                    resolved_paths.extend([
                        os.path.normpath(clean_mod + ext).replace('\\', '/')
                        for ext in ['', '.tsx', '.ts', '/index.tsx', '/index.ts']
                    ])
                for rpath in resolved_paths:
                    if os.path.exists(rpath) and os.path.isfile(rpath):
                        try:
                            ccontent = open(rpath, 'r', encoding='utf-8', errors='ignore').read()
                            if 'apiInstance' in ccontent or 'Api.' in ccontent or 'fetch' in ccontent: has_api = True
                            if 'useAppSelector' in ccontent or 'useSelector' in ccontent or 'dispatch(' in ccontent: has_redux = True
                            if 'localStorage' in ccontent or 'useHrms' in ccontent or 'hrms.' in ccontent: has_local = True
                        except Exception:
                            pass
                        break

            sources = []
            if has_api: sources.append('API')
            if has_redux: sources.append('Redux')
            if has_local: sources.append('localStorage/useHrms')
            if not sources: sources.append('Static/Hardcoded')

            routes.append({
                'route_file': path,
                'component': component,
                'sources': ', '.join(sources)
            })

routes.sort(key=lambda x: x['route_file'])
print(f'Processed {len(routes)} routes.')

with open('docs/ROUTES.md', 'w', encoding='utf-8') as out:
    out.write('# Route Inventory & Data Source Mapping\n\n')
    out.write('This inventory maps every TanStack route file to its rendering component and primary data sources (API, Redux, localStorage/useHrms, Static/Hardcoded).\n\n')
    out.write('| Route File | Component | Data Source |\n')
    out.write('| :--- | :--- | :--- |\n')
    for r in routes:
        out.write(f'| `{r["route_file"]}` | `{r["component"]}` | {r["sources"]} |\n')

print('Wrote docs/ROUTES.md successfully.')
