import * as fs from "node:fs";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

function getAllRouteFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith("__tests__")) {
        getAllRouteFiles(fullPath, fileList);
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

async function main() {
  const routesDir = path.resolve("src/routes");
  const files = getAllRouteFiles(routesDir);
  console.log(`Found ${files.length} route files`);

  let invalidRouteCount = 0;
  for (const file of files) {
    const rel = path.relative(process.cwd(), file);
    try {
      const url = pathToFileURL(file).href;
      const mod = await import(url);
      if (!mod.Route) {
        console.warn(`[WARN] ${rel} has no Route export`);
        invalidRouteCount++;
        continue;
      }
      if (!mod.Route.options) {
        console.error(`[ERROR] ${rel} mod.Route.options is UNDEFINED!`);
        invalidRouteCount++;
      } else {
        const comp = mod.Route.options.component;
        if (comp === undefined && !mod.Route.options.loader && !mod.Route.options.beforeLoad) {
          console.warn(`[INFO] ${rel} has no component, loader, or beforeLoad`);
        }
      }
    } catch (err: any) {
      console.error(`[THROW] ${rel} threw on import: ${err.message}`);
      invalidRouteCount++;
    }
  }

  console.log(`Finished checking. Invalid/problematic route files: ${invalidRouteCount}`);
}

main().catch(console.error);
