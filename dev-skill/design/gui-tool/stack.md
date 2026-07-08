# GUI 工具技术栈

桌面 GUI 工具的固定主体技术栈是 **Wails v2 + Go + 共享前端**。Go 负责桌面壳、系统集成、应用状态和服务编排；当核心业务明显依赖 Python 生态时，允许增加由 Go 管理的独立 Python Worker 或本地服务。

## 固定主体技术栈

| 层 | 技术 | 版本要求 | 作用 |
|----|------|---------|------|
| 桌面壳 | **Wails v2** | ≥ v2.10 | 使用系统 WebView，承载前端与原生窗口 |
| 控制层 | **Go** | ≥ 1.21 | Wails 绑定、系统调用、配置、任务与进程管理 |
| 前端 | 见共享前端栈 | — | React + Shadcn + Notion 风格 |
| 可选执行层 | **Python Worker** | 项目明确 | AI、数据、协议、图像或专有 Python SDK 能力 |

## 架构原则

GUI 场景不是在 Go 和 Python 之间二选一：

```text
前端 React
    ↓ Wails Binding / Event
Go 应用控制层
    ├── 业务 Service
    ├── 系统与持久化 Adapter
    └── Python Worker Adapter（按需）
            ↓ IPC
       Python 业务执行层
```

- Wails + Go 始终是应用主体和唯一前端入口
- Go 代码按业务能力组织，禁止把业务文件全部平铺在根目录
- Wails Binding 是薄边界，不承载数据库、Worker 和业务规则
- Python 是可选业务组件，不直接管理窗口，不直接暴露给前端
- 外部协议客户端应直接连接真实服务端，不无意义地经过 Go 转发数据面
- Go 负责 Python 的启动、停止、健康检查、超时、取消、日志、崩溃处理和退出清理

Go 的目录分级、依赖方向和 Binding 拆分见 [Go 工程结构与依赖规则](go-architecture.md)。

## 何时引入 Python

满足以下任一条件时可以引入：

- 关键库只有 Python 实现，或 Python 实现成熟度明显更高，例如 `asyncua`
- 涉及 PyTorch、Transformers、pandas、NumPy、OpenCV 等生态
- 使用厂商仅提供的 Python SDK
- 需要把高内存、易崩溃、依赖复杂的能力与 GUI 隔离
- 需要长期驻留的协议服务器、模型服务或数据处理引擎

以下情况不应引入：

- Go 标准库或成熟 Go 库已经能够稳定完成
- 只是因为开发者更熟悉 Python
- 逻辑只是简单 CRUD、文件复制、配置读写或少量计算
- 引入后没有明确的进程管理、协议和打包方案

## Python 组件形态

| 形态 | 适用场景 | 推荐通信 |
|------|----------|----------|
| 按任务启动进程 | 偶发、短时、无状态任务 | 参数 + stdout 结果 |
| 常驻 Worker | 模型驻留、协议服务、持续计算 | stdin/stdout JSON Lines |
| 受控本地服务 | 多客户端复用、复杂 HTTP/流式接口 | 127.0.0.1 随机端口 + Token |

默认优先顺序：按任务进程 → 常驻 Worker → 本地服务。只有前一种无法满足时才升级复杂度。

详细规范见 [Python Worker 与本地服务](python-worker.md)。

## 为什么主体仍使用 Wails + Go

- Web 前端适合实现现代、紧凑、Notion 风格界面
- Wails 复用系统 WebView，不需要自带完整浏览器运行时
- Go 适合进程生命周期、并发、文件系统、系统托盘和跨平台控制
- Go-JS 绑定由 Wails 生成，前端只维护稳定 API 层
- Python 能力可以独立替换、升级或崩溃恢复，不污染 UI 结构

## 禁止使用的技术与做法

| 技术/做法 | 禁止原因 |
|-----------|---------|
| Electron | 默认携带 Chromium，非本技能标准 |
| PyQt / PySide 作为主 GUI | 无法复用共享 Web 前端，非本技能 GUI 路线 |
| Tauri | 需 Rust 工具链，非本技能标准 |
| Tkinter | 不符合共享设计体系 |
| 原生 Win32 / Cocoa | 开发效率低，跨平台维护成本高 |
| 前端直接连接 Python | 绕过 Go 控制层，生命周期和安全边界失控 |
| 发布时依赖系统 Python | 用户环境不可控，版本和依赖无法保证 |
| 固定开放本地 HTTP 端口且无认证 | 容易端口冲突，也可能被其他本机进程调用 |
| 根目录平铺全部 Go 业务文件 | 职责和依赖方向不清晰，难以扩展测试 |
| 单个 App 暴露全部业务方法 | 形成上帝对象，前端绑定和维护成本持续上升 |

## 环境要求

基础环境：

- Go ≥ 1.21
- Node.js ≥ 18
- GCC（Windows 用 TDM-GCC，macOS 用 Xcode CLT，Linux 用 gcc）
- WebView2 Runtime（Windows 11 自带，Windows 10 多数自带）
- `wails doctor` 检查通过

使用 Python Worker 时额外要求：

- Python 版本由项目固定，建议 ≥ 3.11
- 使用锁定依赖文件，如 `requirements.lock`、`uv.lock` 或 Poetry lock
- 开发环境可调用 Python 源码；发布环境必须调用打包后的 Worker

## 下一步

- Go 目录、依赖与包边界：[Go 工程结构与依赖规则](go-architecture.md)
- Wails 生命周期与绑定：[Wails 后端模式](wails-backend.md)
- Python 组件与进程管理：[Python Worker 与本地服务](python-worker.md)
- 构建、测试和交付：[GUI 质量标准](quality.md)
