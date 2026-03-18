import { generateJson } from "@/lib/anthropic";
import {
  EmailComposeOutputSchema,
  type EmailComposeInput,
  type EmailComposeOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are an expert at writing brief, compelling job application outreach emails. You write emails that get responses — concise, specific, and human.

Output:
- subject: Email subject line (under 60 characters, specific to the role — do NOT start with "Application:")
- body: The complete email body (under 150 words, no sign-off needed)
- recipientSuggestions: Array of 3 likely email addresses based on company domain patterns

Email structure:
1. One-line opening: who you are + what you're applying for
2. One specific hook: the applicant's most relevant achievement for this role (from their profile)
3. One sentence on why this company specifically
4. Clear ask: "Happy to share my CV" or "Would love to connect"

Rules:
- Under 150 words — hiring managers scan, not read
- Be specific: reference the exact role title and company name
- The hook must reference real experience from the applicant profile (no fabrication)
- Do NOT use: "I am writing to express my interest", "Please find attached", "I am a passionate..."
- recipientSuggestions: derive domain from company name (lowercase, strip spaces/special chars, add .com)`;

export async function runEmailComposer(
  input: EmailComposeInput
): Promise<EmailComposeOutput> {
  const application = input.application as Record<string, unknown>;
  const applicantName = String(application.fullName ?? "the applicant");
  const summary = String(application.summary ?? "");
  const skills = Array.isArray(application.skills)
    ? (application.skills as string[]).slice(0, 8).join(", ")
    : "";

  const profileText = `Name: ${applicantName}\nSummary: ${summary}\nTop skills: ${skills}`;

  const result = await generateJson(
    `Compose a job application outreach email.\n\n## Applicant Profile\n${profileText}\n\n## Job Details\nTitle: ${input.job.title}\nCompany: ${input.job.company}\nLocation: ${input.job.location ?? "Not specified"}\nKey Requirements: ${input.job.requirements.slice(0, 4).join("; ")}\nTech Stack: ${input.job.techStack.slice(0, 6).join(", ")}`,
    EmailComposeOutputSchema,
    { model: "haiku", systemPrompt: SYSTEM_PROMPT, maxTokens: 512 }
  );

  return result.data;
}
