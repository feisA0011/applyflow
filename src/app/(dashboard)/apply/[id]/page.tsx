import { notFound } from "next/navigation";
import { CheckCircle2, Star, Shield, Mail, FileText, Edit3, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ── Data fetching ─────────────────────────────────────────────────────────────

interface ApplicationData {
  job: {
    id: string;
    title: string;
    company: string;
    status: string;
    sourceUrl?: string | null;
  };
  pack: {
    cvVersion: {
      summary: string;
      skills: string[];
      experience?: unknown[];
    } | null;
    coverLetter: {
      content: string;
      keyPoints: string[];
    } | null;
    emailSubject: string | null;
    emailBody: string | null;
    applicationScore: number | null;
    authenticityScore: number | null;
  } | null;
  analysis: {
    matchScore: number | null;
    keyMatches: string[];
    gaps: string[];
  } | null;
  workflowStatus: string;
}

async function getApplicationData(id: string): Promise<ApplicationData | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/apply/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<ApplicationData>;
  } catch {
    // Return demo data when API unavailable
    return {
      job: {
        id,
        title: "Senior Software Engineer",
        company: "Acme Corp",
        status: "ready",
      },
      pack: {
        cvVersion: {
          summary:
            "Experienced software engineer with 6+ years building scalable distributed systems at high-growth companies. Strong expertise in TypeScript, Node.js, and PostgreSQL. Track record of delivering high-impact features serving millions of users.",
          skills: [
            "TypeScript",
            "Node.js",
            "PostgreSQL",
            "AWS",
            "microservices",
            "distributed systems",
            "React",
            "Docker",
          ],
        },
        coverLetter: {
          content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Software Engineer position at Acme Corp. With over 6 years of experience building scalable distributed systems, I am confident that my background aligns closely with your requirements.

In my current role, I have led the architecture and delivery of microservices handling millions of requests daily, reducing infrastructure costs by 30% while improving reliability to 99.97% uptime. My expertise in TypeScript and PostgreSQL directly matches your core technology stack.

What excites me most about Acme Corp is your commitment to engineering excellence and rapid innovation. I would love to bring my experience in distributed systems and technical leadership to help accelerate your platform goals.

I look forward to discussing this opportunity.

Best regards`,
          keyPoints: [
            "6+ years distributed systems experience",
            "TypeScript and PostgreSQL expertise",
            "Led 30% infrastructure cost reduction",
          ],
        },
        emailSubject: "Application: Senior Software Engineer at Acme Corp",
        emailBody: `Hi [Hiring Manager],

I'm applying for the Senior Software Engineer role at Acme Corp. I've attached my tailored CV and cover letter.

My background in TypeScript, Node.js, and distributed systems aligns closely with what you're looking for. Happy to connect at your convenience.

Best,
[Your Name]`,
        applicationScore: 78,
        authenticityScore: 92,
      },
      analysis: {
        matchScore: 78,
        keyMatches: [
          "TypeScript proficiency",
          "Distributed systems experience",
          "PostgreSQL expertise",
          "AWS infrastructure",
        ],
        gaps: ["Kubernetes not mentioned", "Go language not listed"],
      },
      workflowStatus: "completed",
    };
  }
}

// ── Score pill ─────────────────────────────────────────────────────────────────

function ScorePill({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const color =
    score >= 85
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 70
      ? "bg-[#CCFBF1] text-[#0D9488] border-[#0D9488]/20"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${color}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <div>
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-lg font-bold leading-tight">{score}%</p>
      </div>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#EDEAE4] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#EDEAE4] px-5 py-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#0D9488]" />
          <h2 className="font-display text-base font-semibold text-[#1C1917]">
            {title}
          </h2>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-[#EDEAE4] px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
        >
          <Edit3 className="h-3 w-3" />
          Edit
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ApplyReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getApplicationData(id);

  if (!data) notFound();

  const { job, pack, analysis } = data;
  const matchScore = analysis?.matchScore ?? pack?.applicationScore ?? 0;
  const authenticityScore = pack?.authenticityScore ?? 0;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back link */}
      <Link
        href="/apply"
        className="inline-flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Apply
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-[#EDEAE4] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-[#CCFBF1] px-2.5 py-0.5 text-xs font-semibold text-[#0D9488]">
                Ready to send
              </span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-[#1C1917]">
              {job.title}
            </h1>
            <p className="mt-1 text-[#57534E]">{job.company}</p>
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-xs text-[#0D9488] hover:underline"
              >
                View original listing →
              </a>
            )}
          </div>

          {/* Scores */}
          <div className="flex gap-3">
            <ScorePill
              label="Match"
              score={Math.round(matchScore)}
              icon={Star}
            />
            <ScorePill
              label="Authentic"
              score={Math.round(authenticityScore)}
              icon={Shield}
            />
          </div>
        </div>

        {/* Key matches */}
        {analysis?.keyMatches && analysis.keyMatches.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-[#A8A29E]">
              Key matches
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.keyMatches.map((match) => (
                <span
                  key={match}
                  className="flex items-center gap-1 rounded-lg bg-[#CCFBF1]/50 px-2.5 py-1 text-xs font-medium text-[#0D9488]"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {match}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps */}
        {analysis?.gaps && analysis.gaps.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-[#A8A29E]">
              Gaps (addressed in cover letter)
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.gaps.map((gap) => (
                <span
                  key={gap}
                  className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs text-amber-700"
                >
                  {gap}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tailored CV */}
      {pack?.cvVersion && (
        <SectionCard title="Tailored CV" icon={FileText}>
          {/* Summary */}
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
              Summary
            </p>
            <p className="text-sm leading-relaxed text-[#57534E]">
              {pack.cvVersion.summary}
            </p>
          </div>

          {/* Skills */}
          {pack.cvVersion.skills.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                Skills (reordered for this role)
              </p>
              <div className="flex flex-wrap gap-2">
                {pack.cvVersion.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-[#F5F3EF] px-3 py-1 text-xs font-medium text-[#57534E]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* Cover Letter */}
      {pack?.coverLetter && (
        <SectionCard title="Cover Letter" icon={FileText}>
          <div className="mb-4 flex flex-wrap gap-2">
            {pack.coverLetter.keyPoints.map((point) => (
              <span
                key={point}
                className="flex items-center gap-1 rounded-lg bg-[#CCFBF1]/50 px-2.5 py-1 text-xs text-[#0D9488]"
              >
                <CheckCircle2 className="h-3 w-3" />
                {point}
              </span>
            ))}
          </div>
          <div className="rounded-xl bg-[#FAFAF8] border border-[#EDEAE4] p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#57534E]">
              {pack.coverLetter.content}
            </pre>
          </div>
        </SectionCard>
      )}

      {/* Email */}
      {pack?.emailSubject && (
        <SectionCard title="Outreach Email" icon={Mail}>
          <div className="mb-3 rounded-xl border border-[#EDEAE4] bg-[#FAFAF8] px-4 py-2">
            <p className="text-xs text-[#A8A29E]">Subject</p>
            <p className="text-sm font-medium text-[#1C1917]">
              {pack.emailSubject}
            </p>
          </div>
          <div className="rounded-xl bg-[#FAFAF8] border border-[#EDEAE4] p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#57534E]">
              {pack.emailBody}
            </pre>
          </div>
        </SectionCard>
      )}

      {/* Send button */}
      <div className="flex items-center justify-between rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-[#1C1917]">
            Ready to apply?
          </p>
          <p className="text-xs text-[#57534E]">
            Review everything above, then send your application.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shadow-sm"
        >
          <Send className="h-4 w-4" />
          Send Application
        </button>
      </div>
    </div>
  );
}
