# P5 测试设计映射（Test Design Mapping）

> 流程阶段⑤。承接 [测试点提取](p4-test-point-extraction.md) 的测试点集合，输出测试设计策略供 P6 构建场景。

这是整条链路最有价值的一层。

## 核心使命

为每个测试点选择最合适的测试设计方法。

## 映射矩阵

| 测试点特征 | ISTQB 方法 |
|-----------|-----------|
| 数值范围 | Boundary Value Analysis |
| 输入集合 | Equivalence Partitioning |
| 业务规则 | Decision Table |
| 状态变化 | State Transition |
| 用户流程 | Scenario Testing |
| 高风险场景 | Error Guessing |
| 参数组合 | Pairwise Testing |

## 示例

| 测试点 | 方法 |
|--------|------|
| PID 范围 0~100 | Boundary Value |
| 用户角色权限 | Decision Table |
| 调优状态变化 | State Transition |

## 完成标志

每个测试点都绑定设计方法后，本阶段结束，进入 [测试场景构建](p6-test-scenario-construction.md)。
