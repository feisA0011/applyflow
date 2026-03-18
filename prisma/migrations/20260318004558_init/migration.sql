-- CreateTable
CREATE TABLE "MasterCV" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "summary" TEXT NOT NULL,
    "experience" JSONB NOT NULL,
    "education" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "projects" JSONB,
    "certifications" JSONB,
    "languages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterCV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "masterCvId" TEXT NOT NULL,
    "avgSentenceLen" DOUBLE PRECISION NOT NULL,
    "vocabularyLevel" TEXT NOT NULL,
    "quantifiesImpact" BOOLEAN NOT NULL,
    "writingStyle" TEXT NOT NULL,
    "jargonPatterns" JSONB NOT NULL,
    "sampleText" TEXT NOT NULL,
    "formality" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerifiedFact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "masterCvId" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "technologies" JSONB NOT NULL,
    "timeframe" TEXT,
    "impact" TEXT,
    "quantified" BOOLEAN NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'user_input',
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "lastUsedIn" TEXT,
    "successRate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerifiedFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerTarget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "seniority" TEXT,
    "locations" JSONB NOT NULL,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "industries" JSONB NOT NULL,
    "companySize" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerTargetId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "currentLevel" TEXT,
    "requiredLevel" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "learningPath" JSONB,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillGap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveredJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "careerTargetId" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "url" TEXT NOT NULL,
    "salary" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "matchReason" JSONB,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscoveredJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "salary" TEXT,
    "jobType" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'ingested',
    "inputHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "keyRequirements" JSONB NOT NULL,
    "niceToHaves" JSONB,
    "techStack" JSONB,
    "companyCulture" TEXT,
    "roleLevel" TEXT,
    "roleType" TEXT,
    "keywords" JSONB NOT NULL,
    "matchScore" DOUBLE PRECISION,
    "matchReasons" JSONB,
    "companyResearch" JSONB,
    "inputHash" TEXT NOT NULL,
    "providerUsed" TEXT,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvVersion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "masterCvId" TEXT,
    "jobId" TEXT,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "experience" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "projects" JSONB,
    "factIdsUsed" JSONB,
    "optimizations" JSONB,
    "matchScore" DOUBLE PRECISION,
    "inputHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "cvVersionId" TEXT,
    "content" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "keyPoints" JSONB,
    "factIdsUsed" JSONB,
    "inputHash" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPack" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "cvVersionId" TEXT,
    "coverLetterId" TEXT,
    "cvPdfUrl" TEXT,
    "coverLetterPdfUrl" TEXT,
    "emailSubject" TEXT,
    "emailBody" TEXT,
    "recipientEmail" TEXT,
    "applicationScore" DOUBLE PRECISION,
    "authenticityScore" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "tailoredCV" TEXT,
    "coverLetter" TEXT,
    "emailSubject" TEXT,
    "emailBody" TEXT,
    "matchScore" DOUBLE PRECISION,
    "keyMatches" JSONB,
    "gaps" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "appliedAt" TIMESTAMP(3),
    "contactName" TEXT,
    "contactEmail" TEXT,
    "interviews" JSONB,
    "notes" TEXT,
    "followUpAt" TIMESTAMP(3),
    "applyMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthenticityAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvVersionId" TEXT NOT NULL,
    "factIdsUsed" JSONB NOT NULL,
    "factsOmitted" JSONB NOT NULL,
    "changesFromMaster" JSONB NOT NULL,
    "authenticityScore" DOUBLE PRECISION NOT NULL,
    "aiDetectionScore" DOUBLE PRECISION NOT NULL,
    "keywordDensity" DOUBLE PRECISION NOT NULL,
    "voiceMatchScore" DOUBLE PRECISION NOT NULL,
    "fabricatedContent" BOOLEAN NOT NULL DEFAULT false,
    "userApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthenticityAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "resendId" TEXT,
    "type" TEXT NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewPrep" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "companyResearch" JSONB,
    "predictedQuestions" JSONB NOT NULL,
    "answerFrameworks" JSONB,
    "interviewDate" TIMESTAMP(3),
    "interviewType" TEXT,
    "mockSessions" JSONB,
    "thankYouSent" BOOLEAN NOT NULL DEFAULT false,
    "debriefNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewPrep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "baseSalary" INTEGER,
    "bonus" INTEGER,
    "equity" TEXT,
    "benefits" JSONB,
    "startDate" TIMESTAMP(3),
    "marketData" JSONB,
    "benchmarkScore" DOUBLE PRECISION,
    "counterOffers" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileUrl" TEXT,
    "currentHeadline" TEXT,
    "currentAbout" TEXT,
    "optimizationScore" DOUBLE PRECISION,
    "suggestions" JSONB,
    "lastAnalyzedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkedInPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LinkedInPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalAgent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "masterCvId" TEXT,
    "name" TEXT NOT NULL DEFAULT 'Atlas',
    "autonomyLevel" INTEGER NOT NULL DEFAULT 2,
    "canSendFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "canPostLinkedIn" BOOLEAN NOT NULL DEFAULT false,
    "canAutoApply" BOOLEAN NOT NULL DEFAULT false,
    "minMatchScore" INTEGER NOT NULL DEFAULT 80,
    "maxDailyApps" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActiveAt" TIMESTAMP(3),
    "totalActions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentLearning" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "appliedTo" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentLearning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workflowType" TEXT NOT NULL,
    "jobId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "currentStep" TEXT,
    "stepOutputs" JSONB,
    "errorMessage" TEXT,
    "errorStep" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "durationMs" INTEGER,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "tier" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "applicationsUsed" INTEGER NOT NULL DEFAULT 0,
    "applicationsLimit" INTEGER NOT NULL DEFAULT 3,
    "creditsBalance" INTEGER NOT NULL DEFAULT 0,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "agentName" TEXT,
    "model" TEXT,
    "tokensIn" INTEGER,
    "tokensOut" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "promptText" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "totalUses" INTEGER NOT NULL DEFAULT 0,
    "avgAuthenticityScore" DOUBLE PRECISION,
    "avgResponseRate" DOUBLE PRECISION,
    "avgUserSatisfaction" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregateInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "dataPoints" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "appliedTo" TEXT NOT NULL,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AggregateInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterCV_userId_idx" ON "MasterCV"("userId");

