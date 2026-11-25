# 变更日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) 的基本格式。带 tag 的发布以 Git tag 为版本号；已发布版本由发布负责人负责维护英文 `CHANGELOG.md`，本文件是对应版本的中文镜像。两份日志只记录用户可感知事实，日常用中文记录，准备发布（release）时按版本同步到英文，并都随 npm 包发布。

新发布使用 `## [x.y.z] - YYYY-MM-DD` 格式的标题；条目可唯一对应 GitHub issue 时，在末尾附 `(#xx)`。历史条目保留原有标题格式。

## [Unreleased]

## [0.0.4] - 2026-11-25

### Changed

- 支持 Pi 1.6.0。

## [0.0.3] - 2026-07-31

### Fixed

- 统一 Pi `0.83` 开发依赖基线，修复混合依赖版本导致的 TypeScript 类型检查失败。

## [0.0.2] - 2026-07-22

### Changed

- 包名统一为 `pi-provider-ollama-cloud`（旧名 `pi-ollama-cloud-direct` 已弃用）。

## [0.0.1] - 2026-07-22

### Added

- 注册 `ollama-cloud` provider（提供商），直接连接 Ollama Cloud（`https://ollama.com/v1`），无需本地 Ollama 服务。
- 通过交互式 `/login` 输入或环境变量 `$OLLAMA_API_KEY` 解析 API Key。
- 随包提供经过验证的基线模型目录，首次启动即可使用。
- 通过 `/v1/models` + `/api/show` 动态发现模型：注册全部支持工具调用的云端模型（目前 18 个），自动识别视觉与思考能力，并通过 Pi 的 provider 模型存储持久化结果；离线时回退到 4 个已验证的基线模型。
- provider 级 OpenAI 兼容性映射：禁用 `developer` 角色、`store` 与 `strict`，并使用 `max_tokens` 字段。
