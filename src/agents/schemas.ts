import { z } from "zod";

// ── CV Structure Sub-schemas ──────────────────────────────────────────────────

export const ExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  current: z.boolean().default(false),
  location: z.string().nullable(),
  description: z.string().nullable(),
  achievements: z.array(z.string()).default([]),
});
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

export const EducationItemSchema = z.object({
  institution: z.string(),
  degree: z.string().nullable(),
  field: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  gpa: z.string().nullable(),
  achievements: z.array(z.string()).default([]),
});
export type EducationItem = z.infer<typeof EducationItemSchema>;

export const ProjectItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()).default([]),
  url: z.string().nullable(),
  highlights: z.array(z.string()).default([]),
});
export type ProjectItem = z.infer<typeof ProjectItemSchema>;

// ── CV Parser ─────────────────────────────────────────────────────────────────

export const CvParserInputSchema = z.object({
  content: z.string().min(1),
});
export type CvParserInput = z.infer<typeof CvParserInputSchema>;

export const ParsedCvSchema = z.object({
  fullName: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().nullable(),
  linkedin: z.string().nullable(),
  github: z.string().nullable(),
  summary: z.string().nullable(),
  experience: z.array(ExperienceItemSchema),
  education: z.array(EducationItemSchema),
  skills: z.array(z.string()),
  projects: z.array(ProjectItemSchema),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
});
export type ParsedCv = z.infer<typeof ParsedCvSchema>;

// ── Voice Profiler ────────────────────────────────────────────────────────────

export const VoiceProfileInputSchema = z.object({
  rawText: z.string().min(1),
});
export type VoiceProfileInput = z.infer<typeof VoiceProfileInputSchema>;

export const VoiceProfileSchema = z.object({
  avgSentenceLen: z.number().min(1),
  vocabularyLevel: z.enum(["technical", "professional", "casual"]),
  quantifiesImpact: z.boolean(),
  writingStyle: z.enum(["concise", "detailed", "narrative"]),
  jargonPatterns: z.array(z.string()),
  sampleText: z.string(),
  formality: z.number().min(0).max(1),
});
export type VoiceProfileData = z.infer<typeof VoiceProfileSchema>;

// ── Fact Extractor ────────────────────────────────────────────────────────────

export const FactCategorySchema = z.enum([
  "experience",
  "education",
  "skill",
  "project",
  "certification",
  "achievement",
]);
export type FactCategory = z.infer<typeof FactCategorySchema>;

export const VerifiedFactSchema = z.object({
  claim: z.string(),
  category: FactCategorySchema,
  technologies: z.array(z.string()).default([]),
  timeframe: z.string().nullable(),
  impact: z.string().nullable(),
  quantified: z.boolean(),
  source: z.string(), // e.g. "experience:0", "project:2"
});
export type VerifiedFact = z.infer<typeof VerifiedFactSchema>;

export const FactExtractorInputSchema = z.object({
  parsedCv: ParsedCvSchema,
});
export type FactExtractorInput = z.infer<typeof FactExtractorInputSchema>;

export const FactExtractorOutputSchema = z.object({
  facts: z.array(VerifiedFactSchema),
});
export type FactExtractorOutput = z.infer<typeof FactExtractorOutputSchema>;

// ── Impact Miner ──────────────────────────────────────────────────────────────

export const ImpactMinerInputSchema = z.object({
  factId: z.string(),
  claim: z.string(),
  category: z.string(),
  context: z.string().optional(),
});
export type ImpactMinerInput = z.infer<typeof ImpactMinerInputSchema>;

export const ImpactMinerOutputSchema = z.object({
  factId: z.string(),
  questions: z.array(z.string()).min(2).max(3),
});
export type ImpactMinerOutput = z.infer<typeof ImpactMinerOutputSchema>;

// ── Job Scraping ──────────────────────────────────────────────────────────────

export const JobScrapingInputSchema = z.object({
  url: z.string().url(),
});
export type JobScrapingInput = z.infer<typeof JobScrapingInputSchema>;

export const JobScrapingOutputSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().nullable(),
  description: z.string(),
  requirements: z.array(z.string()),
  salary: z.string().nullable(),
  techStack: z.array(z.string()),
  remote: z.boolean(),
});
export type JobScrapingOutput = z.infer<typeof JobScrapingOutputSchema>;

