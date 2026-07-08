# Python Worker 与本地服务

本规范定义桌面 GUI 中如何把 Python 作为 **Wails + Go 主程序的受控业务组件**。适用于 `asyncua`、AI、数据分析、图像处理、自动化和仅提供 Python SDK 的能力。

## 定位

Python 不是第二套应用后端，也不直接服务前端。标准职责关系：

```text
React / Shadcn 前端
        ↓ Wails Binding / Event
Go 应用控制层
        ↓ 受控 IPC
Python Worker / 本地服务
        ↓ 业务协议或计算结果
外部系统、文件、模型、OPC UA 客户端
```

### Go 负责

- Wails 绑定和前端 API
- 应用状态、配置、项目数据和权限边界
- Python 进程启动、停止、健康检查和版本握手
- 请求路由、超时、取消、日志和错误转换
- 崩溃检测、有限重启和应用退出清理
- Worker 路径、资源路径和安装包组织

### Python 负责

- Python 生态中的核心业务能力
- 自身事件循环、线程池、模型或协议服务器
- 业务输入校验和明确错误码
- 进度、状态和结果消息
- 收到停止命令后的资源释放

### 前端负责

- 只调用 Go 暴露的方法
- 只监听 Go 转发的状态和事件
- 不感知 Python 进程、端口、Token、可执行路径或内部协议

## 选型顺序

### 1. 按任务启动进程

适用于：短时、低频、无状态任务。

```text
Go 启动 Worker → 传入任务 → 读取结果 → Worker 退出
```

优点：隔离简单、无常驻资源。缺点：每次有启动开销，不适合模型加载和长期服务。

### 2. 常驻 Worker（默认推荐）

适用于：`asyncua` Server、模型驻留、连续数据生成、需要进度和取消的任务。

```text
Go 启动一次 Worker
Go stdin  → Python 请求
Go stdout ← Python 协议消息
Go stderr ← Python 日志
```

默认使用 **stdin/stdout JSON Lines**，不占端口，也不会暴露给其他本机程序。

### 3. 受控本地服务

适用于：需要 HTTP/WebSocket 语义、多客户端复用、复杂流式接口，或 Python 服务需要独立调试。

要求：

- 仅绑定 `127.0.0.1`
- 由 Go 分配随机可用端口
- Go 启动时生成随机认证 Token
- 所有请求必须携带 Token
- 前端仍然只能通过 Go 调用
- Go 必须负责服务进程和健康状态

禁止默认使用固定公开端口或 `0.0.0.0` 作为控制接口。

## 控制面与数据面

必须区分：

- **控制面**：GUI → Go → Python，用于启动、停止、配置、状态和测试控制
- **数据面**：外部客户端直接连接真实服务，如 OPC UA Client → asyncua Server

除非产品本身是代理或网关，否则 Go 不应转发高频协议数据。

例如 asyncua：

```text
Wails GUI → Go → Python：start_server / stop_server / load_scenario
OPC UA Client → Python：Read / Write / Subscription / Method / Event
```

## JSON Lines 协议

每行必须是一条完整 JSON，UTF-8 编码。

### 请求

```json
{"id":"req-1","method":"start_server","params":{"endpoint":"opc.tcp://0.0.0.0:4840/test/"},"protocol_version":1}
```

### 成功结果

```json
{"id":"req-1","type":"result","result":{"status":"running"}}
```

### 进度

```json
{"id":"req-2","type":"progress","progress":42,"message":"正在加载节点"}
```

### 主动事件

```json
{"type":"event","event":"server_status","data":{"status":"running"}}
```

### 错误

```json
{"id":"req-1","type":"error","error":{"code":"PORT_IN_USE","message":"端口已被占用"}}
```

### 必备方法

- `ping`：健康检查、Worker 版本、协议版本、能力列表
- `shutdown`：优雅退出
- `cancel`：取消指定请求或任务
- 业务方法：使用稳定、可版本化的名称

建议握手结果：

```json
{
  "status": "ok",
  "worker_version": "1.0.0",
  "protocol_version": 1,
  "capabilities": ["ua_server", "scenario_engine"]
}
```

## stdout / stderr 红线

- stdout 只能输出协议 JSON
- stderr 输出普通日志和堆栈
- Python 所有协议消息必须立即 flush
- 禁止第三方库把日志写入 stdout；必要时重定向或配置 logging
- Go 解析失败时必须记录原始行，但不得把协议错误静默忽略

## Go Worker Manager

推荐状态机：

```text
STOPPED → STARTING → READY → BUSY/RUNNING → STOPPING → STOPPED
                    ↘ FAILED
```

至少实现：

