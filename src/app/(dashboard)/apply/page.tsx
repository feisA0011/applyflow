"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PIPELINE_STEPS = [
  { id: "scrape", label: "Scraping job listing", duration: 1200 },
  { id: "analyze", label: "Analyzing match", duration: 1400 },
  { id: "tailor-cv", label: "Tailoring your CV", duration: 1600 },
  { id: "write-cover-letter", label: "Writing cover letter", duration: 1400 },
  { id: "enhance", label: "Enhancing documents", duration: 1000 },
  { id: "packaging", label: "Packaging application", duration: 800 },
];

type PipelineStatus = "idle" | "running" | "done" | "error";

export default function ApplyPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<PipelineStatus>("idle");
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!url.trim()) return;

    setStatus("running");
    setCurrentStepIdx(0);
    setCompletedSteps(new Set());
    setError(null);

    // POST to API to enqueue the job
    let jobId = `demo-${Date.now()}`;
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = (await res.json()) as { jobId: string };
        jobId = data.jobId;
      }
    } catch {
      // Continue with demo mode even if API fails
    }

    // Animate through pipeline steps
    for (let i = 0; i < PIPELINE_STEPS.length; i++) {
      setCurrentStepIdx(i);
      await new Promise((r) => setTimeout(r, PIPELINE_STEPS[i].duration));
      setCompletedSteps((prev) => new Set([...prev, i]));
    }

    setStatus("done");

    // Redirect to review page
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/apply/${jobId}`);
  }

  const isRunning = status === "running";
  const isDone = status === "done";

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-[#1C1917]">
          Apply to a job
        </h1>
        <p className="mt-1 text-[#57534E]">
          Paste a job URL. Atlas will tailor your CV, write a cover letter, and
          draft your outreach email.
        </p>
      </div>

      {/* URL input card */}
      <div className="rounded-2xl border border-[#EDEAE4] bg-white p-6 shadow-sm mb-6">
        <label className="mb-2 block text-sm font-medium text-[#1C1917]">
          Job listing URL
        </label>
        <div className="flex gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isRunning) void handleApply();
            }}
            placeholder="https://jobs.lever.co/company/role-id"
            disabled={isRunning || isDone}
            className="border-[#EDEAE4] bg-[#FAFAF8] text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
          />
          <button
            type="button"
            onClick={() => void handleApply()}
            disabled={!url.trim() || isRunning || isDone}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isRunning ? "Working…" : "Apply Now"}
          </button>
        </div>
        <p className="mt-2 text-xs text-[#A8A29E]">
          Supports LinkedIn, Greenhouse, Lever, Workday, Ashby, and more
        </p>
      </div>

      {/* Pipeline progress */}
      {(isRunning || isDone) && (
        <div className="rounded-2xl border border-[#EDEAE4] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-[#1C1917]">
              {isDone ? "Application ready!" : "Building your application…"}
            </p>
            {isDone && (
              <span className="rounded-full bg-[#CCFBF1] px-3 py-0.5 text-xs font-semibold text-[#0D9488]">
                Complete
              </span>
            )}
          </div>

          <div className="space-y-3">
            {PIPELINE_STEPS.map((step, i) => {
              const done = completedSteps.has(i);
              const active = currentStepIdx === i && !done;

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-[#0D9488]" />
                    ) : active ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#0D9488]" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#EDEAE4]" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      done
                        ? "text-[#1C1917] font-medium"
                        : active
                        ? "text-[#0D9488] font-medium"
                        : "text-[#A8A29E]"
                    )}
                  >
                    {step.label}
                  </span>
                  {done && (
                    <span className="ml-auto text-xs text-[#A8A29E]">Done</span>
                  )}
                  {active && (
                    <span className="ml-auto text-xs text-[#0D9488]">
                      In progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {isDone && (
            <p className="mt-5 text-center text-sm text-[#57534E]">
              Redirecting to your application review…
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Supported boards */}
      {status === "idle" && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
            How it works
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Paste URL",
                desc: "Drop in any job listing URL",
              },
              {
                step: "2",
                title: "Atlas works",
                desc: "AI tailors CV + writes cover letter in ~60s",
              },
              {
                step: "3",
                title: "Review & send",
                desc: "Edit anything, then send with one click",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl border border-[#EDEAE4] bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#CCFBF1] text-xs font-bold text-[#0D9488]">
                  {step}
                </div>
                <p className="text-sm font-semibold text-[#1C1917]">{title}</p>
                <p className="text-xs text-[#57534E]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
