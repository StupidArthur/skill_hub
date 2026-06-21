# Skill Hub

本仓库是一个 **Skill 集合（Skill Hub）**，每个子目录对应一份独立的 Skill，供 Claude Code / Codex 等 Agent 环境调用。

## 目录结构

```
skill_hub/
├── dev-skill/        # 开发工程纪律与流程规范
├── ppt-skill/        # 网页 PPT 生成技能
├── skill-standard/   # Skill 编写规范
├── README.md         # 本文件
└── .gitignore
```

## Skill 列表

| Skill | 简介 |
|-------|------|
| [dev-skill](./dev-skill/SKILL.md) | 开发工程纪律，以完整流程驱动。按需求→设计（含选型）→实现→测试→提交打包五阶段推进，每阶段内嵌对应规则。设计阶段含技术选型（桌面 GUI / B-S 网站 / CLI 工具，Go / Python）。 |
| [ppt-skill](./ppt-skill/SKILL.md) | 生成横向翻页网页 PPT（单 HTML 文件），含 WebGL 背景、章节幕封、数据大字报、图片网格等模板。提供两种风格：① "电子杂志 × 电子墨水"（衬线 + 流体背景 + 暖色） ② "瑞士国际主义"（无衬线 + 网格点阵 + IKB / 柠檬黄 / 柠檬绿 / 安全橙高亮）。当需要制作分享 / 演讲 / 发布会风格的网页 PPT，或提到 "杂志风 PPT"、"瑞士风 PPT"、"Swiss Style"、"horizontal swipe deck" 时使用。 |
| [skill-standard](./skill-standard/SKILL.md) | 指导如何编写 skill。按四步流程推进：选形态→写 frontmatter→写入口→写子文件。当需要新建、重构或审查 skill 格式时调用。 |

## 各 Skill 详细说明

### 1. dev-skill — 开发工程纪律

- **定位**：语言与框架无关的通用开发流程纪律。
- **核心红线**：
  - 谋定后动（禁止拿到需求直接写代码）
  - 删代码前必须二次确认
  - 需求边界（超出当前模块时主动指出并给替代方案）
  - 按需执行（不主动多做未要求的事）
- **五阶段流程**：
  1. **需求阶段** —— 产出需求文档（[requirement.md](./dev-skill/requirement.md)）
  2. **设计阶段** —— 含技术选型（[design.md](./dev-skill/design.md)，[design/](./dev-skill/design/README.md)）
  3. **实现阶段** —— 按设计编码（[coding-standards.md](./dev-skill/coding-standards.md)）
  4. **测试阶段** —— 业务逻辑测试（[testing.md](./dev-skill/testing.md)）
  5. **提交与打包阶段** —— 版本管理 + 打包（[version-control.md](./dev-skill/version-control.md)、[build-package.md](./dev-skill/build-package.md)）
- **横切规则**：
  - [文档与知识管理](./dev-skill/doc-management.md) —— 需求/设计/测试文档写法
  - [运行安全与运维](./dev-skill/runtime-safety.md) —— 批处理/长任务设计
  - [LLM 集成功能设计](./dev-skill/llm-integration.md) —— 涉及 LLM 调用的设计
- **技术选型覆盖**：
  - 桌面 GUI 工具：Wails + Go（[gui-tool/](./dev-skill/design/gui-tool/)）
  - B/S 网站：React + Shadcn 前端 + Go/Python 后端（[bs-web/](./dev-skill/design/bs-web/)）
  - CLI 工具：Go (cobra) / Python (typer)（[cli-tool/](./dev-skill/design/cli-tool/)）
  - 共享前端规范：React 18 + TS + Shadcn UI + Tailwind v3 + Vite（[shared/](./dev-skill/design/shared/)）

### 2. ppt-skill — 网页 PPT 生成

