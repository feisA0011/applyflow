import { generateJson } from "@/lib/anthropic";
import {
  MatchAnalysisOutputSchema,
  type MatchAnalysisInput,
  type MatchAnalysisOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a precise job-CV match scoring engine. Given a candidate's master CV and a job posting, analyze how well the candidate matches the role.

Output:
- matchScore: Integer 0-100 (90-100=Exceptional, 75-89=Strong, 60-74=Moderate, 40-59=Partial, 0-39=Weak)
- keyMatches: Array of 3-6 specific strengths that align with job requirements (reference actual CV content)
- gaps: Array of 2-4 requirements the candidate does not clearly demonstrate
- keywords: Array of 8-15 ATS keywords from the job posting the candidate should include
- roleLevel: One of "Intern", "Junior", "Mid", "Senior", "Staff", "Principal", "Manager", "Director", "VP", "C-Level"

Rules:
- Base ALL scoring on the actual CV content — do not assume skills not mentioned
- keyMatches must reference specific evidence from the CV
- gaps should only list requirements explicitly stated in the job posting
- keywords should be the exact terms used in the job posting
- Be honest about gaps — inflated scores harm the candidate`;

export async function runMatchAnalyzer(
  input: MatchAnalysisInput
): Promise<MatchAnalysisOutput> {
  const cvSummary = JSON.stringify(input.masterCv, null, 2);
  const jobSummary = JSON.stringify(input.jobData, null, 2);

  const result = await generateJson(
    `Analyze how well this candidate matches the job posting.\n\n## Candidate CV\n${cvSummary}\n\n## Job Posting\n${jobSummary}`,
    MatchAnalysisOutputSchema,
    { model: "sonnet", systemPrompt: SYSTEM_PROMPT, maxTokens: 1024 }
  );

  return result.data;
}
