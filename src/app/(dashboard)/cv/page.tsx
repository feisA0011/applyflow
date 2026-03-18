"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Bot,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ExperienceEntry {
  company: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  location: string | null;
  description: string | null;
  achievements: string[];
}

interface EducationEntry {
  institution: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  gpa: string | null;
  achievements: string[];
}

interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
  highlights: string[];
}

interface CvData {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
}

interface FactData {
  id: string;
  claim: string;
  category: string;
  quantified: boolean;
}

interface VoiceProfileData {
  vocabularyLevel: string;
  writingStyle: string;
  quantifiesImpact: boolean;
  formality: number;
}

const EMPTY_CV: CvData = {
  id: "",
  fullName: "",
  email: "",
  phone: null,
  location: null,
  website: null,
  linkedin: null,
  github: null,
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

// ── CV Canvas (Preview) ───────────────────────────────────────────────────────

function CvCanvas({ cv }: { cv: CvData }) {
  return (
    <div className="rounded-2xl border border-[#EDEAE4] bg-white shadow-lg overflow-hidden">
      <div className="bg-[#FAFAF8] border-b border-[#EDEAE4] px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs font-medium text-[#A8A29E]">
          CV Preview — Modern template
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#EDEAE4] bg-white px-3 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors opacity-50 cursor-not-allowed"
          disabled
          title="PDF export coming soon"
        >
          <Download className="h-3 w-3" />
          Download PDF
        </button>
      </div>

      {/* Document */}
      <div
        className="p-8 text-[#1C1917] overflow-y-auto"
        style={{ minHeight: "680px", fontFamily: "var(--font-inter), sans-serif" }}
      >
        {/* Header */}
        <div className="border-b-2 border-[#0D9488] pb-5 mb-6">
          <h1
            className="text-2xl font-bold text-[#1C1917] mb-1"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            {cv.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#57534E]">
            {cv.email && <span>{cv.email}</span>}
            {cv.phone && <span>{cv.phone}</span>}
            {cv.location && <span>{cv.location}</span>}
            {cv.linkedin && (
              <span className="text-[#0D9488]">{cv.linkedin}</span>
            )}
            {cv.github && (
              <span className="text-[#0D9488]">{cv.github}</span>
            )}
            {cv.website && (
              <span className="text-[#0D9488]">{cv.website}</span>
            )}
          </div>
        </div>

        {/* Summary */}
        {cv.summary && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-2">
              Profile
            </h2>
            <p className="text-xs leading-relaxed text-[#57534E]">
              {cv.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {cv.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#1C1917]">
                        {exp.role || "Role"}
                      </p>
                      <p className="text-xs text-[#57534E]">
                        {exp.company || "Company"}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-[10px] text-[#A8A29E] shrink-0 ml-3">
                      {exp.startDate ?? ""}{" "}
                      {exp.startDate && "–"}{" "}
                      {exp.current ? "Present" : (exp.endDate ?? "")}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-[10px] text-[#57534E] leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.achievements.map((a, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-[10px] text-[#57534E]"
                        >
                          <span className="mt-1 h-1 w-1 rounded-full bg-[#0D9488] shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-2">
              Skills
            </h2>
            <p className="text-xs text-[#57534E]">{cv.skills.join(" · ")}</p>
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-3">
              Education
            </h2>
            <div className="space-y-2">
              {cv.education.map((edu, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">
                      {edu.institution}
                    </p>
                    <p className="text-[10px] text-[#57534E]">
                      {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                      {edu.gpa && ` · GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <p className="text-[10px] text-[#A8A29E] shrink-0 ml-3">
                    {edu.startDate ?? ""} {edu.startDate && "–"}{" "}
                    {edu.endDate ?? ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#0D9488] mb-3">
              Projects
            </h2>
            <div className="space-y-3">
              {cv.projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#1C1917]">
                      {proj.name}
                    </p>
                    {proj.technologies.length > 0 && (
                      <span className="text-[10px] text-[#A8A29E]">
                        · {proj.technologies.slice(0, 3).join(", ")}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#57534E] mt-0.5">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Experience form entry ─────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  index,
  onChange,
  onRemove,
}: {
  exp: ExperienceEntry;
  index: number;
  onChange: (updated: ExperienceEntry) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="rounded-xl border border-[#EDEAE4] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#F5F3EF] transition-colors"
      >
        <div>
          <p className="text-sm font-medium text-[#1C1917]">
            {exp.role || "New Role"}
          </p>
          <p className="text-xs text-[#57534E]">{exp.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-[#A8A29E]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A8A29E]" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#EDEAE4] px-4 pb-4 pt-3 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-[#57534E]">Role / Title</Label>
              <Input
                value={exp.role}
                onChange={(e) => onChange({ ...exp, role: e.target.value })}
                className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[#57534E]">Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => onChange({ ...exp, company: e.target.value })}
                className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[#57534E]">Start date</Label>
              <Input
                value={exp.startDate ?? ""}
                onChange={(e) =>
                  onChange({ ...exp, startDate: e.target.value || null })
                }
                placeholder="e.g. 2021-03"
                className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[#57534E]">
                End date (leave blank if current)
              </Label>
              <Input
                value={exp.endDate ?? ""}
                onChange={(e) =>
                  onChange({
                    ...exp,
                    endDate: e.target.value || null,
                    current: !e.target.value,
                  })
                }
                placeholder="e.g. 2024-01 or blank"
                className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-[#57534E]">Location</Label>
            <Input
              value={exp.location ?? ""}
              onChange={(e) =>
                onChange({ ...exp, location: e.target.value || null })
              }
              placeholder="e.g. San Francisco, CA"
              className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-[#57534E]">
              Achievements (one per line)
            </Label>
            <Textarea
              value={exp.achievements.join("\n")}
              onChange={(e) =>
                onChange({
                  ...exp,
                  achievements: e.target.value
                    .split("\n")
                    .filter((l) => l.trim()),
                })
              }
              placeholder="Reduced latency by 40%&#10;Led team of 5 engineers&#10;..."
              className="min-h-24 resize-y border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CvPage() {
  const [cv, setCv] = useState<CvData>(EMPTY_CV);
  const [facts, setFacts] = useState<FactData[]>([]);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfileData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetch("/api/cv")
      .then((r) => r.json())
      .then((data: { cv: CvData | null; facts: FactData[]; voiceProfile: VoiceProfileData | null }) => {
        if (data.cv) {
          setCv(data.cv);
          setHasData(true);
        }
        setFacts(data.facts ?? []);
        setVoiceProfile(data.voiceProfile ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(
    async (updated: CvData) => {
      if (!updated.id) return;
      setSaving(true);
      try {
        await fetch("/api/cv", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            masterCvId: updated.id,
            fullName: updated.fullName,
            email: updated.email,
            phone: updated.phone,
            location: updated.location,
            website: updated.website,
            linkedin: updated.linkedin,
            github: updated.github,
            summary: updated.summary,
            experience: updated.experience,
            education: updated.education,
            skills: updated.skills,
            projects: updated.projects,
          }),
        });
      } catch {
        // Ignore save errors silently
      } finally {
        setSaving(false);
      }
    },
    []
  );

  function updateCv(partial: Partial<CvData>) {
    const updated = { ...cv, ...partial };
    setCv(updated);
    // Debounced save not implemented here to keep code simple;
    // save is called on blur via onBlur handlers
  }

  function addExperience() {
    updateCv({
      experience: [
        ...cv.experience,
        {
          company: "",
          role: "",
          startDate: null,
          endDate: null,
          current: true,
          location: null,
          description: null,
          achievements: [],
        },
      ],
    });
  }

  function updateExperience(index: number, updated: ExperienceEntry) {
    const newExp = [...cv.experience];
    newExp[index] = updated;
    updateCv({ experience: newExp });
  }

  function removeExperience(index: number) {
    updateCv({
      experience: cv.experience.filter((_, i) => i !== index),
    });
  }

  function addSkill() {
    const trimmed = newSkill.trim();
    if (!trimmed || cv.skills.includes(trimmed)) return;
    updateCv({ skills: [...cv.skills, trimmed] });
    setNewSkill("");
  }

  function removeSkill(skill: string) {
    updateCv({ skills: cv.skills.filter((s) => s !== skill) });
  }

  const quantifiedCount = facts.filter((f) => f.quantified).length;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-[#EDEAE4]" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-48 w-full bg-[#EDEAE4]" />
            <Skeleton className="h-32 w-full bg-[#EDEAE4]" />
          </div>
          <Skeleton className="h-[680px] w-full bg-[#EDEAE4]" />
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#CCFBF1]">
          <Bot className="h-8 w-8 text-[#0D9488]" />
        </div>
        <h2 className="font-display mb-2 text-2xl font-semibold text-[#1C1917]">
          No Master CV yet
        </h2>
        <p className="mb-6 max-w-xs text-[#57534E]">
          Complete onboarding to parse your CV and build your Fact Vault.
        </p>
        <Link
          href="/onboard"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0D9488] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          Start onboarding
        </Link>
      </div>
    );
  }

  // ── Editor ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#1C1917]">
            Master CV
          </h1>
          <p className="text-sm text-[#57534E]">
            Your base CV — Atlas tailors it for every application.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {facts.length > 0 && (
            <span className="rounded-full border border-[#EDEAE4] bg-[#CCFBF1] px-3 py-1 text-xs font-medium text-[#0D9488]">
              {facts.length} facts · {quantifiedCount} quantified
            </span>
          )}
          {voiceProfile && (
            <span className="hidden rounded-full border border-[#EDEAE4] bg-[#F5F3EF] px-3 py-1 text-xs text-[#57534E] lg:block">
              Style: {voiceProfile.vocabularyLevel}, {voiceProfile.writingStyle}
            </span>
          )}
          {saving && (
            <span className="text-xs text-[#A8A29E]">Saving…</span>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: editor */}
        <div className="space-y-5 min-w-0">
          {/* Personal Info */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
              Personal Info
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { key: "fullName", label: "Full Name", placeholder: "Jane Doe" },
                  { key: "email", label: "Email", placeholder: "jane@example.com" },
                  { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
                  { key: "location", label: "Location", placeholder: "San Francisco, CA" },
                  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/jane" },
                  { key: "github", label: "GitHub", placeholder: "github.com/jane" },
                  { key: "website", label: "Website", placeholder: "janesmith.com" },
                ] as const
              ).map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-[#57534E]">{label}</Label>
                  <Input
                    value={(cv[key] as string) ?? ""}
                    onChange={(e) =>
                      updateCv({ [key]: e.target.value || null } as Partial<CvData>)
                    }
                    onBlur={() => save(cv)}
                    placeholder={placeholder}
                    className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
              Professional Summary
            </p>
            <Textarea
              value={cv.summary}
              onChange={(e) => updateCv({ summary: e.target.value })}
              onBlur={() => save(cv)}
              placeholder="Write a 2-3 sentence summary of your background and goals..."
              className="min-h-24 resize-y border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
            />
          </div>

          {/* Experience */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
                Experience
              </p>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-1 rounded-lg border border-[#EDEAE4] px-2.5 py-1.5 text-xs font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            {cv.experience.length === 0 ? (
              <p className="text-xs text-[#A8A29E] text-center py-4">
                No experience entries yet. Click &ldquo;Add&rdquo; to start.
              </p>
            ) : (
              <div className="space-y-2">
                {cv.experience.map((exp, i) => (
                  <ExperienceCard
                    key={i}
                    exp={exp}
                    index={i}
                    onChange={(updated) => {
                      updateExperience(i, updated);
                    }}
                    onRemove={() => removeExperience(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
              Skills
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {cv.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    removeSkill(skill);
                    void save({ ...cv, skills: cv.skills.filter((s) => s !== skill) });
                  }}
                  className="flex items-center gap-1 rounded-lg bg-[#F5F3EF] px-3 py-1 text-xs font-medium text-[#57534E] hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  {skill}
                  <span className="text-[#A8A29E]">×</span>
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
                    setTimeout(() => save(cv), 100);
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="border-[#EDEAE4] text-sm focus-visible:ring-[#0D9488]"
              />
              <button
                type="button"
                onClick={() => {
                  addSkill();
                  setTimeout(() => save(cv), 100);
                }}
                className="rounded-xl border border-[#EDEAE4] px-4 text-sm font-medium text-[#57534E] hover:bg-[#F5F3EF] transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Education */}
          <div className="rounded-2xl border border-[#EDEAE4] bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">
              Education
            </p>
            {cv.education.length === 0 ? (
              <p className="text-xs text-[#A8A29E] text-center py-2">
                No education entries.
              </p>
            ) : (
              <div className="space-y-3">
                {cv.education.map((edu, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#EDEAE4] p-3 space-y-2"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-[#57534E]">
                          Institution
                        </Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...cv.education];
                            updated[i] = { ...edu, institution: e.target.value };
                            updateCv({ education: updated });
                          }}
                          onBlur={() => save(cv)}
                          className="border-[#EDEAE4] text-xs focus-visible:ring-[#0D9488]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-[#57534E]">
                          Degree
                        </Label>
                        <Input
                          value={edu.degree ?? ""}
                          onChange={(e) => {
                            const updated = [...cv.education];
                            updated[i] = { ...edu, degree: e.target.value || null };
                            updateCv({ education: updated });
                          }}
                          onBlur={() => save(cv)}
                          className="border-[#EDEAE4] text-xs focus-visible:ring-[#0D9488]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-[#EDEAE4]" />

          {/* Fact Vault summary */}
          {facts.length > 0 && (
            <div className="rounded-2xl border border-[#CCFBF1] bg-[#CCFBF1]/20 p-4">
              <p className="text-xs font-semibold text-[#0D9488] mb-1">
                Fact Vault — {facts.length} verified facts
              </p>
              <p className="text-xs text-[#57534E]">
                {quantifiedCount} quantified · {facts.length - quantifiedCount}{" "}
                need impact data · Atlas uses these to tailor every application.
              </p>
            </div>
          )}
        </div>

        {/* Right: CV Canvas (sticky) */}
        <div className="lg:sticky lg:top-8 self-start">
          <CvCanvas cv={cv} />
        </div>
      </div>
    </div>
  );
}
