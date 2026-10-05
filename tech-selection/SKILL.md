---
name: tech-selection
description: 为新项目、架构迁移或关键技术路线变化直接选择技术栈。提供默认方案和偏离条件；任何涉及技术栈、框架、数据库、接口或运行形态选择的工作都应调用。
---

# 技术选型

目标：**直接做选择，不做技术百科。**

## 1. 是否需要重新选型

| 场景 | 处理 |
|---|---|
| 已有项目普通修改 | 沿用现有技术栈 |
| 新项目 | 重新选型 |
| 明确架构迁移 | 重新选型 |
| 现有方案无法满足需求 | 重新选型 |

## 2. 默认技术路线

| 场景 | 默认选择 | 什么时候偏离 |
|---|---|---|
| 桌面 GUI | React + TypeScript + Vite → Wails → Go | AI / 数据 / 科学计算 / 专有 Python SDK / 模型驻留明显依赖 Python 时，加 Python Worker |
| 普通 Web / 后台 / 管理系统 | React + TypeScript + Vite + Go API | 后端强依赖 Python 生态时改为 Python API |
| SSR / SEO / 内容站 | Next.js | 只有需求明确不需要 SSR/SEO 时回到 Vite SPA |
| 后端服务 / API | Go | AI / ML / 数据分析或关键 SDK 明显偏 Python 时用 Python |
| 正式 CLI / 跨平台工具 | Go | 内部脚本、一次性任务、数据或 AI 自动化时用 Python |
| 批处理 / 自动化 | Python | 单二进制分发、高并发、长期运行、部署一致性要求高时用 Go |

### 桌面 GUI 边界

默认链路：**React + TypeScript + Vite → Wails → Go**  
需要 Python 时：**React + TypeScript + Vite → Wails → Go → Python Worker**

Python Worker 只守四条边界：Go 管生命周期；前端不直连 Python；IPC 使用结构化消息；正式分发不依赖用户预装开发用 Python 环境。

## 3. 数据与接口

### 数据

| 需求 | 选择 |
|---|---|
| 本地单机数据 | SQLite |
| 服务端关系数据 | PostgreSQL |
| 共享缓存 / 短期状态 / 限流 | Redis，仅有明确需求时 |
| 大文件 / 媒体 / 归档 | 对象存储，仅有明确需求时 |
| 全文检索成为核心能力 | 搜索引擎，仅有明确需求时 |

### API / IPC

| 需求 | 选择 |
|---|---|
| 默认接口 | HTTP + JSON |
| 服务端单向实时推送 | SSE |
| 双向实时通信 | WebSocket |
| 高吞吐内部服务通信 | gRPC |
| 本地进程简单通信 | stdin/stdout + 结构化消息 |

没有明确收益时，不增加额外协议。

## 4. 前端基础栈

| 场景 | 选择 |
|---|---|
| 默认前端 | React + TypeScript + Vite |
| SSR / SEO | Next.js |
| 组件库 / 样式 / 视觉规范 | 跟随项目现状；新项目交给 `ui-style` |

## 5. 默认不要提前引入

**微服务 · Kubernetes · 消息队列 · Redis · GraphQL · gRPC · 第二种后端语言 · Python Worker · 复杂前端状态管理 · 多层架构模板**

只有当前需求已经产生明确收益时才引入，不为未来假设提前设计。

## 6. 输出

只输出：**选择：** `<技术路线>`　**原因：** `<2~4 个关键原因>`　**偏离默认：** `<有则写，没有省略>`

只有两个方案会造成明显不同的产品结果、且需求无法判断时，才让用户选择；普通技术细节由 Agent 直接决定。

---

## License

本 skill 采用 MIT 协议，Copyright (c) 2026 StupidArthur。
