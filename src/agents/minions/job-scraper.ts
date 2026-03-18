import { generateJson } from "@/lib/anthropic";
import {
  JobScrapingOutputSchema,
  type JobScrapingInput,
  type JobScrapingOutput,
} from "@/agents/schemas";

const SYSTEM_PROMPT = `You are a precise job listing parser. You receive raw HTML or text content from a job posting URL.

Extract the following fields from the content:
- title: The exact job title
- company: The hiring company's name
- location: City/state/country or "Remote" — null if not found
- description: A clean 2-4 sentence summary of the role (strip boilerplate)
- requirements: Array of 3-8 specific requirements (years of experience, skills, qualifications)
- salary: Salary range as a string (e.g. "$120,000 – $160,000") — null if not mentioned
- techStack: Array of specific technologies, languages, frameworks mentioned
- remote: true if the role is remote-friendly, otherwise false

Rules:
- Extract only what is explicitly stated — do not infer or guess
- If a field is absent, use null (or empty array for arrays)
- Strip HTML tags, navigation text, cookie banners, and footer boilerplate
- techStack should contain only technology names (not soft skills)`;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function runJobScraper(
  input: JobScrapingInput
): Promise<JobScrapingOutput> {
  let pageContent: string;

  try {
    const response = await fetch(input.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ApplyFlow/1.0; +https://applyflow.ai)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    pageContent = stripHtml(html).slice(0, 12_000); // Cap at 12k chars for token efficiency
  } catch (err) {
    // Fallback: ask Claude to extract from just the URL if fetch fails
    pageContent = `Job posting URL: ${input.url}\n\nNote: Could not fetch page content. Extract what you can from the URL itself.`;
    void err;
  }

  const result = await generateJson(
    `Extract job posting data from the following page content:\n\n${pageContent}\n\nSource URL: ${input.url}`,
    JobScrapingOutputSchema,
    { model: "haiku", systemPrompt: SYSTEM_PROMPT, maxTokens: 1024 }
  );

  return result.data;
}
