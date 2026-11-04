import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
await mkdir("public/brand", { recursive: true });
const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="30" fill="#4B2E4F"/><text x="63" y="86" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="91" fill="#FBF7F2">h</text><path d="m28 105 20-18 13 9 15-17 25 26" fill="none" stroke="#D4AF78" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const smallMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#4B2E4F"/><text x="15.5" y="25" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="31" fill="#FBF7F2">h</text></svg>`;
await writeFile("src/app/icon.svg", smallMark);
await writeFile("public/brand/monogram.svg", mark);
for (const size of [16, 32, 180, 192, 512]) {
  const source = size <= 32 ? smallMark : mark;
  const dest =
    size === 180 ? "src/app/apple-icon.png" : `public/brand/icon-${size}.png`;
  await sharp(Buffer.from(source)).resize(size, size).png().toFile(dest);
}
const png = await sharp(Buffer.from(smallMark)).resize(32, 32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = 32;
ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile("src/app/favicon.ico", Buffer.concat([ico, png]));
const original = await readFile("logo.png");
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#FBF7F2"/><rect x="28" y="28" width="1144" height="574" rx="24" fill="none" stroke="#DFD3C8"/><image href="data:image/png;base64,${original.toString("base64")}" x="260" y="54" width="680" height="453"/><text x="600" y="555" text-anchor="middle" fill="#4B2E4F" font-family="Georgia,serif" font-size="25" letter-spacing="4">HOUSE CALLS · SALON APPOINTMENTS</text></svg>`;
await sharp(Buffer.from(social)).png().toFile("public/brand/social-card.png");
const wordmark = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="100" viewBox="0 0 480 100"><text x="8" y="76" fill="#4B2E4F" font-family="Georgia,serif" font-style="italic" font-weight="bold" font-size="68" letter-spacing="-4">Hair<tspan fill="#8B6B56">n</tspan>There</text><path d="M409 25h23v23m0-23-28 28" fill="none" stroke="#8B6B56" stroke-width="3"/></svg>`;
await writeFile("public/brand/wordmark.svg", wordmark);
await writeFile(
  "public/brand/wordmark-dark.svg",
  wordmark.replaceAll("#4B2E4F", "#F6EDE3").replaceAll("#8B6B56", "#B18F72"),
);
console.log("Brand icons, social card, and wordmarks exported.");
