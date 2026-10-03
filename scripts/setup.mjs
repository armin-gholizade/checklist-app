import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
const target = new URL("../apps/api/.env", import.meta.url);
if (!existsSync(target)) {
  const example = readFileSync(
    new URL("../apps/api/.env.example", import.meta.url),
    "utf8",
  );
  writeFileSync(
    target,
    example.replace(
      "replace-with-at-least-32-random-characters",
      randomBytes(48).toString("hex"),
    ),
  );
  console.log("Created apps/api/.env with a random session secret.");
} else console.log("Existing .env preserved.");
