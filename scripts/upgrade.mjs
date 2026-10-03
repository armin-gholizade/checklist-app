import { existsSync, mkdirSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
for (const name of ["apps/api/src/lists.ts", "apps/web/src/app.html"]) {
  const source = join(root, name);
  if (existsSync(source)) {
    const backup = join(root, "upgrade-backup", stamp, name);
    mkdirSync(dirname(backup), { recursive: true });
    renameSync(source, backup);
    console.log("Moved obsolete file to backup:", name);
  }
}
console.log(
  "Source upgrade ready. Run npm run db:generate and npm run db:migrate before npm run dev.",
);
