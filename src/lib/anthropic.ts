import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined;
};

export const anthropic =
  globalForAnthropic.anthropic ??
  new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

if (process.env.NODE_ENV !== "production")
  globalForAnthropic.anthropic = anthropic;

// ── Model IDs ─────────────────────────────────────────────────────────────────

const MODELS = {
  sonnet: "claude-sonnet-4-6",
  haiku: "claude-haiku-4-5-20251001",
} as const;

type ModelKey = keyof typeof MODELS;
type ModelId = (typeof MODELS)[ModelKey];

// ── Pricing per million tokens (USD) ─────────────────────────────────────────

const PRICING: Record<ModelId, { in: number; out: number }> = {
  "claude-sonnet-4-6": { in: 3.0, out: 15.0 },
  "claude-haiku-4-5-20251001": { in: 0.8, out: 4.0 },
};

function calcCost(model: ModelId, tokensIn: number, tokensOut: number): number {
  const p = PRICING[model];
  return (tokensIn / 1_000_000) * p.in + (tokensOut / 1_000_000) * p.out;
}

// ── Return wrapper ────────────────────────────────────────────────────────────

export interface AiResult<T> {
  data: T;
  tokensIn: number;
  tokensOut: number;
  model: string;
  costUsd: number;
}

// ── Options ───────────────────────────────────────────────────────────────────

export interface GenerateOptions {
  model?: ModelKey;
  systemPrompt?: string;
  maxTokens?: number;
}

// ── Core call helper ──────────────────────────────────────────────────────────

async function callClaude(
  prompt: string,
  systemPrompt: string,
  modelId: ModelId,
  maxTokens: number
): Promise<{ text: string; tokensIn: number; tokensOut: number }> {
  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content.find(
    (b): b is Anthropic.TextBlock => b.type === "text"
  );
  if (!block) throw new Error("No text block in Claude response");

  return {
    text: block.text,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
  };
}

// ── generateJson ──────────────────────────────────────────────────────────────
// Calls Claude, parses JSON response, validates with Zod.
// Retries once on any failure (JSON parse or Zod validation).

export async function generateJson<T>(
  prompt: string,
  schema: z.ZodType<T>,
  options: GenerateOptions = {}
): Promise<AiResult<T>> {
  const modelKey = options.model ?? "sonnet";
  const modelId = MODELS[modelKey];
  const maxTokens = options.maxTokens ?? 4096;

  const systemPrompt =
    (options.systemPrompt ?? "You are a helpful AI assistant.") +
    "\n\nRESPONSE FORMAT: Output ONLY valid JSON. No markdown fences, no code blocks, no explanation. Just the raw JSON object.";

  async function attempt(): Promise<{ data: T; tokensIn: number; tokensOut: number }> {
    const raw = await callClaude(prompt, systemPrompt, modelId, maxTokens);
    // Strip markdown fences if Claude emits them despite instructions
    const text = raw.text
      .trim()
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
    const parsed: unknown = JSON.parse(text);
    return {
      data: schema.parse(parsed),
      tokensIn: raw.tokensIn,
      tokensOut: raw.tokensOut,
    };
  }

  let result: { data: T; tokensIn: number; tokensOut: number };

  try {
    result = await attempt();
  } catch {
    // Retry once on any failure
    result = await attempt();
  }

  return {
    data: result.data,
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
    model: modelId,
    costUsd: calcCost(modelId, result.tokensIn, result.tokensOut),
  };
}

// ── generateText ──────────────────────────────────────────────────────────────

export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<AiResult<string>> {
  const modelKey = options.model ?? "sonnet";
  const modelId = MODELS[modelKey];
  const maxTokens = options.maxTokens ?? 4096;
  const systemPrompt = options.systemPrompt ?? "You are a helpful AI assistant.";

  const raw = await callClaude(prompt, systemPrompt, modelId, maxTokens);

  return {
    data: raw.text,
    tokensIn: raw.tokensIn,
    tokensOut: raw.tokensOut,
    model: modelId,
    costUsd: calcCost(modelId, raw.tokensIn, raw.tokensOut),
  };
}
