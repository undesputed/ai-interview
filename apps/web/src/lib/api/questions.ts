import type {
  CreateQuestionInput,
  CreateQuestionSetInput,
  ListQuestionSetsFilter,
  PublicQuestion,
  PublicQuestionSet,
  PublicQuestionSetSummary,
  ReorderQuestionsInput,
  UpdateQuestionInput,
  UpdateQuestionSetInput,
} from '@ai-interview/shared';
import { api } from './client';

/**
 * Build a querystring from a filter object, skipping undefined values.
 * Kept tiny on purpose — no nested objects pass through here.
 */
function toQuery(filter: ListQuestionSetsFilter): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function listQuestionSets(
  filter: ListQuestionSetsFilter = {},
  cookieHeader?: string,
) {
  return api<PublicQuestionSetSummary[]>({
    path: `/question-sets${toQuery(filter)}`,
    cookieHeader,
  });
}

export function getQuestionSet(id: string, cookieHeader?: string) {
  return api<PublicQuestionSet>({ path: `/question-sets/${id}`, cookieHeader });
}

export function createQuestionSet(input: CreateQuestionSetInput) {
  return api<PublicQuestionSet>({
    path: '/question-sets',
    method: 'POST',
    body: input,
  });
}

export function updateQuestionSet(id: string, input: UpdateQuestionSetInput) {
  return api<PublicQuestionSet>({
    path: `/question-sets/${id}`,
    method: 'PATCH',
    body: input,
  });
}

export function deleteQuestionSet(id: string) {
  return api<void>({ path: `/question-sets/${id}`, method: 'DELETE' });
}

export function addQuestion(setId: string, input: CreateQuestionInput) {
  return api<PublicQuestion>({
    path: `/question-sets/${setId}/questions`,
    method: 'POST',
    body: input,
  });
}

export function updateQuestion(
  setId: string,
  questionId: string,
  input: UpdateQuestionInput,
) {
  return api<PublicQuestion>({
    path: `/question-sets/${setId}/questions/${questionId}`,
    method: 'PATCH',
    body: input,
  });
}

export function deleteQuestion(setId: string, questionId: string) {
  return api<void>({
    path: `/question-sets/${setId}/questions/${questionId}`,
    method: 'DELETE',
  });
}

export function reorderQuestions(setId: string, input: ReorderQuestionsInput) {
  return api<PublicQuestion[]>({
    path: `/question-sets/${setId}/questions/reorder`,
    method: 'POST',
    body: input,
  });
}

// ── React Query keys ────────────────────────────────────────────────

export const questionsKeys = {
  all: ['question-sets'] as const,
  list: (filter: ListQuestionSetsFilter = {}) =>
    ['question-sets', 'list', filter] as const,
  detail: (id: string) => ['question-sets', 'detail', id] as const,
};
