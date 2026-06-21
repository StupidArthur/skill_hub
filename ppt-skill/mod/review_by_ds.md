# guizang-ppt-skill 评审报告

> 评审人: ds
> 评审日期: 2026-06-18

---

## 一、总体评价

guizang-ppt-skill 是一个面向 AI Agent 的网页 PPT 生成技能，定位清晰、结构完整、文档扎实。整体质量处于同类 Skill 的上游水平，审美体系成熟，工程实践务实。评审总分: **8.2/10**。

---

## 二、优势亮点

### 2.1 文档体系极其完善 (9.5/10)

- **SKILL.md** (541 行) 覆盖了从需求澄清到最终交付的完整工作流，每一步都有明确的操作指引和"为什么这么做"的解释
- **README.md** 面向人类用户，提供快速上手、安装方式、常见场景和 FAQ
- **references/** 目录下 9 个文件各司其职：组件手册、布局骨架、主题色预设、检查清单、配图提示词、截图适配规则、瑞士风版式锁、地图组件、瑞士风布局
- 文档之间交叉引用关系清晰，加载顺序明确

### 2.2 设计体系成熟 (9/10)

- 两套风格系统（风格 A 电子杂志风、风格 B 瑞士国际主义风）各自有完整的设计哲学、字体体系、配色方案和布局库
- 风格 A 10 种布局 + 5 套主题色，风格 B 22 种锁定版式 + 4 套锚点色
- 设计原则明确且可执行："克制优于炫技"、"结构优于装饰"、"图片是第一公民"
- 瑞士风"版式锁"（layout lock）机制是亮点：通过 `data-layout` 属性 + 校验脚本强制约束，确保生成质量不下滑
- 字号与字重阶梯（"越大越细，越小越粗"）建立了具体可量化的映射表，不是空泛的感性描述

### 2.3 质量控制体系 (8.5/10)

- **checklist.md** 按 P0/P1/P2/P3 四级分类，来自真实迭代踩坑经验，每条都有"现象→根因→做法→自检命令"的完整闭环
- **validate-swiss-deck.mjs** 静态校验脚本覆盖了版式登记、图片槽位绑定、SVG 文字、标题居中、实验版式拦截等关键问题
- 类名预检机制（Step 3.0）强制要求生成前先读取模板 `<style>` 块，从源头避免样式丢失
- 主题节奏硬规则（不能连续 3 页同主题、必须有 dark/light 交替等）确保视觉呼吸感

### 2.4 工程化程度 (8/10)

- 单文件 HTML 交付，零构建、零服务器，浏览器直接打开
- Motion One 本地 + CDN 双保险加载，断网时自动降级为无动画但内容可读
- B 键低功耗模式：停止 WebGL/ASCII canvas RAF，取消 Web Animations，通过 localStorage 持久化
- ESC 索引视图 + 克隆 slide 可见性 CSS override
- 模板中 CSS 变量高度参数化，主题切换只需替换 `:root` 块
- 内置截图背景资产（Style A 5 套 + Style B 4 套 WebP）避免重复生成

### 2.5 平台适配意识 (8/10)

- 明确区分 Claude Code 和 Codex 两种运行环境的行为差异（Ask Question vs 普通对话）
- 配图流程与 GPT-M 2.0 / GPT-Image 2.0 集成
- 字体 fallback 考虑了 Windows 用户（`Microsoft YaHei UI`、`Noto Sans SC`）

---

## 三、待改进问题

### 3.1 硬编码路径问题 (严重)

**问题**: 多处文档中硬编码了作者本机 macOS 路径 `/Users/guohao/Documents/op7418的仓库/项目/Thin-Harness-Fat-Skills/ppt/index.html`，涉及文件：

- [SKILL.md:L402](file:///g:/skills/guizang-ppt-skill/SKILL.md#L402) - Step 4.0 视觉核对步骤
- [checklist.md:L218](file:///g:/skills/guizang-ppt-skill/references/checklist.md#L218) - 模板还原度守卫
- [swiss-layout-lock.md:L9](file:///g:/skills/guizang-ppt-skill/references/swiss-layout-lock.md#L9) - Golden Source 定义
- [layouts-swiss.md:L13](file:///g:/skills/guizang-ppt-skill/references/layouts-swiss.md#L13) - Swiss locked mode 说明

这些路径在其他用户机器上完全不可用，会导致 Agent 无法找到原始参考文件。建议改为相对于 SKILL_ROOT 的路径，或移除具体路径改为描述性说明。

**建议**: 在仓库中内置一份参考 HTML 到 `assets/` 或 `references/` 下，统一使用相对路径。

### 3.2 文档冗余与维护负担 (中)

- **SKILL.md** 和 **README.md** 有大量重复内容（风格介绍、使用场景、核心原则、主题色预设等），维护时需要同步更新两处
- **checklist.md** 与 **SKILL.md Step 3** 中的规则有重叠（如类名预检、对齐法则、字号分档等），部分内容重复出现
- 建议将 checklist.md 作为唯一权威，SKILL.md 中引用而非重复

### 3.3 风格 A 与风格 B 的类名冲突 (中)

两个模板中存在同名类但语义完全不同的情况：

- 风格 A 的 `.h-hero` 是 Noto Serif SC 衬线
- 风格 B 的 `.h-hero` 是 Inter 无衬线 weight 200

虽然文档中已多次强调，但这是一个设计上的隐患——Agent 在混用文档时可能产生混淆。建议在未来的版本中考虑为两套风格使用不同的类名前缀（如 `mag-` 和 `sw-`）。

### 3.4 模板文件体积与可维护性 (中)

- `template.html` 和 `template-swiss.html` 是内嵌 CSS + WebGL shader + JS 的完整单文件，随着功能增加体积会持续膨胀
- 模板中的 WebGL shader 代码（GLSL）和 Motion One 动画逻辑与布局 CSS 耦合在一起，修改一处容易影响其他
- 建议考虑将 WebGL shader 和动画 recipe 逻辑拆分为独立的 JS 模块（在生成时内联回去），提高模板本身的可读性

### 3.5 校验脚本覆盖范围有限 (中低)

- [validate-swiss-deck.mjs](file:///g:/skills/guizang-ppt-skill/scripts/validate-swiss-deck.mjs) 仅覆盖瑞士风（风格 B），风格 A 没有对应的校验脚本
- 校验器使用正则匹配 HTML，无法捕获 CSS 继承或运行时问题（如字体是否实际加载、动画是否正常执行）
- 建议增加风格 A 的校验器，至少覆盖类名存在性、图片比例、主题节奏等基础检查

### 3.6 图片生成流程的耦合度 (中低)

- 配图流程（Step 1 Codex 配图生成、image-prompts.md、screenshot-framing.md）与 Codex/GPT-M 2.0 平台强耦合
- 如果未来需要在其他平台使用，这部分工作流需要重写
- 建议将"图片生成"抽象为通用接口描述，平台特定实现作为附录

### 3.7 测试覆盖不足 (低)

- 没有自动化测试框架
- 模板的 CSS 变更、WebGL shader 修改、动画 recipe 调整缺乏回归测试手段
- 建议至少增加视觉回归测试（截图对比）和模板渲染测试

### 3.8 小问题

- SKILL.md 中"来源识别"段落（L8）要求 Agent 在生成时排除该信息，这是一个容易被忽略的元指令，Agent 可能无意中将其写入 PPT
- 风格 B 的 `P23/P24` 被标记为"历史实验区，默认禁用"，但仍在 layouts-swiss.md 中提供了完整代码，可能被 Agent 误用
- `.github/ISSUE_TEMPLATE/` 的 issue 模板（bug_report、feature_request、question）配置完善，但缺少中文版本
- SPONSORS.md 和 README.md 中的赞助信息展示重复

---

## 四、安全性评估

| 检查项 | 状态 | 说明 |
|---|---|---|
| 是否暴露密钥/Token | ✅ 通过 | 未发现任何硬编码密钥 |
| 是否有 XSS 风险 | ✅ 通过 | 单文件 HTML，无用户输入渲染 |
| 是否有依赖供应链风险 | ⚠️ 注意 | 依赖 Google Fonts CDN、unpkg (lucide)、jsdelivr (motion)、MapLibre CDN；字体加载失败有 fallback，但地图 CDN 失败时依赖静态 fallback |
| 是否有本地文件访问风险 | ✅ 通过 | 仅读取同目录下的 images/ 和 assets/ |

---

## 五、可扩展性

| 维度 | 评分 | 说明 |
|---|---|---|
| 新增主题色 | 容易 | 只需在 themes.md / themes-swiss.md 添加 CSS 变量块 |
| 新增布局 | 中等 | 风格 A 在 layouts.md 添加骨架即可；风格 B 需要同步更新 layout-lock、校验器、模板 CSS |
| 新增平台支持 | 较难 | 配图流程与 GPT-M 2.0 强耦合，需要适配层 |
| 模板定制 | 较难 | 单文件 HTML 中 CSS/JS/GLSL 高度耦合 |

---

## 六、总结

guizang-ppt-skill 是目前所见质量最高的 AI Agent PPT 生成 Skill 之一。它在设计体系、文档质量、质量控制方面都达到了相当高的水准。22 个瑞士风锁定版式 + 校验器的组合是一个精妙的工程决策，用"约束"换"质量"的思路值得推广。

**最需要优先解决的问题**:
1. 移除文档中的硬编码本机路径（严重，影响所有非作者用户）
2. 减少 SKILL.md 与 README.md 之间的内容重复（降低维护成本）
3. 考虑为风格 A 增加校验脚本（提升两类风格的生成质量一致性）

如果这些问题得到解决，评分可提升至 8.8-9.0。