# P7 测试用例生成（Human Test Case Generation）

> 流程阶段⑦。承接 [测试场景构建](p6-test-scenario-construction.md) 的场景集合，输出标准测试用例。本阶段不再推理。

## 核心使命

标准化输出，不再进行推理。

本阶段是机械翻译：把 P6 的场景按标准结构填入字段，不得新增测试逻辑或臆测需求。任何"觉得还该测一下"的冲动，都应回到 P4 补测试点，而不是在 P7 临时加戏。

## 用例结构

| 字段 | 内容 |
|------|------|
| Case ID | TC-001 |
| Title | PID 调优成功 |
| Priority | P1 |
| Requirement | REQ-001 |
| Preconditions | PLC 在线 |
| Steps | 操作步骤 |
| Expected Result | 调优成功 |
| Test Point | 关联测试点 |
| Design Method | 使用的设计方法 |

## 完成标志

用例输出，每条可回溯到测试点和需求后，本流水线结束。
