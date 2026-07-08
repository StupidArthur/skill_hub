# Go 工程结构与依赖规则

本规范定义 Wails GUI 工具的 Go 工程组织方式。目标是解决根目录平铺、`app.go` 膨胀、业务与框架耦合、Python Worker 难以接入等问题。

核心原则：**按业务能力组织代码，框架和外部系统作为适配器放在边界，依赖只向业务内核流动。**

## 一、先判断项目规模

不要所有项目都套同一套目录。根据复杂度使用两档结构。

### 轻量结构

适用于同时满足大部分条件的项目：

- 只有 1～2 个业务能力
- 不使用数据库
- 不包含 Python Worker
- 没有长期运行任务
- 外部系统集成少
- 预计代码规模较小

```text
project/
├── main.go
├── go.mod
├── wails.json
├── internal/
│   ├── app/
│   │   ├── bootstrap.go
│   │   └── lifecycle.go
│   ├── bindings/
│   │   └── tool.go
│   ├── tool/
│   │   ├── model.go
│   │   ├── service.go
│   │   └── service_test.go
│   └── platform/
│       ├── dialog.go
│       └── opener.go
└── frontend/
```

即使是小工具，也不把业务文件继续堆在项目根目录。

### 标准结构

满足以下任意两项时使用：

- 超过 2 个业务能力
- 使用 SQLite 或其他持久化
- 使用 Python Worker
- 存在长期任务、后台服务或任务队列
- 接入多种外部协议或 SDK
- 需要多页面、多种 Wails Binding
- 预计长期迭代
- 需要独立集成测试

```text
project/
├── main.go
├── go.mod
├── go.sum
├── wails.json
│
├── internal/
│   ├── app/                         # 组合根和生命周期
│   │   ├── container.go
│   │   ├── bootstrap.go
│   │   ├── lifecycle.go
│   │   └── config.go
│   │
│   ├── bindings/                    # Wails 边界适配器
│   │   ├── project.go
│   │   ├── uaserver.go
│   │   ├── scenario.go
│   │   └── settings.go
│   │
│   ├── project/                     # 业务能力：项目管理
│   │   ├── model.go
│   │   ├── service.go
│   │   ├── ports.go
│   │   ├── errors.go
│   │   └── service_test.go
│   │
│   ├── uaserver/                    # 业务能力：UA Server
│   │   ├── model.go
│   │   ├── service.go
│   │   ├── runtime.go
│   │   ├── errors.go
│   │   └── service_test.go
│   │
│   ├── scenario/                    # 业务能力：测试场景
│   │   ├── model.go
│   │   ├── service.go
│   │   ├── generator.go
│   │   └── service_test.go
│   │
│   ├── adapters/                    # 外部能力的具体实现
│   │   ├── sqlite/
│   │   │   ├── database.go
│   │   │   ├── migration.go
│   │   │   └── project_repository.go
│   │   ├── pyworker/
│   │   │   ├── manager.go
│   │   │   ├── protocol.go
│   │   │   ├── client.go
│   │   │   └── process_windows.go
│   │   ├── filesystem/
│   │   │   └── repository.go
│   │   └── logging/
│   │       └── logger.go
│   │
│   └── platform/                    # 操作系统能力
│       ├── dialog.go
│       ├── paths.go
│       ├── opener_windows.go
│       ├── opener_darwin.go
│       └── opener_linux.go
│
├── python-worker/                   # 可选，独立 Python 工程
│   ├── pyproject.toml
│   ├── worker/
│   └── tests/
│
├── frontend/
├── scripts/
├── configs/
└── tests/
    └── integration/
```

## 二、目录职责

| 目录 | 职责 | 禁止事项 |
|------|------|----------|
| `internal/app` | 创建依赖、生命周期、配置装配 | 不写业务规则 |
| `internal/bindings` | Wails 方法、DTO 转换、事件转发 | 不直接访问数据库和 Python 进程 |
| `internal/<feature>` | 领域模型、用例编排、业务接口 | 不 import Wails、SQLite、exec、前端类型 |
| `internal/adapters` | 数据库、Python Worker、文件系统等接口实现 | 不决定业务规则 |
| `internal/platform` | 系统对话框、路径、打开目录、进程组等 OS 差异 | 不放业务流程 |
| `frontend` | 页面与交互 | 不直接访问 Python 或数据库 |
| `python-worker` | Python 生态业务能力 | 不管理 Wails 窗口或前端状态 |

