import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { runCvParser } from "@/agents/minions/cv-parser";
import { runVoiceProfiler } from "@/agents/minions/voice-profiler";
import { runFactExtractor } from "@/agents/minions/fact-extractor";
import { runImpactMiner } from "@/agents/minions/impact-miner";

const RequestSchema = z.object({
  content: z.string().min(1, "CV content is required"),
  userId: z.string().min(1, "userId is required"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { content, userId } = parsed.data;

  // ── Run agents ────────────────────────────────────────────────────────────

  let parserResult: Awaited<ReturnType<typeof runCvParser>>;
  try {
    parserResult = await runCvParser({ content });
  } catch (err) {
    return NextResponse.json(
      { error: `CV parsing failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    );
  }

  let profilerResult: Awaited<ReturnType<typeof runVoiceProfiler>>;
  try {
    profilerResult = await runVoiceProfiler({ rawText: content });
  } catch (err) {
    return NextResponse.json(
      { error: `Voice profiling failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    );
  }

  let extractorResult: Awaited<ReturnType<typeof runFactExtractor>>;
  try {
    extractorResult = await runFactExtractor({ parsedCv: parserResult.data });
  } catch (err) {
    return NextResponse.json(
      { error: `Fact extraction failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 }
    );
  }

  const cv = parserResult.data;
  const voiceProfile = profilerResult.data;
  const facts = extractorResult.data.facts;

  // ── Save to database ──────────────────────────────────────────────────────

  let masterCvId = `temp-${Date.now()}`;
  let savedFactIds: Record<string, string> = {};
  let totalTokensIn =
    parserResult.tokensIn + profilerResult.tokensIn + extractorResult.tokensIn;
  let totalTokensOut =
    parserResult.tokensOut +
    profilerResult.tokensOut +
    extractorResult.tokensOut;

  try {
    // Deactivate previous active CVs
    await db.masterCV.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    // Count existing versions
    const versionCount = await db.masterCV.count({ where: { userId } });

    const savedCv = await db.masterCV.create({
      data: {
        userId,
        version: versionCount + 1,
        isActive: true,
        fullName: cv.fullName,
        email: cv.email ?? "",
        phone: cv.phone,
        location: cv.location,
        website: cv.website,
        linkedin: cv.linkedin,
        github: cv.github,
        summary: cv.summary ?? "",
        experience: JSON.parse(JSON.stringify(cv.experience)),
        education: JSON.parse(JSON.stringify(cv.education)),
        skills: cv.skills,
        projects: JSON.parse(JSON.stringify(cv.projects)),
        certifications: cv.certifications,
        languages: cv.languages,
      },
    });

    masterCvId = savedCv.id;

    // Save voice profile
    await db.voiceProfile.create({
      data: {
        userId,
        masterCvId,
        avgSentenceLen: voiceProfile.avgSentenceLen,
        vocabularyLevel: voiceProfile.vocabularyLevel,
        quantifiesImpact: voiceProfile.quantifiesImpact,
        writingStyle: voiceProfile.writingStyle,
        jargonPatterns: voiceProfile.jargonPatterns,
        sampleText: voiceProfile.sampleText,
        formality: voiceProfile.formality,
      },
    });

    // Save facts
    const savedFacts = await Promise.all(
      facts.map((fact) =>
        db.verifiedFact.create({
          data: {
            userId,
            masterCvId,
            claim: fact.claim,
            category: fact.category,
            technologies: fact.technologies,
            timeframe: fact.timeframe,
            impact: fact.impact,
            quantified: fact.quantified,
            source: fact.source,
          },
        })
      )
    );

    savedFactIds = Object.fromEntries(
      savedFacts.map((sf, i) => [facts[i].claim, sf.id])
    );

    // Track usage
    await db.usageRecord.create({
      data: {
        userId,
        type: "cv_parse",
        agentName: "cv-parser+voice-profiler+fact-extractor",
        model: parserResult.model,
        tokensIn: totalTokensIn,
        tokensOut: totalTokensOut,
        costUsd:
          parserResult.costUsd + profilerResult.costUsd + extractorResult.costUsd,
      },
    });
  } catch {
    // DB not available — continue with temp IDs
    savedFactIds = Object.fromEntries(
      facts.map((f, i) => [f.claim, `temp-fact-${i}`])
    );
  }

  // ── Run Impact Miner on unquantified facts ────────────────────────────────

  const unquantifiedFacts = facts.filter((f) => !f.quantified).slice(0, 8);

  const impactQuestions = await Promise.all(
    unquantifiedFacts.map(async (fact, i) => {
      const factId =
        savedFactIds[fact.claim] ??
        `temp-fact-${facts.indexOf(fact)}`;

      try {
        const result = await runImpactMiner({
          factId,
          claim: fact.claim,
          category: fact.category,
          context: `Source: ${fact.source}`,
        });

        totalTokensIn += result.tokensIn;
        totalTokensOut += result.tokensOut;

        return { factId, questions: result.data.questions };
      } catch {
        // Return empty questions on failure
        return { factId: `temp-fact-${i}`, questions: [] };
      }
    })
  );

  // ── Build response ────────────────────────────────────────────────────────

  const savedFactsWithIds = facts.map((fact, i) => ({
    id: savedFactIds[fact.claim] ?? `temp-fact-${i}`,
    claim: fact.claim,
    category: fact.category,
    technologies: fact.technologies,
    timeframe: fact.timeframe,
    impact: fact.impact,
    quantified: fact.quantified,
    source: fact.source,
  }));

  return NextResponse.json({
    masterCvId,
    fullName: cv.fullName,
    email: cv.email,
    phone: cv.phone,
    location: cv.location,
    website: cv.website,
    linkedin: cv.linkedin,
    github: cv.github,
    summary: cv.summary,
    experience: cv.experience,
    education: cv.education,
    skills: cv.skills,
    projects: cv.projects,
    certifications: cv.certifications,
    languages: cv.languages,
    voiceProfile: {
      vocabularyLevel: voiceProfile.vocabularyLevel,
      writingStyle: voiceProfile.writingStyle,
      quantifiesImpact: voiceProfile.quantifiesImpact,
      formality: voiceProfile.formality,
    },
    facts: savedFactsWithIds,
    impactQuestions: impactQuestions.filter((q) => q.questions.length > 0),
    usage: { tokensIn: totalTokensIn, tokensOut: totalTokensOut },
  });
}
