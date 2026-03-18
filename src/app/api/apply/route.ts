import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";

const PLACEHOLDER_USER_ID = "demo-user";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? PLACEHOLDER_USER_ID;
}

// ── POST /api/apply ───────────────────────────────────────────────────────────

const ApplySchema = z.object({
  url: z.string().url("Must be a valid job URL"),
});

export async function POST(req: NextRequest) {
  const userId = getUserId(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { url } = parsed.data;
  const inputHash = createHash("sha256").update(userId + url).digest("hex");

  // Find active master CV
  let masterCvId = "pending";
  try {
    const masterCv = await db.masterCV.findFirst({
      where: { userId, isActive: true },
    });
    masterCvId = masterCv?.id ?? "pending";
  } catch {
    // DB not available
  }

  // Check for duplicate
  try {
    const existing = await db.job.findUnique({ where: { inputHash } });
    if (existing) {
      return NextResponse.json(
        { jobId: existing.id, status: "duplicate", message: "Job already in pipeline" },
        { status: 200 }
      );
    }
  } catch {
    // DB not available — continue
  }

  // Create Job record
  let jobId = `temp-job-${Date.now()}`;
  try {
    const job = await db.job.create({
      data: {
        userId,
        sourceUrl: url,
        title: "Pending",
        company: "Pending",
        description: "Pending scrape",
        status: "ingested",
        inputHash,
      },
    });
    jobId = job.id;
  } catch {
    // DB not available — use temp ID
  }

  // Send Inngest event to trigger the pipeline
  try {
    await inngest.send({
      name: "app/job.apply",
      data: {
        jobId,
        userId,
        jobUrl: url,
        masterCvId,
      },
    });
  } catch {
    // Inngest not configured — return jobId anyway so UI can proceed
  }

  return NextResponse.json({ jobId, status: "processing" }, { status: 201 });
}

// ── GET /api/apply ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const userId = getUserId(req);

  try {
    const applications = await db.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        applicationPack: true,
        analysis: { select: { matchScore: true } },
      },
    });

    return NextResponse.json({ applications });
  } catch {
    return NextResponse.json({ applications: [] });
  }
}
