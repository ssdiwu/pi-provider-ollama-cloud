# Ollama Cloud 官方来源与本机验证（2026-07）

本文件保存 [doc/规格/Ollama-Cloud-接口事实.md](../规格/Ollama-Cloud-接口事实.md) 所依据的官方文档来源、本机探测记录与模型清单快照，是来源与验证证据，不是现行机制权威。核实日期为 2026-07。

## 官方来源

| 用途 | URL | 来源 |
|---|---|---|
| OpenAI 兼容 Chat Completions | `https://ollama.com/v1/chat/completions` | [OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility) |
| 模型列表 | `GET https://ollama.com/v1/models` | 同上（`/v1/models`） |
| 模型详情 | `POST https://ollama.com/api/show` | 本机探测验证（2026-07-21） |
| 认证 | `Authorization: Bearer $OLLAMA_API_KEY` | [Authentication](https://docs.ollama.com/api/authentication) |

- 云端访问必须用 API Key（`OLLAMA_API_KEY`），本地访问无需认证。来源：[Authentication](https://docs.ollama.com/api/authentication)。
- 计费：Ollama Cloud 采用订阅制（Free/Pro/Max），非按量 token 计费。来源：ollama.com/pricing。

## 本机探测（2026-07-21）

只读探测确认：

- `GET /v1/models` 返回 `{ object, data: [{ id, object, created, owned_by }] }`；不含能力或 context。
- `POST /api/show`（body `{ model }`）返回：
  - `capabilities: string[]`（如 `["thinking","completion","tools"]`）
  - `model_info: { "<prefix>.context_length": number }`
  - **不含** max output token 元数据。

由此得出的发现流程结论（`/v1/models` 取 ID → 逐个 `/api/show` 取能力与 context → 只注册含 `tools` 的模型，max output 保守上限 32768）已写入现行正文，本文件只保留探测依据。

## 模型清单快照（2026-07 时点）

`/v1/models` + `/api/show` 探测后，当时全部 18 个云端模型均具备 `tools` 能力，会被全部注册。这是该时点的快照，不是当前模型清单的权威来源。

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
