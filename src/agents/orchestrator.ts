import { inngest } from "@/lib/inngest";
import { db } from "@/lib/db";
import { runJobScraper } from "@/agents/minions/job-scraper";
import { runCompanyResearcher } from "@/agents/minions/company-researcher";
import { runMatchAnalyzer } from "@/agents/minions/match-analyzer";
import { runRelevanceMapper } from "@/agents/minions/relevance-mapper";
import { runCvTailor } from "@/agents/minions/cv-tailor";
import { runCoverLetterWriter } from "@/agents/minions/cover-letter-writer";
import { runEnhancer } from "@/agents/minions/enhancer";
import { runAuthenticityChecker } from "@/agents/minions/authenticity-checker";
import { runEmailComposer } from "@/agents/minions/email-composer";

interface JobApplyEventData {
  jobId: string;
  userId: string;
  jobUrl: string;
  masterCvId: string;
}

export const applicationPipeline = inngest.createFunction(
  {
    id: "application-pipeline",
    name: "Application Pipeline",
    retries: 2,
    triggers: [{ event: "app/job.apply" }],
  },
  async ({ event, step }) => {
    const { jobId, userId, jobUrl, masterCvId } =
      event.data as JobApplyEventData;

    // Create WorkflowRun record
    const workflowRun = await step.run("create-workflow-run", async () => {
      return db.workflowRun.create({
        data: {
          userId,
          workflowType: "application",
          jobId,
          status: "running",
          startTime: new Date(),
          currentStep: "scrape",
        },
      });
    });

    const runId = workflowRun.id;

    // ── Step 1: Scrape job URL ─────────────────────────────────────────────────
    const jobData = await step.run("scrape-job", async () => {
      await db.workflowRun.update({
        where: { id: runId },
        data: { currentStep: "scrape" },
      });
      return runJobScraper({ url: jobUrl });
    });

    // ── Step 2 (parallel): Research company + Analyze match ───────────────────
    const [companyResearch, matchAnalysis] = await Promise.all([
      step.run("research-company", async () => {
        return runCompanyResearcher({
          company: jobData.company,
          jobTitle: jobData.title,
        });
      }),
      step.run("analyze-match", async () => {
        await db.workflowRun.update({
          where: { id: runId },
          data: { currentStep: "analyze" },
        });

        // Fetch master CV data
        const masterCv = await db.masterCV.findUnique({
          where: { id: masterCvId },
        });

        return runMatchAnalyzer({
          masterCv: (masterCv as Record<string, unknown>) ?? {},
          jobData,
        });
      }),
    ]);

    // Persist match analysis
    await step.run("save-analysis", async () => {
      await db.jobAnalysis.upsert({
        where: { jobId },
        create: {
          userId,
          jobId,
          keyRequirements: matchAnalysis.keyMatches,
          techStack: jobData.techStack,
          roleLevel: matchAnalysis.roleLevel,
          keywords: matchAnalysis.keywords,
          matchScore: matchAnalysis.matchScore,
          matchReasons: matchAnalysis.keyMatches,
          companyResearch: JSON.parse(JSON.stringify(companyResearch)),
          inputHash: `${jobId}-analysis`,
          providerUsed: "claude-haiku-4-5-20251001",
        },
        update: {
          matchScore: matchAnalysis.matchScore,
          keywords: matchAnalysis.keywords,
          matchReasons: matchAnalysis.keyMatches,
          companyResearch: JSON.parse(JSON.stringify(companyResearch)),
        },
      });
    });

    // ── Step 3: Map relevance from Fact Vault ─────────────────────────────────
    const relevanceMap = await step.run("map-relevance", async () => {
      await db.workflowRun.update({
        where: { id: runId },
        data: { currentStep: "map-relevance" },
      });

      const facts = await db.verifiedFact.findMany({
        where: { masterCvId },
      });

      return runRelevanceMapper({
        facts: facts.map((f: { id: string; claim: string; category: string; technologies: unknown }) => ({
          id: f.id,
          claim: f.claim,
          category: f.category,
          technologies: (f.technologies ?? []) as string[],
        })),
        keywords: matchAnalysis.keywords,
        techStack: jobData.techStack,
      });
    });

    // Fetch full fact data for relevant facts
    const relevantFacts = await step.run("fetch-relevant-facts", async () => {
      return db.verifiedFact.findMany({
        where: { id: { in: relevanceMap.relevantFactIds } },
      });
    });

    // ── Step 4 (parallel): Tailor CV + Write cover letter ─────────────────────
    const [tailoredCv, coverLetter] = await Promise.all([
      step.run("tailor-cv", async () => {
        await db.workflowRun.update({
          where: { id: runId },
          data: { currentStep: "tailor-cv" },
        });

        return runCvTailor({
          factVault: relevantFacts as unknown as Record<string, unknown>[],
          analysis: matchAnalysis,
          voiceProfile: {},
        });
      }),
      step.run("write-cover-letter", async () => {
        await db.workflowRun.update({
          where: { id: runId },
          data: { currentStep: "write-cover-letter" },
        });

        const masterCv = await db.masterCV.findUnique({
          where: { id: masterCvId },
        });

        return runCoverLetterWriter({
          tailoredCv: (masterCv as Record<string, unknown>) ?? {},
          analysis: matchAnalysis,
          companyResearch: companyResearch.summary,
          tone: "professional",
        });
      }),
    ]);

    // ── Step 5: Enhance both documents ────────────────────────────────────────
    const [enhancedCv, enhancedCoverLetter] = await Promise.all([
      step.run("enhance-cv", async () => {
        await db.workflowRun.update({
          where: { id: runId },
          data: { currentStep: "enhance" },
        });

        return runEnhancer({
          content: tailoredCv.tailoredSummary,
          type: "cv",
          keywords: matchAnalysis.keywords,
          voiceProfile: {},
        });
      }),
      step.run("enhance-cover-letter", async () => {
        return runEnhancer({
          content: coverLetter.content,
          type: "cover-letter",
          keywords: matchAnalysis.keywords,
          voiceProfile: {},
        });
      }),
    ]);

    // ── Step 6 (parallel): Check authenticity + Save CV version ───────────────
    const [authenticityResult, savedCvVersion] = await Promise.all([
      step.run("check-authenticity", async () => {
        await db.workflowRun.update({
          where: { id: runId },
          data: { currentStep: "authenticity" },
        });

        return runAuthenticityChecker({
          document: enhancedCv.enhancedContent,
          voiceProfile: {},
        });
      }),
      step.run("save-cv-version", async () => {
        const masterCv = await db.masterCV.findUnique({
          where: { id: masterCvId },
        });

        const cvVersionCount = await db.cvVersion.count({
          where: { masterCvId },
        });

        return db.cvVersion.create({
          data: {
            userId,
            masterCvId,
            jobId,
            version: cvVersionCount + 1,
            name: `Tailored for ${jobData.company} - ${jobData.title}`,
            summary: enhancedCv.enhancedContent,
            experience: JSON.parse(JSON.stringify(masterCv?.experience ?? [])),
            skills: tailoredCv.skillOrder,
            factIdsUsed: tailoredCv.selectedFacts,
            optimizations: tailoredCv.optimizations,
            matchScore: matchAnalysis.matchScore,
            inputHash: `${jobId}-cv-v${cvVersionCount + 1}`,
          },
        });
      }),
    ]);

    // Save cover letter
    const savedCoverLetter = await step.run("save-cover-letter", async () => {
      const coverLetterCount = await db.coverLetter.count({ where: { jobId } });

      return db.coverLetter.create({
        data: {
          userId,
          jobId,
          cvVersionId: savedCvVersion.id,
          content: enhancedCoverLetter.enhancedContent,
          tone: "professional",
          keyPoints: coverLetter.keyPoints,
          factIdsUsed: coverLetter.factIdsUsed,
          inputHash: `${jobId}-cl-v${coverLetterCount + 1}`,
          version: coverLetterCount + 1,
        },
      });
    });

    // Save authenticity audit
    await step.run("save-authenticity-audit", async () => {
      return db.authenticityAudit.create({
        data: {
          userId,
          cvVersionId: savedCvVersion.id,
          factIdsUsed: tailoredCv.selectedFacts,
          factsOmitted: [],
          changesFromMaster: tailoredCv.optimizations,
          authenticityScore: authenticityResult.authenticityScore,
          aiDetectionScore: authenticityResult.aiDetectionScore,
          keywordDensity: authenticityResult.keywordDensity,
          voiceMatchScore: authenticityResult.voiceMatchScore,
          fabricatedContent: !authenticityResult.passed,
        },
      });
    });

    // ── Step 7: Compose email ──────────────────────────────────────────────────
    const email = await step.run("compose-email", async () => {
      await db.workflowRun.update({
        where: { id: runId },
        data: { currentStep: "compose-email" },
      });

      const masterCv = await db.masterCV.findUnique({
        where: { id: masterCvId },
      });

      return runEmailComposer({
        application: (masterCv as Record<string, unknown>) ?? {},
        job: jobData,
      });
    });

    // ── Step 8: Save ApplicationPack + notify ─────────────────────────────────
    await step.run("save-application-pack", async () => {
      await db.workflowRun.update({
        where: { id: runId },
        data: { currentStep: "packaging" },
      });

      await db.applicationPack.upsert({
        where: { jobId },
        create: {
          userId,
          jobId,
          cvVersionId: savedCvVersion.id,
          coverLetterId: savedCoverLetter.id,
          emailSubject: email.subject,
          emailBody: email.body,
          recipientEmail: email.recipientSuggestions[0] ?? null,
          applicationScore: matchAnalysis.matchScore,
          authenticityScore: authenticityResult.authenticityScore,
          status: "ready",
        },
        update: {
          cvVersionId: savedCvVersion.id,
          coverLetterId: savedCoverLetter.id,
          emailSubject: email.subject,
          emailBody: email.body,
          applicationScore: matchAnalysis.matchScore,
          authenticityScore: authenticityResult.authenticityScore,
          status: "ready",
        },
      });

      // Mark job as ready
      await db.job.update({
        where: { id: jobId },
        data: { status: "ready" },
      });

      // Complete workflow run
      const endTime = new Date();
      await db.workflowRun.update({
        where: { id: runId },
        data: {
          status: "completed",
          currentStep: "done",
          endTime,
          stepOutputs: {
            matchScore: matchAnalysis.matchScore,
            authenticityScore: authenticityResult.authenticityScore,
            emailSubject: email.subject,
          },
        },
      });
    });

    return {
      jobId,
      matchScore: matchAnalysis.matchScore,
      authenticityScore: authenticityResult.authenticityScore,
      status: "completed",
    };
  }
);
