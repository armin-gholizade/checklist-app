import { copyFileSync, writeFileSync, existsSync } from "node:fs";
import { extname } from "node:path";
const source = process.argv[2];
const ext = source && extname(source).toLowerCase();
if (
  !source ||
  !existsSync(source) ||
  ![".woff2", ".woff", ".ttf"].includes(ext)
) {
  console.error(
    'Usage: node scripts/install-font.mjs "C:/path/to/licensed-font.woff2"',
  );
  process.exit(1);
}
copyFileSync(
  source,
  new URL("../apps/web/public/fonts/custom" + ext, import.meta.url),
);
writeFileSync(
  new URL("../apps/web/public/fonts/custom.css", import.meta.url),
  `@font-face{font-family:CustomPersian;src:url('/fonts/custom${ext}') format('${ext === ".ttf" ? "truetype" : ext.slice(1)}');font-weight:100 900;font-display:swap}body{--font:CustomPersian,Vazirmatn,Tahoma,sans-serif}`,
);
console.log("Font installed. Restart the frontend or rebuild.");
