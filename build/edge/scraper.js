import { dedupeResources, safeRelativePath, sanitizeSegment } from "./core.js";

const FILE_KEYS = ["downloadUrl", "fileUrl", "downUrl", "url", "path", "objectUrl"];
const NAME_KEYS = ["name", "filename", "fileName", "title", "resName", "resourceName"];

function first(object, keys) {
  for (const key of keys) if (object && typeof object[key] === "string" && object[key].trim()) return object[key].trim();
  return undefined;
}

function absoluteUrl(value, baseUrl) {
  try { return new URL(value, baseUrl).href; } catch { return undefined; }
}

function looksLikeFile(object) {
  const url = first(object, FILE_KEYS);
  const name = first(object, NAME_KEYS);
  return Boolean(url && name && (/^https?:/i.test(url) || /\.(pdf|docx?|pptx?|xlsx?|zip|rar|7z|jpe?g|png|gif|mp[34]|wav|txt)$/i.test(url)));
}

function collectJson(value, context, out, seen = new WeakSet()) {
  if (!value || typeof value !== "object") return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((item) => collectJson(item, context, out, seen));
    return;
  }
  if (looksLikeFile(value)) {
    const rawUrl = first(value, FILE_KEYS);
    const name = sanitizeSegment(first(value, NAME_KEYS));
    const url = absoluteUrl(rawUrl, context.baseUrl);
    if (url) out.push({ id: String(value.id ?? value.objectid ?? `${url}|${name}`), name, type: "file", source: context.source, downloadUrl: url, size: Number(value.size || value.fileSize || 0) || undefined, path: [...context.path, name] });
  }
  const folder = first(value, ["folderName", "dirName", "chapterName", "sectionName"]);
  const nextPath = folder ? [...context.path, sanitizeSegment(folder)] : context.path;
  Object.entries(value).forEach(([key, child]) => {
    if (key !== "url" && key !== "path") collectJson(child, { ...context, path: nextPath }, out, seen);
  });
}

function domResources(document, source, baseUrl) {
  const out = [];
  for (const element of document.querySelectorAll("a, [data-url], [data-download-url], [data-file-url], [data-objectid]")) {
    const rawUrl = element.getAttribute("href") || element.dataset.url || element.dataset.downloadUrl || element.dataset.fileUrl;
    const text = element.textContent?.trim() || element.getAttribute("title");
    if (!rawUrl || !text || rawUrl.startsWith("javascript:") || rawUrl === "#") continue;
    const url = absoluteUrl(rawUrl, baseUrl);
    if (!url || !/^https?:/i.test(url)) continue;
    const name = sanitizeSegment(text.split("\n")[0]);
    if (name.length < 2) continue;
    out.push({ id: element.dataset.objectid || `${url}|${name}`, name, type: "file", source, downloadUrl: url, path: [name] });
  }
  return out;
}

export function makeTree(resources, courseName, source) {
  const root = { id: `${source}:root`, name: source === "materials" ? "资料" : "章节", type: "folder", source, children: [] };
  const folders = new Map([["", root]]);
  for (const resource of dedupeResources(resources)) {
    const segments = resource.path?.length ? [...resource.path] : [resource.name];
    const fileName = segments.pop();
    let current = root;
    let key = "";
    for (const segment of segments) {
      key = `${key}/${segment}`;
      if (!folders.has(key)) {
        const folder = { id: `${source}:folder:${key}`, name: segment, type: "folder", source, children: [] };
        current.children.push(folder);
        folders.set(key, folder);
      }
      current = folders.get(key);
    }
    current.children.push({ ...resource, name: fileName, path: safeRelativePath([courseName, source === "materials" ? "资料" : "章节", ...segments, fileName]) });
  }
  return root;
}

export async function scanCurrentPage(document, location, fetcher = globalThis.fetch) {
  const url = new URL(location.href);
  const courseName = document.querySelector("[class*='course'], [class*='Course'], h1, h2")?.textContent?.trim()?.split("\n")[0] || document.title.split("-")[0].trim() || "学习通课程";
  const course = { id: url.searchParams.get("courseid") || url.searchParams.get("courseId") || url.searchParams.get("clazzid") || location.href, name: sanitizeSegment(courseName), sourceUrl: location.href };
  const materials = [...domResources(document, "materials", location.href)];
  const chapters = [...domResources(document, "chapters", location.href)];
  const errors = [];
  const linkedPages = [...document.querySelectorAll("a[href]")]
    .map((link) => absoluteUrl(link.getAttribute("href"), location.href))
    .filter((href) => href && new URL(href).origin === location.origin && /chapter|knowledge|mycourse|course/i.test(href))
    .slice(0, 40);
  for (const linkedPage of [...new Set(linkedPages)]) {
    try {
      const response = await fetcher(linkedPage, { credentials: "include" });
      if (!response.ok) continue;
      const html = await response.text();
      const linkedDocument = new DOMParser().parseFromString(html, "text/html");
      chapters.push(...domResources(linkedDocument, "chapters", linkedPage));
    } catch (error) {
      errors.push({ path: linkedPage, message: error instanceof Error ? error.message : String(error) });
    }
  }
  const resourceUrls = performance.getEntriesByType?.("resource").map((entry) => entry.name).filter((name) => /stu-datalist|coursedata|knowledge|chapter|resource|download/i.test(name)) ?? [];
  for (const endpoint of [...new Set(resourceUrls)].slice(0, 30)) {
    try {
      const response = await fetcher(endpoint, { credentials: "include" });
      if (!response.ok) continue;
      const payload = await response.json();
      const target = /chapter|knowledge/i.test(endpoint) ? chapters : materials;
      collectJson(payload, { source: target === chapters ? "chapters" : "materials", baseUrl: endpoint, path: [] }, target);
    } catch (error) {
      errors.push({ path: endpoint, message: error instanceof Error ? error.message : String(error) });
    }
  }
  const roots = [makeTree(materials, course.name, "materials"), makeTree(chapters, course.name, "chapters")];
  return { course, roots, errors, totalFiles: roots.reduce((sum, root) => sum + count(root), 0), totalBytes: roots.reduce((sum, root) => sum + bytes(root), 0) || undefined };
}

function count(node) { return node.type === "file" ? 1 : (node.children || []).reduce((sum, child) => sum + count(child), 0); }
function bytes(node) { return node.type === "file" ? Number(node.size || 0) : (node.children || []).reduce((sum, child) => sum + bytes(child), 0); }
