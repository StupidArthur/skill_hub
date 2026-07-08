# Wails 后端模式

本章节定义 Wails 边界层、生命周期、绑定、错误、事件和前端衔接。Go 目录与依赖规则见 [Go 工程结构与依赖规则](go-architecture.md)。

## 一、职责定位

Wails 后端不是业务代码的集中地，而是桌面边界适配器：

```text
前端
  ↓ Wails Binding
bindings
  ↓
业务 Service
  ↓ ports
数据库 / Python Worker / 文件系统等 adapters
```

Wails 相关代码只应出现在：

- `main.go`
- `internal/app`
- `internal/bindings`
- 少量需要 Wails runtime 的 platform adapter

业务包不得 import Wails。

## 二、推荐入口结构

```text
project/
├── main.go
├── internal/
│   ├── app/
│   │   ├── container.go
│   │   └── lifecycle.go
│   ├── bindings/
│   │   ├── project.go
│   │   ├── uaserver.go
│   │   └── settings.go
│   └── ...
└── frontend/
```

项目规模判断、完整目录和迁移方式见 [Go 工程结构与依赖规则](go-architecture.md)。

## 三、main.go 只做启动

`main.go` 是 composition entry，不写业务逻辑。

```go
package main

import (
    "embed"
    "log"

    "github.com/wailsapp/wails/v2"
    "github.com/wailsapp/wails/v2/pkg/options"
    "github.com/wailsapp/wails/v2/pkg/options/assetserver"

    "yourapp/internal/app"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
    container, err := app.NewContainer()
    if err != nil {
        log.Fatal(err)
    }

    err = wails.Run(&options.App{
        Title:     "工具名称",
        Width:     1180,
        Height:    780,
        MinWidth:  920,
        MinHeight: 620,
        AssetServer: &assetserver.Options{
            Assets: assets,
        },
        OnStartup:  container.Lifecycle.Startup,
        OnShutdown: container.Lifecycle.Shutdown,
        Bind: []interface{}{
            container.ProjectBinding,
            container.UAServerBinding,
            container.SettingsBinding,
        },
    })
    if err != nil {
        log.Fatal(err)
    }
}
```

要求：

- `main.go` 不创建数据库表、不启动 Worker、不读写业务文件
- 所有依赖由 `app.NewContainer()` 创建
- 生命周期统一由 `Lifecycle` 管理
- Binding 按业务能力拆分，不强制只绑定一个 `App`

## 四、Container 是唯一组合根

```go
package app

import (
    "yourapp/internal/adapters/pyworker"
    "yourapp/internal/adapters/sqlite"
    "yourapp/internal/bindings"
    "yourapp/internal/project"
    "yourapp/internal/uaserver"
)

type Container struct {
    Lifecycle       *Lifecycle
    ProjectBinding  *bindings.ProjectBinding
    UAServerBinding *bindings.UAServerBinding
    SettingsBinding *bindings.SettingsBinding
}

func NewContainer() (*Container, error) {
    cfg, err := LoadConfig()
    if err != nil {
        return nil, err
    }

    db, err := sqlite.Open(cfg.DatabasePath)
    if err != nil {
        return nil, err
    }

    workerClient := pyworker.NewClient(cfg.Worker)

    projectService := project.NewService(
        sqlite.NewProjectRepository(db),
    )
    uaService := uaserver.NewService(
        pyworker.NewUARuntime(workerClient),
    )

    return &Container{
        Lifecycle:       NewLifecycle(db, workerClient),
        ProjectBinding:  bindings.NewProjectBinding(projectService),
        UAServerBinding: bindings.NewUAServerBinding(uaService),
        SettingsBinding: bindings.NewSettingsBinding(cfg),
    }, nil
}
```

禁止：

- Binding 内 `sqlite.Open()`
- Binding 内 `exec.Command()` 启动 Python
- 每次调用临时创建 Service
- 使用全局可变单例保存所有依赖

## 五、生命周期

生命周期至少管理：

- Wails context
- 根 `context.Context` 和 cancel
- 数据库关闭
- Worker 启停
- 后台 goroutine
- 日志 flush

```go
package app

import (
    "context"
    "time"
)

type Closable interface {
    Close() error
}

type Worker interface {
    Start(context.Context) error
    Stop(context.Context) error
}

type Lifecycle struct {
    cancel context.CancelFunc
    db     Closable
    worker Worker
}

func (l *Lifecycle) Startup(wailsCtx context.Context) {
    rootCtx, cancel := context.WithCancel(wailsCtx)
    l.cancel = cancel

    go func() {
        _ = l.worker.Start(rootCtx)
    }()
}

func (l *Lifecycle) Shutdown(context.Context) {
    if l.cancel != nil {
        l.cancel()
    }

    stopCtx, cancel := context.WithTimeout(
        context.Background(),
        5*time.Second,
    )
    defer cancel()

    _ = l.worker.Stop(stopCtx)
    _ = l.db.Close()
}
```

实际项目应记录关闭错误；示例省略日志细节。

## 六、Binding 按业务能力拆分

```go
package bindings

import (
    "context"

    "yourapp/internal/uaserver"
)

type UAServerService interface {
    Start(context.Context, uaserver.Config) (uaserver.Status, error)
    Stop(context.Context) error
    Status(context.Context) (uaserver.Status, error)
}

type UAServerBinding struct {
    ctx     context.Context
    service UAServerService
}

func NewUAServerBinding(service UAServerService) *UAServerBinding {
    return &UAServerBinding{service: service}
}

func (b *UAServerBinding) SetContext(ctx context.Context) {
    b.ctx = ctx
}
```

Binding 方法只做边界转换：