- **定位**：单文件 HTML 横向翻页 PPT 技能；附带 PPT 配图与多平台封面。
- **来源**：归藏（guizang-ppt-skill），仓库 [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)；当前项目支持方包括 360 安全龙虾（金牌赞助）、真格 Token Grant（Grant Supporter）。
- **两种风格**：
  - **风格 A · 电子杂志 × 电子墨水**（默认）
    - WebGL 流体 / 等高线 / 色散背景
    - 衬线标题（Noto Serif SC + Playfair Display）+ 非衬线正文 + 等宽元数据
    - 适合：人文分享、行业观察、商业发布、需"杂志感"的演讲
    - 模板：[assets/template.html](./ppt-skill/assets/template.html) · 主题：[references/themes.md](./ppt-skill/references/themes.md) · 布局：[references/layouts.md](./ppt-skill/references/layouts.md)
  - **风格 B · 瑞士国际主义（Swiss Style）**
    - WebGL 极细网格 + 点阵背景
    - 全程无衬线（Inter + Helvetica + Noto Sans SC）+ 极致字号对比
    - 高反差功能色：克莱因蓝 IKB / 柠檬黄 / 柠檬绿 / 安全橙（四选一）
    - 适合：科技产品、数据汇报、设计/工程领域分享、年度总结
    - 模板：[assets/template-swiss.html](./ppt-skill/assets/template-swiss.html) · 主题：[references/themes-swiss.md](./ppt-skill/references/themes-swiss.md) · 布局：[references/layouts-swiss.md](./ppt-skill/references/layouts-swiss.md)
- **交互**：横向翻页（键盘 ← →、滚轮、触屏、ESC 索引）、Lucide 图标、Motion One 入场动效（本地 + CDN 双保险）。
- **配套资源**：
  - [references/components.md](./ppt-skill/references/components.md) —— 组件清单
  - [references/checklist.md](./ppt-skill/references/checklist.md) —— 踩坑清单
  - [scripts/validate-magazine-deck.mjs](./ppt-skill/scripts/validate-magazine-deck.mjs) · [scripts/validate-swiss-deck.mjs](./ppt-skill/scripts/validate-swiss-deck.mjs) —— 校验脚本
  - [references/image-prompts.md](./ppt-skill/references/image-prompts.md) —— 配图提示词
- **使用时机**：需要做分享 / 演讲 / 发布会风格网页 PPT，或提到"杂志风 PPT"、"瑞士风 PPT"、"Swiss Style"、"horizontal swipe deck" 时调用。

### 3. skill-standard — Skill 编写规范

- **定位**：指导如何编写 skill 的元规范（meta-skill），是所有 skill 的格式基准。
- **通用红线**：入口必须流程型、单文档也要放在目录下、子目录入口用 README.md、frontmatter 必备、description 含兜底句。
- **四步流程**：
  1. **选形态** —— 单文档 vs 目录级（[single-doc.md](./skill-standard/single-doc.md) / [directory.md](./skill-standard/directory.md)）
  2. **写 frontmatter** —— name + description（[frontmatter.md](./skill-standard/frontmatter.md)）
  3. **写入口 SKILL.md** —— 流程型，含红线 + 流程主线 + 横切表
  4. **写子文件** —— 流程阶段文件 / 横切规则文件 / 子目录（目录级才有）
- **案例参考**：[examples/](./skill-standard/examples/README.md)

## License

本仓库为多 Skill 集合，各 Skill 独立持证，**协议不同**：

| Skill | 协议 | 版权 / 备注 |
|-------|------|------------|
| [`dev-skill/`](./dev-skill/) | [MIT](./dev-skill/LICENSE) | Copyright (c) 2026 StupidArthur。基于完全自写内容。 |
| [`ppt-skill/`](./ppt-skill/) | [AGPL-3.0](./ppt-skill/LICENSE) | 衍生自歸藏的 [guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill)，原版权归属原作者。衍生修改与归属声明见 [NOTICE](./ppt-skill/NOTICE)。 |
| [`skill-standard/`](./skill-standard/) | [MIT](./skill-standard/LICENSE) | Copyright (c) 2026 StupidArthur。基于完全自写内容。 |

> ⚠️ `ppt-skill/` 为 AGPL-3.0 copyleft 协议。若以网络服务形式对外提供基于它的能力，须按 AGPL-3.0 §13 向用户公开修改后的完整源码。

## 安装与使用

每个 Skill 都有自己的 `SKILL.md` 作为入口。安装方式通常为：

```bash
npx skills add <repo-url> --skill <skill-name>
```

或在 Agent 中提示其把 Skill 复制到 `~/.claude/skills/<skill-name>/`。

## 贡献

- **dev-skill**：在 `dev-skill/` 下按现有规范新增子模块规范（设计阶段的选型树）。
- **ppt-skill**：风格、模板、组件、清单的修改参考 `ppt-skill/mod/` 下的历史修改记录与评审稿（`personal_mod.md`、`review_by_*.md`、`review_merged.md`）。
- **skill-standard**：规范本身的修改直接在 `skill-standard/` 下进行，新增案例放 `examples/`。
