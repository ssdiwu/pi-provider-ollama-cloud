# Ollama Cloud 接口事实

本文件记录实现 `ollama-cloud` provider 所依据的官方事实与边界。所有结论标注来源与核实日期（2026-07）。

## Endpoint

| 用途 | URL | 来源 |
|---|---|---|
| OpenAI 兼容 Chat Completions | `https://ollama.com/v1/chat/completions` | [OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility) |
| 模型列表 | `GET https://ollama.com/v1/models` | 同上（`/v1/models`） |
| 模型详情 | `POST https://ollama.com/api/show` | 本机探测验证（2026-07-21） |
| 认证 | `Authorization: Bearer $OLLAMA_API_KEY` | [Authentication](https://docs.ollama.com/api/authentication) |

**关键边界**：本扩展直连 `ollama.com`，不经本地 Ollama 服务（`localhost:11434`）。这是与 `ollama launch pi` 的核心差异。

## 认证

- 云端访问必须用 API Key（`OLLAMA_API_KEY`），本地访问无需认证。
- 来源：[Authentication](https://docs.ollama.com/api/authentication)。

## 模型发现

本机只读探测（2026-07-21）确认：

- `GET /v1/models` 返回 `{ object, data: [{ id, object, created, owned_by }] }`；不含能力或 context。
- `POST /api/show`（body `{ model }`）返回：
  - `capabilities: string[]`（如 `["thinking","completion","tools"]`）
  - `model_info: { "<prefix>.context_length": number }`
  - **不含** max output token 元数据。

**结论**：动态发现流程为 `/v1/models` 取 ID 列表 → 逐个 `/api/show` 取能力与 context → 只注册 `capabilities` 含 `tools` 的模型；max output 采用保守上限（32768）。

## 协议兼容

- OpenAI Chat Completions 兼容；支持 streaming、tool calling、vision（视模型）、`reasoning_effort`。
- `reasoning_effort` 取值：`high`/`medium`/`low`/`max`/`none`。
- provider 级兼容：`developer` 角色不被接受（`supportsDeveloperRole = false`）、不支持 `store`（`supportsStore = false`）、不支持 `strict` 工具模式（`supportsStrictMode = false`）、用 `max_tokens` 字段（`maxTokensField = "max_tokens"`）。

## 模型目录

### 离线首启基线

保证首次启动、无网络时即可选模型。这 4 个同时也是本机 `~/.pi/agent/models.json` 已通过真实调用验证的模型：

| Model ID | Context | Max Output | Input |
|---|---|---|---|
| `glm-5.2` | 1000000 | 128000 | text |
| `kimi-k2.7-code` | 256000 | 65536 | text, image |
| `deepseek-v4-flash` | 1000000 | 384000 | text |
| `deepseek-v4-pro` | 1000000 | 384000 | text |

### 动态发现全集（首网后覆盖基线）

`/v1/models` + `/api/show` 探测后，当前全部 18 个云端模型均具备 `tools` 能力（均可在 Pi 中使用工具调用），会被全部注册。发现结果经 Pi 的 `ProviderModelsStore` 持久化，下次启动直接复用。

| Model ID | Context | Thinking | Vision |
|---|---|---|---|
| `glm-5.1` | 202752 | yes | no |
| `glm-5.2` | 1000000 | yes | no |
| `kimi-k2.5` | 262144 | yes | yes |
| `kimi-k2.6` | 262144 | yes | yes |
| `kimi-k2.7-code` | 262144 | yes | yes |
| `gpt-oss:120b` | 131072 | yes | no |
| `gpt-oss:20b` | 131072 | yes | no |
| `minimax-m2.5` | 196608 | yes | no |
| `minimax-m2.7` | 196608 | yes | no |
| `minimax-m3` | 524288 | yes | yes |
| `qwen3.5:397b` | 262144 | yes | yes |
| `deepseek-v4-flash` | 1048576 | yes | no |
| `deepseek-v4-pro` | 524288 | yes | no |
| `nemotron-3-nano:30b` | 262144 | yes | no |
| `nemotron-3-super` | 262144 | yes | no |
| `nemotron-3-ultra` | 262144 | yes | no |
| `mistral-large-3:675b` | 262144 | no | yes |
| `gemma4:31b` | 262144 | yes | yes |

> Max output 对动态发现的模型统一保守设为 32768（`/api/show` 不返回该字段）。个人调优通过本机 `models.json` 覆盖层保留。基线模型使用实测更高值。

## 计费

## 计费

Ollama Cloud 采用订阅制（Free/Pro/Max），非按量 token 计费。模型 `cost` 登记为 0；Pi 的 `/cost` 仅作占位。来源：ollama.com/pricing。
