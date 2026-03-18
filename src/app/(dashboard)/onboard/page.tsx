"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  FileText,
  PenLine,
  Sparkles,
  Bot,
  ChevronRight,
  ChevronLeft,
  Rocket,
  Check,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Welcome",
  "Your Experience",
  "Review",
  "Target Role",
  "Your Agent",
];

const SENIORITY = [
  "Intern",
  "Junior",
  "Mid-level",
  "Senior",
  "Staff / Principal",
  "Lead / Manager",
  "Director+",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  location: string | null;
  achievements: string[];
}

interface EducationEntry {
  institution: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface FactEntry {
  id: string;
  claim: string;
  category: string;
  quantified: boolean;
  impact: string | null;
}

interface ParseResult {
  masterCvId: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  summary: string | null;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  voiceProfile: {
    vocabularyLevel: string;
    writingStyle: string;
    quantifiesImpact: boolean;
    formality: number;
  };
  facts: FactEntry[];
  impactQuestions: { factId: string; questions: string[] }[];
}

interface FormState {
  uploadMethod: "upload" | "paste" | "scratch" | null;
  cvText: string;
  parseResult: ParseResult | null;
  editedName: string;
  editedEmail: string;
  editedSummary: string;
  editedSkills: string[];
  factAnswers: Record<string, string>;
  targetRole: string;
  seniority: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  remote: boolean;
  agentName: string;
}

const INITIAL: FormState = {
  uploadMethod: null,
  cvText: "",
  parseResult: null,
  editedName: "",
  editedEmail: "",
  editedSummary: "",
  editedSkills: [],
  factAnswers: {},
  targetRole: "",
  seniority: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  remote: false,
  agentName: "Atlas",
};

export default function OnboardPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  function next() {
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleParse() {
    if (!form.cvText.trim()) return;
    setParsing(true);
    setParseError(null);

    try {
      const res = await fetch("/api/cv/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: form.cvText, userId: "demo-user" }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          typeof errorData.error === "string"
            ? errorData.error
            : "Parsing failed. Check your API key and try again."
        );
      }

      const data = (await res.json()) as ParseResult;
      setForm((f) => ({
        ...f,
        parseResult: data,
        editedName: data.fullName,
        editedEmail: data.email ?? "",
        editedSummary: data.summary ?? "",
        editedSkills: data.skills,
      }));
      next();
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : "Parsing failed. Please try again."
      );
    } finally {
      setParsing(false);
    }
  }

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed || form.editedSkills.includes(trimmed)) return;
    setForm((f) => ({ ...f, editedSkills: [...f.editedSkills, trimmed] }));
    setNewSkill("");
  }

  function removeSkill(skill: string) {
    setForm((f) => ({
      ...f,
      editedSkills: f.editedSkills.filter((s) => s !== skill),
    }));
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      {/* Top bar */}
      <header className="border-b border-[#EDEAE4] bg-[#FAFAF8]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <span className="font-display text-lg font-semibold text-[#1C1917]">
            ApplyFlow
          </span>
          <span className="text-sm text-[#A8A29E]">
            Step {step + 1} of {totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[#EDEAE4]">
          <div
            className="h-full bg-[#0D9488] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Step indicators */}
      <div className="mx-auto mt-6 flex items-center gap-2 px-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all",
                i < step
                  ? "bg-[#0D9488] text-white"
                  : i === step
                  ? "border-2 border-[#0D9488] text-[#0D9488]"
                  : "border border-[#EDEAE4] text-[#A8A29E]"
              )}
            >
              {i < step ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:block",
                i === step ? "text-[#1C1917]" : "text-[#A8A29E]"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px w-4 bg-[#EDEAE4] sm:w-8" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="mx-auto mt-8 w-full max-w-2xl flex-1 px-6 pb-16">
        <div
          key={step}
          className="animate-in fade-in slide-in-from-right-4 duration-300"
        >
          {/* ── STEP 0: Welcome ─────────────────────────────────────────── */}
          {step === 0 && (
            <div>
              <h1 className="font-display mb-2 text-4xl font-semibold text-[#1C1917]">
                Let&apos;s get you hired.
              </h1>
              <p className="mb-8 text-[#57534E]">
                Start by telling us about your background. How would you like to
                set up your Master CV?
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    {
                      id: "upload" as const,
                      icon: Upload,
                      title: "Upload CV",
                      desc: "PDF or Word doc",
                    },
                    {
                      id: "paste" as const,
                      icon: PenLine,
                      title: "Paste Text",
                      desc: "Copy from LinkedIn or doc",
                    },
                    {
                      id: "scratch" as const,
                      icon: FileText,
                      title: "Start Fresh",
                      desc: "Build from scratch",
                    },
                  ] satisfies {
                    id: "upload" | "paste" | "scratch";
                    icon: React.ComponentType<{ className?: string }>;
                    title: string;
                    desc: string;
                  }[]
                ).map(({ id, icon: Icon, title, desc }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, uploadMethod: id }))}
                    className={cn(
                      "flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-150",
                      form.uploadMethod === id
                        ? "border-[#0D9488] bg-[#CCFBF1]/30 shadow-sm"
                        : "border-[#EDEAE4] bg-white hover:border-[#0D9488]/40 hover:bg-[#F5F3EF]"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        form.uploadMethod === id
                          ? "bg-[#0D9488] text-white"
                          : "bg-[#F5F3EF] text-[#57534E]"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1C1917]">{title}</p>
                      <p className="text-xs text-[#A8A29E]">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={!form.uploadMethod}
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Your Experience ──────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="font-display mb-2 text-3xl font-semibold text-[#1C1917]">
                Your experience
              </h2>
              <p className="mb-6 text-[#57534E]">
                Paste your CV text below. Atlas will extract your skills,
                experience, and education automatically.
              </p>
              <Textarea
                value={form.cvText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, cvText: e.target.value }))
                }
                placeholder="Paste your CV text here — work history, skills, education, achievements..."
                className="min-h-64 resize-y border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488] text-sm leading-relaxed"
              />

              {parseError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{parseError}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE4] px-5 py-2.5 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!form.cvText.trim() || parsing}
                  onClick={handleParse}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {parsing ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Parsing with AI…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Parse with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Review ───────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-display mb-2 text-3xl font-semibold text-[#1C1917]">
                Looking good!
              </h2>
              <p className="mb-6 text-[#57534E]">
                Atlas extracted your profile. Edit anything that looks wrong.
              </p>

              {!form.parseResult ? (
                <div className="rounded-2xl border border-[#EDEAE4] bg-white p-8 text-center text-[#A8A29E]">
                  No parsed data available. Please go back and paste your CV.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Identity — editable */}
                  <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                      Your Profile
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-[#57534E]">
                          Full Name
                        </Label>
                        <Input
                          value={form.editedName}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              editedName: e.target.value,
                            }))
                          }
                          className="border-[#EDEAE4] bg-[#FAFAF8] text-sm focus-visible:ring-[#0D9488]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[#57534E]">Email</Label>
                        <Input
                          value={form.editedEmail}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              editedEmail: e.target.value,
                            }))
                          }
                          className="border-[#EDEAE4] bg-[#FAFAF8] text-sm focus-visible:ring-[#0D9488]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary — editable */}
                  <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                      Professional Summary
                    </p>
                    <Textarea
                      value={form.editedSummary}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          editedSummary: e.target.value,
                        }))
                      }
                      className="min-h-24 resize-y border-[#EDEAE4] bg-[#FAFAF8] text-sm focus-visible:ring-[#0D9488]"
                      placeholder="No summary extracted. Add one here."
                    />
                  </div>

                  {/* Experience */}
                  {form.parseResult.experience.length > 0 && (
                    <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                        Experience (
                        {form.parseResult.experience.length} roles)
                      </p>
                      <div className="space-y-3">
                        {form.parseResult.experience.map((exp, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0D9488]" />
                            <div>
                              <p className="text-sm font-medium text-[#1C1917]">
                                {exp.role}
                              </p>
                              <p className="text-xs text-[#57534E]">
                                {exp.company}
                                {exp.startDate &&
                                  ` · ${exp.startDate} – ${exp.current ? "Present" : (exp.endDate ?? "")}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills — editable tags */}
                  <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                      Skills ({form.editedSkills.length} extracted)
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.editedSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="flex items-center gap-1 rounded-lg bg-[#F5F3EF] px-3 py-1 text-xs font-medium text-[#57534E] hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          {skill}
                          <span className="text-[#A8A29E] hover:text-red-500">
                            ×
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add a skill and press Enter"
                        className="border-[#EDEAE4] bg-[#FAFAF8] text-sm focus-visible:ring-[#0D9488]"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="rounded-xl border border-[#EDEAE4] px-4 py-2 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Fact Vault */}
                  <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                        Fact Vault
                      </p>
                      <span className="rounded-full bg-[#CCFBF1] px-2.5 py-0.5 text-xs font-semibold text-[#0D9488]">
                        {form.parseResult.facts.length} verified facts
                      </span>
                    </div>
                    <p className="text-xs text-[#57534E] mb-3">
                      {
                        form.parseResult.facts.filter((f) => f.quantified)
                          .length
                      }{" "}
                      facts are already quantified.{" "}
                      {
                        form.parseResult.facts.filter((f) => !f.quantified)
                          .length
                      }{" "}
                      need impact data.
                    </p>

                    {/* Voice profile summary */}
                    {form.parseResult.voiceProfile && (
                      <div className="rounded-xl bg-[#F5F3EF] px-3 py-2 text-xs text-[#57534E]">
                        Writing style:{" "}
                        <span className="font-medium text-[#1C1917]">
                          {form.parseResult.voiceProfile.vocabularyLevel},{" "}
                          {form.parseResult.voiceProfile.writingStyle}
                          {form.parseResult.voiceProfile.quantifiesImpact &&
                            ", quantified"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Impact questions for unquantified facts */}
                  {form.parseResult.impactQuestions.length > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                        <p className="text-sm font-semibold text-amber-900">
                          Help Atlas quantify your impact
                        </p>
                      </div>
                      <p className="text-xs text-amber-700 mb-4">
                        Answer these optional questions to make your CV more
                        compelling. Skip any you can&apos;t answer.
                      </p>
                      <div className="space-y-5">
                        {form.parseResult.impactQuestions
                          .slice(0, 5)
                          .map(({ factId, questions }) => {
                            const fact = form.parseResult?.facts.find(
                              (f) => f.id === factId
                            );
                            if (!fact) return null;
                            return (
                              <div key={factId} className="space-y-2">
                                <p className="text-xs font-medium text-amber-800 italic">
                                  &ldquo;{fact.claim}&rdquo;
                                </p>
                                {questions.map((q, qi) => (
                                  <div key={qi} className="space-y-1">
                                    <p className="text-xs text-amber-700">
                                      {q}
                                    </p>
                                    <Input
                                      value={
                                        form.factAnswers[`${factId}-${qi}`] ??
                                        ""
                                      }
                                      onChange={(e) =>
                                        setForm((f) => ({
                                          ...f,
                                          factAnswers: {
                                            ...f.factAnswers,
                                            [`${factId}-${qi}`]: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="Your answer (optional)"
                                      className="border-amber-200 bg-white text-xs focus-visible:ring-amber-400"
                                    />
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE4] px-5 py-2.5 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E] shadow-sm"
                >
                  Looks good
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Target Role ──────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="font-display mb-2 text-3xl font-semibold text-[#1C1917]">
                What are you targeting?
              </h2>
              <p className="mb-6 text-[#57534E]">
                Help Atlas understand the kinds of roles you want to apply for.
              </p>

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1C1917]">
                      Target role
                    </Label>
                    <Input
                      value={form.targetRole}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, targetRole: e.target.value }))
                      }
                      placeholder="e.g. Senior Product Designer"
                      className="border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1C1917]">
                      Seniority
                    </Label>
                    <Select
                      value={form.seniority}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, seniority: v ?? "" }))
                      }
                    >
                      <SelectTrigger className="border-[#EDEAE4] bg-white text-[#1C1917] focus:ring-[#0D9488]">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {SENIORITY.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#1C1917]">
                    Preferred location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    placeholder="e.g. New York, London, or Remote"
                    className="border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#1C1917]">
                    Expected salary range
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={form.salaryMin}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, salaryMin: e.target.value }))
                      }
                      placeholder="Min e.g. 80,000"
                      className="border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
                    />
                    <span className="shrink-0 text-sm text-[#A8A29E]">to</span>
                    <Input
                      value={form.salaryMax}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, salaryMax: e.target.value }))
                      }
                      placeholder="Max e.g. 120,000"
                      className="border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#EDEAE4] bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">
                      Open to remote
                    </p>
                    <p className="text-xs text-[#A8A29E]">
                      Include fully-remote and hybrid roles
                    </p>
                  </div>
                  <Switch
                    checked={form.remote}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, remote: v }))
                    }
                    className="data-[state=checked]:bg-[#0D9488]"
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE4] px-5 py-2.5 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!form.targetRole}
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Your Agent ───────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="font-display mb-2 text-3xl font-semibold text-[#1C1917]">
                Meet your agent.
              </h2>
              <p className="mb-8 text-[#57534E]">
                Give your AI hiring agent a name. It will work around the clock
                to get you hired.
              </p>

              {/* Agent preview */}
              <div className="mb-8 flex flex-col items-center rounded-2xl border border-[#EDEAE4] bg-white py-10 shadow-sm">
                <div className="relative mb-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0D9488] shadow-md">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-5 w-5 rounded-full bg-emerald-400 border-2 border-white" />
                  </span>
                </div>
                <p className="font-display text-2xl font-semibold text-[#1C1917]">
                  {form.agentName || "Atlas"}
                </p>
                <p className="mt-1 text-sm text-[#57534E]">
                  Your personal AI hiring agent
                </p>
              </div>

              {/* Name input */}
              <div className="mb-6 space-y-1.5">
                <Label className="text-sm font-medium text-[#1C1917]">
                  Agent name
                </Label>
                <Input
                  value={form.agentName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, agentName: e.target.value }))
                  }
                  placeholder="Atlas"
                  className="border-[#EDEAE4] bg-white text-[#1C1917] placeholder:text-[#A8A29E] focus-visible:ring-[#0D9488]"
                />
              </div>

              {/* Capabilities */}
              <div className="mb-8 rounded-2xl bg-[#F5F3EF] p-5 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E] mb-3">
                  What {form.agentName || "Atlas"} will do
                </p>
                {[
                  "Tailor your CV for every job description",
                  "Write compelling cover letters in your voice",
                  "Draft outreach emails to hiring managers",
                  "Track every application and follow-up",
                  "Prep you for interviews with custom Q&A",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CCFBF1]">
                      <Check className="h-3 w-3 text-[#0D9488]" />
                    </div>
                    <p className="text-sm text-[#57534E]">{item}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {(form.targetRole || form.parseResult) && (
                <div className="mb-8 rounded-xl border border-[#EDEAE4] bg-white px-4 py-3 text-sm text-[#57534E] space-y-1">
                  {form.parseResult && (
                    <p>
                      CV parsed:{" "}
                      <span className="font-medium text-[#1C1917]">
                        {form.parseResult.facts.length} verified facts
                      </span>
                    </p>
                  )}
                  {form.targetRole && (
                    <p>
                      Targeting{" "}
                      <span className="font-medium text-[#1C1917]">
                        {form.seniority ? `${form.seniority} ` : ""}
                        {form.targetRole}
                      </span>
                      {form.location && (
                        <>
                          {" "}
                          in{" "}
                          <span className="font-medium text-[#1C1917]">
                            {form.location}
                          </span>
                        </>
                      )}
                      {form.remote && " (remote welcome)"}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#EDEAE4] px-5 py-2.5 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/home")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0F766E] shadow-md shadow-[#0D9488]/20"
                >
                  <Rocket className="h-4 w-4" />
                  Launch {form.agentName || "Atlas"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
