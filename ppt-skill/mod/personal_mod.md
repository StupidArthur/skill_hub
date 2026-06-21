# guizang-ppt-skill 修改方案 (Modification Proposal)

> 状态: 🟡 **草案 · 待用户批准 · ⛔ 尚未修改任何文件**
> 日期: 2026-06-18
> 目标 skill: `guizang-ppt-skill` (上游: github.com/op7418/guizang-ppt-skill)
> 本地安装位置: `C:\Users\Administrator\.agents\skills\guizang-ppt-skill\`
> 当前 SKILL.md: 36603 字节, 855 行

## 用户决策记录 (2026-06-18 已回答)

| 问题 | 答案 |
|------|------|
| Q1 · BLOCKING 强度 | **强制 BLOCKING** —— 不收到 approved 词 不动 HTML |
| Q2 · 版本标记 | **加 metadata** —— frontmatter 加 `local-mods` 字段 |
| Q3 · 落地位置 | **A · 直接 patch SKILL.md** (侵入式) |
| Q4 · Outline 路径 | **项目根 / `display-N-outline.md`** |
| Q5 · Phase 2 严格度 | **完全 verbatim** —— outline 没写的样式坑也不能动 |

**用户已决定开始实施时**,按 §8 顺序执行。**未决定前**,本方案不触发任何修改动作。

---

## 0. 立场声明(为什么谨慎)

`guizang-ppt-skill` 是从公开仓库下载的标准化 skill,作者是歸藏,带赞助商信息。
直接 patch 它的内容会带来两个风险:

| 风险 | 说明 |
|------|------|
| **破坏上游同步** | 之后 `npx skills update` 覆盖会丢失本地修改 |
| **偏移维护共识** | 改动了原作者的设计意图,后续 issue/PR 不再适用本地版 |

**本方案的设计原则**: 改动要可回滚、可识别、与上游解耦。

---

## 1. 提议的修改清单

| # | 名称 | 优先级 | 落地位置 | 性质 |
|---|------|--------|----------|------|
| M1 | **Phase 1/2 分离 + Outline 评审暂停点** | P0 | SKILL.md (Step 3 之前) | 新增章节 |
| M2 | **规则冲突 → 必须问用户,不自决** | P0 | SKILL.md (新增"总则"章节) | 新增硬规则 |
| M3 | **本地修改的版本标记** | P1 | SKILL.md 顶部 frontmatter | 新增 metadata |
| M4 | **outline-md schema 与示例** | P0 | SKILL.md (新增附录) | 新增模板 |

---

## 2. M1 · Phase 1/2 分离 + Outline 暂停点

### 2.1 当前流程的问题

```
当前: MD → (内部规划) → 直接写 HTML
                       ^^^^^^^^^^^^
                       人类无法打断,无法评审,无法编辑
```

### 2.2 提议的新流程

```
Phase 1 · 规划(可打断,显式 PAUSE)
  输入:  原始 MD + 资源
  输出:  display-N-outline.md  ← 唯一 source of truth
        (Markdown 表格, 人类可读可编辑)
  动作:  拆页 / 取舍 / 改写 / 增删
  状态:  ⏸ PAUSE — 等用户批准

Phase 2 · 格式化(纯翻译,不可再创作)
  输入:  display-N-outline.md (已批准)
  输出:  display-N.html
  动作:  verbatim 翻译: outline 字段 → HTML class
  状态:  机器执行,不再询问
```

### 2.3 在 SKILL.md 里的插入位置

在现有 `### Step 3 · 填充内容` 之前,**新增 Step 2.5**。

### 2.4 提议新增的文本(完整段落)

```markdown
### Step 2.5 · 输出 Page Outline 并暂停(显式 Phase 1 / Phase 2 分界)

**⛔ BLOCKING**: 完成本页所有内容规划后必须停下,等用户显式批准才能进入 Step 3。

#### 流程分界

| 阶段 | 范围 | 可否再思考 | 输出物 |
|------|------|-----------|--------|
| **Phase 1 · 规划** | 拆页 / 取舍 / 改写 / 字段标注 | ✅ 自由 | `display-N-outline.md` |
| **Phase 2 · 格式化** | outline → HTML 的逐字段翻译 | ❌ 不可再创作 | `display-N.html` |

**Phase 2 是机械翻译,不是再思考。** 用户在 outline 里改的任何字,必须 1:1 反映到 HTML;HTML 里出现的每段文字必须能在 outline 里找到出处。

#### Outline Schema(必填字段)

```markdown
# display-N-outline
源文件: pre_X.md · 风格: A/B · 主题: 🖋/🌊/🌿/🍂/🌙 · 页数: N

