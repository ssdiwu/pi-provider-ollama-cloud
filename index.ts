/**
 * pi-ollama-cloud-direct
 *
 * Registers the `ollama-cloud` provider connecting directly to Ollama Cloud
 * (https://ollama.com/v1) without a local Ollama server. Uses OpenAI-compatible
 * Chat Completions. Dynamically discovers tool-capable models via
 * /v1/models + /api/show and persists them through the provider model store.
 *
 * Auth: `/login` prompts for the Ollama Cloud API key, or resolve from
 * $OLLAMA_API_KEY. models.json stays the override layer.
 */
import {
  createProvider,
  type ApiKeyCredential,
  type AuthInteraction,
  type Model,
  type RefreshModelsContext,
} from "@earendil-works/pi-ai";
import { openAICompletionsApi } from "@earendil-works/pi-ai/compat";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export const PROVIDER_ID = "ollama-cloud";
export const PROVIDER_NAME = "Ollama Cloud";
export const BASE_URL = "https://ollama.com";
export const API_BASE = `${BASE_URL}/v1`;

type ModelInput = ("text" | "image")[];

const TEXT_ONLY: ModelInput = ["text"];
const TEXT_AND_IMAGE: ModelInput = ["text", "image"];

const ZERO_COST = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } as const;

// Ollama Cloud's OpenAI-compatible endpoint rejects the `developer` role,
// `store`, and `strict` tool mode, and uses `max_tokens`.
const PROVIDER_COMPAT = {
  supportsDeveloperRole: false,
  supportsStore: false,
  supportsStrictMode: false,
  maxTokensField: "max_tokens" as const,
};

const MAX_TOKENS_DEFAULT = 32768;

// Thinking models: expose standard levels; hide `minimal` (duplicate of low).
// xhigh maps to provider "max".
const DEFAULT_TLM = { minimal: null, xhigh: "max" } as const;

interface BaselineModel {
  id: string;
  name: string;
  input: ModelInput;
  contextWindow: number;
  maxTokens: number;
}

// Verified baseline (see doc/20-能力参考). Serves as the offline first-launch
// fallback before dynamic discovery completes.
export const BASELINE_MODELS: readonly BaselineModel[] = [
  { id: "glm-5.2", name: "GLM-5.2 (Ollama Cloud)", input: TEXT_ONLY, contextWindow: 1_000_000, maxTokens: 128_000 },
  { id: "kimi-k2.7-code", name: "Kimi K2.7 Code (Ollama Cloud)", input: TEXT_AND_IMAGE, contextWindow: 256_000, maxTokens: 65_536 },
  { id: "deepseek-v4-flash", name: "DeepSeek V4 Flash (Ollama Cloud)", input: TEXT_ONLY, contextWindow: 1_000_000, maxTokens: 384_000 },
  { id: "deepseek-v4-pro", name: "DeepSeek V4 Pro (Ollama Cloud)", input: TEXT_ONLY, contextWindow: 1_000_000, maxTokens: 384_000 },
];

function buildModel(m: BaselineModel): Model<"openai-completions"> {
  return {
    id: m.id,
    name: m.name,
    api: "openai-completions",
    provider: PROVIDER_ID,
    baseUrl: API_BASE,
    reasoning: true,
    thinkingLevelMap: { ...DEFAULT_TLM },
    input: [...m.input],
    cost: { ...ZERO_COST },
    contextWindow: m.contextWindow,
    maxTokens: m.maxTokens,
    compat: { ...PROVIDER_COMPAT },
  };
}

// --- Dynamic discovery ------------------------------------------------------

interface ModelsListResponse {
  data?: Array<{ id?: string }>;
}
interface ShowResponse {
  capabilities?: string[];
  model_info?: Record<string, unknown>;
}

function contextLengthFromInfo(modelInfo: Record<string, unknown> | undefined): number | undefined {
  if (!modelInfo) return undefined;
  for (const [key, value] of Object.entries(modelInfo)) {
    if (key.endsWith(".context_length") && typeof value === "number") return value;
  }
  return undefined;
}

