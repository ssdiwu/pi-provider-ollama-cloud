# Ollama Cloud 接口事实与实现约定

本文件是本扩展**现行机制与协议约定**的唯一正文：端点、认证、模型发现流程结论、协议兼容映射与离线首启基线。官方文档链接、本机探测记录、核实日期与模型清单快照等来源与验证证据在 [doc/references/ollama-cloud-official-sources-and-verification-2026-07.md](../references/ollama-cloud-official-sources-and-verification-2026-07.md)，本文件不重复维护证据。

## Endpoint

| 用途 | URL | 认证 |
|---|---|---|
| OpenAI 兼容 Chat Completions | `https://ollama.com/v1/chat/completions` | `Authorization: Bearer $OLLAMA_API_KEY` |
| 模型列表 | `GET https://ollama.com/v1/models` | 同上 |
| 模型详情 | `POST https://ollama.com/api/show` | 同上 |

**关键边界**：本扩展直连 `ollama.com`，不经本地 Ollama 服务（`localhost:11434`）。这是与 `ollama launch pi` 的核心差异。

## 认证

- 云端访问必须用 API Key（`OLLAMA_API_KEY`）；本地 Ollama 无需认证。
- 凭据只从 Pi credential store 或受支持的环境变量读取，不写仓库、日志、缓存或错误详情。

## 模型发现

发现流程（结论）：

1. `GET /v1/models` 取模型 ID 列表；返回体为 `{ object, data: [{ id, object, created, owned_by }] }`，不含能力或 context。
2. 逐个 `POST /api/show`（body `{ model }`）取能力与 context；返回 `capabilities: string[]`（如 `["thinking","completion","tools"]`）与 `model_info: { "<prefix>.context_length": number }`，**不含** max output token 元数据。
3. 只注册 `capabilities` 含 `tools` 的模型；max output 采用保守上限（32768）。

发现结果经 Pi 的 `ProviderModelsStore` 持久化，下次启动直接复用。发现失败时保留离线基线或上一份有效快照，不清空模型列表。

## 协议兼容

- OpenAI Chat Completions 兼容；支持 streaming、tool calling、vision（视模型）、`reasoning_effort`。
- `reasoning_effort` 取值：`high`/`medium`/`low`/`max`/`none`。
- provider 级兼容：`developer` 角色不被接受（`supportsDeveloperRole = false`）、不支持 `store`（`supportsStore = false`）、不支持 `strict` 工具模式（`supportsStrictMode = false`）、用 `max_tokens` 字段（`maxTokensField = "max_tokens"`）。

## 离线首启基线

保证首次启动、无网络时即可选模型：

| Model ID | Context | Max Output | Input |
|---|---|---|---|
| `glm-5.2` | 1000000 | 128000 | text |
| `kimi-k2.7-code` | 256000 | 65536 | text, image |
| `deepseek-v4-flash` | 1000000 | 384000 | text |
| `deepseek-v4-pro` | 1000000 | 384000 | text |

动态发现的模型 max output 统一保守设为 32768（`/api/show` 不返回该字段）；个人调优通过本机 `models.json` 覆盖层保留，基线模型使用实测更高值。

## 计费

Ollama Cloud 采用订阅制，非按量 token 计费，模型 `cost` 登记为 0；Pi 的 `/cost` 仅作占位。计费背景与来源见 references 文件。
