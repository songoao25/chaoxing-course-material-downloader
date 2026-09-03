# AGENTS.md — 学习通资料下载器 Agent 入口

本文件帮助 AI 编码助手理解本仓库的结构、验证要求、发布边界和用户数据安全规则。

## 这是什么

一个本地优先的 Manifest V3 WebExtension，用于在用户已登录学习通且有权访问课程的前提下，扫描“资料”栏目和“章节”中的可下载附件，并按课程目录逐个下载。

## 先看什么

1. 先看 `README.md` 和 `README.zh-CN.md`，确认用户可见功能和中英文是否同步。
2. 再看 `docs/audit-2026-09-03.md`、`docs/release-checklist.md` 和相关源码/测试。
3. 改动前运行 `git status --short --branch`，确认没有覆盖用户已有工作。
4. 真实浏览器验证必须使用用户主动打开且已登录的课程页面；不要复制 profile 或读取 Cookie 数据库。

## 仓库结构

- `src/` — 扩展源码：扫描器、下载队列、后台和界面
- `build/` — `npm run build` 生成的 Firefox、Chrome、Edge、Safari 资源
- `scripts/` — 构建、免商店打包和 Agent 安装准备脚本
- `tests/` — Node 内置测试
- `docs/` — 部署、审计、发布和商店资料
- `.github/` — CI、Release、Issue/PR 模板

## 关键约定

- Conventional Commits：`feat:`、`fix:`、`docs:`、`test:`、`chore:`。
- 对外 README 面向用户，不写内部过程流水账；英文放 `README.md`，简体中文放 `README.zh-CN.md`。
- 版本使用语义化版本号；Alpha/预发布状态必须明确标注。
- 源码变更后必须同步构建产物 `build/`。
- 发布前必须运行 `npm run audit:repo`、`npm test`、`npm run build`、`npm run package:simple` 和 `git diff --check`。
- GitHub 仓库元数据与推送前检查模板统一参考 `docs/repository-standard.md`。
- 推送前检查 README、许可证、贡献指南、行为准则、安全策略、Issue/PR 模板、`.gitignore`、Actions、仓库元数据、敏感信息和个人路径。
- 推送后回读远程 SHA、仓库设置、Release 和 Actions 结果；不能用本地构建代替真实浏览器或生产验收。

## 用户数据与安全边界

- 不提交 Cookie、登录凭据、课程资料、私有 URL、接口响应、下载记录、日志或个人路径。
- 不导出 Cookie，不自动登录，不复制浏览器 profile，不绕过验证码、访问控制、扩展签名或 DRM。
- 只处理用户当前登录账号有权访问且页面提供直接下载地址的文件。
- 课程资料下载目录不属于仓库，任何递归操作都必须明确排除它。

## Agent 部署

```sh
npm test
npm run build
node scripts/install.mjs --browser=auto --json --open
```

Agent 必须读取 JSON 中的 `extensionDir`、`extensionPage`、`steps` 和 `manualConfirmationRequired`，打开扩展管理页面后交给用户完成最后一次加载确认。Safari 暂不纳入免商店自动部署。

## 完成回复

先说明已完成的阶段，再列出改动、实际验证证据、未验证或受平台限制的部分和用户下一步。未运行的检查写明 `not run`，不要把静态构建说成真实浏览器成功。
