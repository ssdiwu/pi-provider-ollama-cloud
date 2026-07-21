## [0.0.2] - 2026-07-22

### Changed

- 包名统一为 `pi-provider-ollama-cloud`（旧名 `pi-ollama-cloud-direct` 已废弃）。

## [0.0.1] - 2026-07-22

### Added

- 注册 `ollama-cloud` provider，直连 Ollama Cloud（`https://ollama.com/v1`），无需本地 Ollama 服务。
- 通过 `/login` 交互式录入或 `$OLLAMA_API_KEY` 环境变量解析 API Key。
- 内置已验证的基线模型目录，首次启动即可用。
- 动态模型发现：`/v1/models` + `/api/show`，注册全部支持工具调用的云端模型（当前 18 个），自动识别 vision 与 thinking 能力，结果经 Pi 的 provider 模型存储持久化；离线时回退到 4 个已验证基线模型。
- provider 级 OpenAI 兼容映射：关闭 `developer` 角色、`store`、`strict`，使用 `max_tokens` 字段。

# Changelog

本文件记录每个版本对使用者可感知的变更。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本以 Git tag 为准。

## [Unreleased]

### Added

- 注册 `ollama-cloud` provider，直连 Ollama Cloud（`https://ollama.com/v1`），无需本地 Ollama 服务。
- 通过 `/login` 交互式录入或 `$OLLAMA_API_KEY` 环境变量解析 API Key。
- 内置已验证的基线模型目录，首次启动即可用。
- 动态模型发现：`/v1/models` + `/api/show`，注册全部支持工具调用的云端模型（当前 18 个），自动识别 vision 与 thinking 能力，结果经 Pi 的 provider 模型存储持久化；离线时回退到 4 个已验证基线模型。
- provider 级 OpenAI 兼容映射：关闭 `developer` 角色、`store`、`strict`，使用 `max_tokens` 字段。
