import QRCode from "qrcode";
import { mkdir, writeFile } from "node:fs/promises";

// A dónde lleva el QR. Mejor una ruta puente de tu dominio (ver paso 4)
const TARGET_URL = "https://contact.discovervcm.com/";
const OUT_DIR = "public/qr";

const options = {
    margin: 2,
    errorCorrectionLevel: "H", // se lee aunque se dañe hasta un 30%
    color: { dark: "#171717", light: "#FFFFFF" },
};

await mkdir(OUT_DIR, { recursive: true });

// PNG en alta resolución, para uso digital
await QRCode.toFile(`${OUT_DIR}/vcm-qr.png`, TARGET_URL, { ...options, width: 1024 });

// SVG vectorial, para imprenta
const svg = await QRCode.toString(TARGET_URL, { ...options, type: "svg" });
await writeFile(`${OUT_DIR}/vcm-qr.svg`, svg);

console.log(`QR generado para ${TARGET_URL} en ${OUT_DIR}/`);