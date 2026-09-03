# 学习通课程资料批量下载器

[![Test](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml/badge.svg)](https://github.com/songoao25/chaoxing-course-material-downloader/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![WebExtension](https://img.shields.io/badge/WebExtension-MV3-blue.svg)](manifest.json)

一个不需要本地引擎的跨浏览器 WebExtension：在用户已登录学习通的前提下，扫描课程“资料”栏目和“章节”中的可下载附件，按原目录逐个下载。

> 项目状态：Alpha。当前优先提供 Firefox、Chrome、Edge 的免商店部署；Safari 暂缓。扫描接口和页面结构仍需根据不同学校部署进行真实浏览器验收。

## 功能

- 扫描“资料”栏目及其嵌套文件夹
- 扫描“章节”下所有小节中的可下载附件
- 支持 PPT、PDF、Word、Excel、压缩包、图片、音频和视频等文件
- 扫描后树状选择，支持搜索、全选和清空
- 逐个直接下载，不生成课程 ZIP
- 保存为 `下载/课程名/资料` 和 `下载/课程名/章节`
- 目录安全处理、同名文件避免覆盖
- 并发下载、失败重试、暂停、取消和失败提示
- 不导出 Cookie，不绕过验证码、权限或 DRM

## 浏览器支持

| 浏览器 | macOS | Windows | Linux | 安装方式 |
| --- | :---: | :---: | :---: | --- |
| Firefox | ✓ | ✓ | ✓ | 临时加载 `build/firefox` |
| Chrome | ✓ | ✓ | ✓ | 开发者模式加载 `build/chrome` |
| Edge | ✓ | ✓ | ✓ | 开发者模式加载 `build/edge` |
| Safari | ✓ | — | — | 用 Xcode 封装 `build/safari` |

Safari 不能直接安装 Chrome 或 Firefox 扩展目录，需要将 Safari 资源导入 Safari Web Extension App，再在 macOS 上签名运行。

## 安装与使用

### 1. 构建

需要 Node.js 20 或更新版本；项目没有运行时依赖：

```sh
git clone https://github.com/songoao25/chaoxing-course-material-downloader.git
cd chaoxing-course-material-downloader
npm test
npm run build
```

### 2. 加载扩展

- Firefox：打开 `about:debugging` →“此 Firefox”→“临时载入附加组件”，选择 `build/firefox/manifest.json`。
- Chrome：打开 `chrome://extensions`，开启“开发者模式”，选择“加载已解压的扩展程序”，选择 `build/chrome`。
- Edge：打开 `edge://extensions`，开启“开发人员模式”，选择“加载解压缩的扩展”，选择 `build/edge`。
- Safari：在 Xcode 中创建 Safari Web Extension App，将 `build/safari` 作为扩展资源导入；详见 [Safari 说明](build/safari/SAFARI.md)。

第一阶段免商店部署的简化说明见 [simple-deployment.md](docs/simple-deployment.md)。

### 3. 下载课程资料

1. 在浏览器中登录学习通并打开目标课程。
2. 点击扩展图标，选择“扫描当前课程”。
3. 等待资料栏目和章节附件扫描完成。
4. 在树状目录中勾选课程、文件夹或单个文件。
5. 点击“开始下载”。

默认保存结构：

```text
下载/
└── 课程名/
    ├── 资料/
    │   └── 原资料文件夹结构/
    └── 章节/
        └── 原章节和小节结构/
```

## 权限与隐私

扩展只申请完成当前功能所需的权限：

- `downloads`：逐个创建和管理文件下载任务
- `tabs`：读取当前活动课程页面并向内容脚本发起扫描
- `storage`：为后续保存用户界面偏好预留
- 学习通站点权限：读取当前课程页面和同源资料接口

程序不会上传课程资料，不会读取或导出 Cookie，也不会处理验证码绕过、权限绕过、DRM 解密或没有直接下载地址的受保护内容。请只下载你有权访问和使用的资料，并遵守学校、教师和平台的规定。

完整隐私说明见 [PRIVACY.md](PRIVACY.md)，商店提交资料草案见 [docs/store-listing.md](docs/store-listing.md)。

## 故障排查

- **提示无法扫描**：确认当前标签页是学习通课程页面，并刷新页面后重试。
- **只显示少量文件**：检查页面是否仍在加载；展开资料/章节页面后再次扫描，并在 Issue 中说明浏览器和页面类型。
- **章节附件缺失**：章节内容可能由学校部署的接口动态加载；程序会显示失败来源，但不会绕过权限。
- **下载失败**：确认浏览器允许学习通下载，查看失败提示并重试；不要把 Cookie 或私有下载 URL 发到 Issue。
- **Safari 无法安装**：Safari 版本必须通过 Xcode 的 Safari Web Extension App 封装，不能直接选择 Chrome/Firefox 目录。

提交问题时请提供浏览器、操作系统、扫描到的文件数量、失败位置和脱敏后的页面类型。请勿提交课程资料、账号信息、Cookie 或完整接口响应。

## 开发

```sh
npm test       # Node 内置测试：路径安全、下载队列、目录树
npm run build  # 生成 Firefox、Chrome、Edge、Safari 资源
npm run package:stores  # 生成商店提交包；这是扩展包，不是课程资料 ZIP
npm run package:simple  # 生成 Chrome、Edge、Firefox 免商店部署包
```

架构分为四层：

1. `src/scraper.js`：课程、资料栏目、章节和附件发现。
2. `src/core.js`：路径安全、去重、统计和下载队列。
3. `src/app.js`：树状选择和任务状态界面。
4. `src/background.js`：浏览器下载 API 适配和后台任务管理。

真实登录态测试不使用提交到仓库的课程数据；请在本机浏览器中完成验收。

商店提交前请按 [发布清单](docs/release-checklist.md) 检查，并使用 [商店资料草案](docs/store-listing.md) 填写对应后台。

## 参考项目

本项目参考了以下公开项目的功能边界和使用说明，但没有复制其 Cookie、课程数据或代码：

- [VirtualTowel/ChaoXingDownloader](https://github.com/VirtualTowel/ChaoXingDownloader)：资料目录递归下载思路。
- [ColdThunder11/ChaoXingDownload](https://github.com/ColdThunder11/ChaoXingDownload)：浏览器端课件下载和兼容性说明。
- [DURUII/chaoxing-downloader](https://github.com/DURUII/chaoxing-downloader)：跨平台运行说明和问题边界。

## 贡献与安全

提交代码前请运行 `npm test` 和 `npm run build`。贡献规范见 [CONTRIBUTING.md](CONTRIBUTING.md)，安全问题见 [SECURITY.md](SECURITY.md)，许可证为 [MIT](LICENSE)。
