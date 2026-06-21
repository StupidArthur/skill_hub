# Guizang PPT Skill 综合评审报告（合并版）

> **合并来源**：`review_by_ds.md`（ds）、`review_by_glm.md`（GLM）、`review_by_kimi.md`（Kimi）
> **合并日期**：2026-06-18
> **评审路径**：`g:\skills\guizang-ppt-skill`
> **验证方式**：对三方提到的每一条问题，均回到仓库源码 / 模板 / 校验器做实际核验，并标注验证状态。

---

## 零、验证状态图例

| 标记 | 含义 |
|------|------|
| ✅ 已确认 | 问题在当前仓库中真实存在，已通过代码检索或实际运行复现 |
| ⚠️ 部分确认 | 问题方向成立，但程度 / 范围与原描述有出入 |
| 💡 观察性建议 | 非缺陷，属于改进方向，无法用"存在/不存在"判定 |

---

## 一、总体评价（三方共识）

guizang-ppt-skill 是一份**定位清晰、完成度很高、工程化意识强**的 Agent Skill。它不是"Markdown 转 HTML"的玩具，而是把"Agent 生成可直接演示的横向翻页网页 PPT"做成了有边界、有约束、有兜底的流水线。

三方一致认为其核心价值不在于两套模板本身，而在于**把审美和工作流显式编码成 Agent 能执行的规则**：需求澄清 7 问、主题节奏硬规则、瑞士风 22 版式锁定、P0/P1/P2/P3 分级 checklist、配图比例与槽位绑定、截图保真优先策略。这种"把经验沉淀成约束"的做法在 Agent Skill 里属于第一梯队 / 上乘水平。

三方综合评分区间：**8.2/10 ~ A-**。

同时，三方也一致指出存在若干**可复现的工程缺陷**，主要集中在"模板自洽性"和"离线/拷贝后的可用性"上。这些问题不影响设计理念，但会影响首次使用体验和"开箱即用"的承诺。

---

## 二、核心亮点（三方共识）

### 1. 双风格不是换肤，而是两套独立的设计语言
- **风格 A · 电子杂志 × 电子墨水**：衬线标题（Noto Serif SC + Playfair）+ WebGL 流体/等高线/色散背景 + 暖色纸感，定位叙事、人文、观点。
- **风格 B · 瑞士国际主义**：全程无衬线（Inter + Helvetica）+ 极细网格/点阵 + 单一高饱和锚点色（IKB / 柠檬黄 / 柠檬绿 / 安全橙）+ 直角发丝线，定位事实、产品、数据、方法论。
- 两套风格各自有独立的模板、布局、主题色和配图规则，[SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) 反复强调"一份 deck 只能选一套，不能混用"，降低了 Agent 的决策负担。