-- CreateIndex
CREATE INDEX "MasterCV_userId_isActive_idx" ON "MasterCV"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceProfile_masterCvId_key" ON "VoiceProfile"("masterCvId");

-- CreateIndex
CREATE INDEX "VoiceProfile_userId_idx" ON "VoiceProfile"("userId");

-- CreateIndex
CREATE INDEX "VerifiedFact_userId_idx" ON "VerifiedFact"("userId");

-- CreateIndex
CREATE INDEX "VerifiedFact_masterCvId_idx" ON "VerifiedFact"("masterCvId");

-- CreateIndex
CREATE INDEX "VerifiedFact_category_idx" ON "VerifiedFact"("category");

-- CreateIndex
CREATE INDEX "CareerTarget_userId_idx" ON "CareerTarget"("userId");

-- CreateIndex
CREATE INDEX "CareerTarget_userId_isActive_idx" ON "CareerTarget"("userId", "isActive");

-- CreateIndex
CREATE INDEX "SkillGap_userId_idx" ON "SkillGap"("userId");

-- CreateIndex
CREATE INDEX "SkillGap_careerTargetId_idx" ON "SkillGap"("careerTargetId");

-- CreateIndex
CREATE INDEX "SkillGap_status_idx" ON "SkillGap"("status");

-- CreateIndex
CREATE INDEX "DiscoveredJob_userId_idx" ON "DiscoveredJob"("userId");

-- CreateIndex
CREATE INDEX "DiscoveredJob_userId_status_idx" ON "DiscoveredJob"("userId", "status");

