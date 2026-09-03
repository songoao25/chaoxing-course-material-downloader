import { mkdir, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const run = promisify(execFile);
const version = "0.1.0";
const out = join(root, "release");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const browser of ["firefox", "chrome", "edge", "safari"]) {
  const source = join(root, "build", browser);
  const archive = join(out, `chaoxing-course-material-downloader-${browser}-v${version}.zip`);
  await run("zip", ["-qr", archive, "."], { cwd: source });
}
console.log(`Created store packages in ${out}`);
