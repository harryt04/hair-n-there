import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("public/brand", { recursive: true });
// A font-independent H/mountain mark keeps the new circular identity legible in a browser tab.
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#2F1F33" stroke="#E8B5B8" stroke-width="3"/><path d="m17 17 10-9 8 8 5-5 9 7" fill="none" stroke="#D4AF78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21c-1 9-3 21-7 30m29-30c-4 9-6 20-6 30M20 36c7-4 15-5 22-4" fill="none" stroke="#FBF7F2" stroke-width="4.8" stroke-linecap="round"/></svg>`;
await writeFile("src/app/icon.svg", mark);
await writeFile("public/brand/monogram.svg", mark);
const frames = [];
for (const size of [16, 32, 48]) {
  const png = await sharp(Buffer.from(mark))
    .resize(size, size)
    .png()
    .toBuffer();
  await writeFile(`public/brand/icon-${size}.png`, png);
  frames.push({ size, png });
}
// ICO directory with 16/32/48px PNG frames for browser/legacy fallbacks.
const directory = Buffer.alloc(6 + frames.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
for (const [index, { size, png }] of frames.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(png.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
await writeFile(
  "src/app/favicon.ico",
  Buffer.concat([directory, ...frames.map((frame) => frame.png)]),
);

const logo = await readFile("public/brand/logo.png");
for (const size of [180, 192, 512]) {
  const inset = Math.round(size * 0.08);
  const image = await sharp(logo)
    .resize(size - 2 * inset, size - 2 * inset)
    .png()
    .toBuffer();
  const destination =
    size === 180 ? "src/app/apple-icon.png" : `public/brand/icon-${size}.png`;
  await sharp({
    create: { width: size, height: size, channels: 4, background: "#FBF7F2" },
  })
    .composite([{ input: image, left: inset, top: inset }])
    .removeAlpha()
    .png()
    .toFile(destination);
}
// The entire detailed logo fits inside the central 80%-diameter safe circle.
// A square of side 56% has corners within that circle (56% * sqrt(2) < 80%).
const maskableLogo = await sharp(logo)
  .resize(286, 286, { fit: "contain", background: "#FBF7F2" })
  .png()
  .toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#FBF7F2" },
})
  .composite([{ input: maskableLogo, left: 113, top: 113 }])
  .removeAlpha()
  .png()
  .toFile("public/brand/icon-maskable-512.png");
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#FBF7F2"/><rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="#DFD3C8"/><image href="data:image/png;base64,${logo.toString("base64")}" x="70" y="90" width="440" height="440"/><text x="550" y="235" fill="#4B2E4F" font-family="Georgia,serif" font-style="italic" font-size="64">HairnThere</text><text x="550" y="290" fill="#8B6B56" font-family="Georgia,serif" font-size="30">Great Hair Travels.</text><text x="550" y="365" fill="#3B2417" font-family="Georgia,serif" font-size="34">Beautiful Hair,</text><text x="550" y="409" fill="#3B2417" font-family="Georgia,serif" font-size="34">Wherever You Are.</text><text x="550" y="500" fill="#8B6B56" font-family="sans-serif" font-size="18" letter-spacing="2">SUNCREST · DRAPER, UTAH</text></svg>`;
await sharp(Buffer.from(social)).png().toFile("public/brand/social-card.png");
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="100" viewBox="0 0 480 100"><text x="8" y="76" fill="#4B2E4F" font-family="Georgia,serif" font-style="italic" font-weight="bold" font-size="68" letter-spacing="-4">Hair<tspan fill="#8B6B56">n</tspan>There</text><path d="M409 25h23v23m0-23-28 28" fill="none" stroke="#8B6B56" stroke-width="3"/></svg>`;
await writeFile("public/brand/wordmark.svg", wordmark);
await writeFile(
  "public/brand/wordmark-dark.svg",
  wordmark.replaceAll("#4B2E4F", "#F6EDE3").replaceAll("#8B6B56", "#B18F72"),
);
console.log(
  "Exported H/mountain SVG and 16/32/48px ICO, 180px Apple icon, 192/512px app icons, 512px maskable icon, and social card from the current brand.",
);
