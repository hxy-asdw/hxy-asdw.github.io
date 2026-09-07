# Site Architecture — Personal Lab / Digital Garden

## 0. 定位

这个网站不是简历，也不是项目陈列页。

它是 Aeneas 长期维护的个人空间，用来保存：

- 最近正在想什么；
- 因为好奇而开始的实验；
- 走得太远的 rabbit holes；
- 没有被整理成结论的过程；
- 一些最终进入上游的小修复；
- 偶尔做出来、偶尔失败的东西。

网站的第一目标不是证明能力，而是让访问者感受到：这里有一个具体的人，正在持续追问、折腾、记录和回头看。

核心语气：

> I build things because I want to know what happens.

中文可以理解为：

> 我做这些东西，通常只是因为想知道它会发生什么。

## 1. 顶层信息架构

第一版只保留六个主要入口：

```text
HOME
├── NOW
├── LAB
├── GARDEN
├── SIDE QUESTS
├── ABOUT
└── ELSEWHERE
```

不加入：

- Resume；
- Skills / 技能评分；
- 求职方向；
- 招聘语言；
- Archive；
- 与项目数量相关的统计指标。

`Archive` 暂时不作为导航入口。旧项目或不成熟实验可以先放在 `LAB` 或 `GARDEN` 中，等内容积累到足以形成时间线后，再决定是否需要单独归档。

## 2. 首页应该展示多少内容

首页不是完整索引，而是入口和当前切片。

第一版建议首页只直接展示：

- 1 个 Hero；
- 1 个 Now 状态块；
- 2 个 Lab 项目；
- 2 个 Garden 条目；
- 2 个 Side Quest；
- 1 个简短 About；
- GitHub 和 Email 两个 Elsewhere 出口。

最多展示 4 个可点击的主要内容对象：

1. 一个当前最值得进入的实验；
2. 一个代表性较强的 Lab；
3. 一个已经形成内容的 Garden 条目；
4. 一个最近的 Side Quest 或 Note。

首页不需要一次展示 `doupo-analysis`、`excel-data-report`、`limitless`、Olist 和两个 PR 的所有细节。完整内容应该由各自的 detail page 或 note page 承担。

### 避免重新变成 Portfolio 的规则

- 不使用 `Selected Work`、`Featured System`、`Business Analysis` 等作品集标签；
- 不在首页用项目数量、commit 数、技术栈标签建立主层级；
- 不把每个项目都做成同样尺寸的卡片；
- 不要求每个项目都拥有 Problem / Solution / Result 的标准案例结构；
- 不把项目都改写成“我解决了什么业务问题”；
- 首页只展示当前正在发生的内容，完整清单由独立索引提供；
- 允许项目以问题、片段、失败记录或未完成状态出现。

首页更像一张当前打开的工作台，而不是一份目录。

## 3. 首页结构

### 3.1 Hero

Hero 只回答一个问题：

> 这里是什么地方？

建议内容：

```text
Aeneas
Personal Lab / Digital Garden

Experiments, rabbit holes, and things I build for fun.
```

中文版本可以是：

```text
一些实验、兔子洞，
以及那些本来没必要做但我还是做了的东西。
```

Hero 不再强调：

- 数据、Agent、Engineering 作为职业标签；
- “让复杂工作变得更值得信任”；
- 可交付、可复盘、可验证等招聘语境；
- “查看精选项目”作为主行动。

主行动建议改为：

- `See what I’m doing now` → `#now`；
- `Open the garden` → `#garden`。

Hero 可以保留当前 calm、precise 的排版和留白，但文字要从“宣言”变成“邀请进入”。

### 3.2 Now

`NOW` 是首页中最重要的持续更新入口。

它不是博客列表，也不是 changelog，而是一个小型的“当前状态”：

```text
NOW / September 2026

01  Trying to make Agent-generated analysis easier to inspect.
02  Re-reading doupo-analysis as a runtime experiment.
03  Following a new branch in the Olist rabbit hole.
```

每条 Now item 只需要包含：

- 当前正在想或做的事情；
- 一句为什么会开始；
- 一个进入相关 Lab / Garden 内容的链接；
- 可选的状态词：`thinking`、`building`、`reading`、`stuck`、`paused`。

### Now 的更新原则

- 更新内容，不需要改页面结构；
- 一次保留 2–4 条；
- 新条目从顶部进入；
- 旧条目可以被替换或转成 Note；
- 不需要保留完整的时间线；
- 不用“完成度百分比”；
- 不用把每一条都写成成果。

Now 的存在感来自内容更新，而不是动画或视觉变化。

### 3.3 Lab preview

首页只预览两个 Lab 项目：

