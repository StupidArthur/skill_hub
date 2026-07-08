---
name: dev-skill
description: 开发工程纪律，以完整流程驱动。开始一次开发或修改工作时调用，按需求→设计（含选型）→实现→测试→提交打包五阶段推进，每阶段内嵌对应规则。设计阶段含技术选型（桌面GUI/B-S网站/CLI工具，Go/Python）；桌面 GUI 固定 Wails + Go 作为壳与控制层，业务能力可按需接入 Python Worker。任何涉及开发或修改代码的工作都应调用。
---

# 开发工程纪律

本技能以开发流程为主线，将工程纪律内嵌到每个阶段。

## 核心红线

- 谋定后动：先需求和设计，再编码。
- 删除或覆盖重要代码前必须确认影响范围。
- 需求超出模块边界时必须指出并给出替代方案。
- 不主动扩大需求范围。

## 开发流程

### ① 需求阶段

确认需求边界、目标和验收标准。

### ② 设计阶段

设计阶段完成技术选型。

桌面 GUI 统一采用：

```text
Wails + Go 控制层
        ↓
可选 Python Worker
```

Python 仅在生态、成熟度或隔离收益明确时引入。

设计阶段必须说明：

- 模块职责
- 数据流
- 控制流
- 技术路线
- Python Worker（如有）的生命周期、IPC、打包方式

### ③ 实现阶段

按设计编码。

GUI 若包含 Python Worker，同时遵循：

- [Python Worker 与本地服务](design/gui-tool/python-worker.md)
- [GUI 技术栈](design/gui-tool/stack.md)

### ④ 测试阶段

验证核心业务逻辑、接口和关键运行流程。

### ⑤ 提交与打包阶段

完成版本提交和目标环境验证。

## 技术选型原则

- GUI：Wails + Go 是桌面壳和控制层标准
- Python：作为可管理的业务执行组件
- CLI：Go 或 Python 根据场景选择
- B/S：Go 或 Python 根据后端能力选择

Python 不替代 Wails 控制层，不直接被前端调用。

## 适用范围

本技能是语言与框架无关的通用流程纪律，但设计阶段内嵌技术选型。具体技术栈规范位于 [design/](design/README.md)。

---

## License

本 skill 采用 [MIT 协议](./LICENSE)，Copyright (c) 2026 StupidArthur。
