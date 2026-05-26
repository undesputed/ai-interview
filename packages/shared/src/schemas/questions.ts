import { z } from 'zod';

/**
 * Question library schemas — shared between web (react-hook-form) and api
 * (Nest pipe). Lowercase enum strings on the wire; the api maps them to
 * Prisma's UPPERCASE enum internally.
 */

export const questionSetAudienceSchema = z.enum(['ai', 'human', 'both']);
export type QuestionSetAudience = z.infer<typeof questionSetAudienceSchema>;

export const questionSetStatusSchema = z.enum(['draft', 'published']);
export type QuestionSetStatus = z.infer<typeof questionSetStatusSchema>;

export const localeSchema = z.enum(['en-PH', 'ja-JP', 'zh-CN']);
export type Locale = z.infer<typeof localeSchema>;

// ── Question (inside a set) ──────────────────────────────────────────

export const questionTextSchema = z
  .string()
  .trim()
  .min(1, 'Question text is required.')
  .max(1000, 'Question is too long.');

export const questionSignalSchema = z
  .string()
  .trim()
  .max(120, 'Signal label is too long.')
  .optional();

export const questionMaxFollowUpsSchema = z
  .number()
  .int()
  .min(0)
  .max(10)
  .optional();

export const createQuestionSchema = z.object({
  text: questionTextSchema,
  signal: questionSignalSchema,
  maxFollowUps: questionMaxFollowUpsSchema,
});
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = createQuestionSchema.partial();
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const reorderQuestionsSchema = z.object({
  /**
   * Question ids in their new order. Must be the complete set — the api will
   * reject if any question is missing or unknown.
   */
  questionIds: z.array(z.string().min(1)).min(1),
});
export type ReorderQuestionsInput = z.infer<typeof reorderQuestionsSchema>;

// ── QuestionSet ──────────────────────────────────────────────────────

export const questionSetNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required.')
  .max(120, 'Name is too long.');

export const questionSetDescriptionSchema = z
  .string()
  .trim()
  .max(400, 'Description is too long.')
  .optional()
  .default('');

export const attachedRolesSchema = z
  .array(z.string().trim().min(1).max(80))
  .max(50, 'Too many roles attached.')
  .optional()
  .default([]);

export const createQuestionSetSchema = z.object({
  name: questionSetNameSchema,
  description: questionSetDescriptionSchema,
  audience: questionSetAudienceSchema,
  status: questionSetStatusSchema.optional().default('draft'),
  locale: localeSchema.optional().default('en-PH'),
  attachedRoles: attachedRolesSchema,
  /**
   * Optional initial set of questions, in display order. Convenient for
   * authoring complete sets in one POST without follow-up calls.
   */
  questions: z.array(createQuestionSchema).max(200).optional(),
});
export type CreateQuestionSetInput = z.infer<typeof createQuestionSetSchema>;

export const updateQuestionSetSchema = z.object({
  name: questionSetNameSchema.optional(),
  description: questionSetDescriptionSchema.optional(),
  audience: questionSetAudienceSchema.optional(),
  status: questionSetStatusSchema.optional(),
  locale: localeSchema.optional(),
  attachedRoles: attachedRolesSchema.optional(),
});
export type UpdateQuestionSetInput = z.infer<typeof updateQuestionSetSchema>;

// ── List filters ─────────────────────────────────────────────────────

export const listQuestionSetsFilterSchema = z.object({
  audience: questionSetAudienceSchema.optional(),
  status: questionSetStatusSchema.optional(),
  locale: localeSchema.optional(),
  q: z.string().trim().min(1).max(120).optional(),
});
export type ListQuestionSetsFilter = z.infer<typeof listQuestionSetsFilterSchema>;

// ── Public response shapes ───────────────────────────────────────────

export interface PublicQuestion {
  id: string;
  text: string;
  signal: string | null;
  maxFollowUps: number | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

/** Summary returned by the list endpoint — omits the full questions array. */
export interface PublicQuestionSetSummary {
  id: string;
  name: string;
  description: string;
  audience: QuestionSetAudience;
  status: QuestionSetStatus;
  locale: Locale;
  attachedRoles: string[];
  usedInInterviews: number;
  questionCount: number;
  /** First question text (for the catalog-card pull-quote). */
  firstQuestion: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; firstName: string; lastName: string };
  updatedBy: { id: string; firstName: string; lastName: string };
}

/** Full detail shape returned by GET /question-sets/:id. */
export interface PublicQuestionSet extends Omit<PublicQuestionSetSummary, 'firstQuestion' | 'questionCount'> {
  questions: PublicQuestion[];
}