- `doupo-analysis`：个人特色最强的运行时分析实验；
- `excel-data-report`：持续思考 Agent 可靠性的长期实验。

`limitless` 不必固定占据首页。只有在它有新的实验记录，或能清楚说明内容边界时，才出现在首页的 Lab preview 中。

首页的 Lab preview 采用不等权布局：

- `doupo-analysis` 作为较大的主条目；
- `excel-data-report` 作为并列但更安静的条目；
- `limitless` 作为短条目或当前 Now 中的引用。

不要使用三个等尺寸的项目卡片。它们不是同一种东西，也不处在同一阶段。

### 3.4 Garden preview

首页展示 1–2 个 Garden 条目，第一批可以来自 Olist：

- 一个已经形成的分析记录；
- 一个仍在发散的兔子洞；
- 一个从分析中留下的数字、疑问或反例。

Garden preview 的标题不要只写项目名，可以写成问题或观察：

```text
What started as an order-delay question
为什么一个订单延迟问题会把我带到复购率？
```

这样 Olist 不会被理解成一个完整的商业案例，而会被理解成一次探索路径。

### 3.5 Side Quests preview

首页只保留最近或最有趣的两个 Side Quest：

- Recharts merged PR；
- Storybook merged PR。

它们使用较轻的行列表现，而不是项目卡片。重点是“顺手追进去并最终进入上游”，而不是展示大型成果。

### 3.6 About preview

首页的 About 只需要一小段，不承担完整自我介绍：

> Aeneas 是我在网上使用的名字。这个空间用来保存一些实验、笔记和还没有完全想明白的东西。我通常不是因为它有用才开始，而是因为我想知道它会发生什么。

通过 `Read about Aeneas` 进入完整 About 页面。

### 3.7 Elsewhere

只保留：

- GitHub；
- Email。

Email 如果还没有准备好，可以暂时不显示，不使用“待添加联系方式”这种占位文案。

## 4. Lab 和 Garden 的区别

两者不是“项目”和“文章”的简单区分，而是两种不同的思考状态。

### LAB：我认真搭过东西

Lab 内容通常具有：

- 明确的实验对象；
- 一定程度的可运行代码；
- 可复现的输入、过程或输出；
- 比较清晰的边界；
- 一个可以被再次打开的实验环境。

Lab 不要求完成，也不要求有实际用途。但需要能回答：

> 我到底搭了什么，想观察什么？

当前 Lab：

- `doupo-analysis`；
- `excel-data-report`；
- `limitless`，前提是明确它是 toy experiment，而不是安全系统。

### GARDEN：我还在想，内容正在长出来

Garden 内容可以是不完整的：

- 一篇 Note；
- 一次分析；
- 一个 debugging 过程；
- 一个失败的尝试；
- 一组还没有结论的链接；
- 从项目中分叉出来的问题。

Garden 不要求存在一个独立软件仓库。它更关心：

> 这个想法后来长出了哪些枝杈？

当前 Garden：

- Olist 分析记录；
- 数据观察；
- Agent 可靠性笔记；
- debugging / testing 过程；
- 未来从 Lab 中拆出来的实验记录。

### 一个简单判断

如果内容的核心是“我搭了一个东西”，放进 `Lab`。

如果内容的核心是“我沿着一个问题走了很远”，放进 `Garden`。

同一个项目可以同时拥有 Lab 页面和 Garden 文章。仓库是对象，Garden 是围绕对象产生的过程。

## 5. doupo-analysis 的核心叙事

`doupo-analysis` 不应该只作为一个项目卡片出现。它更适合成为网站最有个人特色的一条主线。

### 推荐叙事结构

```text
一个很具体的疑问
    ↓
不想连接真实服务，所以先建立边界
    ↓
把黑盒行为搬进离线环境
    ↓
加入 seed、instrumentation 和 batch simulation
    ↓
比较不同分支，而不是只看一次结果
    ↓
留下一个可以继续追问的实验室
```

这条故事线的重点不是“逆向能力”，也不是“系统复杂度”，而是：

- 你没有满足于“看起来像这样”；
- 你主动给实验加了边界；
- 你把一次性的观察变成可重复的比较；
- 你允许结果保持局部、有限和未完成。

### 推荐个人口吻

> 我本来只是想弄清楚一个前端行为到底在做什么。既然不想碰真实服务，我就给自己造了一个离线实验室：固定 seed，记录运行过程，批量比较不同情况。它没有变成一个产品，但变成了一个可以继续追问的地方。

### 页面必须保留的内容

- 起点：最初到底想知道什么；
- 边界：明确不访问什么、不模拟什么；
- 实验器：seed、instrumentation、batch simulation 等；
- 转折：哪些第一次直觉是错的；
- 发现：哪些行为可以被重复观察；
- 当前未解问题：下一步还想知道什么。