## 三、依赖方向

依赖方向必须稳定：

```text
main
  ↓
app/container
  ├── bindings ─────→ feature service
  ├── adapters ─────→ feature ports
  └── platform

feature package 不反向依赖 bindings、adapters、platform 或 Wails
```

允许：

```text
bindings → uaserver
adapters/pyworker → uaserver
app → bindings + adapters + uaserver
```

禁止：

```text
uaserver → bindings
uaserver → adapters/pyworker
project → app
adapter A → binding B
```

接口应定义在**使用接口的一侧**。例如 UA Server 业务需要运行时能力，则接口放在 `internal/uaserver`：

```go
package uaserver

import "context"

type Runtime interface {
    Start(ctx context.Context, cfg Config) error
    Stop(ctx context.Context) error
    Status(ctx context.Context) (Status, error)
}
```

Python Worker 适配器实现该接口：

```go
package pyworker

type UARuntime struct {
    client *Client
}
```

业务层不知道实现来自 Python、Go 库还是远程服务。

## 四、按业务能力组织，不按技术文件类型堆放

推荐：

```text
internal/
├── project/
├── uaserver/
└── scenario/
```

不推荐：

```text
internal/
├── models/
├── services/
├── repositories/
└── controllers/
```

后者会让一次业务修改横跨多个大目录，并逐渐形成 `services`、`models` 杂物箱。

业务包内部可使用统一文件角色：

```text
model.go       数据模型和值对象
service.go     用例和业务编排
ports.go       所需外部能力接口
errors.go      可判定的领域错误
*_test.go      同包测试
```

文件名表达职责，不使用 `manager2.go`、`misc.go`、`helpers.go`。

## 五、组合根

所有具体依赖只在 `internal/app` 创建和连接。

```go
package app

type Container struct {
    Lifecycle       *Lifecycle
    ProjectBinding  *bindings.ProjectBinding
    UAServerBinding *bindings.UAServerBinding
    SettingsBinding *bindings.SettingsBinding
}

func NewContainer(cfg Config) (*Container, error) {
    db, err := sqlite.Open(cfg.DatabasePath)
    if err != nil {
        return nil, err
    }

    workerClient := pyworker.NewClient(cfg.Worker)
    uaRuntime := pyworker.NewUARuntime(workerClient)

    projectService := project.NewService(
        sqlite.NewProjectRepository(db),
    )
    uaService := uaserver.NewService(uaRuntime)

    lifecycle := NewLifecycle(db, workerClient)

    return &Container{
        Lifecycle:       lifecycle,
        ProjectBinding:  bindings.NewProjectBinding(projectService),
        UAServerBinding: bindings.NewUAServerBinding(uaService),
    }, nil
}
```

禁止在 Binding 方法中临时创建数据库连接、Worker 或 Service。

## 六、Wails Binding 拆分

每个稳定业务能力对应一个 Binding：

```text
ProjectBinding
UAServerBinding
ScenarioBinding
SettingsBinding
```

不要把所有方法塞进单个 `App`：

```go
// 不推荐
func (a *App) StartServer(...)
func (a *App) SaveProject(...)
func (a *App) ExportReport(...)
func (a *App) UpdateSettings(...)
```

`Bind` 可以绑定多个边界对象：

```go
Bind: []interface{}{
    container.ProjectBinding,
    container.UAServerBinding,
    container.ScenarioBinding,
    container.SettingsBinding,
},
```

Binding 必须保持薄：

1. 接收前端 DTO
2. 做基础格式检查
3. 转换为业务输入
4. 调用 Service
5. 转换返回 DTO 或错误
6. 必要时发送 Wails Event

不在 Binding 中写 SQL、执行 `exec.Command`、实现重试或业务状态机。

## 七、DTO 与领域模型

