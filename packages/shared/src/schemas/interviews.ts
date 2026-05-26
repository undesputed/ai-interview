import { z } from 'zod';
import { localeSchema, type Locale } from './questions';

/**
 * Interview schemas — shared between web (react-hook-form) and api
 * (Nest pipe). Lowercase enum strings on the wire; the api maps them
 * to Prisma's UPPERCASE enum internally.
 *
 * The display-only `aiMode` ('active' | 'copilot' | 'spectator') is
 * *derived* from `conductedBy` + `aiRole` server-side — clients never
 * pass it directly.
 */

export const interviewStatusSchema = z.enum([
  'draft',
  'scheduled',
  'upcoming',
  'queued',
  'live',
  'completed',
  'cancelled',
]);
export type InterviewStatus = z.infer<typeof interviewStatusSchema>;

/** Statuses that are valid for the wire (stored or settable). */
export const interviewStatusStoredSchema = z.enum([
  'draft',
  'scheduled',
  'live',
  'completed',
  'cancelled',
]);
export type InterviewStatusStored = z.infer<typeof interviewStatusStoredSchema>;

export const interviewConductedBySchema = z.enum(['ai', 'human']);
export type InterviewConductedBy = z.infer<typeof interviewConductedBySchema>;

export const interviewAIRoleSchema = z.enum(['copilot', 'spectator']);
export type InterviewAIRole = z.infer<typeof interviewAIRoleSchema>;

export const interviewPersonaModeSchema = z.enum(['voice', 'video']);
export type InterviewPersonaMode = z.infer<typeof interviewPersonaModeSchema>;

export const interviewAIModeSchema = z.enum(['active', 'copilot', 'spectator']);
export type InterviewAIMode = z.infer<typeof interviewAIModeSchema>;

export const interviewRecommendationSchema = z.enum(['advance', 'hold', 'pass']);
export type InterviewRecommendation = z.infer<typeof interviewRecommendationSchema>;

// ── Candidate (inline payload — find-or-created on the server) ──────

export const candidatePayloadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Candidate name is required.')
    .max(200, 'Name is too long.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required.')
    .max(254)
    .email('Please enter a valid email address.'),
  preferredLocale: localeSchema.optional(),
});
export type CandidatePayload = z.infer<typeof candidatePayloadSchema>;

// ── Create / update interview ───────────────────────────────────────

const baseInterviewFields = z.object({
  roleTitle: z.string().trim().min(1, 'Role title is required.').max(200),
  roleLocation: z.string().trim().max(120).optional().default(''),
  scheduledAt: z
    .string()
    .datetime({ message: 'scheduledAt must be an ISO 8601 datetime.' }),
  durationMin: z.number().int().min(5).max(360).default(45),
  language: localeSchema.default('en-PH'),
  conductedBy: interviewConductedBySchema.default('human'),
  aiRole: interviewAIRoleSchema.optional(),
  personaMode: interviewPersonaModeSchema.default('video'),
  personaStyle: z.string().trim().max(60).default('warm'),
  questionSetId: z.string().min(1).optional(),
  followUps: z.number().int().min(0).max(10).default(2),
  status: z
    .enum(['draft', 'scheduled'])
    .optional()
    .default('scheduled'),
});

export const createInterviewSchema = z
  .object({
    candidate: candidatePayloadSchema,
  })
  .merge(baseInterviewFields)
  .refine(
    (data) =>
      data.conductedBy === 'ai' ? data.aiRole === undefined : true,
    {
      message: 'aiRole should be omitted when AI conducts the interview.',
      path: ['aiRole'],
    },
  );
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

export const updateInterviewSchema = z
  .object({
    candidate: candidatePayloadSchema.optional(),
    roleTitle: z.string().trim().min(1).max(200).optional(),
    roleLocation: z.string().trim().max(120).optional(),
    scheduledAt: z.string().datetime().optional(),
    durationMin: z.number().int().min(5).max(360).optional(),
    language: localeSchema.optional(),
    conductedBy: interviewConductedBySchema.optional(),
    aiRole: interviewAIRoleSchema.nullable().optional(),
    personaMode: interviewPersonaModeSchema.optional(),
    personaStyle: z.string().trim().max(60).optional(),
    questionSetId: z.string().min(1).nullable().optional(),
    followUps: z.number().int().min(0).max(10).optional(),
    status: z.enum(['draft', 'scheduled']).optional(),
  });
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;

// ── Complete (post-interview evaluation) ────────────────────────────

export const completeInterviewSchema = z.object({
  score: z.number().min(0).max(10),
  recommendation: interviewRecommendationSchema,
  pullQuote: z.string().trim().max(400).optional(),
});
export type CompleteInterviewInput = z.infer<typeof completeInterviewSchema>;

// ── List filters ────────────────────────────────────────────────────

export const listInterviewsFilterSchema = z.object({
  /** Single status, or "upcoming" / "queued" which match scheduled rows by time. */
  status: interviewStatusSchema.optional(),
  conductedBy: interviewConductedBySchema.optional(),
  language: localeSchema.optional(),
  /** ISO date — return only interviews scheduled on this day. */
  on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'on must be YYYY-MM-DD')
    .optional(),
  q: z.string().trim().min(1).max(120).optional(),
});
export type ListInterviewsFilter = z.infer<typeof listInterviewsFilterSchema>;

// ── Public response shapes ──────────────────────────────────────────

export interface PublicCandidate {
  id: string;
  name: string;
  email: string;
  initials: string;
  preferredLocale: Locale | null;
}

export interface PublicQuestionSetRef {
  id: string;
  name: string;
}

export interface PublicInterview {
  id: string;
  candidate: PublicCandidate;
  roleTitle: string;
  roleLocation: string;
  scheduledAt: string;
  durationMin: number;
  language: Locale;

  conductedBy: InterviewConductedBy;
  aiRole: InterviewAIRole | null;
  /** Derived display value — what the UI shows as the AI's role this session. */
  aiMode: InterviewAIMode;

  personaMode: InterviewPersonaMode;
  personaStyle: string;

  questionSet: PublicQuestionSetRef | null;
  followUps: number;

  /** Includes the time-derived UPCOMING / QUEUED values for SCHEDULED rows. */
  status: InterviewStatus;

  score: number | null;
  recommendation: InterviewRecommendation | null;
  pullQuote: string | null;

  /** Only present when status === 'live'. Minutes remaining. */
  remainingMin?: number;

  createdBy: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}
