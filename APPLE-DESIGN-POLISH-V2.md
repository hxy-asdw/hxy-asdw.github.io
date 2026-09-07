# Apple Design Polish V2 — 视觉与动效审查记录

本轮保留 Homepage V1 的信息架构、浅色材质、橙色小面积强调和原生静态实现，只收敛层级、节奏与反馈。

## 删掉了什么

- 删除全页 noise 纹理，降低持续存在的视觉噪音。
- 删除 Working Principle 中的三条斜向连线、中心光环和两块模糊色块。
- 删除浮动玻璃卡片式的 Question / Evidence / Decision，改成一条有编号、有顺序的流程线。
- 删除 contribution row hover 时改变左右 padding 的布局位移，避免 pointer 进入时内容抖动。
- 没有加入 scroll reveal、全页 fade-up、更多卡片、更多颜色或新的 Section。

## Hero 调整

- 桌面标题从接近海报的极大尺寸收敛到 `clamp(3.45rem, 5.7vw, 6.05rem)`。
- 降低标题字重，放松 leading，并把 tracking 从统一的强收紧改成更适合中文大字的值。
- 移动端单独降低上限与 tracking，保留两到三行的力量感，但让留白重新成为主角。
- Hero 右侧不再模拟“AI 光球”，而是用 Question → Evidence → Decision 的三段工作流程表达真实方法。

## Section rhythm

页面现在按「强 → 静 → 强 → 静」组织：

1. Hero 是第一处强信号。
2. Working Principle 以安静的流程线承接，不再制造第二个视觉高潮。
3. Work 区以 Excel Data Report Agent 为主项目，Olist 和 Open Source 的标题尺寸下降，信息密度更像阅读而不是海报。
4. About 使用更轻的标题和更大的留白，Contact 只保留一次收束性的标题。

标题不再依靠统一的巨大字号建立层级，而是通过尺寸、字重、leading、tracking 和上下留白组合建立 hierarchy。

## Working Principle

桌面端是三列流程：

`Question / 定义目标与边界 → Evidence / 选择可核验的事实 → Decision / 明确下一步动作`

移动端改为纵向轨道，保持相同的来源、方向和空间关系。它表达的是实际的问题解决顺序，而不是抽象的节点网络。

## Excel Data Report Agent

- 保留为视觉主项目。
- pipeline marker 与 stage dot、track 现在共用同一条空间基准，减少“看起来在动但不在同一系统里”的错位。
- pipeline 增加了仓库文档中已有的证据摘要：`5 documented stages`、`4 quality gates`、`CI eval harness`。
- marker 使用 `transform`，不再动画 `left/top`，减少布局计算。
- marker 弹簧从当前 presentation value 继续，并保存当前 velocity；连续点击不同 stage 时会重新定向，不等待上一段动画结束。
- 当前仓库没有真实报告文件或脱敏 HTML artifact 可安全嵌入首页，因此没有用概念图冒充真实产物。

## Olist metrics

指标不再等权：

- `8.1%` 是 primary signal，拥有最大字号和 `PRIMARY SIGNAL` 标签。
- `3.1%`、`38.2%` 是 secondary context。
- `12` 是行动建议数量，以较轻权重收尾。

它仍然使用一条 editorial rail，没有圆角 KPI cards；移动端将 primary metric 独占一行，其余指标进入次级网格。

## Navigation / material

- 只有滚动后的 header 使用轻量半透明材质：背景、边框和阴影做渐进变化，blur 保持 18px，不继续增强 glassmorphism。
- header 不再把没有发生的 `transform` 纳入过渡。
- 普通背景上的正文仍使用实色页面，不叠加多层玻璃。

## Motion audit

| 交互 | 实现 | Spring | 可打断 | pointer-down 反馈 | 结论 |
| --- | --- | --- | --- | --- | --- |
| Navigation scroll state | `requestAnimationFrame` 节流 + 普通颜色/边框/阴影 transition | 否 | 不适用 | 链接即时颜色/opacity | 只反馈状态，不做装饰动画 |
| Hero / nav buttons | CSS `:hover` + `:active` | 否 | 不适用 | `:active` 立即缩放或降低 opacity | 短、明确、没有等待 |
| Text / external links | 颜色 transition + press opacity | 否 | 不适用 | 立即反馈 | 不改变布局 |
| Excel pipeline stage | `requestAnimationFrame` 阻尼弹簧，`transform` 位移 | 是 | 是，从当前值和当前 velocity 重定向 | stage `:active` 立即下压，文字立即更新 | 唯一需要空间连续性的 spring |
| Hover | 颜色、背景或极小位移 | 否 | 不适用 | 不承载关键信息 | 不再使用 padding 造成 layout shift |
| Anchor scroll | 原生 `scroll-behavior: smooth` | 否 | 浏览器控制 | 点击后立即触发 | 不增加自定义延迟 |
| Section reveal | 无 | 否 | 不适用 | 不适用 | 避免每个 section 统一 fade-up |
| Section transition | 无独立动画 | 否 | 不适用 | 不适用 | 用空间和边界建立节奏 |

## Reduced Motion

`prefers-reduced-motion: reduce` 下：

- 平滑滚动改为即时滚动。
- pipeline marker 直接到达目标位置，仍保留 stage 文字、颜色与 `aria-selected` 状态反馈。
- 取消 hover / press 的位移和缩放，但保留约 140ms 的颜色、背景、边框或 opacity 变化。
- 不存在大幅进入、退出或循环背景动画，因此没有需要“突然关掉”的隐藏运动。

## 检查结果

- 已用真实浏览器检查桌面首屏、Work 区 pipeline、移动端 Working Principle 与 Olist metrics。
- 390 / 768 / 1440 宽度下继续保持无横向溢出。
- pipeline marker 已核对与 stage dot 和 track 对齐。
- 未加入虚构报告截图、虚构联系信息或未验证的项目结果。