不要把页面写成完整的技术报告。应该让读者看见“一个人如何被一个奇怪的问题拖着走”。

## 6. apple-design 视觉系统如何承接新的内容语气

保留当前视觉基础：

- 浅色、安静的页面底色；
- 轻量 translucent navigation；
- 系统字体与收敛的中文大标题；
- 强 → 静 → 强 → 静的 section rhythm；
- 少量强调色；
- 只在有空间连续性的交互中使用 spring；
- reduced motion 下保留状态反馈，而不是粗暴关闭一切。

内容转向个人化，不需要靠增加插画、渐变、贴纸或更多动效实现。主要变化来自层级和文字：

### 从“证明”改成“记录”

把：

```text
可验证、可交付、工程质量
```

改成：

```text
我试了什么、哪里卡住、后来发现什么
```

### 从“卡片”改成“空间中的对象”

- Lab 使用较完整的实验面板；
- Garden 使用更像阅读目录的条目；
- Now 使用轻量状态列表；
- Side Quest 使用简短行；
- 不让所有内容共享同一种卡片模板。

### 从“视觉高潮”改成“阅读节奏”

建议首页节奏：

```text
Hero 强
  ↓
Now 静、近、可更新
  ↓
Lab 强，但只有一个主实验
  ↓
Garden 静、可阅读、允许未完成
  ↓
Side Quests 轻
  ↓
About 静
```

页面应该通过留白、字号和密度表达层级，而不是给每个 section 一个新的视觉特效。

### 动效边界

- Now 更新时只需要即时的内容状态反馈，不需要大面积 reveal；
- Lab 内部的 pipeline、步骤切换或空间关系可以使用可打断 spring；
- Garden 的阅读列表使用普通颜色和 opacity transition；
- Side Quest 行只需要 pointer-down 的即时反馈；
- 不为“新文章出现”统一添加 fade-up；
- 不用滚动动画制造“网站正在活动”的错觉。

## 7. 内容模型：让新增内容足够简单

未来新增一篇 Note 或 Experiment，不应该需要修改首页布局、增加新的组件类型或重新设计一个卡片。

### Note 最小字段

```yaml
type: note
title: "一个具体的问题或观察"
date: "2026-09-08"
status: seed | growing | settled | paused
summary: "一句话说明我为什么记下它"
body: "正文"
related:
  - olist-business-analysis-report
  - excel-data-report
```

Note 最少只需要：

- 标题；
- 日期；
- 一句话；
- 正文。

### Experiment 最小字段

```yaml
type: experiment
title: "实验名称"
question: "我想知道什么？"
started: "2026-09-08"
status: building | paused | finished | failed
repo: "https://github.com/..."
what-happened: "目前发生了什么"
next-question: "接下来还想知道什么"
```

Experiment 最少只需要：

- 一个问题；
- 一个过程记录；
- 一个当前状态；
- 一个下一步或未解问题。

### 新内容发布规则

新增内容时只需要：

1. 新建一个 Note 或 Experiment 文件；
2. 填写最小字段；
3. 如果它属于 Now，再加一条 Now 引用；
4. 如果它成熟到值得首页出现，再加入首页的有限 preview。

大多数 Note 不需要进入首页。首页只负责展示当前最值得进入的少数内容。

## 8. 第一版内容地图

```text
HOME
│
├── Hero
│   └── 这是一个什么地方
│
├── Now
│   └── 最近正在做、想、研究的 2–4 件事
│
├── Lab
│   ├── doupo-analysis
│   ├── excel-data-report
│   └── limitless（边界合适时加入）
│
├── Garden
│   ├── Olist rabbit hole
│   ├── build logs
│   ├── debugging notes
│   └── learning records
│
├── Side Quests
│   ├── Recharts merged PR
│   └── Storybook merged PR
│
├── About
│   ├── Aeneas 这个名字
│   ├── 为什么喜欢折腾东西
│   └── 为什么保留这个空间
│
└── Elsewhere
    ├── GitHub
    └── Email
```

## 9. 结论

第一版网站不需要覆盖所有仓库，也不需要解释所有经历。

它只需要形成三条清晰的线：

1. `NOW` 让网站有现在时；
2. `LAB` 让人看到 Aeneas 认真搭过什么；
3. `GARDEN` 让人看到一个问题如何在时间里继续生长。

其中，`doupo-analysis` 是最适合建立个人辨识度的主线，`excel-data-report` 是最适合持续维护的 Lab，Olist 是最适合开始 Garden 的第一批内容。

网站不需要把每件事都解释成成果。留下问题、过程、失败和未完成，本身就是这个空间的内容。
