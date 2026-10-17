import * as fs from "node:fs";

const content = fs.readFileSync("src/routeTree.gen.ts", "utf-8");
const lines = content.split("\n");

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.toLowerCase().includes("hroperations") || line.toLowerCase().includes("hr-operations") || line.toLowerCase().includes("hr_operations")) {
    console.log(`L${i + 1}: ${line}`);
  }
}
