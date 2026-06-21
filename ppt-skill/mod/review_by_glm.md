# Guizang PPT Skill 评审意见

**评审对象**：guizang-ppt-skill
**评审路径**：`g:\skills\guizang-ppt-skill`
**评审日期**：2026-06-18
**评审人**：GLM
**评审方法**：直接阅读仓库源码（`SKILL.md` / `README.md` / `references/*` / `assets/template*.html` / `scripts/validate-swiss-deck.mjs`），并对模板与校验器做实际运行验证。未参考仓库内其他评审文档。

---

## 一、总体评价

这是一个**完成度很高、工程化意识强**的 Agent Skill。它把"Agent 生成可直接演示的横向翻页网页 PPT"做成了一个有边界、有约束、有兜底的流水线，而不是一个"Markdown 转 HTML"的玩具。

它的核心价值不在于两套模板本身，而在于**把审美和工作流显式编码成 Agent 能执行的规则**：需求澄清 7 问、主题节奏硬规则、瑞士风 22 版式锁定、P0/P1/P2/P3 分级 checklist、配图比例与槽位绑定、截图保真优先策略。这种"把经验沉淀成约束"的做法在 Agent Skill 里属于上乘水平。

同时，它也存在几个**可复现的工程缺陷**（详见第五节），主要集中在"模板自洽性"和"离线/拷贝后的可用性"上。这些问题不影响设计理念，但会影响首次使用体验和"开箱即用"的承诺。

---

## 二、核心亮点

### 1. 双风格不是换肤，而是两套独立的设计语言

- **风格 A · 电子杂志 × 电子墨水**：衬线标题（Noto Serif SC + Playfair）+ WebGL 流体/等高线/色散背景 + 暖色纸感，定位叙事、人文、观点。
- **风格 B · 瑞士国际主义**：全程无衬线（Inter + Helvetica）+ 极细网格/点阵 + 单一高饱和锚点色（IKB / 柠檬黄 / 柠檬绿 / 安全橙）+ 直角发丝线，定位事实、产品、数据、方法论。

