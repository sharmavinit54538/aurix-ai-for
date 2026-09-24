const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Create 32x32 image
const size = 32;
const png = new PNG({ width: size, height: size });

// Draw OFC360 futuristic icon:
// Radial gradient background ring / circle with cyan (#06B6D4) -> blue (#3B82F6) -> violet (#7C3AED)
// and glowing white center node
const center = size / 2;
const rOuter = size * 0.44;
const rInner = size * 0.28;
const rCenter = size * 0.12;

for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    const idx = (size * y + x) << 2;
    const dx = x - center + 0.5;
    const dy = y - center + 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= rCenter) {
      // White glowing center node
      const alpha = Math.min(255, Math.floor(255 * (1 - dist / (rCenter + 1))));
      png.data[idx] = 255;
      png.data[idx + 1] = 255;
      png.data[idx + 2] = 255;
      png.data[idx + 3] = 255;
    } else if (dist <= rOuter && dist >= rInner) {
      // Ring with gradient
      const angle = Math.atan2(dy, dx); // -PI to PI
      const t = (angle + Math.PI) / (2 * Math.PI); // 0 to 1
      
      // Gradient: #06B6D4 (6, 182, 212) -> #3B82F6 (59, 130, 246) -> #7C3AED (124, 58, 237)
      let r, g, b;
      if (t < 0.5) {
        const factor = t * 2;
        r = Math.round(6 + (59 - 6) * factor);
        g = Math.round(182 + (130 - 182) * factor);
        b = Math.round(212 + (246 - 212) * factor);
      } else {
        const factor = (t - 0.5) * 2;
        r = Math.round(59 + (124 - 59) * factor);
        g = Math.round(130 + (58 - 130) * factor);
        b = Math.round(246 + (237 - 246) * factor);
      }

      // Edge antialiasing
      let edgeAlpha = 1.0;
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
      const tGlow = 1 - (dist - rCenter) / (rInner - rCenter);
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

const pngBuffer = PNG.sync.write(png);

// Pack into standard ICO format
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // 1 = ICO
header.writeUInt16LE(1, 4); // 1 image count

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(size, 0); // width
dirEntry.writeUInt8(size, 1); // height
dirEntry.writeUInt8(0, 2); // colors
dirEntry.writeUInt8(0, 3); // reserved
dirEntry.writeUInt16LE(1, 4); // color planes
dirEntry.writeUInt16LE(32, 6); // bpp
dirEntry.writeUInt32LE(pngBuffer.length, 8); // size
dirEntry.writeUInt32LE(22, 12); // offset (6 + 16)

const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);
const dest = path.resolve(__dirname, '../public/favicon.ico');
fs.writeFileSync(dest, icoBuffer);
console.log(`Generated favicon.ico successfully at ${dest} (${icoBuffer.length} bytes)`);
