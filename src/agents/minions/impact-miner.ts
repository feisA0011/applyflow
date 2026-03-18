import { generateJson, type AiResult } from "@/lib/anthropic";
import {
  ImpactMinerInputSchema,
  ImpactMinerOutputSchema,
  type ImpactMinerInput,
  type ImpactMinerOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert career coach helping candidates quantify their professional achievements. Given a vague or unquantified fact from someone's CV, generate 2-3 targeted follow-up questions to help them add measurable impact.

Rules:
1. Be specific — questions must be directly relevant to the exact claim. No generic questions.
2. Focus on numbers — ask about size, scale, speed, cost, users, revenue, percentage improvements, team size, time saved, etc.
3. Be conversational — questions should feel like a helpful coach asking, not an interrogator.
4. Generate exactly 2 or 3 questions. No more, no less.
5. Return the factId field unchanged — echo it back exactly as provided.

Output ONLY a valid JSON object — no preamble, no markdown:
{
  "factId": "the-exact-fact-id",
  "questions": ["Question one?", "Question two?", "Optional question three?"]
}`;

export async function runImpactMiner(
  input: ImpactMinerInput
): Promise<AiResult<ImpactMinerOutput>> {
  const validated = ImpactMinerInputSchema.parse(input);

  const context = validated.context
    ? `\nContext: ${validated.context}`
    : "";

  const prompt = `Generate follow-up questions to quantify this CV fact:

Fact ID: ${validated.factId}
Claim: "${validated.claim}"
Category: ${validated.category}${context}

Return questions that will help the candidate add specific, measurable impact to this claim.`;

  return generateJson(prompt, ImpactMinerOutputSchema, {
    model: "haiku",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 512,
  });
}
