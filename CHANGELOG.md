# Changelog

This project follows the basic format of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). For tagged releases, use the version from the Git tag. The tagged release is maintained by the release owner in this English `CHANGELOG.md`; daily user-perceivable changes are recorded in the Chinese `CHANGELOG-zh.md` in this repository. Both files contain user-perceivable facts only and ship in the npm package.

For new releases, use headings in the format `## [x.y.z] - YYYY-MM-DD`. When an entry can be linked unambiguously to a GitHub issue, append `(#xx)`. Historical entries keep their original heading format.

## [Unreleased]

## [0.0.4] - 2026-11-25

### Changed

- Supports Pi 1.6.0.

## [0.0.3] - 2026-07-31

### Fixed

- Unified the Pi `0.83` development dependency baseline, fixing TypeScript type-check failures caused by mixed dependency versions.

## [0.0.2] - 2026-07-22

### Changed

- Standardized the package name to `pi-provider-ollama-cloud` (the former name `pi-ollama-cloud-direct` is deprecated).

## [0.0.1] - 2026-07-22

### Added

- Registered the `ollama-cloud` provider, connecting directly to Ollama Cloud (`https://ollama.com/v1`) with no local Ollama service required.
- Resolves the API key through interactive `/login` input or the `$OLLAMA_API_KEY` environment variable.
- Ships a verified baseline model catalog, ready to use on first launch.
- Dynamic model discovery via `/v1/models` + `/api/show`: registers all cloud models that support tool calls (currently 18), automatically detects vision and thinking capabilities, and persists results through Pi's provider model store; falls back to 4 verified baseline models when offline.
- Provider-level OpenAI compatibility mapping: disables the `developer` role, `store`, and `strict`, and uses the `max_tokens` field.
