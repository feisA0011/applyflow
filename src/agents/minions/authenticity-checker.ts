import { generateJson } from "@/lib/anthropic";
import {
  AuthenticityCheckOutputSchema,
  type AuthenticityCheckInput,
  type AuthenticityCheckOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a document authenticity auditor. You analyze a tailored job application document to verify it sounds authentically human-written and matches the candidate's established voice profile.

Output (all integers 0-100 except keywordDensity):
- authenticityScore: How authentic and genuine the document feels (90+ = very human, 70-89 = mostly human, <70 = feels AI-generated)
- aiDetectionScore: Estimated probability (0-100) that AI detection tools would flag this (target: keep below 30)
- voiceMatchScore: How closely the document matches the provided voice profile (100 = perfect match)
- keywordDensity: Keyword density as a decimal 0.0-1.0 (0.02-0.04 is ideal; above 0.06 is keyword-stuffed)
- passed: true if authenticityScore ≥ 80 AND aiDetectionScore ≤ 40 AND voiceMatchScore ≥ 70

Scoring guidelines:
- Deduct from authenticityScore for: perfect sentence structure, no natural variation, zero hedging language, unnaturally consistent paragraph length
- Deduct from voiceMatchScore for: vocabulary level mismatch, sentence length far from avgSentenceLen, formality level mismatch
- Add to aiDetectionScore for: formulaic openings, "Furthermore/Moreover/Additionally" transitions, passive voice overuse, perfectly balanced paragraph lengths`;

export async function runAuthenticityChecker(
  input: AuthenticityCheckInput
): Promise<AuthenticityCheckOutput> {
  const voiceText = JSON.stringify(input.voiceProfile, null, 2);

  const result = await generateJson(
    `Audit this document for authenticity and voice consistency.\n\n## Voice Profile\n${voiceText}\n\n## Document\n${input.document}`,
    AuthenticityCheckOutputSchema,
    { model: "haiku", systemPrompt: SYSTEM_PROMPT, maxTokens: 512 }
  );

  return result.data;
}