| # | theme | layout | kicker | title | body | callout | image | note |
|---|-------|--------|--------|-------|------|---------|-------|------|
| 1 | hero-dark | L1 | (无) | AI 赋能测试 | 私享会开场, 2026.06 | — | — | 封面, 无页码 |
| 2 | light | L3 | Where to push AI | 我们要把 AI 推到哪? | 4 个 Yes (Vision) | — | — | 大字报 2x2 |
| 3 | light | L5 | The Workflow | 测试全流程图 | 14 节点 4 反馈环 | 14/4/1 | 01_blueprint.svg | fit-contain, h:36vh |
| ... | | | | | | | | |
```

**字段说明**:
- `theme`: `light` / `dark` / `hero-light` / `hero-dark`
- `layout`: L1-L10 (风格 A) 或 S01-S22 (风格 B)
- `kicker`: 短钩子, ≤ 20 字, 与 chrome 不同义
- `title`: 衬线大标题, ≤ 5 字不加 nowrap
- `body`: 该页正文,可多行,标注 [LEAD] [BODY] [LIST] 等子类型
- `callout`: 引用块,可选
- `image`: `images/xxx.svg` + ratio + 高度(vh),可选
- `note`: 取舍说明 —— 原文删了什么 / 合并了什么 / 改写为什么

#### PAUSE 标记

完成 outline 后,在文档末尾追加:

```markdown
---
## ⏸ PAUSE — Awaiting User Approval

**Phase 1 Complete**. 请评审以上 outline:
- 检查 kicker / title / body 字段
- 编辑 callout 措辞
- 调整 image 落位
- 补充 / 删除页

回复 "approved" 或修改后的 outline 文件路径,即可进入 Phase 2。
```

#### 进入 Phase 2 的条件

- 用户显式说 "approved" / "go" / "继续"
- 或用户提供了修改后的 outline 文件

满足任一条件,才允许进入 Step 3 写 HTML。

```

### 2.5 兼容性分析

- ✅ 不修改任何现有 step 的内容
- ✅ 现有用户跳过 outline 也能继续(因为是新增章节,不强制)
- ❓ 但如果要"全局生效",需要强制 BLOCKING —— 这一点见 §6 待你确认
```

---

## 3. M2 · 规则冲突 → 必须问用户

### 3.1 提议的硬规则

```markdown
### 规则冲突处理(全局硬规则)

**当两条 skill 内部规则产生冲突时,不得自决,必须询问用户。**

典型冲突场景:
- "单 accent 规则" vs "多工具推荐"(风格 B 经常出现)
- "版式多样性" vs "内容密度"(7/9/11 项的尴尬数量)
- "视觉简洁" vs "信息完整"(工具描述是否含链接/特点)
- "中文标题 ≤ 5 字" vs "标题必须保留原意"

#### 决策框架

```
1. 意识冲突存在 — 不跳过, 不默认选一个
2. 分析各方保护的价值
3. 向用户呈现选项模板(见下)
4. 等用户回复,再继续
```

#### 选项模板

```
检测到规则冲突:[简述冲突内容]

这个场景下你倾向于:
A. 严格遵守视觉规则(单 accent / 版式简洁)
B. 优先内容准确性(保留全部信息)
C. 均等展示所有项(去掉高亮, 平等呈现)
D. 你来决定(不问我, 选个最稳的)
```

#### 与 outline 暂停的关系

- 规则冲突的提问,应该尽量在 **Phase 1 outline 阶段**问完
- Phase 2 不再询问(进入机械翻译)
- 例外: outline 没覆盖到的冲突,在 Phase 2 中断也要停下来问
```

### 3.2 在 SKILL.md 里的插入位置

在 SKILL.md 顶部 frontmatter 之后、`## 这个 Skill 做什么` 之前,**新增"全局硬规则"章节**。这样所有后续 step 都能引用。

### 3.3 兼容性分析

- ✅ 不修改任何 step 行为,只新增"问之前不要自决"的约束
- ✅ 现有 happy path 几乎不受影响(很少出现冲突)
- ⚠️ 增加了"提问次数",可能让有经验的用户的"无脑生成"变慢 —— 但这是设计意图

---

## 4. M3 · 本地修改的版本标记

### 4.1 提议

在 SKILL.md 顶部 frontmatter 增加一个 `local-mods` 字段:

```yaml
---
name: guizang-ppt-skill
description: ...
local-mods:
  version: "2026.06.18-m1"
  changes:
    - M1 · Phase 1/2 outline-driven workflow
    - M2 · rule conflict → ask user
  source-of-truth: ../../demo1/guizang-ppt-skill-mods/SKILL-modification-proposal.md
  upstream: https://github.com/op7418/guizang-ppt-skill
---
```

