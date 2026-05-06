import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

// CRC32 lookup table
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcData = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

/** Build a PNG with RGBA pixels from a draw function */
function buildPNG(size, draw) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  // Raw image data (filter byte 0 per row + RGB pixels)
  const raw = Buffer.allocUnsafe(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 3)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b] = draw(x, y, size);
      const off = y * (1 + size * 3) + 1 + x * 3;
      raw[off] = r; raw[off + 1] = g; raw[off + 2] = b;
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  return Buffer.concat([PNG_SIG, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// ── Colors ────────────────────────────────────────────────────
const BG   = [168, 173, 127];  // #a8ad7f olive
const INK  = [42,  48,  24];   // #2a3018 dark rule
const CX   = [138, 43,  31];   // #8a2b1f red (X)
const CO   = [53,  94,  138];  // #355e8a blue (O)

function drawIcon(x, y, size, padding = 0) {
  const s = size - padding * 2;
  const px = x - padding, py = y - padding;

  // outside padding → bg
  if (px < 0 || py < 0 || px >= s || py >= s) return BG;

  // outer border (3px)
  const bw = Math.max(3, Math.round(s * 0.025));
  if (px < bw || py < bw || px >= s - bw || py >= s - bw) return INK;

  const inner = s - bw * 2;
  const ix = px - bw, iy = py - bw;

  // 3x3 grid — divide inner into 3 equal cells
  const cell = Math.floor(inner / 3);
  const gw = Math.max(2, Math.round(s * 0.018));
  const col = Math.floor(ix / cell);
  const row = Math.floor(iy / cell);
  const cx = ix % cell, cy = iy % cell;

  // grid lines between cells
  if ((col < 2 && cx >= cell - gw) || (row < 2 && cy >= cell - gw)) return INK;

  // clamp to 0-2
  const c = Math.min(col, 2), r = Math.min(row, 2);

  // Draw X in top-left (0,0), O in center (1,1), X in bottom-right (2,2)
  const marks = { '0,0': 'X', '1,1': 'O', '2,2': 'X' };
  const mark = marks[`${c},${r}`];

  if (mark) {
    const sz = cell - gw;
    const lx = cx, ly = cy;
    const m = Math.round(sz * 0.18); // margin within cell
    const thick = Math.max(2, Math.round(sz * 0.13));

    if (mark === 'X') {
      // Draw X as two diagonal stripes
      const dx = Math.abs(lx - ly), ds = Math.abs(lx - (sz - 1 - ly));
      if ((lx >= m && lx < sz - m && ly >= m && ly < sz - m) &&
          (dx <= thick || ds <= thick)) return CX;
    }

    if (mark === 'O') {
      // Draw O as a ring
      const cx2 = sz / 2, cy2 = sz / 2;
      const dist = Math.sqrt((lx - cx2) ** 2 + (ly - cy2) ** 2);
      const r1 = sz * 0.22, r2 = sz * 0.38;
      if (dist >= r1 && dist <= r2) return CO;
    }
  }

  return BG;
}

mkdirSync('public/icons', { recursive: true });

writeFileSync('public/icons/icon-192.png',         buildPNG(192, (x, y, s) => drawIcon(x, y, s, 0)));
writeFileSync('public/icons/icon-512.png',         buildPNG(512, (x, y, s) => drawIcon(x, y, s, 0)));
writeFileSync('public/icons/icon-maskable-512.png', buildPNG(512, (x, y, s) => drawIcon(x, y, s, Math.round(512 * 0.1))));

console.log('Icons generated in public/icons/');
