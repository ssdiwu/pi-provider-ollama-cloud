# pi-provider-ollama-cloud 文档入口

> **English contribution guide:** [README.md](../README.md) (usage) · [README-zh.md](../README-zh.md) (Chinese companion) · [AGENTS.md](../AGENTS.md) (engineering rules). Keep both READMEs and this map in sync; user-visible release notes go to `CHANGELOG.md`.

1. [用户说明](../README.md) / [中文用户说明](../README-zh.md) — 是什么、给谁用、怎么运行、验证命令，两种语言同步。
2. [规格正文](./规格/Ollama-Cloud-接口事实.md) — 端点、认证、模型发现、协议兼容映射与离线首启基线的唯一正文。
3. [决策档案](./决策档案/README.md) — 难逆转决策的索引。
4. [经验笔记](./经验笔记.md) — 可改做法与避坑经验。
5. [证据与历史](./references/) — 官方来源、本机探测记录与模型清单快照，不是现行权威。
6. [代理协作规则](../AGENTS.md)。

当前实现以 `index.ts` 为准；本文件只做导航，不裁定权威。

根目录无 `PLAN.md`：本仓库当前没有单独的执行状态文件。

本机原始现场（探测原始输出、抓包、原始日志）放仓库根 `.artifacts/`，已被 Git 忽略；引用它不表示文件随仓库分发。

## 规格正文（`doc/规格/`）

| 文件 | 回答什么 |
|---|---|
| [Ollama-Cloud-接口事实.md](./规格/Ollama-Cloud-接口事实.md) | 直连端点、认证、发现流程结论、协议兼容映射、离线首启基线与计费约定 |

## 决策与经验

- [决策档案/README.md](./决策档案/README.md)：ADR 索引。修订以「后记」追加，不改写原文。
- [经验笔记.md](./经验笔记.md)：可改的做法与避坑经验。

## 证据与历史（`doc/references/`）

只保存来源、验证记录与历史快照，不维护第二份现行正文：

| 文件 | 内容 |
|---|---|
| [ollama-cloud-official-sources-and-verification-2026-07.md](./references/ollama-cloud-official-sources-and-verification-2026-07.md) | 官方文档链接、2026-07-21 本机 `/api/show` 探测记录、核实日期与 2026-07 时点 18 个模型清单快照 |

## 维护规则

- 机制或协议约定变化 → 更新 `doc/规格/` 对应正文；难逆转决策 → 新增 ADR 并同步索引；可复用做法 → 追加 `经验笔记.md`。
- 来源、探测记录与时点快照 → 追加 `doc/references/`，不回写进现行正文。
- 日常事实先写入本仓中文 `CHANGELOG-zh.md`；准备发布时按版本把用户可感知的已完成变化同步到英文 `CHANGELOG.md`；两份 changelog 都随 npm 包发布。本机原始现场 → `.artifacts/`（Git 忽略）。
