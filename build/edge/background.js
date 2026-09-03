import { api, DownloadQueue } from "./core.js";

const browserApi = api();
const queues = new Map();
const pendingDownloads = new Map();

if (browserApi.downloads?.onChanged) {
  browserApi.downloads.onChanged.addListener((change) => {
    const pending = pendingDownloads.get(change.id);
    if (!pending || !change.state) return;
    if (change.state.current === "complete") { pendingDownloads.delete(change.id); pending.resolve(); }
    if (change.state.current === "interrupted") { pendingDownloads.delete(change.id); pending.reject(new Error(change.error?.current || "下载被中断")); }
  });
}

function waitForDownload(id) {
  if (!browserApi.downloads?.onChanged) return Promise.resolve();
  return new Promise((resolve, reject) => pendingDownloads.set(id, { resolve, reject }));
}

browserApi.runtime.onMessage.addListener(async (message, sender) => {
  if (message?.type !== "download-selected") return undefined;
  const taskId = crypto.randomUUID();
  const queue = new DownloadQueue(async (task) => {
    const downloadId = await browserApi.downloads.download({ url: task.url, filename: task.filename, saveAs: false, conflictAction: "uniquify" });
    if (downloadId == null) throw new Error("浏览器未接受下载任务");
    await waitForDownload(downloadId);
  });
  queues.set(taskId, queue);
  queue.run(message.tasks, (task) => browserApi.runtime.sendMessage({ type: "download-progress", taskId, task }).catch(() => {}));
  return { taskId };
});

browserApi.runtime.onMessage.addListener((message) => {
  const queue = message?.taskId && queues.get(message.taskId);
  if (!queue) return undefined;
  if (message.type === "pause-download") queue.pause();
  if (message.type === "resume-download") queue.resume();
  if (message.type === "cancel-download") queue.cancel();
  return undefined;
});
