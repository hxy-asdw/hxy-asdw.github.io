# V2 部署与云端交接

日期：2026-10-03。用户明确要求先部署已完成的版本，方便后续在 Codex 云端继续。发布的是 V2 多语言开屏和每次刷新播放；后续舞台风格尚未实施。

## 1. 发布范围

| 内容 | 发布处理 |
|---|---|
| index.html、home-intro.css、home-intro.js | 提交到 main，随 GitHub Pages 发布 |
| .github/workflows/deploy.yml | 只在既有文件白名单中增加两份开屏资源 |
| 本目录开发文档、AGENTS.md | 提交到仓库供云端接手；不进入网站公开产物白名单 |
| 本机快照与故障副本 | 仅保存在本会话本机产物目录 |
| 原有未提交日志与审阅文件 | 保持本地原状态，不混入此次提交 |

发布前产品文件与 V2 快照一致，已有检查有效；发布配置的新变化单独检查资源白名单和文件存在性，不重新跑无关测试。iOS 真机、系统减少动画变化及真实切标签的限制见 V1/V2 检查记录。

## 2. 发布流程

1. 获取 origin 最新记录，确认当前 main 与远端基线一致。
2. 核对本次提交内容、脚本语法与部署文件白名单。
3. 提交并推送到 main，由既有 Deploy static site to GitHub Pages 工作流发布。
4. 核对该提交对应的工作流结果和 https://hxy-asdw.github.io/ 的实际开屏、刷新与资源加载。

实际发布提交与状态以[GitHub Actions 发布记录](https://github.com/hxy-asdw/hxy-asdw.github.io/actions/workflows/deploy.yml)为准；仓库最新代码可从[main 分支](https://github.com/hxy-asdw/hxy-asdw.github.io/tree/main)核对。精确提交 SHA、Actions 链接、线上检查结果另存本次部署产物记录，避免为了把提交 SHA 写回同一个提交而产生循环提交。

## 3. Codex 云端接手

- 仓库：hxy-asdw/hxy-asdw.github.io；分支：main。
- 新云端任务应从更新后的 main 开始；已有云端工作目录先检查 git status，再获取远端。无本地修改时可使用 git pull --ff-only origin main；有修改时先保存并合并，不能直接重置覆盖。
- 先读仓库根目录 AGENTS.md，再读本目录 README.md、requirements-and-design.md 与 verification-v2.md。
- 原生静态网站，无 npm build、类型检查或测试套件，不新增工具链凑检查。
- 本机 V0/V1/V2 快照的绝对路径在云端不可用；已发布的 Git 提交可作为云端开发基线。

## 4. 后续候选方向

用户提出掀幕像戏剧开场。讨论中的方向是深色首屏与米白正文：多语言问候报幕，幕布揭开已在背后的 Aeneas 名字，随后一句个人表达和入口出现；可考虑淡暖光，当前进度清单后移。

以上是后续设计构想，尚未实施，也不代表用户已经授权实施全部细节。继续开发前根据新指令更新范围、视觉参数与验收。当前线上版本仍是原首页布局加 V2 开屏，刷新规则已完成。
