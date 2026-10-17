import { Generator, getConfig } from "@tanstack/router-generator";
import * as fs from "node:fs";

async function main() {
  const config = getConfig({}, process.cwd());
  const gen = new Generator({ config, root: process.cwd() });
  
  // monkey patch safeFileWrite
  const origSafeFileWrite = (gen as any).safeFileWrite.bind(gen);
  (gen as any).safeFileWrite = async function(args: any) {
    console.log("safeFileWrite called with filePath:", args.filePath);
    try {
      const res = await origSafeFileWrite(args);
      console.log("safeFileWrite succeeded:", res);
      return res;
    } catch (err) {
      console.error("safeFileWrite FAILED with error:", err);
      throw err;
    }
  };

  await gen.run();
  console.log("gen.run() completed successfully.");
}

main().catch(console.error);
