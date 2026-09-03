import { mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const run = promisify(execFile);
const out = join(root, "release-simple");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const browser of ["chrome", "edge", "firefox"]) {
  await run("zip", ["-qr", join(out, `chaoxing-downloader-${browser}.zip`), "."], { cwd: join(root, "build", browser) });
}
console.log(`Created simple deployment packages in ${out}`);
