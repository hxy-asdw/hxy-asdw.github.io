# Case Study 事实与来源

这里只保留人工整理的溯源清单，不包含原始数据或源码。起因与探索先后顺序来自作者回顾；原游戏机制属于被分析游戏，不属于作者原创实现。

| Section | 核实内容 | 读取来源 |
| --- | --- | --- |
| 00–01 | 好奇驱动的拆解起点 | 作者提供的回顾，不从文件反推动机 |
| 02 | 数据、事件、模拟引擎、页面层分工；本地与保存的 online 快照一致 | data.js、events.js、sim.js、game.js、runtime-lab-sources.json、online/comparison.json；额外哈希读取 online 下四份 JS |
| 03 | createGame 与 rollYear 顺序；提前返回；日志队列与年份不同步 | sim.js、game.js、runtime-analysis.md |
| 04 | 普通突破不消费 cult；100 上限；三条成帝路径；事件先扣次数后判条件；单步观察 | data.js、events.js、sim.js、runtime-analysis.md、runtime-checks.json、runtime-lab.html、runtime-lab-install.js、runtime-lab-ui.js |
| 05 | 问题自然延伸 | 作者回顾 |
| 06 | 固定初态、1 局样本、3651 年、源气终局；271 个覆盖点中联合命中 212 | simulation-summary.json、simulation-config.json、branch-coverage.json、simulation-report.md、BATCH-README.md、runtime-lab.html、runtime-lab-ui.js |
| 07 | seed93、3395 年／3401 岁、20291 draw；开局消费 3 draw 的差异；重放一致 | doupo-emperor-replay.html、seed-search-results.json、replay-verification.json、README-EMPEROR-REPLAY.md、SEED93-REPRODUCTION.md、seed93-rng-first100.json、seed93-clone-verification.json |
| 08–09 | 回顾与返回入口 | 作者回顾；以上证据的边界说明 |

## 冲突处理

- BATCH-README 声称当前交付为 1000 局；根目录配置、summary 与 report 一致为 1 局，采用后者。不借用 check-output 下同名文件拼接样本。
- 旧源码注释的源气 22–24 万与实现不符，采用 data.js 的 230000–240000；旧“小层不加寿元”注释与 lifespanGain 不符，采用实际函数。
- Seed 93 的 3395 是推进年数，3401 才是年龄。普通 Seeded 开局与固定初态搜索的协议不同，不是同 seed 算法失效。
- 单步面板为 LCG；批量与 Seed93 重放为 xoshiro128**，区分工具版本与随机源。
- 历史安装器存在，但后续 BATCH-README 要求使用独立离线页；不把安装器描述成当前批量入口。

## 本次只读核对

- 四份原始 JS 与已保存 online 副本 SHA-256 相等，并吻合 comparison 记录。
- 搜索、重放、clone 的 20291 项随机序列按顺序比较，无差异；前100项记录均 equal。
- 逐年状态与终态一致的结论采用验证 JSON 标志；本次未重新运行模拟、安装器或原项目测试。
- 大 JSON 以解析字段、数组核对方式读取；源码和内嵌工具页只读与文中主张相关的函数、入口和 CSP，不把整份派生 HTML 当成新增原创源码。

## 仍有边界

- 缺少可与 README 的 1000 局声明对应的本次已核实数据集，不给总体概率。
- 原工具报告不提供真实浏览器视觉／CSP 执行证据，不声称完成此项验证。
- 保存的 online 快照不等于当前线上版本；本次没有联网更新原项目。

## 2026-09-09 事实一致性收口

### 1000 局声明：仍未验证

- 搜索范围：原项目当前文件（含隐藏文件）、同名 config / summary / report、备份名称、本地全部分支历史、reflog 与不可达 Git 对象。当前只有 main / origin/main；有关结果的历史仅有初始提交 `9b97438`，提交中的根目录 summary 同样是 1 局。`git fsck --full --no-reflogs --unreachable` 未发现可恢复的历史对象。本结论不覆盖其他机器、未获取的远程历史或已丢失文件。
- 根目录 simulation-config.json / simulation-summary.json / simulation-report.md：seed 20261051，请求与完成均为 1，成帝 1；xiandi / xianyuan / feisheng 为 0 / 1 / 0，截断 0。采用这组三份一致记录，但不把样本比例解释为游戏概率。
- check-output 下三份同名文件：seed 1，请求与完成均为 10，死亡 10、成帝 0、截断 0，三条成帝路径均为 0。它不是缺失的 1000 局结果，不与根目录拼接。
- 另发现 aptitude-comparison.json：每种资质 10000 局、共 100000 局，资质 1–10 各有独立 seed 区间；这是另一套资质对照实验，不能证明 README 所说的那次 1000 局。aptitude-comparison-validation.json 的 passed 对应 20 局工具一致性校验，不是重新核验全部 100000 局。本轮未将这组实验扩展进页面。
- 采用配置与结构化结果，而非孤立 README 数字；没有可核实的 1000 局成帝数、各路径数或最终比例。本轮未重新执行任何模拟，没有新建模拟结果目录，也未改动原项目。

