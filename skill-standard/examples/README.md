# 案例参考

本文件提供两种结构的对照案例。**用法**：写 skill 前先对照同结构的案例，理解标准写法，但不要照搬内容。

## 目录级案例（仓库内真实 skill）

[dev-skill](../../dev-skill/SKILL.md) 是按本规范编写的目录级流程型 skill，可直接对照学习：

| 想学什么 | 看哪个文件 | 重点观察 |
|---------|-----------|---------|
| 入口 SKILL.md 怎么写流程主线 | [dev-skill/SKILL.md](../../dev-skill/SKILL.md) | frontmatter 的 description 含兜底句；五阶段流程每阶段有"读哪个文件 + 完成标志"；红线为何内联 |
| 流程节点怎么内嵌文件引用 | [dev-skill/SKILL.md](../../dev-skill/SKILL.md) 设计阶段 | 不写独立路由表，引用内嵌在流程节点里；横切规则在阶段里直接引用 |
| 子目录怎么组织 | [dev-skill/design/](../../dev-skill/design/README.md) | 子目录入口用 README.md 不用 SKILL.md；选型内容作为设计阶段子步骤 |
| 横切规则怎么被多阶段引用 | [dev-skill/SKILL.md](../../dev-skill/SKILL.md) 横切规则表 | 横切规则不单独成阶段，被多个阶段直接引用 |
| 流程阶段文件怎么写 | [dev-skill/requirement.md](../../dev-skill/requirement.md) | 开头 blockquote 标注所属阶段；结尾写完成标志和下一阶段链接 |

**触发时机**：选定目录级结构、开始写 SKILL.md 入口前，先读上表对应案例。

## 单文档案例

仓库内暂无真实单文档 skill。以下提供两份对照资源：

### 1. 完整范例（外部参考）

[langgpt_standard_v3.md](../../langgpt_standard_v3.md) 是一份完整的单文档 9 维 skill 范例，展示了 9 个维度齐全、Output Format 用缩进块（非反引号）的写法。

**触发时机**：选定单文档结构、开始填 9 维前，先通读此文件感受各维度的实际写法。

### 2. 可填空骨架模板

新建单文档 skill 时，复制以下骨架到 `skills/<skill-name>/SKILL.md`，逐项填入：

```markdown
---
name: <skill-name>
description: <做什么 + 何时触发 + 兜底句。例：指导XX。当需要XX时调用。任何涉及XX的工作都应调用。>
---

# Role: <带领域定语的专家头衔>

## Profile
- Author: <作者>
- Version: 1.0
- Language: 中文
- Description: <一句话说明>

## Background
<为什么需要这个 skill，解决什么问题>

## Goals
1. <目标 1>
2. <目标 2>
3. <目标 3>

## Constraints
- **环境依赖**：<必须的工具/接口>
- **行为红线**：<必须/严禁...>
- **异常熔断**：<出错时如何处理>

## Skills
1. <技能名>：<实现逻辑>。依赖工具：<具体工具/接口>
2. <技能名>：<实现逻辑>。依赖工具：<具体工具/接口>
3. <技能名>：<实现逻辑>。依赖工具：<具体工具/接口>

## Workflows
1. <步骤 1：含依赖识别与信息补全>
2. <步骤 2>
3. <步骤 3>

## Output Format
<用缩进块表示示例，不要用三个反引号>

    {
      "field": "value"
    }

## Initialization
作为 <Role>，我已就绪。请提供 <输入格式>。
```

**触发时机**：确定用单文档结构后，用此骨架起步，避免漏维度。注意 frontmatter 的 description 必须含兜底句。

## 使用提醒

- 案例是"对照学习"，不是"必须照搬"——内容要按自己的业务写
- 单文档骨架的 Constraints 三类约束（环境依赖/行为红线/异常熔断）尽量齐全
- 目录级案例的路由都内嵌在流程节点里，写自己的入口时照此要求，不要写独立路由表
- 无论单文档还是目录级，frontmatter 的 description 都必须有兜底句
