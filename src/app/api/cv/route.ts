import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { runFactExtractor } from "@/agents/minions/fact-extractor";
import type {
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "@/agents/schemas";

// Placeholder: in production, derive userId from Supabase session cookie
const PLACEHOLDER_USER_ID = "demo-user";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? PLACEHOLDER_USER_ID;
}

// ── GET /api/cv ───────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const userId = getUserId(req);

  try {
    const cv = await db.masterCV.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!cv) {
      return NextResponse.json({ cv: null, facts: [], voiceProfile: null });
    }

    const [facts, voiceProfile] = await Promise.all([
      db.verifiedFact.findMany({
        where: { masterCvId: cv.id },
        orderBy: { createdAt: "asc" },
      }),
      db.voiceProfile.findUnique({ where: { masterCvId: cv.id } }),
    ]);

    return NextResponse.json({ cv, facts, voiceProfile });
  } catch {
    // DB not available
    return NextResponse.json({ cv: null, facts: [], voiceProfile: null });
  }
}

// ── PUT /api/cv ───────────────────────────────────────────────────────────────

const UpdateCvSchema = z.object({
  masterCvId: z.string(),
  fullName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  github: z.string().nullable().optional(),
  summary: z.string().optional(),
  experience: z.array(z.record(z.string(), z.unknown())).optional(),
  education: z.array(z.record(z.string(), z.unknown())).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.record(z.string(), z.unknown())).optional(),
});

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdateCvSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { masterCvId, ...fields } = parsed.data;

  try {
    const { experience, education, projects, ...scalarFields } = fields;
    const updated = await db.masterCV.update({
      where: { id: masterCvId, userId },
      data: {
        ...scalarFields,
        ...(experience !== undefined && { experience: JSON.parse(JSON.stringify(experience)) }),
        ...(education !== undefined && { education: JSON.parse(JSON.stringify(education)) }),
        ...(projects !== undefined && { projects: JSON.parse(JSON.stringify(projects)) }),
        updatedAt: new Date(),
      },
    });

    // Re-run fact extractor if experience/education/projects changed
    const changedStructural =
      fields.experience !== undefined ||
      fields.education !== undefined ||
      fields.projects !== undefined;

    if (changedStructural && updated) {
      try {
        // Delete old facts
        await db.verifiedFact.deleteMany({ where: { masterCvId } });

        // Re-extract facts
        const extractorResult = await runFactExtractor({
          parsedCv: {
            fullName: updated.fullName,
            email: updated.email ?? null,
            phone: updated.phone ?? null,
            location: updated.location ?? null,
            website: updated.website ?? null,
            linkedin: updated.linkedin ?? null,
            github: updated.github ?? null,
            summary: updated.summary ?? null,
            experience: ((updated.experience ?? []) as unknown) as ExperienceItem[],
            education: ((updated.education ?? []) as unknown) as EducationItem[],
            skills: ((updated.skills ?? []) as unknown) as string[],
            projects: ((updated.projects ?? []) as unknown) as ProjectItem[],
            certifications: [],
            languages: [],
          },
        });

        await Promise.all(
          extractorResult.data.facts.map((fact) =>
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
      } catch {
        // Re-extraction failed — return updated CV without new facts
      }
    }

    const [facts, voiceProfile] = await Promise.all([
      db.verifiedFact.findMany({ where: { masterCvId } }),
      db.voiceProfile.findUnique({ where: { masterCvId } }),
    ]);

    return NextResponse.json({ cv: updated, facts, voiceProfile });
  } catch (err) {
    return NextResponse.json(
      { error: `Update failed: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    );
  }
}
