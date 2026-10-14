# 发布前检查清单

- [ ] 已在 Firefox、Chrome、Edge 和 Safari 的目标系统完成登录态扫描测试
- [ ] 已验证资料栏目和章节附件均能被识别
- [ ] 已验证中文目录、重复文件、失败重试和权限失败提示
- [ ] Manifest 有正确版本号、图标、短描述和最小权限
- [ ] GitHub About 描述使用英文；Homepage 仅在存在真实站点或演示页时填写
- [ ] README 英文为主入口，并与 `README.zh-CN.md` 保持同步
- [ ] CI、CodeQL、Dependabot、Issue/PR 模板和分支保护已检查
- [ ] 商店截图不包含账号、Cookie、课程隐私信息
- [ ] 已填写商店隐私声明、数据使用说明和测试说明
- [ ] 发布包根目录直接包含 `manifest.json`
- [ ] `npm test`、`npm run build` 和商店自动验证均通过
- [ ] 未提交课程资料、下载目录、Cookie、私有 URL 或接口响应
