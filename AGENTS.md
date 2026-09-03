# Agent deployment contract

本项目支持 Agent 进行无凭据部署准备，但浏览器禁止免商店扩展静默安装，最后一次“加载扩展”确认必须由用户完成。

## Machine-readable flow

```sh
npm test
npm run build
node scripts/install.mjs --browser=auto --json
```

脚本返回 JSON，包含 `browser`、`extensionDir`、`extensionPage`、`steps` 和 `manualConfirmationRequired`。Agent 应先读取 JSON，再打开 `extensionPage`，不得读取或导出 Cookie。

## Supported browsers

`chrome`、`edge`、`firefox`。Safari 暂不纳入免商店自动部署流程。

## Safety boundary

- 只操作本地构建目录和用户主动打开的浏览器扩展页。
- 不复制浏览器 profile，不访问 Cookie 数据库，不自动登录。
- 不下载、保存或提交课程资料。
- 不绕过扩展签名、验证码、权限或 DRM。
