-- CreateEnum
CREATE TYPE "interview_status" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "interview_conducted_by" AS ENUM ('AI', 'HUMAN');

-- CreateEnum
CREATE TYPE "interview_ai_role" AS ENUM ('COPILOT', 'SPECTATOR');

-- CreateEnum
CREATE TYPE "interview_persona_mode" AS ENUM ('VOICE', 'VIDEO');

-- CreateEnum
CREATE TYPE "interview_recommendation" AS ENUM ('ADVANCE', 'HOLD', 'PASS');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferredLocale" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "roleLocation" TEXT NOT NULL DEFAULT '',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 45,
    "language" TEXT NOT NULL DEFAULT 'en-PH',
    "conductedBy" "interview_conducted_by" NOT NULL DEFAULT 'HUMAN',
    "aiRole" "interview_ai_role",
    "personaMode" "interview_persona_mode" NOT NULL DEFAULT 'VIDEO',
    "personaStyle" TEXT NOT NULL DEFAULT 'warm',
    "questionSetId" TEXT,
    "followUps" INTEGER NOT NULL DEFAULT 2,
    "status" "interview_status" NOT NULL DEFAULT 'DRAFT',
    "score" DOUBLE PRECISION,
    "recommendation" "interview_recommendation",
    "pullQuote" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "interviews_status_idx" ON "interviews"("status");

-- CreateIndex
CREATE INDEX "interviews_scheduledAt_idx" ON "interviews"("scheduledAt");

-- CreateIndex
CREATE INDEX "interviews_createdById_idx" ON "interviews"("createdById");

-- CreateIndex
CREATE INDEX "interviews_candidateId_idx" ON "interviews"("candidateId");

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "question_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
