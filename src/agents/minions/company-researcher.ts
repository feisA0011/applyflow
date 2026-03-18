import { generateJson } from "@/lib/anthropic";
import {
  CompanyResearchOutputSchema,
  type CompanyResearchOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a company intelligence analyst. Given a company name and job title, provide a structured research briefing that helps a job applicant personalize their application.

Output the following fields:
- summary: 2-3 sentences about what the company does, its size/stage, and market position
- culture: 1-2 sentences about the company's known culture, values, or work style
- recentNews: Array of 2-4 recent notable events (funding, launches, expansions, partnerships)
- productsServices: 1-2 sentences describing the company's main products or services
- techStack: Array of technologies the company is known to use (from public information, job postings, engineering blogs)

Rules:
- Only report what is publicly known — do not speculate or fabricate
- If you have limited information, keep answers short and accurate rather than padding with guesses
- For lesser-known companies, focus on what can be reasonably inferred from the industry and job title
- recentNews items should be concise factual statements`;

interface CompanyResearchInput {
  company: string;
  jobTitle?: string;
}

export async function runCompanyResearcher(
  input: CompanyResearchInput
): Promise<CompanyResearchOutput> {
  const result = await generateJson(
    `Research the following company for a job applicant:\n\nCompany: ${input.company}\nRole they're applying for: ${input.jobTitle ?? "Software Engineer"}\n\nProvide a structured briefing to help them personalize their application.`,
    CompanyResearchOutputSchema,
    { model: "sonnet", systemPrompt: SYSTEM_PROMPT, maxTokens: 1024 }
  );

  return result.data;
}
