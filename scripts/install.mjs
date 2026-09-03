import { access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const args = new Set(process.argv.slice(2));
const requested = process.argv.find((value) => value.startsWith("--browser="))?.split("=", 2)[1] || "auto";
const json = args.has("--json");
const open = args.has("--open");

const candidates = {
  chrome: { page: "chrome://extensions", dirs: ["/Applications/Google Chrome.app", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "C:/Program Files/Google/Chrome/Application/chrome.exe", `${process.env.LOCALAPPDATA || ""}/Google/Chrome/Application/chrome.exe`] },
  edge: { page: "edge://extensions", dirs: ["/Applications/Microsoft Edge.app", "/usr/bin/microsoft-edge", "/usr/bin/microsoft-edge-stable", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", `${process.env.LOCALAPPDATA || ""}/Microsoft/Edge/Application/msedge.exe`] },
  firefox: { page: "about:debugging#/runtime/this-firefox", dirs: ["/Applications/Firefox.app", "/usr/bin/firefox", "C:/Program Files/Mozilla Firefox/firefox.exe", `${process.env.LOCALAPPDATA || ""}/Mozilla Firefox/firefox.exe`] }
};

async function exists(path) { try { await access(path); return true; } catch { return false; } }
async function detectBrowser() {
  if (requested !== "auto") return candidates[requested] ? requested : fail(`不支持的浏览器：${requested}`);
  for (const browser of ["chrome", "edge", "firefox"]) {
    const installed = await Promise.any(candidates[browser].dirs.map(async (path) => {
      if (await exists(path)) return true;
      throw new Error("not found");
    }).map((promise) => promise.catch(() => false)));
    if (installed) return browser;
  }
  return "chrome";
}
function fail(message) { if (json) { console.log(JSON.stringify({ ok: false, error: message })); process.exit(1); } throw new Error(message); }
function openPage(url) {
  const command = process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const commandArgs = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  spawn(command, commandArgs, { detached: true, stdio: "ignore" }).unref();
}

const browser = await detectBrowser();
const extensionDir = join(root, "build", browser);
if (!(await exists(join(extensionDir, "manifest.json")))) fail(`找不到 ${browser} 构建目录，请先运行 npm run build`);
const result = {
  ok: true,
  browser,
  extensionDir,
  extensionPage: candidates[browser].page,
  manualConfirmationRequired: true,
  steps: browser === "firefox"
    ? ["打开 about:debugging#/runtime/this-firefox", "点击临时载入附加组件", `选择 ${join(extensionDir, "manifest.json")}`]
    : ["打开浏览器扩展页面", "开启开发者模式", `选择加载已解压扩展并选择 ${extensionDir}`]
};
if (open) openPage(result.extensionPage);
if (json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`检测到浏览器：${browser}`);
  console.log(`扩展目录：${extensionDir}`);
  console.log(`已打开：${result.extensionPage}`);
  console.log(`请完成最后一步：${result.steps[result.steps.length - 1]}`);
  console.log("浏览器禁止免商店扩展静默安装，因此这一步必须由用户确认。");
}