### Seed 93：已确认计数单位与边界

- 来源：seed-search-results.json、replay-verification.json、seed93-clone-verification.json、emperor-replay-core.js 的 session / nextYear / rngForSeed，以及 sim.js 的 rollYear。
- `rollCount = years.length = 3395`；主局每次 rollYear 同时令 year 与 age 加 1。初始 year 为 0、age 为 6，终态 year 为 3395、age 为 3401。这里的年数不累加事件内部其他角色的临时模拟年数。
- 本轮逐条检查保存的 3395 条年度记录：year 与 roll 相等、age 等于 6 + roll；RNG 边界从 0 连续衔接到 20291，无不一致记录。fullLogs 实际长度为 415，不代表 415 年。
- `searchRngDraws.length = 20291` 只记录成功候选 Seed 93 的整局随机消费，包含内部临时模拟。失败候选不在这个数组内；全候选合计另见 searchTotals。独立重放和 clone 各自记录同样长度，不将各次验证相加。
- 引擎回调每返回一次 53 位 [0,1) 数值就记录一个 draw；适配器内部调用两次 32 位 word，不把 word 次数称为 draw。固定基准直接构造初态，不包含普通 createGame 的三次开局抽取；内部临时模拟的 createGame 消费仍会计入。
- replay verification 的 finalStatesEqual / yearBoundariesAndStatesEqual 为 true；这是保存的验证结果，本轮只核对数据和实现，未重新执行引擎。

### RNG 与规则：采用实际实现，限定于保存的源码版本

| 结论 | 采用来源与理由 | 边界 |
| --- | --- | --- |
| 单步工具使用 LCG | runtime-lab-ui.js 的乘数 1664525、增量 1013904223 与 32 位状态更新 | 不等于 Seed 93 的算法 |
| Seed 93 使用 xoshiro128** | emperor-replay-core.js rngForSeed 与 replay-verification.json 的 RNG 协议一致；splitmix32 初始化，53 位适配 | 不是官方浏览器随机流的回放 |
| 普通突破不检查或扣除 cult | sim.js attemptBreak 读取资质、境界和年龄；levelUp 增加 cult | 不推断其他事件不会扣斗气 |
| 普通升级上限 100 | attemptBreak 的上限保护、levelUp 在 lvl >= 100 时只增加 cult | 不是整个游戏最高等级；成帝可进入 101 |
| 三条成帝路径 | sim.js 中设置 ascended=true / lvl=101 的三处：古帝传承、源气达标、强冲成功 | 源码分支存在不等于自然样本验证了每条路径的概率 |
| 事件先扣次数，再判断 cond | sim.js rollEvent：年龄及剩余次数筛选 → 加权抽取 → 扣次数 → cond → ok/fail | 内部测试模式另排除 xuejin；不是先用 cond 筛池 |

### 页面其他具体数字的来源

| 页面数字 | 来源 |
| --- | --- |
| 初态境界 1、斗气 10、血脉/资质 10、年龄 6、寿元 80；上限 100000 年 | 根目录 simulation-config.json 与 summary.config |
| seed 20261051；1 局、0 截断；3651 次推进、3657 岁、斗气 1784253 | 根目录 simulation-summary.json，与 simulation-report.md 一致 |
| 271 / 157 / 179 / 212 覆盖点 | branch-coverage.json；分别为登记、自然命中、注入命中、联合命中，不相加当作独立样本 |
| 源气门槛 230000–240000；小层寿元奖励 1% 四舍五入 | data.js 源气数据；sim.js lifespanGain，优先于冲突的旧注释 |
| 8 项检查、禁止接口访问 0 | runtime-checks.json；工具记录，不是完整浏览器实测 |
| seed 93、3395 / 3401 / 20291 / 415 | seed-search-results.json 的 seed / rollCount / emperorAge / searchRngDraws / fullLogs |
| 前 100 个随机值一致；普通开局消费 3 个 draw，第一年从索引 3 开始 | seed93-rng-first100.json、SEED93-REPRODUCTION.md 与 sim.js createGame |
| 重放终态境界 101、斗气 2207677、寿元 999999 | replay-verification.json、seed93-clone-verification.json 终态 |

本轮页面没有更换上述数值，只补全计数解释与 1000 局的证据边界。仍未验证总体成帝概率、缺失的 1000 局历史结果、当前线上源码及真实浏览器环境下的原工具运行；不以保存的报告冒充本轮重新运行。
