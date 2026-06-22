# P2 需求解构（Requirement Analysis）

> 流程阶段②。承接 [需求评审](p1-requirement-review.md) 后的需求，输出结构化元素供 P3 对象化。

## 核心使命

把自然语言需求拆成结构化元素。

## 输出模型

| 元素 | 说明 |
|------|------|
| Actor | 参与者 |
| Goal | 业务目标 |
| Input | 输入 |
| Output | 输出 |
| Constraint | 约束 |
| State | 状态 |
| Exception | 异常 |
| Dependency | 依赖 |

## 示例

| 字段 | 内容 |
|------|------|
| Actor | 操作员 |
| Goal | 执行 PID 调优 |
| Input | PID 参数 |
| Output | 调优结果 |
| Constraint | 管理员权限 |
| State | 待调优→调优中→完成 |
| Exception | PLC 离线 |
| Dependency | PLC 在线 |

## 完成标志

八类元素齐全、无遗漏后，本阶段结束，进入 [需求对象化](p3-requirement-object-modeling.md)。
