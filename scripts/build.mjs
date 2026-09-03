import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const build = join(root, "build");
const run = promisify(execFile);
await rm(build, { recursive: true, force: true });
const files = ["manifest.json", "src/core.js", "src/scraper.js", "src/content.js", "src/background.js", "src/app.html", "src/app.js", "src/styles.css"];
for (const target of ["firefox", "chrome", "edge", "safari"]) {
  const out = join(build, target); await mkdir(out, { recursive: true });
  for (const file of files) await cp(join(root, file), join(out, file.split("/").pop()));
  await run("convert", [join(root, "src/icons/icon.svg"), "-resize", "16x16", join(out, "icon-16.png")]);
  await run("convert", [join(root, "src/icons/icon.svg"), "-resize", "32x32", join(out, "icon-32.png")]);
  await run("convert", [join(root, "src/icons/icon.svg"), "-resize", "48x48", join(out, "icon-48.png")]);
  await run("convert", [join(root, "src/icons/icon.svg"), "-resize", "128x128", join(out, "icon-128.png")]);
  const manifest = JSON.parse(await readFile(join(root, "manifest.json"), "utf8"));
  if (target === "firefox") manifest.browser_specific_settings = { gecko: { id: "chaoxing-downloader@example.local", strict_min_version: "109.0" } };
  await writeFile(join(out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}
await writeFile(join(build, "safari", "SAFARI.md"), "将此目录作为 Safari Web Extension 资源导入 Xcode 的 Safari Extension App，然后在 macOS 上签名运行。Safari 不支持直接安装 Chrome 或 Firefox 扩展目录。\n");
console.log(`Built browser extensions in ${build}`);
