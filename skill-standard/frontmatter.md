# frontmatter 规范

无论单文档还是目录级，SKILL.md 必须以 frontmatter 开头。frontmatter 是 Agent 发现和加载 skill 的唯一依据。

## 格式

SKILL.md 文件最顶部，用 `---` 包裹的 YAML 块：

```yaml
---
name: <skill-name>
description: <做什么 + 何时触发>
---
```

## 字段要求

### name
- skill 的唯一标识符
- 用小写英文 + 连字符，如 `dev-skill`、`skill-standard`
- 与目录名一致

### description
- **最关键的字段**——Agent 据此判断是否加载这个 skill
- 必须包含三部分：**做什么**（功能）+ **何时触发**（触发条件）+ **兜底句**
- 控制在 200 字符以内
- 兜底句示例："任何涉及 X 的工作都应调用"
- 示例：`指导如何编写 skill。按四步流程推进：选形态→写frontmatter→写入口→写子文件。当需要新建skill、重构现有skill、或审查skill格式时调用。任何涉及skill编写的工作都应调用。`

## description 撰写要点

### 必须写清触发条件

description 里的"何时触发"决定了 Agent 会不会在正确的时机加载这个 skill。常见触发条件写法：

- "当需要...时调用"
- "在...场景下使用"
- "收到...请求时触发"

### 必须有兜底句

枚举触发场景总有遗漏。必须加一句兜底，防止枚举不到的场景下 skill 不被加载：

- "任何涉及 X 的工作都应调用"
- "所有 X 相关操作前都应加载"

兜底句的作用：当用户的指令没有精确匹配枚举的触发条件时，兜底句能让 Agent 判断"这虽然没列出来，但属于 X 的范畴，应该加载"。

### 反例与正例

- ❌ `开发技术路线选型`（只说做什么，没说何时触发，没兜底）
- ❌ `指导编写 skill。当需要新建 skill、重构 skill 时调用。`（有触发条件但没兜底，遗漏"审查 skill 格式"等场景）
- ✅ `指导如何编写 skill。按四步流程推进。当需要新建、重构或审查 skill 时调用。任何涉及 skill 编写的工作都应调用。`（做什么 + 触发条件 + 兜底句齐全）

## Agent 兼容性

主流 Agent（Claude Code、Codex、OpenCode、MiMo Code 等）的 skill 加载机制：

1. 扫描 skills 目录下的子目录
2. 读取每个子目录里 SKILL.md 的 frontmatter
3. 用 description 判断是否与当前任务相关
4. 相关则加载 SKILL.md 正文

因此：
- **没有 frontmatter 的 .md 文件不会被 Agent 自动发现**
- **description 不写触发条件，Agent 不知道何时加载**
- **单文档和目录级都必须有 frontmatter**——这是 Agent 兼容性的基础

## frontmatter 与 9 维的关系

- frontmatter（name/description）管"Agent 怎么发现我"
- 9 维正文管"加载后怎么组织内容"
- 两者不冲突，各管各的
- Profile 维度里的 Author/Version/Language 等可选字段，可写在 frontmatter 或正文 Profile 章节，不重复

## 开源协议（LICENSE）

公开发布的 skill 必须包含 LICENSE 文件。协议选择分两种情况：

### 完全自写的 skill

推荐 **MIT** 协议。理由：
- skill 含代码模板和文档，MIT 对两者都适用
- 最宽松，不限制商用/修改/分发，利于 skill 传播
- skill 社区主流选择，维护成本低

MIT 的写法：在 skill 根目录放 LICENSE 文件，内容为标准 MIT 文本，版权行填作者名：

```
MIT License

Copyright (c) 2026 <作者名>
```

### 继承自他人 skill 的

必须遵守原协议，不能随意更换：

| 原协议类型 | 处理方式 |
|-----------|---------|
| MIT / Apache 2.0（宽松型） | 可继续用 MIT，但必须保留原作者版权声明和原协议文本 |
| GPL / LGPL（传染型） | 衍生作品必须用相同协议，不能换 |
| CC BY 4.0 | 可修改，但必须署名原作者并注明改动 |
| CC BY-NC / ND 等限制型 | 需仔细看条款，NC 不可商用，ND 不可修改 |

实操：在 LICENSE 文件中包含原协议文本 + 你的版权声明；在 README 或 SKILL.md 中注明"本 skill 基于 [原作者] 的 [原 skill] 修改/扩展"。

### 协议声明位置

- LICENSE 文件放在 skill 根目录（与 SKILL.md 同级）
- SKILL.md 的 frontmatter 不写协议（frontmatter 只管 Agent 发现机制）
- 可在 SKILL.md 末尾或 README 中提一句"本 skill 采用 MIT 协议"
