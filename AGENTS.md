# AGENTS.md — pi-ollama-cloud-direct

## 项目一句话定位

直连 Ollama Cloud（`ollama.com`）的 Pi provider 扩展：注册 `ollama-cloud`，不经本地 Ollama 服务，用 OpenAI 兼容协议调用云端模型并动态发现支持工具调用的模型。

## 先读文档顺序

1. `README.md` — 是什么、怎么跑。
2. `doc/README.md` — 文档地图。
3. `doc/20-能力参考/Ollama-Cloud-接口事实.md` — 官方接口事实与边界。
4. `index.ts` — 当前实现。

## 代码边界与安全边界

- 只通过 Pi 的 credential store 或环境变量读取凭据，绝不写入仓库、日志或缓存。
- 只接 Ollama Cloud（`ollama.com`），不包含本地 Ollama，不承担其他 provider 逻辑。
- 动态发现只注册 `capabilities` 含 `tools` 的模型；不把 `completion`-only 模型塞进工具调用列表。
- 发现失败时保留上一份已知模型列表与离线基线，不清空、不崩溃。
- 不把远端返回的模型 ID 直接当作安全输入；构造请求前做最小校验。

## 验证方式

```bash
npm run check                              # 类型检查（tsc --noEmit）
npm test                                   # 行为测试
pi -e . --list-models | grep ollama-cloud
```

真实流式冒烟测试（需已配置 `OLLAMA_API_KEY`）：

```bash
pi -e . -p "用一句话回答 1+1" --model ollama-cloud/glm-5.2
```

## 项目特有禁忌

- 不硬编码 API Key。
- 不在本扩展内复制 Ollama 本地 API 语义；只对接云端 OpenAI 兼容接口。
- 不为尚未出现的第三个 provider 提前抽公共抽象。

## 代码工程纪律

- 删除测试判断模块价值：删掉某个抽象后复杂度消失即透传（删）；复杂度在多处重现即真减负（留）。
- 接缝纪律：只在真有变化处引入抽象；单一实现不提前抽接口。
- 函数粒度 100 行以内。
- 测试看行为不看实现；mock 只放系统边界。
- 先建反馈环再调 bug：临时 debug 日志打唯一前缀 tag（如 `[DEBUG-ocd-a4f2]`），清理时一个 grep 全删。
