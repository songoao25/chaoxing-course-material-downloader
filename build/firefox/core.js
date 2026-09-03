export function api() {
  return globalThis.browser ?? globalThis.chrome;
}

export function sanitizeSegment(value, fallback = "未命名") {
  const cleaned = String(value ?? "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
    .replace(/\.{2,}/g, "_")
    .trim();
  return cleaned || fallback;
}

export function safeRelativePath(parts) {
  return parts.map((part) => sanitizeSegment(part)).filter(Boolean).join("/");
}

export function dedupeResources(resources) {
  const seen = new Set();
  return resources.filter((item) => {
    const key = item.id || `${item.downloadUrl}|${item.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function countFiles(nodes) {
  return nodes.reduce((total, node) => total + (node.type === "file" ? 1 : countFiles(node.children ?? [])), 0);
}

export function totalBytes(nodes) {
  return nodes.reduce((total, node) => total + (node.type === "file" ? Number(node.size || 0) : totalBytes(node.children ?? [])), 0);
}

export class DownloadQueue {
  constructor(download, { concurrency = 3, retries = 2 } = {}) {
    this.download = download;
    this.concurrency = concurrency;
    this.retries = retries;
    this.paused = false;
    this.cancelled = false;
  }

  pause() { this.paused = true; }
  resume() { this.paused = false; }
  cancel() { this.cancelled = true; }

  async run(tasks, onUpdate = () => {}) {
    const queue = [...tasks];
    let cursor = 0;
    const worker = async () => {
      while (cursor < queue.length && !this.cancelled) {
        while (this.paused && !this.cancelled) await new Promise((resolve) => setTimeout(resolve, 150));
        const task = queue[cursor++];
        task.status = "downloading";
        onUpdate(task);
        let error;
        for (let attempt = 0; attempt <= this.retries && !this.cancelled; attempt += 1) {
          try {
            await this.download(task);
            task.status = "success";
            error = undefined;
            break;
          } catch (caught) {
            error = caught;
            if (attempt < this.retries) await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
          }
        }
        if (error) {
          task.status = this.cancelled ? "skipped" : "failed";
          task.error = error instanceof Error ? error.message : String(error);
        }
        onUpdate(task);
      }
    };
    await Promise.all(Array.from({ length: Math.min(this.concurrency, queue.length || 1) }, worker));
    return tasks;
  }
}
