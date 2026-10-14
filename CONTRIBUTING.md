# 贡献指南

提交前请运行：

```sh
npm test
npm run build
```

请使用脱敏的模拟页面或接口数据测试，不要提交真实课程资料、Cookie、下载记录或账号信息。

涉及学习通页面结构变化时，请说明浏览器、页面 URL 类型、扫描结果和失败位置，但不要提交私有 URL 参数或响应正文。

## Repository framework status

本仓库按个人规范 `public-repo/project-standard.md` 管理。它是**公开**的浏览器脚本/扩展项目，
不是 npm 包，发布走浏览器商店与标签打包。

**已经具备**：`README.md` + `README.zh-CN.md`（互链）、`LICENSE`、`CONTRIBUTING.md`（本文件）、
`SECURITY.md`、`SUPPORT.md`、`PRIVACY.md`、`CODE_OF_CONDUCT.md`、`docs/`、`tests/`（`npm test` 一条命令）、
`build/`（构建产物入库，49 个文件）、`.github/workflows/test.yml`（`npm test` + `npm run build`，push 与 PR 都跑）、
`.github/workflows/codeql.yml`、`.github/workflows/release.yml`（打 `v*` 标签时打包商店产物）、
`.github/dependabot.yml`、`.github/CODEOWNERS`、`.github/PULL_REQUEST_TEMPLATE.md`、`.github/ISSUE_TEMPLATE/`（3 个）、
`.private/`（私有材料，本机专属排除清单覆盖）。

**已知差异**（2026-10-14 核对，每条带理由）：

- **CI 文件名是 `test.yml` 而不是标准的 `ci.yml`**：职责与标准的 `ci` 完全一致（测试 + 构建，push 与 PR 都跑），
  只是文件名不同。改名会让历史里的 workflow 徽章与引用失效，收益不抵改动，故保留并在此登记。
- **CI 还没有"构建产物与源码一致"的检查**：`build/` 是入库产物，但 `test.yml` 只跑 `npm run build`，
  没有 `git diff --exit-code -- build`。补这条需要先确认当前未提交改动落地后 `build/` 与 `src/` 确实一致
  （当前工作区有 60 多个未提交改动，不能拿它当基线），所以先登记、后补。
- **没有 `CHANGELOG.md`**：改动说明写在 release 描述与 [docs/release-checklist.md](docs/release-checklist.md)；
  标准要求有变更记录，这里登记为差异。
- **没有 `release-please` 与 `release-please-config.json`**：本项目不发 npm；版本号写在
  `manifest.json` 与商店素材里，由维护者打标签时手工确定。标准第 5 节的"版本号只由发版机器人改"不适用。
- **没有 `publish-npm.yml` / `verify-npm-release.yml`**：不发布 npm 包。
- **没有 `auto-merge-own.yml`**：单人维护、直接推 `main`（仓库当前没有分支保护）。

任何偏离标准的做法都登记在本节，写明理由与日期。

