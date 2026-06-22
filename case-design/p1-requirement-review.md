# P1 需求评审（Requirement Review）

> 流程阶段①。承接原始需求（SRS / PRD / 用户故事），输出评审意见供 P2 解构。

## 核心使命

发现问题，而不是理解需求。

本阶段只负责挑出需求里的缺陷，不做需求解构——解构是 P2 的事。混在一起会导致"边挑错边脑补"，漏掉真正的缺陷。

## 输入

| 类型 | 示例 |
|------|------|
| PRD | 产品需求文档 |
| SRS | 软件需求规格说明书 |
| Standard | IEEE、国标 |
| Design | 设计文档 |
| Story | 用户故事 |

## 输出

| 类型 | 内容 |
|------|------|
| Missing | 缺失信息 |
| Conflict | 冲突信息 |
| Ambiguous | 歧义描述 |
| Untestable | 不可测试需求 |
| Risk | 潜在风险 |

## 评审维度

| 维度 | 英文 | 检查内容 |
|------|------|---------|
| 完整性 | Completeness | 是否缺失内容 |
| 一致性 | Consistency | 是否存在矛盾 |
| 正确性 | Correctness | 是否符合业务 |
| 歧义性 | Ambiguity | 是否有模糊表述 |
| 可追踪性 | Traceability | 是否可关联来源 |
| 可测试性 | Testability | 是否可验证 |

## 完成标志

需求缺陷清单输出，用户确认"需求可进入解构"后，本阶段结束，进入 [需求解构](p2-requirement-analysis.md)。
