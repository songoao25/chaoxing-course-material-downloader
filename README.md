# 学习通课程资料批量下载器

一个不需要本地引擎的跨浏览器 WebExtension，用于在用户已登录学习通的前提下扫描并批量下载课程资料。

## 功能

- 扫描“资料”栏目和“章节”中的可下载附件
- 递归保留资料文件夹、章节和小节结构
- 扫描后树状选择，支持搜索和按来源全选
- 逐个直接下载，不生成 ZIP
- 默认下载到 `下载/课程名/资料` 或 `下载/课程名/章节`
- 下载队列、并发限制、失败重试、失败清单
- 不读取或导出 Cookie，不绕过验证码和权限

## 浏览器支持

Firefox、Chrome、Edge 支持 macOS、Windows、Linux。Safari 仅支持 macOS，并需要把 `build/safari` 导入 Xcode 的 Safari Web Extension App；Safari 不能直接安装 Chrome 或 Firefox 扩展目录。

本项目只下载当前登录账号有权访问且页面提供直接下载地址的附件。播放器中的 DRM 或没有下载地址的受保护内容不在范围内。

## 已知限制

- 学习通页面接口和 DOM 可能随学校部署或平台升级变化；扫描结果会显示读取失败来源。
- 真实浏览器加载、章节动态附件和 Safari App 签名需要在目标机器上进行验收。
- 课程资料不应提交到 GitHub；`.gitignore` 已排除常见下载目录和临时文件。

## 开发运行

需要 Node.js 20 或更新版本。项目没有运行时依赖：

```sh
npm test
npm run build
```

构建后的扩展目录在 `build/`：

- `build/firefox`
- `build/chrome`
- `build/edge`
- `build/safari`

Firefox、Chrome、Edge 可从各自的开发者扩展页面加载对应目录。Safari 需要把 `build/safari` 作为 Safari Web Extension 资源导入 Xcode 的 Safari Extension App；Safari 不能直接加载 Chrome/Firefox 的安装包。

## 使用

1. 在浏览器登录学习通并打开目标课程。
2. 点击扩展图标。
3. 点击“扫描当前课程”。
4. 在资料树中选择需要的文件或文件夹。
5. 点击“开始下载”。

程序只会请求当前登录页面权限能够访问的资源。章节中未公开下载地址的播放器或受保护媒体不会被破解。
