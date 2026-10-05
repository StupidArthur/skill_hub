---
name: tech-selection
description: 为新项目、架构迁移或关键技术路线变化直接选择技术栈。提供默认方案和偏离条件；任何涉及技术栈、框架、数据库、接口或运行形态选择的工作都应调用。
---

# 技术选型

目标：**直接做选择，不做技术百科。**

## 1. 先判断是否需要选型

- 已有项目普通修改：沿用现有技术栈。
- 只有新项目、明确迁移、现有方案无法满足需求时，重新选型。

## 2. 按产品形态选择

### 桌面 GUI

默认：

```text
React + TypeScript + Vite
        ↓
     Wails
        ↓
       Go
```

需要 Python 生态时：

```text
React + TypeScript + Vite
        ↓
     Wails
        ↓
       Go
        ↓
 Python Worker
```

选择规则：

- 默认保持纯 Go。
- AI、数据、科学计算、专有 Python SDK、模型驻留明显依赖 Python 时，再增加 Worker。
- Go 管理 Worker 生命周期；前端不直接调用 Python。
- 正式分发不能依赖用户预装开发用 Python 环境。

### Web 应用

普通后台、工具、管理系统：

```text
React + TypeScript + Vite
        +
      Go API
```

需要 SSR / SEO / 内容站：

```text
Next.js
```

后端明显依赖 AI、数据处理或 Python SDK：

```text
React + TypeScript
        +
Python API
```

### 后端服务 / API

默认：

```text
Go
```

改用 Python 的条件：

- 核心能力依赖 AI / ML / 数据分析生态；
- 关键 SDK 只有 Python 或 Python 成熟度明显更高；
- Python 能显著减少跨语言胶水代码。

否则保持 Go。

### CLI

正式工具、需要长期维护或跨平台分发：

```text
Go
```

内部脚本、一次性任务、数据处理、AI 自动化：

```text
Python
```

### 批处理 / 自动化

默认：

```text
Python
```

如果需要单二进制分发、高并发、长期运行或更强部署一致性：

```text
Go
```

## 3. 数据与接口

### 数据库

```text
本地单机数据      → SQLite
服务端关系数据    → PostgreSQL
```

只有确有需求时再增加：

```text
Redis        → 共享缓存、短期状态、限流等
对象存储     → 大文件、媒体、归档
搜索引擎     → 全文检索成为核心能力时
```

不要因为“以后可能会用”提前引入。

### API / IPC

默认：

```text
HTTP + JSON
```

按需求偏离：

```text
服务端单向实时推送      → SSE
双向实时通信            → WebSocket
高吞吐内部服务通信      → gRPC
本地进程简单通信        → stdin/stdout + 结构化消息
```

没有明确收益时不引入额外协议。

## 4. 前端基础栈

新项目默认：

```text
React
TypeScript
Vite
```

需要 SSR / SEO 时使用 Next.js。

组件库、样式方案和视觉规范由项目现状及 `ui-style` 决定，不在这里绑定。

## 5. 默认不要引入的复杂度

没有明确需求时，不主动加入：

- 微服务；
- Kubernetes；
- 消息队列；
- Redis；
- GraphQL；
- gRPC；
- 第二种后端语言；
- Python Worker；
- 复杂前端状态管理；
- 多层架构模板。

需要时再加，不为未来假设提前设计。

## 6. 输出格式

最终只输出：

```text
选择：<技术路线>
原因：<2~4 个关键原因>
偏离默认：<如有，说明触发条件；没有则省略>
```

如果两个方案会造成明显不同的产品结果且需求无法判断，再让用户选择；普通技术细节由 Agent 直接决定。

---

## License

本 skill 采用 MIT 协议，Copyright (c) 2026 StupidArthur。
