# 开发技术路线选型

本技能是**技术选型顾问 + 开发规范库**。当用户要开发桌面 GUI 工具、B/S 网站、CLI 工具时调用。先判断开发类型，再确定主体技术栈；桌面 GUI 固定使用 Wails + Go 作为壳与控制层，但允许在 Python 生态具有明确优势时增加独立 Python Worker。

## 子目录职责总览

| 子目录 | 管什么 | 何时去看 |
|--------|--------|----------|
| [shared/](shared/) | 共享前端层（GUI + B/S 通用：React + Shadcn + Notion 风） | 带界面的场景都要先看 |
| [gui-tool/](gui-tool/) | 桌面 GUI 工具（Wails + Go 控制层，可选 Python Worker） | 开发桌面应用时 |
| [bs-web/](bs-web/) | B/S 网站后端（Go / Python 选型） | 开发 Web 应用时 |
| [cli-tool/](cli-tool/) | CLI 工具（Go / Python 选型） | 开发命令行工具时 |
| [examples/](examples/) | 完整案例参考 | 需要样板实现时 |

## 第一步：判断开发类型

收到开发需求时，先确认用户要开发什么：

| 类型 | 特征 | 前端 | 后端/执行层选型 |
|------|------|------|-----------------|
| 桌面 GUI 工具 | 带界面的桌面应用 | Wails 内嵌 | Go 控制层；按需增加 Python Worker |
| B/S 网站 | 前后端分离的 Web 应用 | 独立部署 | Go 或 Python |
| CLI 工具 | 命令行，无界面 | 无 | Go 或 Python |

## 第二步：选型决策树

```text
用户要开发什么？
├─ 桌面 GUI 工具
│   → 固定 Wails + Go + 共享前端
│   → 先判断项目规模，选择轻量结构或标准结构
│   → 再判断核心业务能力是否明显依赖 Python 生态
│       ├─ 否：纯 Go 模式
│       └─ 是：Wails + Go 控制层 + Python Worker/本地服务
│           ├─ 短时、无状态任务：按任务启动 Python 进程
│           ├─ 长期运行、模型驻留、协议服务：常驻 Python Worker
│           └─ 需要多客户端复用或复杂流式接口：受控本地服务
│   → 见 gui-tool/
├─ CLI 工具（Go or Python？）
│   ├─ Go：单文件分发、无依赖、并发/运维 → cli-tool/go.md
│   └─ Python：AI/数据、快速脚本 → cli-tool/python.md
└─ B/S 网站（前端用共享层，后端 Go or Python？）
    ├─ Go：高并发、单二进制 → bs-web/go-backend.md
    └─ Python：FastAPI、AI集成、自动文档 → bs-web/python-backend.md
```

CLI 和 B/S 后端需要与用户沟通 Go 还是 Python，选型维度见各场景的 stack.md。GUI 不改变 Wails + Go 主体，只评估项目结构级别和是否增加 Python 执行组件。

## 共享前端层（GUI + B/S 通用）

带界面的场景共用同一套前端规范：

- [共享前端技术栈](shared/frontend-stack.md) — React 18 + TS + Shadcn UI + Tailwind v3 + Vite
- [设计规范](shared/design-system.md) — Notion 式浅色简约 Token 体系
- [前端组件使用方法](shared/frontend-components.md) — 组件清单、用法、组合模式
- [前端架构模式](shared/frontend-patterns.md) — 分层、状态管理、API 封装原则
- [组件代码片段](shared/component-snippets.md) — 即用组件实现

## 场景层

### 桌面 GUI 工具（Wails + Go 控制层）

阅读顺序：

1. [GUI 技术栈](gui-tool/stack.md) — 主体技术栈、Python 组件选型边界、禁用项
2. [Go 工程结构与依赖规则](gui-tool/go-architecture.md) — 目录分级、业务包、适配器、组合根、测试组织
3. [Wails 后端模式](gui-tool/wails-backend.md) — 生命周期、Binding、DTO、错误和前端衔接
4. [Python Worker 与本地服务](gui-tool/python-worker.md) — Go 管理 Python 的 IPC、生命周期和打包
5. [GUI 质量标准](gui-tool/quality.md) — 构建、测试、依赖与交付清单

### CLI 工具（Go 或 Python）

- [CLI 选型](cli-tool/stack.md) — Go vs Python 维度对比
- [Go CLI](cli-tool/go.md) — cobra 技术栈
- [Python CLI](cli-tool/python.md) — typer + httpx + pyinstaller

### B/S 网站（前端共享层 + 后端 Go 或 Python）

- [B/S 选型](bs-web/stack.md) — 后端 Go vs Python + 前端 fetch 封装
- [Go 后端](bs-web/go-backend.md) — gin 技术栈
- [Python 后端](bs-web/python-backend.md) — FastAPI + httpx

## 案例参考

- [完整案例：skill-manager-pro](examples/skill-manager-pro/) — 小型纯 Go GUI 的历史样板；目录结构应按新规范评估后使用

## 核心原则

1. **选型先行**：先判断类型、项目规模和执行层，再写代码
2. **前端共享**：带界面场景共用 React + Shadcn + Notion 规范
3. **按业务组织**：Go 代码按业务能力分包，不在根目录或技术大目录平铺
4. **Go 统一控制**：GUI 的系统能力、生命周期、配置和服务编排由 Go 负责
5. **Python 按需引入**：仅在生态能力、成熟度或隔离收益明确时增加 Python 组件
6. **边界适配**：Wails、数据库、文件系统和 Worker 都是业务边界的 Adapter
7. **质量达标**：构建、测试、依赖、进程清理和离线分发均须通过检查

## 强制约束

此技能为强制标准。一旦用户选择调用本技能：

- GUI 的桌面壳和前端桥接必须使用 Wails + Go；前端必须遵循共享设计规范
- Go 项目不得默认把业务代码平铺在根目录；按规模选择轻量结构或标准结构
- 单个 Wails `App` 不得无上限承载所有业务方法，复杂项目按业务拆分 Binding
- Python 只能作为由 Go 管理的独立业务组件，不能替代 Wails 控制层，也不能由前端直接调用
- 发布版本不得依赖用户预装 Python；Python 组件必须随应用打包或以明确安装包形式交付
- CLI / B-S 后端的 Go/Python 选型须与用户沟通确认，不擅自决定
- 测试纪律遵循 [测试纪律](../testing.md)