### 4.2 作用

- 后续 `npx skills update` 覆盖后,能从 metadata 看到本地丢了什么
- 多台机器同步时,这个字段是最快的"我改了什么"清单

---

## 5. M4 · outline-md schema 与示例(已含在 M1 中)

M1 §2.4 已包含 schema。示例:

```markdown
# display-1-outline
源文件: rc/pre_1.md · 风格: A · 主题: 🌿 森林墨 · 页数: 16

| # | theme | layout | kicker | title | body | callout | image | note |
|---|-------|--------|--------|-------|------|---------|-------|------|
| 1 | hero-dark | L1 | (无) | AI 赋能测试 | [LEAD] 一份关于 AI 如何嵌入测试团队日常工作流的内部分享; [META] 测试架构组 / 2026.06.18 | — | — | 封面 |
| 2 | light | L3 | Where to push AI | 我们要把 AI 推到哪? | [LEAD] 4 个 Yes, 是这份分享的全部边界。 [GRID 2x2] 提升效率 / 赋能 / 全流程 / 治理 | — | — | 原 MD "Page Vision" 章节 |
| 3 | light | L5 | The Workflow | 测试全流程图 | [LEAD] 14 个核心节点, 4 条反馈环, 知识库驱动设计 | 14 节点 · 4 反馈环 · 1 知识库 | images/01_blueprint.svg fit-contain h:36vh | 原 MD "Page Blueprint" mermaid 转图 |
| ... |
```

---

## 6. 关键待你确认的问题(影响落地方式)

| # | 问题 | 选项 |
|---|------|------|
| Q1 | **是否真的强制 BLOCKING?** | A. 是, 不批准就不动 HTML / B. 软提示, 用户忽略也能继续 |
| Q2 | **M3 metadata 标记是否加?** | A. 加(推荐) / B. 不加, 只靠本地规则文件 |
| Q3 | **修改落地到哪个文件?** | A. 直接 patch SKILL.md(侵入式) / B. 同时在 SKILL.md 顶部加一行 "本 skill 已被本地扩展, 见 ../demo1/guizang-ppt-rules.md"(轻量) / C. 不改 SKILL.md, 全靠 `guizang-ppt-rules.md` 补充 |
| Q4 | **outline 落盘路径约定?** | A. `项目/display-N-outline.md` / B. `项目/outline/display-N.md` / C. 不强制 |
| Q5 | **Phase 2 翻译时, 是否真的 0 思考?** | A. 是(可能踩 outline 没考虑到的样式坑时也要硬走) / B. 否(允许微调 inline style 适配,但不重写字段) |

---

## 7. 落地风险与回滚

| 风险 | 缓解 |
|------|------|
| `npx skills update` 覆盖丢失 | 用 git init 在 `~/.agents/skills/guizang-ppt-skill/` 做版本控制, 每次 patch 前 commit |
| 上游某次更新与本地冲突 | `git diff` 快速定位, M3 metadata 标记增量范围 |
| 改动让 skill 在其他项目失效 | M1 / M2 都是"加强约束",理论上不会让 happy path 失效;但建议先在 1-2 个项目试运行 |

---

## 8. 建议的实施顺序(等你批准后)

1. **决策 Q1-Q5** ← 你现在要回我的
2. 把 §2.4 + §3.2 + §4.1 + §5 的文本合并成一份 patch
3. 在 `~/.agents/skills/guizang-ppt-skill/` 做 git commit 基线
4. 应用 patch, 再 commit
5. 跑 1 个 demo 验证 Phase 1 / Phase 2 / 规则冲突三处都生效
6. 把这次修改记入 memory, 跨 session 保留

---

## 9. 当前进度

| 阶段 | 状态 |
|------|------|
| 1. 读上游 SKILL.md | ✅ |
| 2. 写本修改方案 | ✅ (你正在看的就是) |
| 3. 用户审 + 决策 Q1-Q5 | ⏳ |
| 4. 落地 | 待批准 |
| 5. demo 验证 | 待批准 |
| 6. 记入 memory | 待批准 |

---

## 10. 附录 · 参考

- 上游 SKILL.md 现状: `C:\Users\Administrator\.agents\skills\guizang-ppt-skill\SKILL.md` (855 行, 36603 字节)
- 本地补充规则: `F:\presentation\demo1\guizang-ppt-rules.md` (规则冲突框架已存在)
- 本次 demo 实际产出: `F:\presentation\demo1\display-m3.html` (16 页 · 风格 A · 森林墨)

---

*本方案是设计草案,所有改动等你显式批准。批准后我会按 §8 顺序执行。*
