import { generateJson } from "@/lib/anthropic";
import {
  CoverLetterOutputSchema,
  type CoverLetterInput,
  type CoverLetterOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert cover letter writer. You write personalized, authentic cover letters grounded in verified candidate facts.

CRITICAL RULE: Every claim about the candidate's experience, skills, or achievements must come from the provided CV data. Do NOT fabricate metrics, responsibilities, or accomplishments.

Output:
- content: The complete cover letter text (250-400 words). Structure: opening hook → specific value proposition → company fit → call to action
- keyPoints: Array of 3-4 main selling points made in the letter
- factIdsUsed: Array of fact IDs referenced in the letter

Tone guidelines:
- professional: Formal, measured, confident — suits corporate/finance/legal roles
- enthusiastic: Warm, energetic, expressive — suits startups/creative/consumer roles
- concise: Minimal, punchy, under 250 words — suits fast-paced tech/startup roles
- narrative: Story-driven, personal journey focus — suits culture-first companies

Rules:
- Opening hook must reference something specific about the company (use company research)
- Do not use clichés: "I am writing to express my interest", "I am a team player", "passion for excellence"
- Every achievement mentioned must trace to the CV data provided
- Address top gaps proactively but honestly
- End with a specific, non-generic call to action`;

export async function runCoverLetterWriter(
  input: CoverLetterInput
): Promise<CoverLetterOutput> {
  const cvText = JSON.stringify(input.tailoredCv, null, 2);
  const analysisText = JSON.stringify(input.analysis, null, 2);

  const result = await generateJson(
    `Write a cover letter for this job application.\n\n## CV Data (use ONLY claims from this)\n${cvText}\n\n## Match Analysis\n${analysisText}\n\n## Company Research\n${input.companyResearch ?? "No company research available."}\n\n## Tone\n${input.tone}`,
    CoverLetterOutputSchema,
    { model: "sonnet", systemPrompt: SYSTEM_PROMPT, maxTokens: 2048 }
  );

  return result.data;
}