```go
type StartServerRequest struct {
    Endpoint  string `json:"endpoint"`
    Namespace string `json:"namespace"`
}

type ServerStatusDTO struct {
    State    string `json:"state"`
    Endpoint string `json:"endpoint"`
}

func (b *UAServerBinding) Start(
    req StartServerRequest,
) (ServerStatusDTO, error) {
    cfg, err := req.toConfig()
    if err != nil {
        return ServerStatusDTO{}, err
    }

    status, err := b.service.Start(b.ctx, cfg)
    if err != nil {
        return ServerStatusDTO{}, mapPublicError(err)
    }

    return toServerStatusDTO(status), nil
}
```

## 七、Context 注入

所有 Binding 需要共享应用根 context。推荐由 `Lifecycle.Startup` 注入：

```go
type ContextReceiver interface {
    SetContext(context.Context)
}

func (l *Lifecycle) Startup(ctx context.Context) {
    rootCtx, cancel := context.WithCancel(ctx)
    l.cancel = cancel

    for _, receiver := range l.contextReceivers {
        receiver.SetContext(rootCtx)
    }
}
```

禁止在业务调用中随意使用 `context.Background()` 绕过应用取消。短任务应基于根 context 创建超时 context。

## 八、方法命名

Binding 类型已经表达业务域，方法不重复领域名。

推荐：

```text
ProjectBinding.List
ProjectBinding.Save
ProjectBinding.Delete
UAServerBinding.Start
UAServerBinding.Stop
UAServerBinding.Status
ScenarioBinding.Run
ScenarioBinding.Cancel
```

不推荐：

```text
App.GetAllProjects
App.StartUAServerProcess
App.DoScenarioExecution
```

方法使用 PascalCase，保证 Wails 生成前端绑定。

## 九、DTO 边界

- 前端请求和返回结构定义在 `bindings`
- 所有公开字段带 `json` tag
- 内部模型不直接暴露给前端
- 路径、时间、枚举等在边界统一格式化
- 不用 `map[string]any` 代替稳定 DTO

DTO 转换函数保持私有：

```go
func toServerStatusDTO(status uaserver.Status) ServerStatusDTO
func (r StartServerRequest) toConfig() (uaserver.Config, error)
```

## 十、错误处理

优先使用 `(T, error)`，让前端 Promise 正常 reject。

业务层返回可判定错误：

```go
var ErrAlreadyRunning = errors.New("server already running")
```

Binding 将内部错误映射为稳定用户错误：

```go
type PublicError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
}
```

不要：

- panic 处理普通业务失败
- 把完整堆栈返回前端
- 所有方法都返回 `Success bool + Error string`
- 根据错误文本做业务判断

批量操作可返回部分成功明细，但系统级失败仍返回 `error`。

## 十一、Wails Event

事件适合：

- Worker 状态
- 长任务进度
- 实时日志
- 外部客户端连接状态
- 数据变化通知

事件名使用稳定命名空间：

```text
worker:state
worker:log
ua-server:state
scenario:progress
project:changed
```

Go 负责把内部事件转换为前端 DTO，再调用 `runtime.EventsEmit`。业务包不直接 import Wails runtime。

不要用事件替代所有请求响应。一次性查询和命令仍使用 Binding 方法。

## 十二、系统能力

系统对话框、打开目录等能力放在 `platform` 或专用 Binding，不放入业务 Service。

```go
type SystemBinding struct {
    ctx context.Context
}

func (b *SystemBinding) PickFile() (string, error) {
    return runtime.OpenFileDialog(
        b.ctx,
        runtime.OpenDialogOptions{Title: "选择文件"},
    )
}
```

跨平台差异较大时使用：

```text
opener_windows.go
opener_darwin.go
opener_linux.go
```

## 十三、前端 API 收口

组件不得直接 import `wailsjs`，统一封装：

```ts
// frontend/src/lib/api/project.ts
import {
  List,
  Save,
  Delete,
} from '../../../wailsjs/go/bindings/ProjectBinding'

export const projectApi = {
  list: List,
  save: Save,
  remove: Delete,
}
```

```ts
// frontend/src/lib/api/uaServer.ts
import {
  Start,
  Stop,
  Status,
} from '../../../wailsjs/go/bindings/UAServerBinding'

export const uaServerApi = {
  start: Start,
  stop: Stop,
  status: Status,
}
```

页面只依赖业务 API 模块。

## 十四、测试分层

- `internal/<feature>`：业务单元测试
- `internal/adapters`：数据库、协议和 Worker adapter 测试
- `internal/bindings`：DTO 转换和关键错误映射测试
- `tests/integration`：Wails 控制层以下的真实链路

运行：

```bash
go test -v -count=1 ./...
```

Binding 应保持足够薄，避免必须启动完整 Wails 环境才能验证业务。

## 十五、禁止模式

- 项目根目录堆放所有 `.go` 业务文件
- 单个 `App` 类型暴露全部业务方法
- Binding 直接写 SQL、操作 Worker 或实现业务规则
- 业务包 import Wails runtime
- 前端直接 import 多个零散 `wailsjs` 方法
- 全局变量保存 context、数据库或 Worker
- 使用 `common`、`helpers`、`utils` 收纳不相关逻辑

## 十六、验收标准

- `main.go` 只负责启动
- 具体依赖只在 `app.Container` 组装
- Binding 按业务域拆分
- Binding 只做 DTO、调用和事件转换
- 业务包完全脱离 Wails 可测试
- 前端 API 统一收口
- 生命周期能关闭数据库、Worker 和后台任务
- 项目目录符合 [Go 工程结构与依赖规则](go-architecture.md)