1. 防止重复启动
2. `exec.CommandContext` 或等效方式绑定生命周期
3. stdin 写入串行化，避免并发消息互相穿插
4. stdout 独立读取协程，按请求 ID 分发响应
5. stderr 独立读取并转发日志
6. 启动后 `ping`，不能仅以进程存在作为就绪条件
7. 每个请求有超时；超时后发送取消并返回确定错误
8. 监听 `Wait()`；异常退出时失败所有未完成请求
9. 优雅关闭超时后强制结束
10. 处理 Python 创建的子进程，确保应用退出无残留
11. 自动重启必须有限次、带退避，并区分可恢复错误与配置错误

推荐重启策略：1 秒、2 秒、5 秒，连续失败达到上限后停止自动重启并提示用户。

以下情况不得自动重启：

- 端口占用
- 配置、证书或资源无效
- 协议版本不匹配
- 用户主动停止
- Worker 依赖缺失

## Python Worker 实现

- 使用一个明确入口，如 `worker/main.py`
- asyncio 服务不能被阻塞式 stdin 读取卡住，可使用 `asyncio.to_thread(sys.stdin.readline)` 或专用读取线程
- 每个长期任务保存 Task/取消句柄
- 关闭时先停止业务任务，再停止协议服务器、线程池和子进程
- 所有外部异常转换为稳定错误码，不把完整内部堆栈直接返回前端
- 堆栈写 stderr 日志，用户消息保持可理解

高频数据更新应在 Python 内部执行。例如 GUI 一次下发数据发生器配置，Python 事件循环持续更新节点；不要让前端或 Go 每几十毫秒发送一次更新。

## 项目结构

```text
项目根/
├── main.go
├── app.go
├── internal/
│   ├── worker/
│   │   ├── manager.go
│   │   ├── protocol.go
│   │   └── process_<os>.go
│   └── domain/
├── python-worker/
│   ├── pyproject.toml
│   ├── requirements.lock
│   ├── worker/
│   │   ├── main.py
│   │   ├── protocol.py
│   │   ├── service.py
│   │   └── domain/
│   └── tests/
├── frontend/
└── build/
```

Python 业务模块不得依赖 Wails；Go 的领域逻辑不得依赖具体 Python 启动命令。进程适配和业务接口分层。

## 开发与生产

### 开发

Go 可启动：

```text
python -u python-worker/worker/main.py --transport stdio
```

要求：

- Python 版本和依赖由项目固定
- `-u` 或显式 flush 保证实时通信
- 与生产使用同一协议和业务入口

### 生产

- 使用 PyInstaller、Nuitka 或已评估工具生成独立 Worker
- 每个目标平台和架构分别构建
- Go 通过资源定位函数解析 Worker 路径，不能依赖当前工作目录
- Worker、动态库、证书、NodeSet、模型等资源必须完整交付
- 目标机器不需要安装 Python

优先目录模式排查依赖，稳定后再评估单文件模式。不要把“单文件”作为强制质量指标。

## 安全要求

- Go 对发送给 Worker 的文件路径、端口和关键配置做基础校验
- Python 仍须执行完整业务校验，不能信任 IPC 输入
- 本地 HTTP 服务必须使用随机 Token，不把控制接口暴露到局域网
- 禁止执行来自前端的任意 Python 代码、模块名或 shell 字符串
- 子进程启动使用参数数组，不拼接 shell 命令
- 日志不得记录密码、Token、私钥或敏感业务数据

## 测试要求

### Python

- 业务逻辑单元测试
- 服务启动、停止、重复启动
- 非法配置和资源缺失
- 任务取消和异常清理

### Go

- 协议编解码
- 请求 ID 并发映射
- 超时和取消
- Worker 启动失败、异常退出、无响应
- 日志分流和状态机

### 集成

至少覆盖：

1. Go 启动打包或开发 Worker
2. ping 和协议版本握手成功
3. 执行一个真实业务命令
4. 收到结果或状态事件
5. 正常 shutdown
6. 强制终止后无残留进程
7. Worker 崩溃时前端获得明确失败状态

对于 asyncua 场景，还应使用真实 OPC UA Client 验证连接、读写、订阅、重连和安全配置。

## 验收标准

- 前端完全不直接调用 Python
- Go 是 Python 生命周期的唯一管理者
- Python 不可用时 GUI 仍能启动并显示可诊断错误
- Worker 启动有健康检查和版本握手
- 所有请求有唯一 ID、超时和错误码
- 日志与协议严格分流
- 应用退出后无残留进程
- 发布包在无 Python 环境中可运行
- Python 组件仅承担其擅长的业务能力，不复制 Go 的控制职责