// ── Match Analysis ────────────────────────────────────────────────────────────

export const MatchAnalysisInputSchema = z.object({
  masterCv: z.record(z.string(), z.unknown()),
  jobData: JobScrapingOutputSchema,
});
export type MatchAnalysisInput = z.infer<typeof MatchAnalysisInputSchema>;

export const MatchAnalysisOutputSchema = z.object({
  matchScore: z.number().min(0).max(100),
  keyMatches: z.array(z.string()),
  gaps: z.array(z.string()),
  keywords: z.array(z.string()),
  roleLevel: z.string(),
});
export type MatchAnalysisOutput = z.infer<typeof MatchAnalysisOutputSchema>;

// ── CV Tailoring ──────────────────────────────────────────────────────────────

export const CvTailoringInputSchema = z.object({
  factVault: z.array(z.record(z.string(), z.unknown())),
  analysis: MatchAnalysisOutputSchema,
  voiceProfile: z.record(z.string(), z.unknown()),
});
export type CvTailoringInput = z.infer<typeof CvTailoringInputSchema>;

export const CvTailoringOutputSchema = z.object({
  tailoredSummary: z.string(),
  selectedFacts: z.array(z.string()),
  skillOrder: z.array(z.string()),
  optimizations: z.array(z.string()),
  authenticityScore: z.number().min(0).max(100),
});
export type CvTailoringOutput = z.infer<typeof CvTailoringOutputSchema>;

// ── Cover Letter ──────────────────────────────────────────────────────────────

export const CoverLetterInputSchema = z.object({
  tailoredCv: z.record(z.string(), z.unknown()),
  analysis: MatchAnalysisOutputSchema,
  companyResearch: z.string().optional(),
  tone: z.enum(["professional", "enthusiastic", "concise", "narrative"]),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

export const CoverLetterOutputSchema = z.object({
  content: z.string(),
  keyPoints: z.array(z.string()),
  factIdsUsed: z.array(z.string()),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;

// ── Authenticity Check ────────────────────────────────────────────────────────

export const AuthenticityCheckInputSchema = z.object({
  document: z.string(),
  voiceProfile: z.record(z.string(), z.unknown()),
});
export type AuthenticityCheckInput = z.infer<typeof AuthenticityCheckInputSchema>;

export const AuthenticityCheckOutputSchema = z.object({
  authenticityScore: z.number().min(0).max(100),
  aiDetectionScore: z.number().min(0).max(100),
  voiceMatchScore: z.number().min(0).max(100),
  keywordDensity: z.number().min(0).max(1),
  passed: z.boolean(),
});
export type AuthenticityCheckOutput = z.infer<typeof AuthenticityCheckOutputSchema>;

// ── Email Compose ─────────────────────────────────────────────────────────────

export const EmailComposeInputSchema = z.object({
  application: z.record(z.string(), z.unknown()),
  job: JobScrapingOutputSchema,
});
export type EmailComposeInput = z.infer<typeof EmailComposeInputSchema>;

export const EmailComposeOutputSchema = z.object({
  subject: z.string(),
  body: z.string(),
  recipientSuggestions: z.array(z.string()),
});
export type EmailComposeOutput = z.infer<typeof EmailComposeOutputSchema>;

// ── Company Research ──────────────────────────────────────────────────────────

export const CompanyResearchOutputSchema = z.object({
  summary: z.string(),
  culture: z.string(),
  recentNews: z.array(z.string()),
  productsServices: z.string(),
  techStack: z.array(z.string()),
});
export type CompanyResearchOutput = z.infer<typeof CompanyResearchOutputSchema>;

// ── Relevance Mapping ─────────────────────────────────────────────────────────

export const RelevanceMappingOutputSchema = z.object({
  relevantFactIds: z.array(z.string()),
  relevanceScores: z.record(z.string(), z.number()),
  prioritizedSkills: z.array(z.string()),
});
export type RelevanceMappingOutput = z.infer<typeof RelevanceMappingOutputSchema>;

// ── Enhancer ──────────────────────────────────────────────────────────────────

export const EnhancerOutputSchema = z.object({
  enhancedContent: z.string(),
  changes: z.array(z.string()),
});
export type EnhancerOutput = z.infer<typeof EnhancerOutputSchema>;
