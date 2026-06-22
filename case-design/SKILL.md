---
name: case-design
description: 需求到测试设计流水线，把需求转化为标准测试用例。按 P1 需求评审→P2 需求解构→P3 需求对象化→P4 测试点提取→P5 测试设计映射→P6 测试场景构建→P7 测试用例生成七阶段推进。当需要从需求生成测试用例、做测试设计、审查需求可测性时调用。任何涉及测试用例设计或需求到测试转化的工作都应调用。
---

# 需求到测试设计流水线

本技能以**七阶段流水线**为主线，将"需求 → 测试用例"的跨度拆解为可控的中间层，解决 AI 直接从需求生成用例时漏测严重的问题。核心思路：需求 → 对象 → 测试点 → 设计方法 → 场景 → 用例，每一层有明确输入输出，逐层收敛。

## 核心红线（贯穿全流程）

- **逐层推进，不跳层**：禁止从需求直接跳到测试用例（P1→P7），必须经过对象化（P3）和测试点（P4）中间层，否则漏测率不可控。
- **P1 是澄清不是审计**：需求评审采用澄清模式，发现缺陷后必须转换为可执行的澄清问题，输出四层澄清报告，不能只列问题就结束。
- **P7 不再推理**：测试用例生成是机械翻译阶段，把 P6 场景按标准结构输出，不得在 P7 新增测试逻辑或臆测需求。
- **每层输出可追溯**：每个测试用例必须能回溯到测试点→需求对象→原始需求，断链即停。

## 流水线

按以下七阶段顺序推进。每个阶段有明确完成标志，未完成不进入下一阶段。

### ① P1 需求澄清与评审

将需求推进到可测试状态，多轮迭代。

- 读 [需求澄清与评审](p1-requirement-review.md)
- 输入：SRS / PRD / 用户故事
- 输出：需求澄清报告（问题列表带状态 + Delta Analysis + 成熟度评估）
- 完成标志：Quality Gate（G1-G5）全通过，成熟度达 L3（Testable）

### ② P2 需求解构

把自然语言需求拆成结构化元素。

- 读 [需求解构](p2-requirement-analysis.md)
- 输入：评审后需求
- 输出：结构化需求元素（Actor / Goal / Input / Output / Constraint / State / Exception / Dependency）
- 完成标志：八类元素齐全，无遗漏

### ③ P3 需求对象化

把结构化元素转成统一领域对象。

- 读 [需求对象化](p3-requirement-object-modeling.md)
- 输入：结构化需求元素
- 输出：Requirement Object（统一模型）
- 完成标志：Requirement Object 生成，作为后续阶段的唯一输入

### ④ P4 测试点提取

从需求对象中抽取测试关注点。

- 读 [测试点提取](p4-test-point-extraction.md)
- 输入：Requirement Object
- 输出：测试点集合（按九大分类）
- 完成标志：测试点覆盖九大分类，无盲区

### ⑤ P5 测试设计映射

为每个测试点选择最合适的测试设计方法。

- 读 [测试设计映射](p5-test-design-mapping.md)
- 输入：测试点集合
- 输出：测试设计策略（测试点 ↔ ISTQB 方法映射）
- 完成标志：每个测试点都绑定设计方法

### ⑥ P6 测试场景构建

把测试设计结果组装成真实业务场景。

- 读 [测试场景构建](p6-test-scenario-construction.md)
- 输入：测试设计结果
- 输出：场景集合（Happy / Alternate / Exception / Permission / Recovery Path）
- 完成标志：五类场景覆盖，场景可执行

### ⑦ P7 测试用例生成

标准化输出，不再推理。

- 读 [测试用例生成](p7-test-case-generation.md)
- 输入：场景集合
- 输出：标准测试用例（Case ID / Title / Steps / Expected Result / 关联测试点 / 设计方法）
- 完成标志：用例输出，每条可回溯到测试点和需求

## 横切规则

以下规则不单独成阶段，被多个阶段引用：

| 规则 | 性质 | 被谁引用 |
|------|------|---------|
| 可追溯性 | 贯穿约束 | ①-⑦（每层输出须能回溯上层） |
| 九大测试点分类 | 分类标准 | ④⑤（提取与映射的基准） |
| ISTQB 设计方法集 | 方法库 | ⑤（映射目标） |
| 五类场景路径 | 场景框架 | ⑥（构建骨架） |

## 认知架构

本流水线对应一个 Test Analyst Agent 的认知架构，七层各司其职：

| 层级 | 名称 | 作用 |
|------|------|------|
| L1 需求质量层 | Requirement Review | 发现需求缺陷 |
| L2 需求理解层 | Requirement Analysis | 结构化解构 |
| L3 需求建模层 | Requirement Object Modeling | 统一领域对象 |
| L4 测试分析层 | Test Point Extraction | 抽取测试关注点 |
| L5 测试设计层 | Test Design Mapping | 绑定设计方法 |
| L6 场景构建层 | Test Scenario Construction | 组装业务场景 |
| L7 用例生成层 | Human Test Case Generation | 标准化输出 |

---

## License

本 skill 采用 [MIT 协议](./LICENSE)，Copyright (c) 2026 StupidArthur。
