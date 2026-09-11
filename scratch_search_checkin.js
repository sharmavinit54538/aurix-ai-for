import fs from "fs";
let content = fs.readFileSync("tmp-openapi.json", "utf8");
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
const data = JSON.parse(content);
for (const p of Object.keys(data.paths)) {
  if (p.includes("attendance") || p.includes("checkin") || p.includes("checkout") || p.includes("break")) {
    console.log("ENDPOINT:", p);
    for (const [m, op] of Object.entries(data.paths[p])) {
      console.log(`  [${m.toUpperCase()}] summary: ${op.summary}`);
      if (op.requestBody) {
        console.log(`    requestBody schema:`, JSON.stringify(op.requestBody.content?.["application/json"]?.schema || op.requestBody.content?.["multipart/form-data"]?.schema || op.requestBody));
      }
      if (op.parameters) {
        console.log(`    params:`, op.parameters.map(param => param.name + ` (${param.in})`).join(", "));
      }
    }
  }
}
