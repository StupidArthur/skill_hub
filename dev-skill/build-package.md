# 构建与打包

> 流程阶段⑤。承接测试阶段，执行构建、打包、分发。本规范语言与平台无关，具体打包工具由选型 skill 决定。

## 产物隔离

- 跨平台编译产物必须严格放在各自独立的命名子目录中（如 `dist/windows/`、`dist/linux/`），禁止混合存放。
- 打包生成的中间产物和输出目录绝对不允许被 Git 追踪，必须写入 `.gitignore`。
- 多进程应用必须明确区分主程序、Worker、资源和配置产物。

## 无环境依赖分发

- 打包产物应尽量做到在无开发环境的目标系统上可直接运行（内置依赖）。
- GUI 工具打包时必须确保运行时不显示多余控制台窗口。
- Wails + Python Worker 架构不得要求用户预装 Python；Worker 必须随应用打包或通过正式安装器交付。

## 跨平台兼容

- CLI 工具和需跨平台运行的工具，必须同步考虑目标平台兼容性。
- 路径拼接使用各语言跨平台 API，禁止硬编码分隔符。
- Python Worker、动态库和原生依赖必须在对应目标平台分别构建。

## 具体打包规范

各技术栈的具体打包命令和规范由选型 skill 提供：

- GUI 工具（Wails）：见 [design/gui-tool/quality.md](design/gui-tool/quality.md)
- GUI Python Worker：见 [design/gui-tool/python-worker.md](design/gui-tool/python-worker.md)
- Python CLI（PyInstaller）：见 [design/cli-tool/python.md](design/cli-tool/python.md)
- Go CLI（go build）：见 [design/cli-tool/go.md](design/cli-tool/go.md)
