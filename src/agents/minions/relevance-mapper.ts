import { generateJson } from "@/lib/anthropic";
import { z } from "zod";
import { type RelevanceMappingOutput } from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a CV fact relevance scorer. Given a list of candidate facts (claims from their CV), a set of job keywords, and a tech stack, score each fact for relevance to this specific role.

For each fact, assign a relevance score between 0.0 and 1.0:
- 0.9 – 1.0: Critical match — directly addresses a core job requirement
- 0.7 – 0.89: High relevance — strongly related skill or experience
- 0.5 – 0.69: Moderate relevance — somewhat related, worth including
- 0.3 – 0.49: Low relevance — tangentially related
- 0.0 – 0.29: Omit — not relevant to this role

Also return:
- relevantFactIds: IDs of facts with score ≥ 0.5, sorted by score descending (max 12)
- prioritizedSkills: The 5-8 most important skills from the techStack to highlight for this role

Rules:
- Score based on semantic relevance, not just keyword matching
- A fact about Python is highly relevant to a Python job even if phrased differently
- Leadership facts are relevant for senior roles but less so for individual contributor roles
- Return ALL fact IDs in relevanceScores, even if scored 0`;

interface FactSummary {
  id: string;
  claim: string;
  category: string;
  technologies: string[];
}

interface RelevanceMappingInput {
  facts: FactSummary[];
  keywords: string[];
  techStack: string[];
}

const RelevanceMappingSchema = z.object({
  relevantFactIds: z.array(z.string()),
  relevanceScores: z.record(z.string(), z.number()),
  prioritizedSkills: z.array(z.string()),
});

export async function runRelevanceMapper(
  input: RelevanceMappingInput
): Promise<RelevanceMappingOutput> {
  if (input.facts.length === 0) {
    return {
      relevantFactIds: [],
      relevanceScores: {},
      prioritizedSkills: input.techStack.slice(0, 5),
    };
  }

  const factsText = input.facts
    .map(
      (f) =>
        `ID: ${f.id}\nClaim: ${f.claim}\nCategory: ${f.category}\nTechnologies: ${f.technologies.join(", ") || "none"}`
    )
    .join("\n\n");

  const result = await generateJson(
    `Score the relevance of these candidate facts against the job requirements.\n\n## Job Keywords\n${input.keywords.join(", ")}\n\n## Job Tech Stack\n${input.techStack.join(", ")}\n\n## Candidate Facts\n${factsText}`,
    RelevanceMappingSchema,
    { model: "haiku", systemPrompt: SYSTEM_PROMPT, maxTokens: 1024 }
  );

  return result.data;
}
