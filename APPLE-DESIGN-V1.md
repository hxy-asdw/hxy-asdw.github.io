# Apple Design — 个人作品集首页 V1

这是个人网站首页的第一版可视化原型。当前实现只使用原生 HTML、CSS 与 JavaScript，目标是让 GitHub Pages 可以直接托管，同时保留后续迁移到框架的自由度。

## 页面结构

- Hero：用一句工作主张和 `Question → Evidence → Decision` 的关系图建立定位。
- Excel Data Report Agent：首要项目，用可点击的五阶段 pipeline 展示工作流，而不是只放一张项目卡片。
- Olist Business Analysis：用关键指标和分析范围表现从数据到建议的过程。
- Open Source：展示两个已合并的上游 PR，不把 fork 仓库写成自己的独立项目。
- About：说明数据、Agent 工作流、测试与调试之间的联系。
- Contact：保留真实 GitHub 链接；Email 与 Resume 暂时显式标记为待补充。

## Apple Design 取舍

- 反馈：按钮、导航、项目链接和 pipeline stage 都有 pointer/keyboard 的即时反馈；pipeline 点击会立即更新说明文字。
- 直接操控：用户点击五个 stage 就能查看对应阶段，不需要打开另一个页面或等待加载。
- 可打断：pipeline marker 从当前的呈现位置继续运动，不锁住输入，也不排队执行多个动画。
- Spring：pipeline marker 使用高阻尼、无明显回弹的弹簧积分移动；它服务于状态切换的空间连续性，不是装饰性弹跳。
- 空间一致性：pipeline 的节点、进度 marker 与文字说明始终表达同一阶段状态；移动端改为纵向轨道。
- 材质：半透明只用于 header、关系图节点和 pipeline 等有层级关系的功能性表面，并提供 `prefers-reduced-transparency` 降级。
- 排版：使用系统字体栈；大标题收紧 tracking，正文保持较松的行距，标签使用小字号和较宽字距。
- 克制：没有暗色模式、技能条、头像、虚构客户、虚构指标或夸大的“全自动”叙述。

## 可访问性与响应式

- `prefers-reduced-motion: reduce` 会关闭平滑滚动与位移动画，但保留短促的颜色、透明度反馈。
- `prefers-reduced-transparency: reduce` 会把玻璃表面降级为实色表面。
- `prefers-contrast: more` 会提高正文、边框和控件的对比度。
- pipeline 使用 button、tablist 与 `aria-selected`；stage 说明使用 `aria-live`。
- 已针对桌面、笔记本、平板和手机宽度写入断点：约 `1440 / 1024 / 768 / 390px`。

## 当前仍需补充的材料

- 真实姓名、正式求职定位、邮箱和简历 PDF 尚未提供，因此 Contact 区保留占位状态。
- 项目截图、运行中的 HTML 报告、eval 输出、CI 截图和 PR review 片段还没有进入首页。后续应补充真实 artifact，而不是制作概念性示意图冒充结果。
- Excel 项目的 README 已说明多阶段流程与质量门；若用于正式求职，仍建议补充一次可复现的端到端 demo、代表性 eval 结果和失败案例。
- Olist 仓库目前存在本机绝对路径与缺少自动化测试等可复现性问题；首页只展示分析结论，不掩盖这个后续工程任务。

## 本地运行

在仓库根目录执行：

```powershell
python -m http.server 4173
```

然后打开 <http://127.0.0.1:4173>。这是静态站点，没有 npm build 步骤；生产预览等价于直接托管这几个静态文件。

## 第一版之后

1. 补充真实姓名、邮箱、简历和每个项目的可验证 artifact。
2. 在不增加页面噪音的前提下，为 Excel 项目加入一张真实报告截图或可下载的脱敏样例。
3. 修复 Olist 的绝对路径与复现说明后，再决定是否把它提升到和 Excel 项目同等的视觉权重。
4. 如果需要更复杂的交互，再引入构建工具；目前原生实现更容易审阅、部署和继续由 Codex 修改。

第二轮 polish 的具体记录见 [APPLE-DESIGN-POLISH-V2.md](APPLE-DESIGN-POLISH-V2.md)。
