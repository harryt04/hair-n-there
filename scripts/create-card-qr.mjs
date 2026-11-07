import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";
import { business } from "../src/data/business.ts";

// Generate both formats from the same services destination used by the digital card.
const directory = new URL("../public/card/", import.meta.url);
await mkdir(directory, { recursive: true });
const options = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#000000", light: "#ffffff" },
};
await writeFile(
  new URL("hairnthere-qr.svg", directory),
  await QRCode.toString(business.cardDestination, { ...options, type: "svg" }),
);
await QRCode.toFile(
  new URL("hairnthere-qr.png", directory).pathname,
  business.cardDestination,
  { ...options, width: 1200 },
);
console.log("Created SVG and PNG QR assets for the public business website.");
