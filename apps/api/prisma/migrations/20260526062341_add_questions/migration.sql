-- CreateEnum
CREATE TYPE "question_set_audience" AS ENUM ('AI', 'HUMAN', 'BOTH');

-- CreateEnum
CREATE TYPE "question_set_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "question_sets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "audience" "question_set_audience" NOT NULL,
    "status" "question_set_status" NOT NULL DEFAULT 'DRAFT',
    "locale" TEXT NOT NULL DEFAULT 'en-PH',
    "attachedRoles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "usedInInterviews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT NOT NULL,

    CONSTRAINT "question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "questionSetId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "signal" TEXT,
    "maxFollowUps" INTEGER,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "question_sets_status_idx" ON "question_sets"("status");

-- CreateIndex
CREATE INDEX "question_sets_audience_idx" ON "question_sets"("audience");

-- CreateIndex
CREATE INDEX "question_sets_createdById_idx" ON "question_sets"("createdById");

-- CreateIndex
CREATE INDEX "questions_questionSetId_position_idx" ON "questions"("questionSetId", "position");

-- AddForeignKey
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sets" ADD CONSTRAINT "question_sets_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "question_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
