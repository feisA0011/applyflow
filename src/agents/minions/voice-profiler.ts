import { generateJson, type AiResult } from "@/lib/anthropic";
import {
  VoiceProfileInputSchema,
  VoiceProfileSchema,
  type VoiceProfileInput,
  type VoiceProfileData,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert writing analyst. Analyze raw CV text and produce a voice profile capturing the author's natural writing style.

Rules:
1. Analyze objectively — base all measurements on the actual text.
2. Do not fabricate — all measurements must be derived from what is present.
3. avgSentenceLen: calculate average word count per sentence from bullet points and summaries (must be >= 1).
4. vocabularyLevel: "technical" (heavy jargon/acronyms), "professional" (business language), or "casual" (conversational).
5. quantifiesImpact: true if the author regularly uses numbers, percentages, or measurable outcomes.
6. writingStyle: "concise" (short bullets), "detailed" (thorough descriptions), or "narrative" (prose-like).
7. jargonPatterns: up to 10 frequently used domain-specific terms or phrases.
8. sampleText: a verbatim 2-3 sentence excerpt that best represents the author's voice.
9. formality: float 0.0 (very casual) to 1.0 (highly formal).

Output ONLY a valid JSON object — no preamble, no markdown:
{
  "avgSentenceLen": 12.5,
  "vocabularyLevel": "technical",
  "quantifiesImpact": true,
  "writingStyle": "concise",
  "jargonPatterns": ["microservices", "CI/CD"],
  "sampleText": "Verbatim excerpt...",
  "formality": 0.8
}`;

export async function runVoiceProfiler(
  input: VoiceProfileInput
): Promise<AiResult<VoiceProfileData>> {
  const validated = VoiceProfileInputSchema.parse(input);

  return generateJson(
    `Analyze the writing style in the following CV text and return a voice profile JSON:\n\n${validated.rawText}`,
    VoiceProfileSchema,
    {
      model: "haiku",
      systemPrompt: SYSTEM_PROMPT,
      maxTokens: 1024,
    }
  );
}
