# 0001 — Provider ID 沿用 ollama-cloud

## 状态

已采纳（2026-07）

## 上下文

Ollama Cloud 生态已有多个第三方扩展使用 `ollama-cloud` 作为 provider ID。本机 `auth.json` 已存有该 ID 下的 API Key，`models.json` 也有同名覆盖。

## 决策

本扩展的 provider ID 定为 `ollama-cloud`，baseUrl 为 `https://ollama.com/v1`，不经本地 Ollama 服务。

## 理由

1. 复用已有凭据，用户无需重新 `/login`。
2. 与 Ollama 官方文档与社区约定一致。
3. 包名用 `pi-provider-ollama-cloud` 与 npm 上已有的 `pi-ollama-cloud` 区分，但 provider ID 保持用户熟悉的 `ollama-cloud`。

## 后果

- 与其他同 ID 扩展同时安装时，后加载者覆盖前者的动态注册；用户应只启用一个。
- `models.json` 中的 `ollama-cloud` 条目继续作为覆盖层叠加在扩展之上。
- 本地 Ollama（`localhost:11434`）应由另一 provider（如 `ollama`）处理，本扩展不兼容本地。
