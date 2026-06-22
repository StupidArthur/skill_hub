# P4 测试点提取（Test Point Extraction）

> 流程阶段④。承接 [需求对象化](p3-requirement-object-modeling.md) 的 Requirement Object，输出测试点集合供 P5 映射设计方法。

## 核心使命

从需求对象中抽取测试关注点。

## 分类体系

| 分类 | 内容 |
|------|------|
| Functional | 功能 |
| Data | 数据 |
| Boundary | 边界 |
| State | 状态 |
| Permission | 权限 |
| Exception | 异常 |
| Dependency | 依赖 |
| Performance | 性能 |
| Security | 安全 |

## 示例

| 类别 | 测试点 |
|------|--------|
| Functional | 启动 PID 调优 |
| Boundary | PID 范围 0~100 |
| State | 调优中→成功 |
| Permission | 普通用户启动调优 |
| Exception | PLC 断连 |

## 完成标志

测试点覆盖九大分类、无盲区后，本阶段结束，进入 [测试设计映射](p5-test-design-mapping.md)。
