import { generateJson } from "@/lib/anthropic";
import { z } from "zod";
import { type EnhancerOutput } from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a professional document polisher. You improve CV summaries and cover letters for clarity, flow, and ATS keyword density — without changing the substance.

CRITICAL RULE: Do NOT add any claims, achievements, or facts not present in the original content. You may only rephrase, reorder, tighten, and naturally incorporate the provided keywords.

Output:
- enhancedContent: The polished document (same approximate length as input)
- changes: Array of 3-5 specific improvements made

Enhancement rules:
- Target keyword density: 2-4% (count keyword occurrences / total words)
- Add missing keywords only where they fit naturally — never force them
- Fix grammar, punctuation, and sentence flow
- Remove redundant phrases and filler words
- Improve active voice where passive voice weakens impact
- Maintain the candidate's voice (do not over-formalize or over-casualize)
- For CVs: keep bullet points punchy, start with action verbs
- For cover letters: ensure smooth paragraph transitions

Forbidden:
- Adding new job titles, companies, or date ranges
- Inventing metrics not in the original
- Changing the factual content of any claim
- Generic AI-sounding phrases ("leveraging synergies", "driving impactful outcomes")`;

const EnhancerSchema = z.object({
  enhancedContent: z.string(),
  changes: z.array(z.string()),
});

interface EnhancerInput {
  content: string;
  type: "cv" | "cover-letter";
  keywords: string[];
  voiceProfile: Record<string, unknown>;
}

export async function runEnhancer(input: EnhancerInput): Promise<EnhancerOutput> {
  const result = await generateJson(
    `Enhance this ${input.type} document.\n\n## Target ATS Keywords\n${input.keywords.join(", ")}\n\n## Voice Profile\n${JSON.stringify(input.voiceProfile, null, 2)}\n\n## Document to Enhance\n${input.content}`,
    EnhancerSchema,
    { model: "haiku", systemPrompt: SYSTEM_PROMPT, maxTokens: 2048 }
  );

  return result.data;
}
