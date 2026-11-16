# pi-provider-ollama-cloud — Agent 规范

## 文件职责与阅读顺序

- 本文件只记录 provider 长期工程、安全和验证边界，不固定当前远端模型清单。
- 修改前读取 `README.md`、`doc/README.md`、`doc/20-能力参考/Ollama-Cloud-接口事实.md`、`package.json`、`index.ts` 和测试。
- `doc/20-能力参考/` 是现行机制与协议约定的唯一正文；`doc/references/` 只保存官方来源、探测记录与时点快照，不作为现行权威。`doc/决策档案/` 收难逆转决策，`doc/经验笔记.md` 收可改做法。本机原始现场放 `.artifacts/`（Git 忽略）。

## 项目边界

- 本扩展注册 `ollama-cloud`，直连 `ollama.com` 的云端 OpenAI 兼容接口；不代理本地 Ollama，也不承担其他 provider。
- 凭据只从 Pi credential store 或受支持的环境变量读取，不写仓库、日志、缓存或错误详情。
- 远端模型 ID、capabilities 和响应均是不可信输入；校验后只注册满足当前工具调用契约的模型。
- 动态发现失败时保持可用离线基线或上一份有效快照，不清空模型列表、不让扩展崩溃。
- 不把某个模型名写成永久 smoke 目标；真实验证从当前发现结果中选择兼容模型。
- 优先复用 Pi provider API 和现有实现，只有稳定重复或明确契约时才抽象。

## 验证

```bash
npm run check
npm test
pi -e . --list-models | grep ollama-cloud
```

- 凭据、发现或流式协议改动还需使用授权 Key，从当前模型列表选择支持工具的模型做最小真实请求。
- 未配置凭据或网络受限时明确说明只完成本地测试，不把离线基线当作云端可用性证明。

## 文档与 Git

- provider ID、鉴权、发现策略、请求协议或安装方式变化时同步 README 与能力参考。
- 未经用户明确要求，不执行 commit、push、tag 或 npm publish。
