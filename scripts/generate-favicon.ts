import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create 32x32 image
const size: number = 32;
const png: PNG = new PNG({ width: size, height: size });

// Draw OFC360 futuristic icon:
// Radial gradient background ring / circle with cyan (#06B6D4) -> blue (#3B82F6) -> violet (#7C3AED)
// and glowing white center node
const center: number = size / 2;
const rOuter: number = size * 0.44;
const rInner: number = size * 0.28;
const rCenter: number = size * 0.12;

for (let y: number = 0; y < size; y++) {
  for (let x: number = 0; x < size; x++) {
    const idx: number = (size * y + x) << 2;
    const dx: number = x - center + 0.5;
    const dy: number = y - center + 0.5;
    const dist: number = Math.sqrt(dx * dx + dy * dy);

    if (dist <= rCenter) {
      // White glowing center node
      const alpha: number = Math.min(255, Math.floor(255 * (1 - dist / (rCenter + 1))));
      void alpha;
      png.data[idx] = 255;
      png.data[idx + 1] = 255;
      png.data[idx + 2] = 255;
      png.data[idx + 3] = 255;
    } else if (dist <= rOuter && dist >= rInner) {
      // Ring with gradient
      const angle: number = Math.atan2(dy, dx); // -PI to PI
      const t: number = (angle + Math.PI) / (2 * Math.PI); // 0 to 1

      // Gradient: #06B6D4 (6, 182, 212) -> #3B82F6 (59, 130, 246) -> #7C3AED (124, 58, 237)
      let r: number;
      let g: number;
      let b: number;
      if (t < 0.5) {
        const factor: number = t * 2;
        r = Math.round(6 + (59 - 6) * factor);
        g = Math.round(182 + (130 - 182) * factor);
        b = Math.round(212 + (246 - 212) * factor);
      } else {
        const factor: number = (t - 0.5) * 2;
        r = Math.round(59 + (124 - 59) * factor);
        g = Math.round(130 + (58 - 130) * factor);
        b = Math.round(246 + (237 - 246) * factor);
      }

      // Edge antialiasing
      let edgeAlpha: number = 1.0;
      if (dist < rInner + 1) {
        edgeAlpha = dist - rInner;
      } else if (dist > rOuter - 1) {
        edgeAlpha = rOuter - dist;
      }
      edgeAlpha = Math.max(0, Math.min(1, edgeAlpha));

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = Math.round(255 * edgeAlpha);
    } else if (dist < rInner && dist > rCenter) {
      // Inner soft glow from center
      const tGlow: number = 1 - (dist - rCenter) / (rInner - rCenter);
      png.data[idx] = 59;
      png.data[idx + 1] = 130;
      png.data[idx + 2] = 246;
      png.data[idx + 3] = Math.round(120 * tGlow);
    } else {
      // Outside
      png.data[idx] = 0;
      png.data[idx + 1] = 0;
      png.data[idx + 2] = 0;
      png.data[idx + 3] = 0;
    }
  }
}

const pngBuffer: Buffer = PNG.sync.write(png);

// Pack into standard ICO format
const header: Buffer = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = ICO
header.writeUInt16LE(1, 4); // 1 image count

const dirEntry: Buffer = Buffer.alloc(16);
dirEntry.writeUInt8(size, 0); // width
dirEntry.writeUInt8(size, 1); // height
dirEntry.writeUInt8(0, 2); // colors
dirEntry.writeUInt8(0, 3); // reserved
dirEntry.writeUInt16LE(1, 4); // color planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(pngBuffer.length, 8); // size
dirEntry.writeUInt32LE(22, 12); // offset (6 + 16)

const icoBuffer: Buffer = Buffer.concat([header, dirEntry, pngBuffer]);
const dest: string = path.resolve(__dirname, "../public/favicon.ico");
fs.writeFileSync(dest, icoBuffer);
console.log(`Generated favicon.ico successfully at ${dest} (${icoBuffer.length} bytes)`);
