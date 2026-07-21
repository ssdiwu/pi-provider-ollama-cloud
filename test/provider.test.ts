import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  BASELINE_MODELS,
  PROVIDER_ID,
  API_BASE,
  discoverModels,
} from "../index.ts";

test("provider id and endpoint target Ollama Cloud directly", () => {
  assert.equal(PROVIDER_ID, "ollama-cloud");
  assert.equal(API_BASE, "https://ollama.com/v1");
  // Must not point at a local server.
  assert.ok(!API_BASE.includes("localhost"));
  assert.ok(!API_BASE.includes("127.0.0.1"));
});

test("baseline has the verified cloud models", () => {
  const ids = BASELINE_MODELS.map((m) => m.id);
  assert.ok(ids.includes("glm-5.2"));
  assert.ok(ids.includes("kimi-k2.7-code"));
  assert.ok(ids.includes("deepseek-v4-flash"));
  assert.ok(ids.includes("deepseek-v4-pro"));
});

function makeFetch(responses: Array<{ url: string; body: unknown; ok?: boolean }>) {
  const calls: Array<{ url: string; body?: unknown }> = [];
  const queue = [...responses];
  const f = async (url: string, init?: RequestInit) => {
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
    const next = queue.shift();
    if (!next) throw new Error(`unexpected fetch ${url}`);
    return {
      ok: next.ok ?? true,
      async json() {
        return next.body;
      },
    } as unknown as Response;
  };
  return { f, calls };
}

test("discoverModels registers only tool-capable models with vision detected", async () => {
  const { f, calls } = makeFetch([
    { url: "models", body: { data: [{ id: "glm-5.2" }, { id: "text-only" }, { id: "vision-model" }] } },
    { url: "show:glm-5.2", body: { capabilities: ["thinking", "completion", "tools"], model_info: { "glm5.2.context_length": 1000000 } } },
    { url: "show:text-only", body: { capabilities: ["completion"] } },
    { url: "show:vision-model", body: { capabilities: ["tools", "vision"], model_info: { "x.context_length": 200000 } } },
  ]);
  const models = await discoverModels("key", { fetch: f as unknown as typeof fetch });
  const ids = models.map((m) => m.id).sort();
  assert.deepEqual(ids, ["glm-5.2", "vision-model"]);
  const glm = models.find((m) => m.id === "glm-5.2")!;
  assert.equal(glm.contextWindow, 1000000);
  assert.equal(glm.reasoning, true);
  assert.deepEqual(glm.input.sort(), ["text"]);
  const vis = models.find((m) => m.id === "vision-model")!;
  assert.deepEqual(vis.input.sort(), ["image", "text"]);
  assert.equal(vis.reasoning, false);
  // show is POSTed per model.
  assert.equal(calls.filter((c) => c.url.endsWith("/api/show")).length, 3);
});

test("discoverModels returns empty on list failure (keeps baseline)", async () => {
  const { f } = makeFetch([{ url: "models", body: {}, ok: false }]);
  const models = await discoverModels("key", { fetch: f as unknown as typeof fetch });
  assert.equal(models.length, 0);
});
