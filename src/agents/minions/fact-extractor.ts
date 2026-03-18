import { generateJson, type AiResult } from "@/lib/anthropic";
import {
  FactExtractorInputSchema,
  FactExtractorOutputSchema,
  type FactExtractorInput,
  type FactExtractorOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert at extracting verifiable, atomic facts from structured CV data. Each fact is a single, concrete claim about a candidate's experience, skills, or achievements.

Rules:
1. One claim per fact — each fact must be a single, atomic, verifiable statement.
2. No fabrication — extract only what is explicitly stated in the CV data.
3. Decompose complex bullet points into individual facts when appropriate.
4. quantified: set to true ONLY if the fact contains a specific number, percentage, dollar amount, or measurable metric.
5. source: use format "experience:0", "experience:1", "project:0", "education:0" etc. (0-indexed array positions).
6. category must be one of: "experience", "education", "skill", "project", "certification", "achievement".
7. technologies: list only technologies explicitly named in the fact itself.
8. impact: capture the outcome/result if described; otherwise null.
9. timeframe: capture time period if mentioned; otherwise null.

Output ONLY a valid JSON object with a "facts" array — no preamble, no markdown:
{
  "facts": [
    {
      "claim": "Reduced API response time by 40% through Redis caching",
      "category": "experience",
      "technologies": ["Redis"],
      "timeframe": "2021-2023",
      "impact": "40% reduction in API response time",
      "quantified": true,
      "source": "experience:0"
    }
  ]
}`;

export async function runFactExtractor(
  input: FactExtractorInput
): Promise<AiResult<FactExtractorOutput>> {
  const validated = FactExtractorInputSchema.parse(input);

  const prompt = `Extract all verifiable facts from the following structured CV data:\n\n${JSON.stringify(validated.parsedCv, null, 2)}`;

  return generateJson(prompt, FactExtractorOutputSchema, {
    model: "haiku",
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 4096,
  });
}
