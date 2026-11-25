# pi-provider-ollama-cloud — Agent 规范

## 文件职责与阅读顺序

- 本文件只记录 provider 长期工程、安全和验证边界，不固定当前远端模型清单。
- 修改前读取 `README.md` / `README-zh.md`、`doc/README.md`、`doc/规格/Ollama-Cloud-接口事实.md`、`package.json`、`index.ts` 和测试。
- `doc/规格/` 是现行机制与协议约定的唯一正文；`doc/references/` 只保存官方来源、探测记录与时点快照，不作为现行权威。`doc/决策档案/` 收难逆转决策，`doc/经验笔记.md` 收可改做法。本机原始现场放 `.artifacts/`（Git 忽略）。

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

## 文档语言与发布记录

- 对外 README 以英文 `README.md` 为默认入口，配套完整中文 `README-zh.md`；顶部互链，安装、配置、命令、开发、测试与公开契约入口同步到两种语言，链接只指向仓库内真实文件。
- `doc/README.md` 顶部保留简短英文贡献导航，中文导航正文继续维护；公开贡献说明（两份 README 与 `doc/README.md`）同步更新。`AGENTS.md`、ADR、规格与历史材料按主要读者决定语言，内部资料可中文；工具名、命令、配置键、环境变量和 API 字段保持原样。
- 两份变更日志都在本 GitHub 仓库维护：`CHANGELOG.md` 是英文发布记录，`CHANGELOG-zh.md` 是中文日常记录；两份只写用户可感知事实，不写验证日志、内部过程或纯文档整理。
- 日常用中文把已完成的用户可感知变化写入 `CHANGELOG-zh.md`；准备发布（release）时按版本把同一版本的用户可感知条目同步进英文 `CHANGELOG.md`，两份都保留该版本记录，并核对版本、日期与 issue 链接。
- `README.md` 是英文默认版（npm 默认展示），`README-zh.md` 是同包附带的中文版；两份 README 与两份 changelog 都随 npm 包发布。发布前用 `npm pack --dry-run --ignore-scripts --json` 核对清单包含 `README.md`、`README-zh.md`、`CHANGELOG.md`、`CHANGELOG-zh.md`。

## 文档与 Git

- provider ID、鉴权、发现策略、请求协议或安装方式变化时同步英文 `README.md`、中文 `README-zh.md` 与规格正文。
- 未经用户明确要求，不执行 commit、push、tag 或 npm publish。
