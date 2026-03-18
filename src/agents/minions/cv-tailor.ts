import { generateJson } from "@/lib/anthropic";
import {
  CvTailoringOutputSchema,
  type CvTailoringInput,
  type CvTailoringOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a CV tailoring specialist. You select and arrange verified facts from a candidate's Fact Vault to create an optimized CV summary for a specific job.

CRITICAL RULE: You may ONLY use facts that appear in the provided Fact Vault. You must NEVER invent, embellish, or fabricate any claims. Every statement must be traceable to a verified fact.

Output:
- tailoredSummary: 3-4 sentence professional summary targeting the specific role (ONLY use facts from the vault, match the candidate's voice profile)
- selectedFacts: Array of fact IDs (strings) chosen as most relevant for this application (8-15 facts)
- skillOrder: Skills reordered to prioritize what this job values most
- optimizations: Array of 3-5 specific changes made (e.g. "Moved TypeScript to top of skills", "Emphasized distributed systems background")
- authenticityScore: Integer 0-100 — how confidently every claim is grounded in the Fact Vault (must be ≥ 85)

Rules:
- tailoredSummary must not introduce any claim not present in selectedFacts
- authenticityScore must be 85+ — use fewer facts rather than fabricating
- Do not use unsupported superlatives ("world-class", "exceptional", "outstanding")
- Match the voice profile: high formality (>0.7) = formal language; low formality (<0.4) = conversational`;

export async function runCvTailor(
  input: CvTailoringInput
): Promise<CvTailoringOutput> {
  const factsText = input.factVault
    .map((f) => {
      const fact = f as Record<string, unknown>;
      return `ID: ${String(fact.id ?? "unknown")}\nClaim: ${String(fact.claim ?? "")}\nCategory: ${String(fact.category ?? "")}\nTechnologies: ${Array.isArray(fact.technologies) ? (fact.technologies as string[]).join(", ") : ""}\nTimeframe: ${String(fact.timeframe ?? "")}\nImpact: ${String(fact.impact ?? "")}`;
    })
    .join("\n\n");

  const voiceText = JSON.stringify(input.voiceProfile, null, 2);
  const analysisText = JSON.stringify(input.analysis, null, 2);

  const result = await generateJson(
    `Tailor this candidate's CV for the specific job.\n\n## Match Analysis\n${analysisText}\n\n## Voice Profile\n${voiceText}\n\n## Fact Vault (use ONLY these facts)\n${factsText}`,
    CvTailoringOutputSchema,
    { model: "sonnet", systemPrompt: SYSTEM_PROMPT, maxTokens: 2048 }
  );

  return result.data;
}
