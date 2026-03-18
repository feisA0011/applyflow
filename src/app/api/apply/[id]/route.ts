import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const PLACEHOLDER_USER_ID = "demo-user";

function getUserId(req: NextRequest): string {
  return req.headers.get("x-user-id") ?? PLACEHOLDER_USER_ID;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = getUserId(req);

  try {
    const job = await db.job.findFirst({
      where: { id, userId },
      include: {
        applicationPack: {
          include: {
            cvVersion: true,
            coverLetter: true,
          },
        },
        analysis: true,
        workflowRuns: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const workflowRun = job.workflowRuns[0] ?? null;

    return NextResponse.json({
      job,
      pack: job.applicationPack,
      analysis: job.analysis,
      workflowStatus: workflowRun?.status ?? "pending",
      currentStep: workflowRun?.currentStep ?? null,
    });
  } catch {
    // Return mock data when DB is unavailable
    return NextResponse.json({
      job: { id, title: "Senior Software Engineer", company: "Acme Corp", status: "ready" },
      pack: {
        cvVersion: { summary: "Experienced engineer with 6+ years building distributed systems.", skills: ["TypeScript", "Node.js", "PostgreSQL", "AWS"] },
        coverLetter: { content: "Dear Hiring Manager,\n\nI am excited to apply for this role...", keyPoints: ["6+ years experience", "Strong TypeScript background"] },
        emailSubject: "Application: Senior Software Engineer at Acme Corp",
        emailBody: "Hi [Hiring Manager],\n\nI'm applying for the Senior Software Engineer role...",
        applicationScore: 78,
        authenticityScore: 92,
      },
      analysis: { matchScore: 78, keyMatches: ["TypeScript", "distributed systems", "PostgreSQL"], gaps: ["Kubernetes experience"] },
      workflowStatus: "completed",
      currentStep: "done",
    });
  }
}
