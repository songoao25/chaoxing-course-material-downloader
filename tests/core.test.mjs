import test from "node:test";
import assert from "node:assert/strict";
import { DownloadQueue, safeRelativePath, sanitizeSegment } from "../src/core.js";
import { makeTree } from "../src/scraper.js";

test("sanitizes unsafe file segments and preserves Chinese names", () => {
  assert.equal(sanitizeSegment("章节/../第一章?.pdf"), "章节___第一章_.pdf");
  assert.equal(safeRelativePath(["知识产权法学", "章节", "第一章", "课件.pptx"]), "知识产权法学/章节/第一章/课件.pptx");
});

test("download queue limits concurrency and retries failures", async () => {
  let active = 0; let peak = 0; const attempts = new Map();
  const queue = new DownloadQueue(async (task) => {
    active++; peak = Math.max(peak, active); await new Promise((resolve) => setTimeout(resolve, 2));
    const count = (attempts.get(task.resourceId) || 0) + 1; attempts.set(task.resourceId, count); active--;
    if (task.resourceId === "bad") throw new Error("network");
  }, { concurrency: 2, retries: 2 });
  const tasks = ["one", "two", "bad"].map((resourceId) => ({ resourceId, status: "pending" }));
  await queue.run(tasks);
  assert.ok(peak <= 2); assert.equal(tasks[0].status, "success"); assert.equal(tasks[1].status, "success"); assert.equal(tasks[2].status, "failed"); assert.equal(attempts.get("bad"), 3);
});

test("material and chapter trees preserve source and nested paths", () => {
  const root = makeTree([
    { id: "m1", name: "讲义.pdf", type: "file", source: "materials", downloadUrl: "https://example.test/m1", path: ["教师课件", "第一章", "讲义.pdf"] },
    { id: "c1", name: "案例.docx", type: "file", source: "chapters", downloadUrl: "https://example.test/c1", path: ["第一章", "第一节", "案例.docx"] }
  ], "知识产权法学", "materials");
  assert.equal(root.name, "资料");
  assert.equal(root.children[0].name, "教师课件");
  assert.equal(root.children[0].children[0].name, "第一章");
  assert.equal(root.children[0].children[0].children[0].path, "知识产权法学/资料/教师课件/第一章/讲义.pdf");
});