两套风格各自有独立的 [template](file:///g:/skills/guizang-ppt-skill/assets/template.html)、[layouts](file:///g:/skills/guizang-ppt-skill/references/layouts.md)、[themes](file:///g:/skills/guizang-ppt-skill/references/themes.md)，并且 [SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) 反复强调"一份 deck 只能选一套，不能混用"。这种收敛策略降低了 Agent 的决策负担。

### 2. 瑞士风版式锁定 + 自动化校验是最大亮点

[swiss-layout-lock.md](file:///g:/skills/guizang-ppt-skill/references/swiss-layout-lock.md) 把正文页严格限定在 22 个登记版式（`S01–S22`），新增首尾页只能用 `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`，并配 [validate-swiss-deck.mjs](file:///g:/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs) 做自动拦截。

校验器的规则设计相当细致，覆盖了真实踩坑场景：

- 未登记版式 / 缺 `data-layout` → 报错
- 实验性 `P23/P24` / `Swiss Image Split` / `Evidence Grid` → 报错
- SVG 内出现 `<text>` 可见标签 → 报错
- 本地图片缺 `data-image-slot` → 报错
- `S22` 必须绑定 `s22-hero-21x9` 且禁止 `object-position:top center`（避免裁人脸）→ 报错
- `S15/S16` 的 21:9 槽位误用 `fit-contain` 或固定 `vh` 高度 → 报错
- 非 statement 版式顶部标题 `text-align:center` → 报错

"规则文档 + 可执行校验"的组合在 Agent Skill 里很少见，是把"看起来像 Swiss 但已经脱离模板"这类隐性失败显性化的关键手段。

### 3. 工作流写给 Agent 看，可执行性强

[SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) 的工作流不是抽象描述，而是逐步指令：

- **Step 1** 7 问澄清清单（风格 / 受众 / 时长 / 素材 / 图片截图 / 主题色 / 硬约束），并区分 Claude Code（用 Ask Question）与 Codex（普通对话）两种运行环境。
- **Step 2** 拷贝模板 + 必改占位符 + 主题色"只许选不许自定义"。
- **Step 3** 类名预检（最重要）→ 主题节奏规划 → 挑布局 → 图片比例规范。
- 对常见返工点有预防性说明，例如"类名必须在模板 `<style>` 里有定义"、"chrome 和 kicker 不要写同一句话"、"不要接受用户自定义 hex"。

### 4. 模板单文件可运行，且做了多重降级

两个模板都是单文件 HTML，浏览器直接打开即可演示：

- 横向翻页：键盘 ← → / 滚轮 / 触屏 / 底部圆点 / ESC 紗引。
- WebGL 背景（风格 A 流体 / 风格 B 网格点阵），按 `B` 切换低性能静态模式，并通过 `localStorage` 持久化用户选择。
- Motion One 入场动效，按 recipe（cascade / hero / quote / directional / pipeline）分发，并做了 `prefers-reduced-motion` 与加载失败的 opacity 兜底。
- 风格 B 引入了 IBM Carbon 2x Grid 的 spacing token（`--sp-3`…`--sp-13`）和 Motion token，设计系统化程度高。

### 5. 配图与截图链路完整

[image-prompts.md](file:///g:/skills/guizang-ppt-skill/references/image-prompts.md) 给出风格 A / B 各自的配图提示词库（纪实照片 / 信息图 / 流程图 / 对比图 / 系统关系图 / 截图再设计 / 数据大字报），并强制"先定槽位再生成比例"。[screenshot-framing.md](file:///g:/skills/guizang-ppt-skill/references/screenshot-framing.md) 把截图处理分成"程序化适配优先（保真）/ GPT-M 2.0 只做重构"，并提供 7 个语义参数（ratio / background / padding / inset / shadow / corners / alignment），配套 `assets/screenshot-backgrounds/` 下 9 张内置背景 WebP。这套链路能复用到多平台封面（公众号 21:9 / 1:1 / 小红书 3:4 / 视频号 16:9）。

---

## 三、评分

| 维度 | 评分 | 说明 |
|------|------|------|
| 产品定位 | A+ | 锁定 Agent 生成网页 PPT 垂类，双风格覆盖完整 |
| 文档质量 | A | 工作流、checklist、reference 齐全且可执行 |
| 模板实现 | B+ | 单文件可运行，但自带 demo 通不过自家校验器，且本地 motion 路径在拷贝后失效 |
| 瑞士风版式锁定 | A+ | 22 版式登记 + 细致校验器，核心壁垒 |
| 配图与封面能力 | A- | 提示词库 + 截图语义参数 + 内置背景，链路完整 |
| 工程化与可维护性 | B+ | 结构清晰、有校验器，但缺示例项目、缺风格 A 校验器、golden source 路径不可移植 |
| 使用门槛 | B | 学习曲线陡，规则多但必要 |
| 可移植性 / 离线 | B- | 强依赖多个 CDN，golden source 写死 macOS 本地路径 |

**综合评分：A-**

---

## 四、优点

1. **经验沉淀密度高**：checklist 的每一条都带"现象 / 根因 / 做法 / 自检命令"四段式结构，明显来自真实分享场景的迭代，而不是凭空想象的规范。
2. **审美系统自洽**：两套风格都有明确的设计原则、字号字重阶梯（瑞士风"越大越细，越小越粗"）、主题色、字体分工，不是拼贴 CSS。
3. **Agent 友好**：大量规则用"Agent 能听懂的话"表达，例如"不要发明新类名"、"先选版式再生成图片"、"模板是唯一的类名来源"。
4. **质量兜底分层**：checklist（人）+ 版式锁定（文档）+ 校验脚本（机器）三层防护，能拦住大部分低质量输出。
5. **降级意识强**：低性能静态模式、Motion 加载失败兜底、MapLibre 失败的静态 fallback、`prefers-reduced-motion` 支持，都考虑了真实演示环境的不确定性。
6. **设计系统化**：风格 B 引入 Carbon spacing/motion token、role-based 文本色 token，超越了"写死 CSS"的层次。

---

## 五、问题与改进建议

### 1. 🔴 模板自带的 demo slides 通不过自家校验器（高优先级，可复现）

**复现命令**：

```bash
node scripts/validate-swiss-deck.mjs assets/template-swiss.html
```

**实际输出**（exit code = 1）：

```
Swiss deck validation failed:
- Slide 1: missing data-layout. Swiss locked mode requires S01-S22 or SWISS-COVER-ASCII/SWISS-CLOSING-ASCII.
- Slide 1: top heading appears vertically/centrally aligned. Use the original left-top title skeleton.
- Slide 2: missing data-layout. ...
```

**根因**：[template-swiss.html](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html) 在 `SLIDES_HERE` 之后内置了两页 demo（第 1245 行 `<section class="slide accent">` 封面、第 1273 行 `<section class="slide split">` 封底），但都没有写 `data-layout`。而 [SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) 明确要求封面/封底必须用 `SWISS-COVER-ASCII` / `SWISS-CLOSING-ASCII`。

**影响**：新用户拷贝模板后，第一件被叮嘱做的事就是"运行校验器"，结果立刻报错。这会严重打击首次使用信心，也让"瑞士风必须守版式"的规则显得不自信。

**建议**：给两页 demo 补上 `data-layout="SWISS-COVER-ASCII"` 和 `data-layout="SWISS-CLOSING-ASCII"`（封底的 `align-self:center` 也会因此被正确豁免）。改完后模板自身应能通过校验，作为"开箱即过"的基线。

### 2. 🔴 本地 motion.min.js 在拷贝后的 deck 里必然 404（高优先级，可复现）

**现象**：两个模板都声明"本地 + CDN 双保险"：

```js
// template.html L747 / template-swiss.html L1607
motion = await import('./assets/motion.min.js');
// 失败后 fallback 到 jsDelivr CDN
```

但 [SKILL.md](file:///g:/skills/guizang-ppt-skill/SKILL.md) Step 2 的拷贝指令只做了两件事：

```bash
cp "<SKILL_ROOT>/assets/template.html" "项目/XXX/ppt/index.html"
mkdir -p "项目/XXX/ppt/images"
```

**没有任何步骤**把 `assets/motion.min.js` 一起拷到 `项目/XXX/ppt/assets/motion.min.js`。

**后果**：任何按官方流程生成的 deck，`./assets/motion.min.js` 都会 404，"本地优先"形同虚设，实际永远走 CDN。所谓"离线可用"的承诺在生成物上不成立。

**建议**（任选其一）：
- 在 Step 2 增加 `cp <SKILL_ROOT>/assets/motion.min.js 项目/XXX/ppt/assets/motion.min.js`；
- 或把 `motion.min.js` 内联进模板 `<script>`，真正实现单文件自洽；
- 或在文档里诚实说明"本地 fallback 仅在 Skill 根目录预览时生效，生成物依赖 CDN"。

### 3. 🟠 golden source 写死 macOS 本地路径，不可移植（中优先级）

[swiss-layout-lock.md](file:///g:/skills/guizang-ppt-skill/references/swiss-layout-lock.md) 与 [checklist.md](file:///g:/skills/guizang-ppt-skill/references/checklist.md) 多次把 golden source 指向：

```
/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html
```

这是维护者本人的本地绝对路径，对其他用户毫无意义，也会让 Agent 误以为"应该去读这个文件"。checklist 0-E 甚至要求"运行本次测试目录里的 `compare-swiss-base.mjs`"，但该脚本在仓库中并不存在。

**建议**：把 golden source 改为仓库内相对路径或一个可访问的样例 deck；移除对不存在脚本的引用；或将这些"维护者内部对齐信息"挪到 `CONTRIBUTING.md`，不进 Agent 主路径。

### 4. 🟠 缺少示例项目（中优先级）

仓库没有 `examples/`。对新用户而言，从 `SKILL.md` + 9 份 reference 直接上手成本较高。建议增加 1–2 份完整生成的 deck（例如一份 8 页杂志风、一份 10 页瑞士风），既当样板又当校验器的回归测试夹具（配合问题 1 一起，能防止"模板/规则/校验器"三者再次脱节）。

### 5. 🟠 缺少风格 A 的校验器（中优先级）

目前只有瑞士风有 [validate-swiss-deck.mjs](file:///g:/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs)。风格 A 同样有大量可机器化的约束：`[必填]` 占位符未替换、`slide` 缺 `light`/`dark`/`hero` 主题类、连续 3 页同主题、使用了模板 `<style>` 未定义的类名。建议增加 `validate-magazine-deck.mjs`，至少覆盖前三项，把风格 A 的质量兜底补齐到与风格 B 同等水平。

### 6. 🟡 文档与实现的小幅不一致（低优先级）

- [components.md](file:///g:/skills/guizang-ppt-skill/references/components.md) L26 写"必须包含 `data-theme` 属性"，但 [template.html](file:///g:/skills/guizang-ppt-skill/assets/template.html) L646 的 JS 是 `el.dataset.theme || (el.classList.contains('light')?...)`，即 `data-theme` 可选、会回退到 class；[checklist.md](file:///g:/skills/guizang-ppt-skill/references/checklist.md) 2b 又强调"slide 必须带 light/dark 类"。三处对"主题到底由什么决定"的表述不统一，建议以 class 为准并修订 components.md。
- 风格 A 与风格 B 存在同名类（`h-hero` / `lead` / `meta-row` 等）但视觉完全不同。文档已强调不能混用，但仍建议在风格 B 用前缀化类名（如 `sw-h-hero`）从命名层面根治，或在风格 A 校验器里加"检测风格 B 专属类名"的规则。

### 7. 🟡 离线 / CDN 依赖（低优先级）

模板依赖 Google Fonts、Lucide（unpkg）、Motion One（jsDelivr）、MapLibre（unpkg）。离线或网络不稳定时字体会回退、图标不显示、地图组件降级。建议在 README 明确列出外部依赖清单与降级行为，或提供本地字体/图标的可选 fallback 包。

### 8. 🟡 单文件模板体量大，维护成本高（低优先级）

[template-swiss.html](file:///g:/skills/guizang-ppt-skill/assets/template-swiss.html) 超过 1600 行，CSS / WebGL shader / ASCII IIFE / 翻页 JS / demo HTML 全揉在一起。符合"单文件交付"目标，但维护者阅读成本高。建议开发期用多文件 + 构建打包，或在文件内用更清晰的 region 注释分段。

### 9. 🟡 明确不支持场景的边界（低优先级）

README/SKILL 已列出不适合场景（大段表格、培训课件、多人协作）。建议再补两条：
- 需要复杂交互动画 / 嵌入视频 / 实时数据 → 拒绝或降级；
- 需要打印 / 导出 PDF → 单文件 HTML 打印分页不稳定，应在需求澄清阶段提前问"是否需要打印/PDF"。

---

## 六、适合与不适合

### 适合

- 线下分享、demo day、发布会的演讲 deck。
- 把长文 / 方法论快速视觉化为网页 PPT。
- 需要统一视觉系统的多平台封面（公众号、小红书、视频号）。
- 在 Claude Code / Codex 中愿意接受"先澄清需求再动手"工作流的用户。

### 不适合

- 多人协作编辑的商务场景（静态 HTML）。
- 信息密度极高的培训课件或数据报表。
- 期望"一句话出整套完美 PPT"的零干预用户。
- 对离线运行、PDF 导出、视频嵌入有强需求的场景。

---

## 七、结论

**guizang-ppt-skill 是一份理念先进、规则扎实的高质量 Agent Skill，在"网页 PPT"垂类建立了很高的标杆。** 它的最大贡献不是两套模板，而是把审美与工作流编码成可执行、可校验的约束体系。

但要把它从"优秀"推向"首选"，需要先解决两个**可复现的自洽性问题**：让模板自带 demo 通过自家校验器、让本地 motion fallback 在生成物里真正生效。这两点修复成本极低，但对首次使用体验和"开箱即用"承诺的回报极高。在此基础上补齐示例项目、风格 A 校验器和可移植的 golden source，它完全可以成为 Agent 生成 PPT 的事实标准之一。
