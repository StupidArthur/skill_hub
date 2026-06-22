# P3 需求对象化（Requirement Object Modeling）

> 流程阶段③。承接 [需求解构](p2-requirement-analysis.md) 的结构化元素，输出统一领域对象供 P4 提取测试点。

这是整个流水线最容易被忽略的一层。

## 核心使命

把需求转成统一领域对象。

## 为什么需要这一层

直接从需求生成测试点跨度过大：

```text
需求 → 测试点
```

会导致 AI 漏测。引入对象层后：

```text
需求 → 对象 → 测试点
```

稳定性会高很多——对象是稳定的中间表示，后续阶段都基于它，不再回头读自然语言需求。

## 输出结构

| 属性 | 类型 |
|------|------|
| actors | List |
| goals | List |
| inputs | List |
| outputs | List |
| constraints | List |
| states | List |
| exceptions | List |
| dependencies | List |

## 示例

| 类别 | 内容 |
|------|------|
| Actor | 操作员 |
| Goal | PID 调优 |
| State | 调优中 |
| Exception | PLC 断连 |
| Constraint | 权限控制 |

## 完成标志

Requirement Object 生成，作为后续阶段的唯一输入后，本阶段结束，进入 [测试点提取](p4-test-point-extraction.md)。
