# 免商店部署（第一阶段）

第一阶段支持 Firefox、Chrome 和 Edge；Safari 暂缓。用户不需要 Node.js，直接下载已经构建好的浏览器目录或 Release 包即可。

## Chrome

1. 下载并解压 Chrome 包。
2. 打开 `chrome://extensions`。
3. 开启右上角“开发者模式”。
4. 点击“加载已解压的扩展程序”。
5. 选择解压后的 Chrome 目录。

## Edge

1. 下载并解压 Edge 包。
2. 打开 `edge://extensions`。
3. 开启“开发人员模式”。
4. 点击“加载解压缩的扩展”。
5. 选择解压后的 Edge 目录。

## Firefox

开发测试：

1. 打开 `about:debugging`。
2. 选择“此 Firefox”。
3. 点击“临时载入附加组件”。
4. 选择 Firefox 目录中的 `manifest.json`。

Firefox 正式版的长期安装需要 Mozilla 签名的 XPI；未签名扩展仅适合开发版、Nightly 或临时测试。第一阶段先提供可验证的临时加载版本，不伪装成正式安装包。

## 使用

安装后，登录学习通并打开课程，点击扩展图标，扫描资料和章节，勾选文件后开始下载。课程资料不会被打包成 ZIP。

## 安全提醒

只从项目 GitHub Releases 下载扩展包，不要加载来源不明的修改版。更新扩展时，在浏览器扩展页面移除旧目录后重新加载新目录。
