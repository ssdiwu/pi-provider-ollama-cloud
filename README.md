# pi-provider-ollama-cloud

直连 [Ollama Cloud](https://ollama.com)（`ollama.com`）的 [Pi](https://pi.dev) 自定义 provider 扩展。

## 这是什么

注册 `ollama-cloud` provider，不经本地 Ollama 服务，直连 Ollama 托管 API（`https://ollama.com/v1`）。通过 OpenAI 兼容的 Chat Completions 协议调用云端模型，并用 `/v1/models` + `/api/show` 动态发现支持工具调用的模型。

## 给谁用

有 Ollama Cloud API Key、希望在 Pi 中直接使用云端模型（无需本地 Ollama 服务）的开发者。

## 怎么运行

```bash
pi install npm:pi-provider-ollama-cloud
# 或本地开发
pi -e /Users/diwu/Workspace/Codes/Githubs/pi-provider-ollama-cloud
```

配置 API Key（任选其一）：

```bash
export OLLAMA_API_KEY=你的 Ollama Cloud API Key
# 或在 Pi 内 /login 后选择 ollama-cloud
```

随后用 `/model` 选择 `ollama-cloud` 下的模型，或：

```bash
pi --model ollama-cloud/glm-5.2
```

## 目录与入口

- `index.ts` — 扩展入口，注册 provider、认证、动态发现与兼容映射。
- `doc/` — 设计依据、能力边界与决策档案。
- `test/` — provider 注册、发现解析与兼容性行为测试。

## 验证

```bash
npm run check   # 类型检查
npm test        # 行为测试
pi --list-models | grep ollama-cloud
```
