import * as fs from "node:fs";

function printContext(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  let idx = 0;
  while ((idx = content.indexOf(".component", idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(`--- Match in ${filePath} at ${idx} ---`);
    console.log(content.slice(start, end));
    idx += 10;
  }
}

printContext(".output/public/assets/index-pyIQBtzp.js");
