import { rmSync } from "node:fs";
import { join } from "node:path";

const targets = [
  join(process.cwd(), ".next"),
  join(process.cwd(), ".next-app"),
  join(process.cwd(), ".next-build"),
  join(process.cwd(), ".next", "types", "cache-life.d.ts"),
];

for (const target of targets) {
  try {
    rmSync(target, { recursive: true, force: true });
  } catch {
    // ignore cleanup failures caused by transient file locks
  }
}
