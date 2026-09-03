import { scanCurrentPage } from "./scraper.js";

const runtime = globalThis.browser ?? globalThis.chrome;
runtime.runtime.onMessage.addListener(async (message) => {
  if (message?.type !== "scan-course") return undefined;
  return scanCurrentPage(document, location);
});