function apiKeyFromCredential(credential: RefreshModelsContext["credential"]): string | undefined {
  if (credential?.type === "api_key") return credential.key;
  return undefined;
}

/**
 * Fetch tool-capable models from Ollama Cloud. Exported for testing.
 * Returns an empty list on failure so the provider keeps its baseline.
 */
export async function discoverModels(
  apiKey: string,
  init?: { fetch?: typeof fetch; signal?: AbortSignal },
): Promise<Model<"openai-completions">[]> {
  const fetchFn = init?.fetch ?? fetch;
  const signal = init?.signal;
  const auth = { Authorization: `Bearer ${apiKey}` };

  const listRes = await fetchFn(`${API_BASE}/models`, { headers: auth, signal });
  if (!listRes.ok) return [];
  const list = (await listRes.json()) as ModelsListResponse;
  const ids = (list.data ?? []).map((m) => m.id).filter((id): id is string => typeof id === "string" && id.length > 0);

  const models: Model<"openai-completions">[] = [];
  // Detail fetches are bounded by the list size; failures fall back to baseline.
  await Promise.all(
    ids.map(async (id) => {
      try {
        const showRes = await fetchFn(`${BASE_URL}/api/show`, {
          method: "POST",
          headers: { ...auth, "Content-Type": "application/json" },
          body: JSON.stringify({ model: id }),
          signal,
        });
        if (!showRes.ok) return;
        const show = (await showRes.json()) as ShowResponse;
        const caps = show.capabilities ?? [];
        if (!caps.includes("tools")) return; // only register tool-capable models
        const contextWindow = contextLengthFromInfo(show.model_info) ?? 128_000;
        const input: ModelInput = caps.includes("vision") ? [...TEXT_AND_IMAGE] : [...TEXT_ONLY];
        models.push({
          id,
          name: id,
          api: "openai-completions",
          provider: PROVIDER_ID,
          baseUrl: API_BASE,
          reasoning: caps.includes("thinking"),
          thinkingLevelMap: caps.includes("thinking") ? { ...DEFAULT_TLM } : undefined,
          input,
          cost: { ...ZERO_COST },
          contextWindow,
          maxTokens: MAX_TOKENS_DEFAULT, // /api/show does not expose max output
          compat: { ...PROVIDER_COMPAT },
        });
      } catch {
        // Per-model failure: skip, keep others.
      }
    }),
  );
  return models;
}

async function login(interaction: AuthInteraction): Promise<ApiKeyCredential> {
  const key = await interaction.prompt({
    type: "secret",
    message: "Ollama Cloud API Key (OLLAMA_API_KEY):",
    placeholder: "ollama-...",
  });
  return { type: "api_key", key: key || undefined };
}

async function fetchModels(
  context: RefreshModelsContext,
): Promise<readonly Model<"openai-completions">[]> {
  if (!context.allowNetwork) return [];
  const key = apiKeyFromCredential(context.credential);
  if (!key) return [];
  try {
    const discovered = await discoverModels(key, { signal: context.signal });
    return discovered;
  } catch {
    return []; // keep baseline on failure
  }
}

export default function ollamaCloudDirect(pi: ExtensionAPI): void {
  const provider = createProvider<"openai-completions">({
    id: PROVIDER_ID,
    name: PROVIDER_NAME,
    baseUrl: API_BASE,
    auth: {
      apiKey: {
        name: "Ollama Cloud API key",
        login,
        async resolve({ ctx, credential }) {
          const key = credential?.key ?? (await ctx.env("OLLAMA_API_KEY"));
          if (!key) return undefined;
          return {
            auth: { apiKey: key },
            source: credential?.key ? "stored API key" : "OLLAMA_API_KEY",
          };
        },
      },
    },
    models: BASELINE_MODELS.map(buildModel),
    fetchModels,
    api: openAICompletionsApi(),
  });

  pi.registerProvider(provider);
}

// Ensure ApiKeyCredential is referenced for type export surface.
export type { ApiKeyCredential };
