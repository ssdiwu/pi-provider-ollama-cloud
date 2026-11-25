# pi-provider-ollama-cloud

[English](./README.md) · 简体中文

直连 [Ollama Cloud](https://ollama.com)（`ollama.com`）的 [Pi](https://pi.dev) 自定义 provider 扩展。

## 这是什么

注册 `ollama-cloud` provider，不经本地 Ollama 服务，直连 Ollama 托管 API（`https://ollama.com/v1`）。通过 OpenAI 兼容的 Chat Completions 协议调用云端模型，并用 `/v1/models` + `/api/show` 动态发现支持工具调用的模型。

## 给谁用

有 Ollama Cloud API Key、希望在 Pi 中直接使用云端模型（无需本地 Ollama 服务）的开发者。

## 怎么运行

```bash
pi install npm:pi-provider-ollama-cloud
# 或本地开发
pi -e /Users/diwu/Workspace/Codes/Githubs/pi-extensions/pi-provider-ollama-cloud
# 或在仓库根目录本地加载
pi -e .
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

## 开发、测试与公开契约入口

- 开发与贡献规则：[`AGENTS.md`](./AGENTS.md) 与 [`doc/README.md`](./doc/README.md)。
- 测试：[`test/README.md`](./test/README.md) 与 [`test/provider.test.ts`](./test/provider.test.ts)；覆盖 provider 注册、发现解析与兼容性映射。
- 公开契约：现行端点、鉴权、发现与兼容规则见 [`doc/规格/Ollama-Cloud-接口事实.md`](./doc/规格/Ollama-Cloud-接口事实.md)（中文），实现见 [`index.ts`](./index.ts)。来源链接、探测记录与时点快照在 [`doc/references/`](./doc/references/)，不是现行权威。

## 目录与入口

- `index.ts` — 扩展入口，注册 provider、认证、动态发现与兼容映射。
- `doc/` — 文档入口见 [`doc/README.md`](./doc/README.md)：现行机制与协议正文在 `doc/规格/`，难逆转决策在 `doc/决策档案/`，来源与验证证据在 `doc/references/`。
- `test/` — provider 注册、发现解析与兼容性行为测试。

## 验证

```bash
npm run check   # 类型检查
npm test        # 行为测试
pi --list-models | grep ollama-cloud
```
