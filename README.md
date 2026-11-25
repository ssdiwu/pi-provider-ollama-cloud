# pi-provider-ollama-cloud

English · [简体中文](./README-zh.md)

A custom [Pi](https://pi.dev) provider extension that connects directly to [Ollama Cloud](https://ollama.com).

## What it is

Registers the `ollama-cloud` provider. It does not go through a local Ollama server; it connects directly to the Ollama hosted API (`https://ollama.com/v1`). Cloud models are called through the OpenAI-compatible Chat Completions protocol, and `/v1/models` + `/api/show` dynamically discover models that support tool calls.

## Who it is for

Developers with an Ollama Cloud API Key who want to use cloud models in Pi directly, without a local Ollama service.

## How to run

```bash
pi install npm:pi-provider-ollama-cloud
# or local development (this workspace path)
pi -e /Users/diwu/Workspace/Codes/Githubs/pi-extensions/pi-provider-ollama-cloud
# or, from the repository root
pi -e .
```

Configure the API key (either way):

```bash
export OLLAMA_API_KEY=your-ollama-cloud-api-key
# or choose ollama-cloud after /login inside Pi
```

Then pick a model under `ollama-cloud` with `/model`, or run:

```bash
pi --model ollama-cloud/glm-5.2
```

## Development, tests, and public contracts

- Development and contribution rules: [`AGENTS.md`](./AGENTS.md) and [`doc/README.md`](./doc/README.md).
- Tests: [`test/README.md`](./test/README.md) and [`test/provider.test.ts`](./test/provider.test.ts); behavior checks cover provider registration, discovery parsing, and compatibility mapping.
- Public contract: the current endpoint, authentication, discovery, and compatibility rules are in [`doc/规格/Ollama-Cloud-接口事实.md`](./doc/规格/Ollama-Cloud-接口事实.md) (Chinese); the implementation is [`index.ts`](./index.ts). Source links, probe records, and snapshots are in [`doc/references/`](./doc/references/) and are not current authority.

## Directories and entry points

- `index.ts` — extension entry: provider registration, authentication, dynamic discovery, and compatibility mapping.
- `doc/` — document map in [`doc/README.md`](./doc/README.md): current mechanism and protocol in `doc/规格/`, hard-to-reverse decisions in `doc/决策档案/`, sources and verification evidence in `doc/references/`.
- `test/` — provider registration, discovery parsing, and compatibility behavior tests.

## Verification

```bash
npm run check   # type-check
npm test        # behavior tests
pi --list-models | grep ollama-cloud
```
