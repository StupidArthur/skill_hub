# Skill Hub · 待办清单（Todo）

> 本文件汇总 skill_hub 仓库的待办项，来源于 [skill-standard](C:/Users/Administrator/.claude/skills/skill-standard) 下的合规性审查。
> 完成一项划掉一项（用 `~~` 包住），保持文件可追溯。

---

## 状态总览

| 优先级 | 数量 | 已完成 |
|--------|------|--------|
| P0（硬性违规） | 4 | 4 |
| P1（建议优化） | 1 | 1 |
| P2（锦上添花） | 2 | 2 |
| **合计** | **7** | **7** |

---

## P0 · 硬性违规（必改）

### [x] ~~#1 `dev-skill` description 缺兜底句~~
- **文件**：`dev-skill/SKILL.md:3`
- **违反**：[skill-standard/frontmatter.md:27](../.claude/skills/skill-standard/frontmatter.md) — description 必须含「兜底句」
- **现状**（107 字符）：「开发工程纪律，以完整流程驱动。开始一次开发或修改工作时调用，按需求→设计（含选型）→实现→测试→提交打包五阶段推进，每阶段内嵌对应规则。设计阶段含技术选型（桌面GUI/B-S网站/CLI工具，Go/Python）。」
- ~~**改法**：在末尾追加「**任何涉及开发或修改代码的工作都应调用。**」~~ ✅ 已完成

### [x] ~~#2 `ppt-skill` description 缺兜底句~~
- **文件**：`ppt-skill/SKILL.md:3`
- **违反**：同上
- ~~**改法**：在末尾追加「**任何涉及制作分享 / 演讲 / 发布会风格网页 PPT 的工作都应调用。**」~~
- **实际改法**：与 #5 合并——先精简 description（移除 WebGL 背景/章节幕封/数据大字报/图片网格等模板细节，正文「这个 Skill 做什么」段已含这些），再在末尾追加兜底句。✅ 已完成

### [x] ~~#3 删除孤儿文件 `dev-skill/requirement-design.md`~~
- **文件**：`dev-skill/requirement-design.md`（28 行）
- **违反**：[skill-standard/directory.md:16-22](../.claude/skills/skill-standard/directory.md) — 阶段文件必须由入口流程节点引用，不能躺着
- **证据**：
  - `dev-skill/SKILL.md` 流程主线只引用 `requirement.md` 和 `design.md`
  - 全仓库 grep 无任何 `requirement-design` 引用
  - 内容是旧的「需求+设计」合并版，已被拆分替代
- ~~**改法**：`rm dev-skill/requirement-design.md`~~ ✅ 已完成

### [x] ~~#7 `dev-skill/SKILL.md` 残留 `design/SKILL.md` 断链（审查漏报，执行时新发现）~~
- **文件**：`dev-skill/SKILL.md:35`、`dev-skill/SKILL.md:47`
- **违反**：[skill-standard/directory.md:63](../.claude/skills/skill-standard/directory.md) — 子目录入口用 README.md，不写 design/SKILL.md
- **证据**：
  - 第 35、47 行引用 `[design/](design/SKILL.md)`，但 `design/` 子目录下无 SKILL.md（只有 README.md）→ 断链
  - 第 79 行已正确用 `design/README.md`，三处不一致
  - 首轮审查「确认合规」误判此条已通过（只看了第 79 行）
- ~~**改法**：第 35、47 行的 `design/SKILL.md` 改为 `design/README.md`~~ ✅ 已完成

---

## P1 · 建议优化

### [x] ~~#4 `ppt-skill/SKILL.md` 缺「横切资源」表~~
- **文件**：`ppt-skill/SKILL.md`
- **违反**：[skill-standard/directory.md §三.4](../.claude/skills/skill-standard/directory.md) — 目录级入口必须有四块（frontmatter / 核心红线 / 流程主线 / 横切规则引用表）
- **现状**：H2 段位为「全局硬规则 / 这个 Skill 做什么 / 何时使用 / 工作流 / ⏸ PAUSE / 资源文件导览 / 核心设计原则 / 参考作品」，无横切表。但 `references/` 下 10 个文件实际就是横切资源（components / themes / layouts / checklist / screenshot-framing …）
- ~~**改法**：在「工作流」之后、「资源文件导览」之前插入横切表~~ ✅ 已完成
- **备注**：ppt-skill 非经典「流程阶段+横切规则」结构，已有详尽的「资源文件导览」段；横切表以「被哪些 Step 引用」维度补充，与导览段互补不重复。映射依据各 references 文件内部说明 + SKILL.md「加载顺序建议」。

---

## P2 · 锦上添花

### [x] ~~#5 `ppt-skill` description 超 200 字符~~
- **文件**：`ppt-skill/SKILL.md:3`（当前 230 字符）
- **违反**：[skill-standard/frontmatter.md](../.claude/skills/skill-standard/frontmatter.md) — 「控制在 200 字符以内」
- ~~**改法**：把次要内容（WebGL 背景、章节幕封、数据大字报、图片网格等模板）从 description 移到正文「这个 Skill 做什么」段。description 只留：风格 + 触发条件 + 兜底。~~ ✅ 已完成（与 #2 合并执行）

### [x] ~~#6 `dev-skill/design/README.md` 加子目录总览~~
- **文件**：`dev-skill/design/README.md`
- **现状**：当前只列了决策树和场景清单，但 `bs-web/`、`cli-tool/`、`gui-tool/`、`shared/`、`examples/` 五个子目录之间的职责边界不清晰
- ~~**改法**：在 README 顶部加一个子目录职责总览表（每个子目录管什么、何时去看），强化入口索引作用。~~ ✅ 已完成

---

## 确认合规 · 不动

- ✅ 入口 SKILL.md 是流程型（不是纯路由表）
- ✅ 流程阶段文件带 `> 流程阶段X` blockquote、结尾有「完成标志」
- ✅ 阶段文件无 frontmatter
- ✅ 横切规则文件带 `> 横切规则` blockquote、内部写明「什么情况适用」
- ✅ 横切文件无 frontmatter
- ✅ 子目录入口用 README.md（不是 SKILL.md）：`dev-skill/design/`、`dev-skill/design/examples/skill-manager-pro/`（#7 修复了 SKILL.md 内残留的 `design/SKILL.md` 断链，现三处引用统一为 `design/README.md`）
- ✅ LICENSE 文件位于 skill 根目录、与 SKILL.md 同级
- ✅ LICENSE 协议合规：`dev-skill` MIT（Copyright StupidArthur）、`ppt-skill` AGPL-3.0（继承自歸藏原项目）
- ✅ frontmatter 不写 License 字段
- ✅ License 在 SKILL.md 末尾或顶部有声明
- ✅ 根 README 有 License 章节并区分两个 Skill 的协议
- ✅ `.gitignore` 不误伤 LICENSE

---

## 操作记录

- 2026-06-21：完成第一轮审查（基于 skill-standard），生成本文档
- 2026-06-21：执行全部待办（#1-#7）。其中 #7 为执行时新发现的断链问题（首轮审查漏报），已补入 P0 并修复；#2 与 #5 合并为一次编辑（精简 description 同时加兜底句）
