---
name: ui-style
description: 约束新界面和显著视觉改版的默认 UI 设计方向。适用于桌面工具、工作台、管理工具、数据工具和其他复杂交互界面。强调明亮、克制、专业的工具感，统一导航、Toolbar、主工作区、Inspector、辅助面板以及 Card/Section/Row 的使用规则。任何涉及新建或显著调整界面的工作都应调用。
---

# UI 风格约束

本 Skill 定义**默认设计哲学、界面结构和视觉倾向**，不绑定前端框架、组件库、CSS 方案或固定 Design Token。

已有成熟设计系统、品牌规范或用户明确参考时，以项目要求为准。

## 核心方向

默认方向：**明亮、克制、紧凑、专业的桌面工具感**。

参考 macOS 专业软件的设计逻辑，但不要机械模仿系统 UI。

- Main Canvas 默认以白色或接近白色为主，不使用大面积灰底营造“高级感”；
- Sidebar、Toolbar、Popover 等可以使用轻微材质感或浅色层次，但避免装饰性玻璃拟态；
- 层级优先依靠布局、间距、字重、细边框和真实层级建立；
- 阴影只用于真实浮层、弹窗、悬浮面板等需要表达 Z 轴关系的地方；
- 字号保持紧凑可读，不为了视觉冲击主动放大标题；
- 不通过渐变、3D、霓虹或大量装饰制造“科技感”。

## Studio / Workspace 结构

复杂工具默认把界面理解为一个稳定的 Workspace，而不是不断嵌套的“页面中的页面”。

常见区域：

- **Navigation**：用户去哪里；
- **Toolbar**：当前 Workspace / 页面标识和少量高频操作；
- **Main Canvas**：当前唯一主任务；
- **Inspector**：当前选中对象的上下文详情；
- **Auxiliary Panel**：Logs、Problems、Terminal、Output 等辅助信息。

简单页面不必强行使用所有区域，但不要破坏这些区域的职责边界。

## Navigation

### 统一导航层级

一级、二级以及更深层级的功能导航，应尽量属于**同一个导航系统**，通常放在左侧 Sidebar。

不要因为进入更深层级就再在 Main Canvas 顶部增加一排功能 Tabs。

例如：

- Tasks
  - Running
  - History
  - Scheduled
- Devices
  - Production
  - Test Bench

这是一个导航树，不应拆成“左侧一级导航 + 内容区顶部二级 Tabs”。

### 一级与二级必须有明确视觉区别

- 一级导航代表功能分区，可以使用统一线性图标；
- 二级导航代表分区内部目的地，默认通过缩进、字重、间距或轻量指示表达层级；
- 二级选中态不要做成 Input、Button 或独立 Card 的样子；
- 二级选中通常使用文字强调 + 轻量位置指示即可。

### Sidebar 收起

Sidebar 可以从完整导航收起为 Rail，但收起只改变占用空间，不改变信息架构。

默认规则：

- 收起按钮属于 Sidebar 自身，不放到 Main Canvas；
- 收起后按钮保持同一视觉形态，不临时变成无关的普通箭头字符；
- Rail 模式只显示一级导航图标；
- 所有二级导航在 Rail 模式下完全隐藏；
- 一级图标严格居中；
- 收起后的选中态保持克制，不使用明显背景框、输入框式描边或复杂装饰；
- 可以通过图标加深、轻量位置点等方式表达当前位置。

### Tabs 的使用边界

Tabs 只用于**同一对象、同一上下文、同一空间中的视图切换**。

适合：

- Preview / Source；
- Logs / Problems / Terminal；
- Day / Week / Month。

不适合：

- Tasks / Devices / Plugins / Settings；
- 任何本质上是在进入不同功能空间的导航。

## Toolbar

Toolbar 是**唯一页面级标题区域**。

- 当前页面 / Workspace 名称只在 Toolbar 出现一次；
- Main Canvas 不重复 Page Title + Description；
- Main Canvas 只有在显示具体对象详情时，才允许出现对象标题；
- Toolbar 右侧只放当前上下文真正有价值的高频操作；
- 不为了填满 Toolbar 放置 Back、Forward、More、Clear 等零散图标；
- Back / Forward 只有在产品确实存在明确导航历史语义时才出现；
- Toolbar 图标与 Sidebar 使用同一套线性视觉语言。

## Main Canvas

Main Canvas 是界面的**唯一主工作区**。

- 打开页面后直接进入内容，不再增加第二层 Page Header；
- 页面级操作优先放到 Toolbar；
- Canvas 内只保留内容模块、对象内容和必要的局部操作；
- 不把导航、页面标题、说明文字和操作条一层层堆在内容上方。

## Inspector

Inspector 是**选中对象的上下文详情**，不是永久存在的第三栏。

默认行为：

