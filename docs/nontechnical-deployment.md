# 非技术人员部署

## 推荐方式

从 GitHub Releases 下载对应浏览器包，不需要 Node.js、不需要命令行：

1. 下载 Chrome、Edge 或 Firefox 对应 ZIP。
2. 解压到一个固定文件夹。
3. 按浏览器页面的提示加载一次扩展。
4. 以后只需打开学习通课程并点击扩展图标。

免商店扩展受浏览器安全策略限制，无法完全静默安装；这是唯一需要用户确认的步骤。

## Agent 方式

在开发机或 Agent 工作区运行：

```sh
npm test
npm run build
node scripts/install.mjs --browser=auto --json --open
```

Agent 读取 JSON 后打开扩展管理页面，用户只需确认加载。指定浏览器时使用 `--browser=chrome`、`--browser=edge` 或 `--browser=firefox`。

## 更新

下载新 Release 后，先移除旧的解压目录，再加载新的目录。课程资料下载目录不会被安装器触碰。
