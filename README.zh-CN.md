# 学习通课程资料批量下载器

[English](README.md) · **简体中文**

[![CI](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml/badge.svg)](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml)
[![Release](https://img.shields.io/github/v/release/songoao25/chaoxing-course-material-downloader?include_prereleases)](https://github.com/songoao25/chaoxing-course-material-downloader/releases)
[![Last commit](https://img.shields.io/github/last-commit/songoao25/chaoxing-course-material-downloader)](https://github.com/songoao25/chaoxing-course-material-downloader/commits/main)
[![许可证](https://img.shields.io/github/license/songoao25/chaoxing-course-material-downloader)](LICENSE)

一个本地优先的浏览器扩展：用户在学习通登录并打开课程后，程序扫描“资料”栏目和“章节”中的可下载附件，用户选择目录或文件后逐个下载，并保留课程目录结构。

> **项目状态：Alpha。** 当前提供 Chrome、Edge、Firefox 的免商店部署包；不同学校部署的真实登录态、章节动态接口和 Safari 仍需进一步验收，暂不宣称正式稳定版。

## 功能

- 递归扫描“资料”栏目及嵌套文件夹。
- 扫描“章节”下所有小节中的可下载附件。
- 在树状目录中选择课程、文件夹、章节或单个文件。
- 支持 PPT、PDF、Word、Excel、压缩包、图片、音频和视频等文件。
- 保存到 `下载/课程名/资料` 和 `下载/课程名/章节`。
- 下载失败重试并显示扫描/下载错误。
- 课程资料逐个直接下载，不生成 ZIP。
- 不导出 Cookie，不绕过验证码、访问控制或 DRM。

## 非技术人员最快部署

从 [GitHub Releases](https://github.com/songoao25/chaoxing-course-material-downloader/releases) 下载 Chrome、Edge 或 Firefox 包，按照[简化部署说明](docs/nontechnical-deployment.md)操作，不需要 Node.js。

由于浏览器不允许免商店扩展静默安装，扩展管理页面仍需要用户确认一次“加载扩展”。这是非商店部署中无法自动消除的唯一确认步骤。

## 浏览器支持

| 浏览器 | macOS | Windows | Linux | 当前分发方式 |
| --- | :---: | :---: | :---: | --- |
| Chrome | ✓ | ✓ | ✓ | GitHub Release，加载已解压扩展 |
| Edge | ✓ | ✓ | ✓ | GitHub Release，加载已解压扩展 |
| Firefox | ✓ | ✓ | ✓ | GitHub Release，临时加载 |
| Safari | — | — | — | 暂缓，需要签名的 macOS App |

Safari 资源仍保留在仓库中，用于后续封装；当前简易部署版本不包含 Safari。

## 使用方法

1. 登录学习通并打开目标课程。
2. 打开扩展，点击“扫描当前课程”。
3. 等待“资料”和“章节”扫描完成。
4. 勾选要下载的文件夹或文件。
5. 点击“开始下载”。

文件默认保存为：

```text
下载/
└── 课程名/
    ├── 资料/
    └── 章节/
```

## 隐私与权限

扩展采用本地优先设计，不上传课程资料、不使用统计分析、不运行远程后端。只有用户主动开始扫描后，才使用当前浏览器登录状态读取课程页面。

权限仅用于：

- `downloads`：创建和观察用户主动发起的下载任务。
- `tabs`：访问当前课程标签页并请求扫描。
- `storage`：预留保存本地界面偏好。
- 学习通站点权限：读取课程页面和同源资料接口。

详见[隐私说明](PRIVACY.md)和[安全政策](SECURITY.md)。请只下载你有权访问和使用的资料。

## 故障排查

- **无法扫描：** 刷新已登录的课程页面后重试。
- **文件数量过少：** 先打开“资料”或“章节”页面，等待动态内容加载后再次扫描。
- **章节附件缺失：** 不同学校部署可能使用不同动态接口；提交 Issue 时只提供脱敏后的浏览器、版本、文件数量和失败位置。
- **下载失败：** 检查浏览器下载权限并重试；不要提交 Cookie 或私有 URL。
- **Firefox 安装失效：** 当前版本用于临时加载；正式长期安装需要 Mozilla 签名。

## 开发与 Agent 使用

```sh
npm test
npm run build
npm run package:simple
node scripts/install.mjs --browser=auto --json --open
```

机器可读的 Agent 部署契约见 [AGENTS.md](AGENTS.md)，审计结果和已知缺口见 [docs/audit-2026-09-03.md](docs/audit-2026-09-03.md)，发布前请按 [发布检查清单](docs/release-checklist.md)执行。

## 仓库规范

- 使用 Conventional Commits，例如 `feat:`、`fix:`、`docs:`、`test:`、`chore:`。
- 提交前运行测试和构建。
- 不提交 Cookie、凭据、课程资料、私有 URL、日志或个人路径。
- 对外文档面向用户，并明确标注未验证的真实运行行为。

## 参考项目

- [VirtualTowel/ChaoXingDownloader](https://github.com/VirtualTowel/ChaoXingDownloader)
- [ColdThunder11/ChaoXingDownload](https://github.com/ColdThunder11/ChaoXingDownload)
- [DURUII/chaoxing-downloader](https://github.com/DURUII/chaoxing-downloader)

## 许可证

MIT © songoao25，详见 [LICENSE](LICENSE)。
