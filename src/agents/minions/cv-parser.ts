import { generateJson, type AiResult } from "@/lib/anthropic";
import {
  CvParserInputSchema,
  ParsedCvSchema,
  type CvParserInput,
  type ParsedCv,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert CV/resume parser. Your job is to extract structured information from raw CV text.

Rules:
1. Extract only what is present — never infer or fabricate information.
2. Mark absent fields as null — if a field is not found in the text, set it to null.
3. Preserve the candidate's exact language — do not rephrase achievements or summaries.
4. Dates — extract in "YYYY-MM" or "YYYY" format when possible; if ambiguous, use the candidate's wording.
5. Achievements — extract bullet points or sentences describing what the person did. Each achievement is a separate string.
6. Skills — extract as a flat list of skill names; do not group by category.
7. If a role says "Present" for end date, set endDate to null and current to true.

Output ONLY a valid JSON object matching this exact structure — no preamble, no explanation, no markdown fences:
{
  "fullName": "string",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "website": "string or null",
  "linkedin": "string or null",
  "github": "string or null",
  "summary": "string or null",
  "experience": [{ "company": "string", "role": "string", "startDate": "string or null", "endDate": "string or null", "current": false, "location": "string or null", "description": "string or null", "achievements": ["string"] }],
  "education": [{ "institution": "string", "degree": "string or null", "field": "string or null", "startDate": "string or null", "endDate": "string or null", "gpa": "string or null", "achievements": ["string"] }],
  "skills": ["string"],
  "projects": [{ "name": "string", "description": "string", "technologies": ["string"], "url": "string or null", "highlights": ["string"] }],
  "certifications": ["string"],
  "languages": ["string"]
}`;

export async function runCvParser(
  input: CvParserInput
): Promise<AiResult<ParsedCv>> {
  const validated = CvParserInputSchema.parse(input);

  return generateJson(
    `Parse the following CV text and return a structured JSON object:\n\n${validated.content}`,
    ParsedCvSchema,
    {
      model: "haiku",
      systemPrompt: SYSTEM_PROMPT,
      maxTokens: 4096,
    }
  );
}
