# P6 测试场景构建（Test Scenario Construction）

> 流程阶段⑥。承接 [测试设计映射](p5-test-design-mapping.md) 的设计结果，输出场景集合供 P7 生成用例。

## 核心使命

形成真实业务场景。

## 场景分类

| 类型 | 说明 |
|------|------|
| Happy Path | 主流程 |
| Alternate Path | 分支流程 |
| Exception Path | 异常流程 |
| Permission Path | 权限流程 |
| Recovery Path | 恢复流程 |

## 示例

| 场景 ID | 场景描述 |
|---------|---------|
| SC001 | 操作员完成 PID 调优 |
| SC002 | PLC 断连导致调优失败 |
| SC003 | 普通用户无权限启动调优 |

## 完成标志

五类场景覆盖、场景可执行后，本阶段结束，进入 [测试用例生成](p7-test-case-generation.md)。
