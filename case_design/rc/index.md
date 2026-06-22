
# Requirements → Test Design Pipeline（需求到测试设计流水线）

| 阶段 | 中文名称   | 英文名称                        | 核心问题         | 输入                 | 输出                 | 是否推理阶段 |
| -- | ------ | --------------------------- | ------------ | ------------------ | ------------------ | ------ |
| P1 | 需求评审   | Requirement Review          | 需求是否存在问题？    | SRS / PRD          | 评审意见               | 是      |
| P2 | 需求解构   | Requirement Analysis        | 需求到底在说什么？    | 评审后需求              | 结构化需求元素            | 是      |
| P3 | 需求对象化  | Requirement Object Modeling | 如何形成统一需求模型？  | 结构化需求              | Requirement Object | 是      |
| P4 | 测试点提取  | Test Point Extraction       | 到底需要测什么？     | Requirement Object | 测试点集合              | 是      |
| P5 | 测试设计映射 | Test Design Mapping         | 应该用什么测试设计方法？ | 测试点                | 测试设计策略             | 是      |
| P6 | 测试场景构建 | Test Scenario Construction  | 用户真实如何使用？    | 测试设计结果             | 场景集合               | 是      |
| P7 | 测试用例生成 | Human Test Case Generation  | 如何输出标准测试用例？  | 场景集合               | 测试用例               | 否      |

---

# P1 需求评审（Requirement Review）

## 核心使命

发现问题，而不是理解需求。

### 输入

| 类型       | 示例        |
| -------- | --------- |
| PRD      | 产品需求文档    |
| SRS      | 软件需求规格说明书 |
| Standard | IEEE、国标   |
| Design   | 设计文档      |
| Story    | 用户故事      |

### 输出

| 类型         | 内容     |
| ---------- | ------ |
| Missing    | 缺失信息   |
| Conflict   | 冲突信息   |
| Ambiguous  | 歧义描述   |
| Untestable | 不可测试需求 |
| Risk       | 潜在风险   |

### 推荐评审维度

| 维度   | 英文           | 检查内容    |
| ---- | ------------ | ------- |
| 完整性  | Completeness | 是否缺失内容  |
| 一致性  | Consistency  | 是否存在矛盾  |
| 正确性  | Correctness  | 是否符合业务  |
| 歧义性  | Ambiguity    | 是否有模糊表述 |
| 可追踪性 | Traceability | 是否可关联来源 |
| 可测试性 | Testability  | 是否可验证   |

---

# P2 需求解构（Requirement Analysis）

## 核心使命

把自然语言需求拆成结构化元素。

### 输出模型

| 元素         | 说明   |
| ---------- | ---- |
| Actor      | 参与者  |
| Goal       | 业务目标 |
| Input      | 输入   |
| Output     | 输出   |
| Constraint | 约束   |
| State      | 状态   |
| Exception  | 异常   |
| Dependency | 依赖   |

### 示例

| 字段         | 内容         |
| ---------- | ---------- |
| Actor      | 操作员        |
| Goal       | 执行PID调优    |
| Input      | PID参数      |
| Output     | 调优结果       |
| Constraint | 管理员权限      |
| State      | 待调优→调优中→完成 |
| Exception  | PLC离线      |
| Dependency | PLC在线      |

---

# P3 需求对象化（Requirement Object Modeling）

这是整个流水线最容易被忽略的一层。

## 核心使命

把需求转成统一领域对象。

### 输出结构

| 属性           | 类型   |
| ------------ | ---- |
| actors       | List |
| goals        | List |
| inputs       | List |
| outputs      | List |
| constraints  | List |
| states       | List |
| exceptions   | List |
| dependencies | List |

### 示例

| 类别         | 内容    |
| ---------- | ----- |
| Actor      | 操作员   |
| Goal       | PID调优 |
| State      | 调优中   |
| Exception  | PLC断连 |
| Constraint | 权限控制  |

### 价值

解决：

```text
需求 → 测试点
```

跨度过大导致 AI 漏测的问题。

变成：

```text
需求 → 对象 → 测试点
```

稳定性会高很多。

---

# P4 测试点提取（Test Point Extraction）

## 核心使命

从需求对象中抽取测试关注点。

### 分类体系

| 分类          | 内容 |
| ----------- | -- |
| Functional  | 功能 |
| Data        | 数据 |
| Boundary    | 边界 |
| State       | 状态 |
| Permission  | 权限 |
| Exception   | 异常 |
| Dependency  | 依赖 |
| Performance | 性能 |
| Security    | 安全 |

### 示例

| 类别         | 测试点        |
| ---------- | ---------- |
| Functional | 启动PID调优    |
| Boundary   | PID范围0~100 |
| State      | 调优中→成功     |
| Permission | 普通用户启动调优   |
| Exception  | PLC断连      |

---

# P5 测试设计映射（Test Design Mapping）

我认为这是整条链路最有价值的一层。

## 核心使命

为每个测试点选择最合适的测试设计方法。

### 映射矩阵

| 测试点特征 | ISTQB方法                  |
| ----- | ------------------------ |
| 数值范围  | Boundary Value Analysis  |
| 输入集合  | Equivalence Partitioning |
| 业务规则  | Decision Table           |
| 状态变化  | State Transition         |
| 用户流程  | Scenario Testing         |
| 高风险场景 | Error Guessing           |
| 参数组合  | Pairwise Testing         |

### 示例

| 测试点        | 方法               |
| ---------- | ---------------- |
| PID范围0~100 | Boundary Value   |
| 用户角色权限     | Decision Table   |
| 调优状态变化     | State Transition |

---

# P6 测试场景构建（Test Scenario Construction）

## 核心使命

形成真实业务场景。

### 场景分类

| 类型              | 说明   |
| --------------- | ---- |
| Happy Path      | 主流程  |
| Alternate Path  | 分支流程 |
| Exception Path  | 异常流程 |
| Permission Path | 权限流程 |
| Recovery Path   | 恢复流程 |

### 示例

| 场景ID  | 场景描述        |
| ----- | ----------- |
| SC001 | 操作员完成PID调优  |
| SC002 | PLC断连导致调优失败 |
| SC003 | 普通用户无权限启动调优 |

---

# P7 人工测试用例生成（Human Test Case Generation）

## 核心使命

标准化输出，不再进行推理。

### 用例结构

| 字段              | 内容      |
| --------------- | ------- |
| Case ID         | TC-001  |
| Title           | PID调优成功 |
| Priority        | P1      |
| Requirement     | REQ-001 |
| Preconditions   | PLC在线   |
| Steps           | 操作步骤    |
| Expected Result | 调优成功    |
| Test Point      | 关联测试点   |
| Design Method   | 使用的设计方法 |

---

# 最终我建议的认知架构

| 层级 | 中文名称  | 作用                          |
| -- | ----- | --------------------------- |
| L1 | 需求质量层 | Requirement Review          |
| L2 | 需求理解层 | Requirement Analysis        |
| L3 | 需求建模层 | Requirement Object Modeling |
| L4 | 测试分析层 | Test Point Extraction       |
| L5 | 测试设计层 | Test Design Mapping         |
| L6 | 场景构建层 | Test Scenario Construction  |
| L7 | 用例生成层 | Human Test Case Generation  |

这个结构已经比较接近一个真正的 **Test Analyst Agent Cognitive Architecture（测试分析师认知架构）** 了，而不只是一个“生成测试用例 Prompt”。实际上你后面做 Skill 的时候，可以把每一层都拆成独立 Skill，再通过 Orchestrator 串起来。这样比一个 3000 行的大 Prompt 更稳定，也更容易评审和持续优化。