- 没有选中对象时不显示；
- 选择具体对象后按需打开；
- 支持关闭；有明确价值时可以支持 Pin；
- 可以调整宽度时，应记住用户选择；
- 主要显示 Properties、Status、Parameters、Metadata、Quick Actions 和少量相关历史；
- 不在 Inspector 内继续生长完整的小型应用或多层功能导航。

## Auxiliary Panel / Output

Logs、Problems、Terminal、Output 等属于辅助空间，默认按需出现。

- 默认隐藏，不长期占用主工作区；
- 用户可以主动打开、调整高度或最大化；
- 正常成功操作不要自动抢占主界面；
- Error / Warning 等需要用户关注的情况可以主动打开对应辅助视图；
- 已经打开时直接追加内容，不反复改变布局；
- Terminal 只在开发者工具或确实需要命令行能力的产品中出现。

核心原则：**复杂度按需暴露**。专业工具可以很强，但不应让用户持续面对系统内部结构。

## Card / Section / Row 视觉语法

不要把“减少卡片”当成目标，也不要为了统一风格把所有内容强行拍平成列表。

默认使用以下层级：

### Workspace Region

Navigation、Main Canvas、Inspector、Auxiliary Panel 等大区域本身不是 Card。

### Section

Section 表示一组共同语义内容。

- 可以通过标题、间距、细分隔线建立分组；
- 不要求每个 Section 都有独立背景容器。

### Card

Card 用于真正独立的信息模块。

适合：

- KPI / Summary；
- 独立图表；
- 有自己状态、操作或数据边界的模块；
- 可以被单独理解的信息块。

不适合：

- 仅仅为了制造层级而包住普通文字；
- 页面中的每一个 Section；
- Table 的每一行；
- Sidebar、Inspector 等大结构区域。

### Row

Row 用于同类对象或属性的重复记录，例如 Table、List、Property List、Activity List。

同一产品中的 Overview、Performance、Status 等页面应共享相同的 Card / Section / Row 视觉语法，但**内容表达可以针对场景变化**。统一不是让所有页面长得一样，而是让相同类型的信息使用相同规则。

## 图标

- 优先使用项目已有统一图标集；
- 新项目使用统一的线性 Outline 风格；
- Sidebar、Toolbar、Inspector 等区域保持同一 stroke、尺寸和视觉重量；
- 不混用 Unicode 字符、实心符号、Emoji 和不同来源的图标；
- 没有明确功能价值的图标直接删除，不为了“像工具软件”增加按钮。

## 组件与交互

- 优先复用项目已有组件体系；
- Checkbox、Select、Dialog、Table 等遵循成熟交互模式；
- Hover、Focus、Selected、Disabled、Loading、Error 等状态必须清晰；
- Selected 状态不要默认使用强边框或 Input 式外观；
- 动效短促自然，只服务状态变化和空间变化；
- 危险操作必须与普通操作有明确区分，但不要用夸张视觉制造压力。

## 默认避免

除非产品定位明确需要，否则不要默认使用：

- 大面积灰色页面背景；
- 大面积渐变；
- 装饰性玻璃拟态、霓虹、强模糊；
- 超大 Hero 标题和营销页式留白；
- 每个区块都做 Card；
- 为了“统一”把所有 Card 和分区都拍平成 Row；
- 过深阴影和过多悬浮层；
- 蓝紫渐变式“AI 科技感”；
- 装饰性 3D、无意义插画；
- 为了高级感降低文字对比度或过度缩小字号；
- 把普通业务工具设计成 IDE，只因为产品功能复杂。

## 设计顺序

1. **先确定信息架构**：用户去哪里、当前主任务是什么、什么是选中对象、什么只是辅助信息；
2. **再确定区域职责**：Navigation、Toolbar、Canvas、Inspector、Auxiliary Panel 是否真的需要；
3. **再确定内容语法**：哪些是 Section、哪些是真正需要 Card、哪些应该是 Row；
4. **最后处理视觉细节**：间距、字重、边框、阴影、图标、材质和交互反馈。

## 自检

完成界面后检查：

- 是否存在两层页面标题；
- 是否把功能导航错误地做成了内容区 Tabs；
- Sidebar 收起后是否仍然清晰、居中、无多余二级内容；
- Toolbar 是否堆了没有必要的图标；
- Card 是否有明确语义，而不是为了装饰；
- Inspector 和 Output 是否只在需要时出现；
- 是否为了显示“专业”而暴露了过多复杂度；
- Overview、Performance 等不同页面是否使用同一种视觉语法，而不是同一种机械布局；
- 界面是否明亮、紧凑、清晰且可长时间使用。

**完成标志**：信息架构稳定，页面只有一个主工作区；导航、Toolbar、Card、Inspector 和辅助面板职责清楚；视觉语言统一，但不会为了统一牺牲场景本身需要的表达方式。

---

## License

本 skill 采用 MIT 协议，Copyright (c) 2026 StupidArthur。