### 2. 瑞士风版式锁定 + 自动化校验是最大亮点
[swiss-layout-lock.md](file:///g:/skills/guizang-ppt-skill/references/swiss-layout-lock.md) 把正文页严格限定在 22 个登记版式（`S01–S22`），新增首尾页只能用 `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`，并配 [validate-swiss-deck.mjs](file:///g:/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs) 做自动拦截。校验规则覆盖未登记版式、实验性 `P23/P24`、SVG 内可见文字、图片缺 `data-image-slot`、`S22` 人脸裁切、`S15/S16` 槽位误用、标题居中等真实踩坑场景。"规则文档 + 可执行校验"的组合在 Agent Skill 里很少见。

### 3. 工作流写给 Agent 看，可执行性强
[SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) 的工作流是逐步指令而非抽象描述：Step 1 的 7 问澄清清单（并区分 Claude Code 用 Ask Question、Codex 用普通对话）；Step 2 拷贝模板 + 必改占位符；Step 3 类名预检 → 主题节奏规划 → 挑布局 → 图片比例规范。对常见返工点有预防性说明，如"类名必须在模板 `<style>` 里有定义"、"不要接受用户自定义 hex"。

### 4. 模板单文件可运行，且做了多重降级
两个模板都是单文件 HTML，浏览器直接打开即可演示：横向翻页（键盘 / 滚轮 / 触屏 / 圆点 / ESC 索引）；WebGL 背景，按 `B` 切换低性能静态模式并通过 `localStorage` 持久化；Motion One 入场动效按 recipe 分发，做了 `prefers-reduced-motion` 与加载失败的 opacity 兜底；风格 B 引入 IBM Carbon 2x Grid 的 spacing/motion token，设计系统化程度高。

### 5. 配图与截图链路完整
[image-prompts.md](file:///g:/skills/guizang-ppt-skill/references/image-prompts.md) 给出两套风格各自的配图提示词库，并强制"先定槽位再生成比例"；[screenshot-framing.md](file:///g:/skills/guizang-ppt-skill/references/screenshot-framing.md) 把截图处理分成"程序化适配优先（保真）/ GPT-M 2.0 只做重构"，提供 7 个语义参数，配套 `assets/screenshot-backgrounds/` 下 9 张内置背景 WebP，可复用到多平台封面。

### 6. 质量兜底分层 + 实战沉淀
checklist（人）+ 版式锁定（文档）+ 校验脚本（机器）三层防护；checklist 每条都带"现象 / 根因 / 做法 / 自检命令"四段式结构，明显来自真实分享场景的迭代。

---

## 三、问题清单（已逐条验证）

> 按严重程度排序。每条标注：提出方、验证状态、证据、建议。

### P0 · 严重（影响"开箱即用"承诺，可复现）

#### 1. 🔴 模板自带的 demo slides 通不过自家校验器 ✅ 已确认
- **提出方**：GLM #1
- **复现命令**：`node scripts/validate-swiss-deck.mjs assets/template-swiss.html`
- **实际运行结果**（exit code = 1，本次评审实测复现）：
  ```
  Swiss deck validation failed:
  - Slide 1: missing data-layout. Swiss locked mode requires S01-S22 or SWISS-COVER-ASCII/SWISS-CLOSING-ASCII.
  - Slide 1: top heading appears vertically/centrally aligned. Use the original left-top title skeleton.
  - Slide 2: missing data-layout. Swiss locked mode requires S01-S22 or SWISS-COVER-ASCII/SWISS-CLOSING-ASCII.
  ```
- **根因**：[template-swiss.html](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html) 在 `SLIDES_HERE` 之后内置了两页 demo（L1245 封面 `<section class="slide accent">`、L1273 封底 `<section class="slide split">`），均未写 `data-layout`（全文件检索 `data-layout` 零命中）。而 SKILL.md 明确要求封面/封底必须用 `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`。
- **影响**：新用户拷贝模板后第一件被叮嘱做的事就是"运行校验器"，结果立刻报错，严重打击首次使用信心。
- **建议**：给两页 demo 补上 `data-layout="SWISS-COVER-ASCII"` 和 `data-layout="SWISS-CLOSING-ASCII"`，让模板自身能通过校验，作为"开箱即过"的基线。

#### 2. 🔴 本地 motion.min.js 在拷贝后的 deck 里必然 404 ✅ 已确认
- **提出方**：GLM #2
- **证据**：两个模板都声明"本地 + CDN 双保险"——[template.html:747](file:///g:/skills/guizang-ppt-skill/assets/template.html#L747) / [template-swiss.html:1607](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html#L1607) 均为 `motion = await import('./assets/motion.min.js')`。但 [SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) Step 2（L153-165）的拷贝指令只做两件事：
  ```bash
  mkdir -p "项目/XXX/ppt/images"
  cp "<SKILL_ROOT>/assets/template.html" "项目/XXX/ppt/index.html"
  ```
  **没有任何步骤**把 `assets/motion.min.js` 一起拷到生成物目录。
- **后果**：任何按官方流程生成的 deck，`./assets/motion.min.js` 都会 404，"本地优先"形同虚设，实际永远走 CDN，"离线可用"承诺在生成物上不成立。
- **建议**（任选其一）：
  - Step 2 增加 `cp <SKILL_ROOT>/assets/motion.min.js 项目/XXX/ppt/assets/motion.min.js`；
  - 或把 `motion.min.js` 内联进模板 `<script>`，真正实现单文件自洽；
  - 或在文档里诚实说明"本地 fallback 仅在 Skill 根目录预览时生效，生成物依赖 CDN"。

### P1 · 中（影响可移植性 / 质量一致性 / 维护成本）

#### 3. 🟠 golden source 写死 macOS 本地路径，不可移植 ✅ 已确认
- **提出方**：DS #3.1、GLM #3
- **证据**：硬编码路径 `/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html` 出现在：
  - [SKILL.md:398](file:///g:/skills/guizang-ppt-skill/SKILL.md#L398)（注：DS 原文标 L402，实测为 L398，问题属实）
  - [checklist.md:218](file:///g:/skills/guizang-ppt-skill/references/checklist.md#L218)
  - [swiss-layout-lock.md:9](file:///g:/skills/guizang-ppt-skill/references/swiss-layout-lock.md#L9)
  - [layouts-swiss.md:13](file:///g:/skills/guizang-ppt-skill/references/layouts-swiss.md#L13) 与 [layouts-swiss.md:206](file:///g:/skills/guizang-ppt-skill/references/layouts-swiss.md#L206)
- **附加问题**：[checklist.md:225](file:///g:/skills/guizang-ppt-skill/references/checklist.md#L225) 要求"运行本次测试目录里的 `compare-swiss-base.mjs`"，但该脚本在仓库中**并不存在**（已检索确认）。
- **影响**：对其他用户毫无意义，会让 Agent 误以为"应该去读这个文件"。
- **建议**：把 golden source 改为仓库内相对路径或可访问的样例 deck；移除对不存在脚本的引用；或将"维护者内部对齐信息"挪到 `CONTRIBUTING.md`，不进 Agent 主路径。

#### 4. 🟠 缺少示例项目 ✅ 已确认
- **提出方**：GLM #4、Kimi #1
- **证据**：仓库无 `examples/` 目录（Glob 检索零命中）。
- **影响**：新用户从 SKILL.md + 9 份 reference 直接上手成本较高。
- **建议**：增加 1–2 份完整生成的 deck（如一份 8 页杂志风、一份 10 页瑞士风），既当样板又当校验器回归测试夹具（配合问题 1，能防止"模板/规则/校验器"三者再次脱节）。

#### 5. 🟠 缺少风格 A 的校验器 ✅ 已确认
- **提出方**：DS #3.5、GLM #5、Kimi #2
- **证据**：`scripts/` 下仅有 [validate-swiss-deck.mjs](file:///g:/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs)，无风格 A 校验器。
- **影响**：风格 A 同样有大量可机器化的约束（`[必填]` 占位符未替换、`slide` 缺 `light`/`dark`/`hero` 主题类、连续 3 页同主题、使用模板 `<style>` 未定义的类名），但无自动拦截，两类风格质量兜底不对等。
- **建议**：增加 `validate-magazine-deck.mjs`，至少覆盖上述前四项，把风格 A 兜底补齐到与风格 B 同等水平。

#### 6. 🟠 风格 A 与风格 B 的同名类冲突 ✅ 已确认
- **提出方**：DS #3.3、GLM #6、Kimi #5
- **证据**：两模板均定义 `.h-hero` / `.lead` / `.meta-row`，但视觉完全不同：
  - [template.html](file:///g:/skills/guizang-ppt-skill/assets/template.html)：`.h-hero`（L217，Noto Serif SC 衬线）、`.lead`（L84/L249）、`.meta-row`（L258）
  - [template-swiss.html](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html)：`.h-hero`（L180，Inter 无衬线 weight 200）、`.lead`（L225）、`.meta-row`（L254）
- **影响**：文档已强调不能混用，但 Agent 在混读文档时仍可能踩坑。
- **建议**：为风格 B 使用前缀化类名（如 `sw-h-hero` / `sw-lead`）从命名层面根治；或在风格 A 校验器里加"检测风格 B 专属类名"的规则。

#### 7. 🟠 文档与实现的小幅不一致：data-theme ✅ 已确认
- **提出方**：GLM #6
- **证据**：
  - [components.md:26](file:///g:/skills/guizang-ppt-skill/references/components.md#L26) 写"必须包含 `data-theme` 属性"；
  - [template.html:646](file:///g:/skills/guizang-ppt-skill/assets/template.html#L646) 实际是 `el.dataset.theme || (el.classList.contains('light')?...)`，即 `data-theme` 可选、会回退到 class；
  - [checklist.md](file:///g:/skills/guizang-ppt-skill/references/checklist.md) 2b 又强调"slide 必须带 light/dark 类"。
  - 三处对"主题到底由什么决定"表述不统一。
- **建议**：以 class 为准并修订 components.md，统一表述。

### P2 · 中低（改进方向 / 耦合度 / 体验）

#### 8. 🟡 文档冗余与维护负担 💡 观察性建议
- **提出方**：DS #3.2
- **说明**：SKILL.md 与 README.md 有大量重复内容（风格介绍、使用场景、核心原则、主题色预设等）；checklist.md 与 SKILL.md Step 3 的规则（类名预检、对齐法则、字号分档）有重叠。
- **建议**：将 checklist.md 作为唯一权威，SKILL.md 中引用而非重复；README.md 聚焦人类快速上手，细节交给 SKILL.md。

#### 9. 🟡 单文件模板体量大，维护成本高 ✅ 已确认
- **提出方**：DS #3.4、GLM #8、Kimi #6
- **证据**：[template-swiss.html](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html) 超过 1600 行，CSS / WebGL shader / ASCII IIFE / 翻页 JS / demo HTML 全揉在一起。
- **说明**：符合"单文件交付"目标，但维护者阅读成本高，修改一处容易影响其他。
- **建议**：开发期用多文件 + 构建打包，或在文件内用更清晰的 region 注释分段；可考虑将 WebGL shader 和动画 recipe 拆为独立 JS 模块（生成时内联回去）。

#### 10. 🟡 离线 / CDN 依赖 ✅ 已确认
- **提出方**：DS（安全评估）、GLM #7、Kimi #4
- **证据**：模板依赖 Google Fonts、Lucide（unpkg）、Motion One（jsDelivr）、MapLibre（unpkg）。字体加载失败有 fallback，但地图 CDN 失败时依赖静态 fallback。
- **建议**：在 README 明确列出外部依赖清单与降级行为；或提供本地字体/图标/Motion 的可选 fallback 包。

#### 11. 🟡 图片生成流程与平台强耦合 💡 观察性建议
- **提出方**：DS #3.6
- **说明**：配图流程（image-prompts.md、screenshot-framing.md）与 Codex / GPT-M 2.0 平台强耦合，未来换平台需重写。
- **建议**：将"图片生成"抽象为通用接口描述，平台特定实现作为附录。

#### 12. 🟡 明确不支持场景的边界 💡 观察性建议
- **提出方**：GLM #9、Kimi #7
- **说明**：README/SKILL 已列出不适合场景（大段表格、培训课件、多人协作）。建议再补：
  - 需要复杂交互动画 / 嵌入视频 / 实时数据 → 拒绝或降级；
  - 需要打印 / 导出 PDF → 单文件 HTML 打印分页不稳定，应在需求澄清阶段提前问"是否需要打印/PDF"。

### P3 · 低（小问题 / 锦上添花）

#### 13. 🟢 P23/P24 实验版式仍提供完整代码 ✅ 已确认
- **提出方**：DS #3.8
- **证据**：[layouts-swiss.md:743](file:///g:/skills/guizang-ppt-skill/references/layouts-swiss.md#L743) 起有"历史实验区（默认禁用）"，P23（L747）、P24（L794）标注"默认禁用"但提供完整代码，可能被 Agent 误用。
- **建议**：保留说明但移除完整代码，或在校验器中已拦截的基础上进一步降低可见性。

#### 14. 🟢 Issue 模板缺少中文版本 ✅ 已确认
- **提出方**：DS #3.8
- **证据**：[bug_report.yml](file:///g:/skills/guizang-ppt-skill/.github/ISSUE_TEMPLATE/bug_report.yml) 等均为英文，项目主体为中文用户。
- **建议**：提供中文版 issue 模板，或中英双语。

#### 15. 🟢 SPONSORS 信息在 README 与 SPONSORS.md 重复 ⚠️ 部分确认
- **提出方**：DS #3.8
- **证据**：[SPONSORS.md](file:///g:/skills/guizang-ppt-skill/SPONSORS.md) 有完整赞助表；[README.md](file:///g:/skills/guizang-ppt-skill/README.md) L9-10（badge）、L64-70（赞助与支持小节）也列出了 360 安全龙虾、真格 Token Grant。
- **说明**：README 已主要链接到 SPONSORS.md，但赞助方名称仍两处出现，存在轻度重复。
- **建议**：README 仅保留 badge + 链接，详情统一收口到 SPONSORS.md。

#### 16. 🟢 "来源识别"元指令可能泄漏进 PPT ⚠️ 部分确认
- **提出方**：DS #3.8
- **说明**：SKILL.md 顶部要求 Agent 在生成时排除该信息，这是一个容易被忽略的元指令，Agent 可能无意中将其写入 PPT。
- **建议**：用更显眼的隔离标记（如独立 `<!-- META: -->` 块）并明确"绝不写入生成物"。

#### 17. 🟢 测试覆盖不足 ✅ 已确认
- **提出方**：DS #3.7
- **证据**：仓库无自动化测试框架。
- **建议**：至少增加视觉回归测试（截图对比）和模板渲染测试；示例项目（问题 4）可同时作为回归夹具。

#### 18. 🟢 国际化支持 💡 观察性建议
- **提出方**：Kimi #3
- **说明**：模板默认中文，已有 [README.en.md](file:///g:/skills/guizang-ppt-skill/README.en.md)，但模板占位文案、类名说明、错误提示仍以中文为主。
- **建议**：如目标用户含英文场景，可提供英文版模板占位文案，并在 SKILL.md 增加"英文 deck"处理说明。

---

## 四、安全性评估（DS 提供，三方无异议）

| 检查项 | 状态 | 说明 |
|---|---|---|
| 是否暴露密钥/Token | ✅ 通过 | 未发现任何硬编码密钥 |
| 是否有 XSS 风险 | ✅ 通过 | 单文件 HTML，无用户输入渲染 |
| 是否有依赖供应链风险 | ⚠️ 注意 | 依赖 Google Fonts / unpkg(Lucide) / jsDelivr(Motion) / MapLibre CDN；字体有 fallback，地图 CDN 失败依赖静态 fallback |
| 是否有本地文件访问风险 | ✅ 通过 | 仅读取同目录下的 images/ 和 assets/ |

---

## 五、可扩展性（DS 提供）

| 维度 | 评分 | 说明 |
|---|---|---|
| 新增主题色 | 容易 | 只需在 themes.md / themes-swiss.md 添加 CSS 变量块 |
| 新增布局 | 中等 | 风格 A 在 layouts.md 添加骨架即可；风格 B 需同步更新 layout-lock、校验器、模板 CSS |
| 新增平台支持 | 较难 | 配图流程与 GPT-M 2.0 强耦合，需要适配层 |
| 模板定制 | 较难 | 单文件 HTML 中 CSS/JS/GLSL 高度耦合 |

---

## 六、优先级修复建议（合并结论）

**第一优先级（成本极低、回报极高，直接破坏"开箱即用"承诺）：**
1. 给 template-swiss.html 两页 demo 补 `data-layout`，让模板通过自家校验器（问题 1）
2. Step 2 补拷贝 `motion.min.js`，或内联进模板，让本地 fallback 在生成物里真正生效（问题 2）

**第二优先级（可移植性 / 质量一致性）：**
3. 移除文档中硬编码的 macOS 路径与对不存在脚本 `compare-swiss-base.mjs` 的引用（问题 3）
4. 增加 1–2 份示例项目，兼作回归夹具（问题 4）
5. 增加风格 A 校验器（问题 5）

**第三优先级（降低长期维护成本 / 体验完善）：**
6. 统一 `data-theme` 表述（问题 7）；考虑风格 B 类名前缀化（问题 6）
7. 降低单文件模板维护成本（问题 9）；明确 CDN 依赖与降级（问题 10）
8. 补充不支持场景边界、issue 模板中文化等小问题（问题 12–18）

---

## 七、结论

**guizang-ppt-skill 是一份理念先进、规则扎实的高质量 Agent Skill，在"网页 PPT"垂类建立了很高的标杆。** 三方评审对其设计体系、文档质量、质量控制给出高度一致的正向评价，22 个瑞士风锁定版式 + 校验器的组合是用"约束"换"质量"的精妙工程决策。

但要把它从"优秀"推向"首选"，需要先解决两个**可复现的自洽性问题**（模板 demo 通过自家校验器、本地 motion fallback 在生成物里真正生效）——这两点修复成本极低，但对首次使用体验和"开箱即用"承诺的回报极高。在此基础上补齐示例项目、风格 A 校验器和可移植的 golden source，它完全可以成为 Agent 生成 PPT 的事实标准之一。

> **附注**：本合并报告对三方提到的所有问题均已回到源码核验。其中 DS 原文标注的 `SKILL.md:L402`（硬编码路径）实测为 L398，问题属实仅行号略有出入；DS 提到的"SPONSORS 重复"为轻度重复（README 已主要链接到 SPONSORS.md）。其余问题均如实确认存在。