-- CreateIndex
CREATE INDEX "DiscoveredJob_careerTargetId_idx" ON "DiscoveredJob"("careerTargetId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_inputHash_key" ON "Job"("inputHash");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_userId_status_idx" ON "Job"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JobAnalysis_jobId_key" ON "JobAnalysis"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "JobAnalysis_inputHash_key" ON "JobAnalysis"("inputHash");

-- CreateIndex
CREATE INDEX "JobAnalysis_userId_idx" ON "JobAnalysis"("userId");

-- CreateIndex
CREATE INDEX "CvVersion_userId_idx" ON "CvVersion"("userId");

-- CreateIndex
CREATE INDEX "CvVersion_masterCvId_idx" ON "CvVersion"("masterCvId");

-- CreateIndex
CREATE INDEX "CvVersion_jobId_idx" ON "CvVersion"("jobId");

-- CreateIndex
CREATE INDEX "CoverLetter_userId_idx" ON "CoverLetter"("userId");

-- CreateIndex
CREATE INDEX "CoverLetter_jobId_idx" ON "CoverLetter"("jobId");

-- CreateIndex
CREATE INDEX "CoverLetter_cvVersionId_idx" ON "CoverLetter"("cvVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPack_jobId_key" ON "ApplicationPack"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPack_cvVersionId_key" ON "ApplicationPack"("cvVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPack_coverLetterId_key" ON "ApplicationPack"("coverLetterId");

-- CreateIndex
CREATE INDEX "ApplicationPack_userId_idx" ON "ApplicationPack"("userId");

-- CreateIndex
CREATE INDEX "ApplicationPack_userId_status_idx" ON "ApplicationPack"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_key" ON "Application"("jobId");

-- CreateIndex
CREATE INDEX "Application_userId_idx" ON "Application"("userId");

-- CreateIndex
CREATE INDEX "Application_userId_status_idx" ON "Application"("userId", "status");

-- CreateIndex
CREATE INDEX "Application_followUpAt_idx" ON "Application"("followUpAt");

-- CreateIndex
CREATE UNIQUE INDEX "AuthenticityAudit_cvVersionId_key" ON "AuthenticityAudit"("cvVersionId");

-- CreateIndex
CREATE INDEX "AuthenticityAudit_userId_idx" ON "AuthenticityAudit"("userId");

-- CreateIndex
CREATE INDEX "EmailEvent_userId_idx" ON "EmailEvent"("userId");

-- CreateIndex
CREATE INDEX "EmailEvent_applicationId_idx" ON "EmailEvent"("applicationId");

-- CreateIndex
CREATE INDEX "EmailEvent_type_idx" ON "EmailEvent"("type");

-- CreateIndex
CREATE INDEX "InterviewPrep_userId_idx" ON "InterviewPrep"("userId");

-- CreateIndex
CREATE INDEX "InterviewPrep_applicationId_idx" ON "InterviewPrep"("applicationId");

-- CreateIndex
CREATE INDEX "InterviewPrep_interviewDate_idx" ON "InterviewPrep"("interviewDate");

-- CreateIndex
CREATE INDEX "Offer_userId_idx" ON "Offer"("userId");

-- CreateIndex
CREATE INDEX "Offer_applicationId_idx" ON "Offer"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInProfile_userId_key" ON "LinkedInProfile"("userId");

-- CreateIndex
CREATE INDEX "LinkedInProfile_userId_idx" ON "LinkedInProfile"("userId");

-- CreateIndex
CREATE INDEX "LinkedInPost_userId_idx" ON "LinkedInPost"("userId");

-- CreateIndex
CREATE INDEX "LinkedInPost_userId_status_idx" ON "LinkedInPost"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAgent_userId_key" ON "PersonalAgent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonalAgent_masterCvId_key" ON "PersonalAgent"("masterCvId");

-- CreateIndex
CREATE INDEX "PersonalAgent_userId_idx" ON "PersonalAgent"("userId");

-- CreateIndex
CREATE INDEX "AgentLearning_userId_idx" ON "AgentLearning"("userId");

-- CreateIndex
CREATE INDEX "AgentLearning_agentId_idx" ON "AgentLearning"("agentId");

-- CreateIndex
CREATE INDEX "WorkflowRun_userId_idx" ON "WorkflowRun"("userId");

-- CreateIndex
CREATE INDEX "WorkflowRun_userId_status_idx" ON "WorkflowRun"("userId", "status");

-- CreateIndex
CREATE INDEX "WorkflowRun_jobId_idx" ON "WorkflowRun"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "UsageRecord_userId_idx" ON "UsageRecord"("userId");

-- CreateIndex
CREATE INDEX "UsageRecord_userId_type_idx" ON "UsageRecord"("userId", "type");

-- CreateIndex
CREATE INDEX "UsageRecord_createdAt_idx" ON "UsageRecord"("createdAt");

-- CreateIndex
CREATE INDEX "PromptVersion_userId_idx" ON "PromptVersion"("userId");

-- CreateIndex
CREATE INDEX "PromptVersion_agentName_isActive_idx" ON "PromptVersion"("agentName", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVersion_agentName_version_key" ON "PromptVersion"("agentName", "version");

-- CreateIndex
CREATE INDEX "AggregateInsight_userId_idx" ON "AggregateInsight"("userId");

-- CreateIndex
CREATE INDEX "AggregateInsight_isPromoted_idx" ON "AggregateInsight"("isPromoted");

-- AddForeignKey
ALTER TABLE "VoiceProfile" ADD CONSTRAINT "VoiceProfile_masterCvId_fkey" FOREIGN KEY ("masterCvId") REFERENCES "MasterCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedFact" ADD CONSTRAINT "VerifiedFact_masterCvId_fkey" FOREIGN KEY ("masterCvId") REFERENCES "MasterCV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillGap" ADD CONSTRAINT "SkillGap_careerTargetId_fkey" FOREIGN KEY ("careerTargetId") REFERENCES "CareerTarget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoveredJob" ADD CONSTRAINT "DiscoveredJob_careerTargetId_fkey" FOREIGN KEY ("careerTargetId") REFERENCES "CareerTarget"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAnalysis" ADD CONSTRAINT "JobAnalysis_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvVersion" ADD CONSTRAINT "CvVersion_masterCvId_fkey" FOREIGN KEY ("masterCvId") REFERENCES "MasterCV"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CvVersion" ADD CONSTRAINT "CvVersion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_cvVersionId_fkey" FOREIGN KEY ("cvVersionId") REFERENCES "CvVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPack" ADD CONSTRAINT "ApplicationPack_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPack" ADD CONSTRAINT "ApplicationPack_cvVersionId_fkey" FOREIGN KEY ("cvVersionId") REFERENCES "CvVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPack" ADD CONSTRAINT "ApplicationPack_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "CoverLetter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthenticityAudit" ADD CONSTRAINT "AuthenticityAudit_cvVersionId_fkey" FOREIGN KEY ("cvVersionId") REFERENCES "CvVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailEvent" ADD CONSTRAINT "EmailEvent_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewPrep" ADD CONSTRAINT "InterviewPrep_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalAgent" ADD CONSTRAINT "PersonalAgent_masterCvId_fkey" FOREIGN KEY ("masterCvId") REFERENCES "MasterCV"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentLearning" ADD CONSTRAINT "AgentLearning_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "PersonalAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowRun" ADD CONSTRAINT "WorkflowRun_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
