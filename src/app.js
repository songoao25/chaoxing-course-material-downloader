import { api, safeRelativePath } from "./core.js";

const browserApi = api();
const state = { result: null, selected: new Set(), nodes: new Map(), tasks: new Map() };
const $ = (id) => document.getElementById(id);

function walk(nodes, fn) { for (const node of nodes) { fn(node); if (node.children) walk(node.children, fn); } }
function allFiles() { const files = []; if (state.result) walk(state.result.roots, (node) => node.type === "file" && files.push(node)); return files; }
function render() {
  state.nodes.clear();
  const query = $("search").value.trim().toLowerCase();
  $("tree").replaceChildren();
  if (!state.result) return;
  const renderNode = (node, depth = 0) => {
    const hasMatch = node.type === "folder" || !query || node.name.toLowerCase().includes(query);
    if (!hasMatch) return null;
    state.nodes.set(node.id, node);
    const row = document.createElement("label"); row.className = `node depth-${Math.min(depth, 8)}`;
    const checkbox = document.createElement("input"); checkbox.type = "checkbox";
    const descendants = []; walk([node], (item) => item.type === "file" && descendants.push(item));
    const selectedCount = descendants.filter((item) => state.selected.has(item.id)).length;
    checkbox.checked = descendants.length > 0 && selectedCount === descendants.length;
    checkbox.indeterminate = selectedCount > 0 && selectedCount < descendants.length;
    checkbox.dataset.id = node.id; checkbox.addEventListener("change", () => toggle(node, checkbox.checked));
    row.append(checkbox, document.createTextNode(`${node.type === "folder" ? "📁" : "📄"} ${node.name}`));
    if (node.type === "file" && node.size) { const size = document.createElement("small"); size.textContent = ` ${formatBytes(node.size)}`; row.append(size); }
    const wrapper = document.createElement("div"); wrapper.append(row);
    if (node.children) { const children = document.createElement("div"); node.children.map((child) => renderNode(child, depth + 1)).filter(Boolean).forEach((child) => children.append(child)); wrapper.append(children); }
    return wrapper;
  };
  state.result.roots.map((root) => renderNode(root)).filter(Boolean).forEach((node) => $("tree").append(node));
  updateSummary();
}
function toggle(node, checked) { walk([node], (item) => item.type === "file" && (checked ? state.selected.add(item.id) : state.selected.delete(item.id))); render(); }
function updateSummary() { const selected = allFiles().filter((file) => state.selected.has(file.id)); $("summary").textContent = `${selected.length}/${allFiles().length} 个文件`; $("download").disabled = selected.length === 0; }
function formatBytes(value) { if (!value) return ""; const units = ["B", "KB", "MB", "GB"]; let index = 0; let number = value; while (number >= 1024 && index < units.length - 1) { number /= 1024; index++; } return `${number.toFixed(index ? 1 : 0)} ${units[index]}`; }

$("scan").addEventListener("click", async () => {
  $("status").textContent = "正在扫描资料和章节…";
  try {
    const [tab] = await browserApi.tabs.query({ active: true, currentWindow: true });
    const result = await browserApi.tabs.sendMessage(tab.id, { type: "scan-course" });
    state.result = result; state.selected.clear(); $("course").textContent = result.course.name; render(); $("status").textContent = `扫描完成，共 ${result.totalFiles} 个文件`;
    if (result.errors?.length) { $("errors").hidden = false; $("errors").textContent = `有 ${result.errors.length} 个来源读取失败，仍已保留其他扫描结果。`; }
  } catch (error) { $("status").textContent = `扫描失败：${error.message || error}`; }
});
$("search").addEventListener("input", render);
$("select-all").addEventListener("click", () => { allFiles().forEach((file) => state.selected.add(file.id)); render(); });
$("clear-all").addEventListener("click", () => { state.selected.clear(); render(); });
$("download").addEventListener("click", async () => {
  const tasks = allFiles().filter((file) => state.selected.has(file.id)).map((file) => ({ resourceId: file.id, url: file.downloadUrl, filename: file.path || safeRelativePath([state.result.course.name, file.source === "materials" ? "资料" : "章节", file.name]), status: "pending" }));
  const { taskId } = await browserApi.runtime.sendMessage({ type: "download-selected", tasks });
  tasks.forEach((task) => state.tasks.set(task.resourceId, task)); $("status").textContent = `已提交 ${tasks.length} 个下载任务`; $("pause").disabled = false; $("cancel").disabled = false;
  browserApi.runtime.onMessage.addListener((message) => { if (message.type === "download-progress" && message.taskId === taskId) { state.tasks.set(message.task.resourceId, message.task); const done = [...state.tasks.values()].filter((task) => taskId === taskId && ["success", "failed", "skipped"].includes(task.status)).length; $("status").textContent = `下载进度：${done}/${tasks.length}`; } });
  $("pause").onclick = () => { browserApi.runtime.sendMessage({ type: "pause-download", taskId }); $("status").textContent = "下载已暂停"; };
  $("cancel").onclick = () => { browserApi.runtime.sendMessage({ type: "cancel-download", taskId }); $("status").textContent = "正在取消下载"; };
});