前端 DTO 放在 `bindings` 包，不直接把内部领域模型暴露给前端。

```go
type StartServerRequest struct {
    Endpoint  string `json:"endpoint"`
    Namespace string `json:"namespace"`
}

type ServerStatusDTO struct {
    State    string `json:"state"`
    Endpoint string `json:"endpoint"`
}
```

领域对象不为了前端序列化而到处添加 UI 字段。DTO 转换函数放在 Binding 文件附近。

## 八、错误模型

普通异常使用 Go `error`，Wails 方法优先返回 `(T, error)`：

```go
func (b *UAServerBinding) Start(req StartServerRequest) (ServerStatusDTO, error) {
    cfg, err := req.toConfig()
    if err != nil {
        return ServerStatusDTO{}, err
    }

    status, err := b.service.Start(b.ctx, cfg)
    if err != nil {
        return ServerStatusDTO{}, mapPublicError(err)
    }

    return toStatusDTO(status), nil
}
```

批量操作允许返回部分成功结果：

```go
type BatchResult struct {
    Succeeded []string    `json:"succeeded"`
    Failed    []ItemError `json:"failed"`
}
```

禁止所有接口统一返回：

```go
{ Success bool; Error string }
```

这种模式会丢失错误类别，并迫使前端到处手工判断字符串。

## 九、平台代码

简单差异可用 `runtime.GOOS`。差异较大时使用构建标签和平台文件：

```text
opener_windows.go
opener_darwin.go
opener_linux.go
```

公共接口保持一致：

```go
func OpenInFolder(path string) error
```

路径一律使用 `filepath`，用户目录使用 `os.UserHomeDir()`，应用数据目录由平台适配层统一解析。

## 十、包命名规则

- 包名小写、简短、单数
- 不使用 `common`、`base`、`misc`、`helper` 作为通用垃圾包
- 不创建仅含一个转发函数的无意义包
- 不为“未来可能”预建空层
- 避免包名与导出类型重复，如 `project.ProjectService` 可简化为 `project.Service`
- 发现循环依赖时重新审视职责，不用全局变量绕过

## 十一、测试组织

### 单元测试

测试文件与业务包同目录：

```text
internal/uaserver/service_test.go
internal/scenario/generator_test.go
```

使用接口替身测试业务服务，不启动 Wails。

### 适配器测试

```text
internal/adapters/sqlite/project_repository_test.go
internal/adapters/pyworker/protocol_test.go
```

数据库使用临时目录，进程测试使用受控假 Worker。

### 集成测试

跨包真实链路放在：

```text
tests/integration/
```

例如：

- Go 启动 Python Worker
- ping 与版本握手
- 启动 asyncua Server
- 客户端连接、读写、订阅
- 关闭后无残留进程

## 十二、从平铺结构迁移

原结构：

```text
main.go
app.go
project.go
server.go
worker.go
database.go
```

迁移顺序：

1. 创建 `internal/app`，把启动和生命周期移入
2. 创建业务包，把模型和业务规则按能力迁入
3. 创建 `bindings`，把 Wails 方法按业务拆分
4. 创建 `adapters`，迁移数据库、Worker、文件系统实现
5. 创建 `platform`，迁移系统差异代码
6. 在 `app.Container` 统一组装依赖
7. 更新前端 API 封装和 Wails 生成绑定
8. 运行单元测试和启动验证

迁移过程中不同时重写业务算法，先完成结构移动，再做行为优化。

## 十三、验收清单

- [ ] 根目录只保留入口、模块、构建配置和顶层资源
- [ ] 业务代码按能力放在 `internal/<feature>`
- [ ] Wails Binding 按业务拆分且保持薄
- [ ] 业务包不 import Wails、SQLite 驱动或 `os/exec`
- [ ] Python Worker 位于 `adapters/pyworker`
- [ ] 具体依赖只在组合根创建
- [ ] 没有 `common`、`misc`、超大 `utils` 包
- [ ] 没有单个上帝 `App` 承载全部功能
- [ ] 单元测试与业务包共置，集成测试单独组织
- [ ] 目录复杂度与项目规模匹配，没有为分层而分层
