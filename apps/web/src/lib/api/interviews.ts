import type {
  CompleteInterviewInput,
  CreateInterviewInput,
  ListInterviewsFilter,
  PublicInterview,
  UpdateInterviewInput,
} from '@ai-interview/shared';
import { api } from './client';

function toQuery(filter: ListInterviewsFilter): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function listInterviews(
  filter: ListInterviewsFilter = {},
  cookieHeader?: string,
) {
  return api<PublicInterview[]>({
    path: `/interviews${toQuery(filter)}`,
    cookieHeader,
  });
}

export function getInterview(id: string, cookieHeader?: string) {
  return api<PublicInterview>({ path: `/interviews/${id}`, cookieHeader });
}

export function createInterview(input: CreateInterviewInput) {
  return api<PublicInterview>({
    path: '/interviews',
    method: 'POST',
    body: input,
  });
}

export function updateInterview(id: string, input: UpdateInterviewInput) {
  return api<PublicInterview>({
    path: `/interviews/${id}`,
    method: 'PATCH',
    body: input,
  });
}

export function completeInterview(id: string, input: CompleteInterviewInput) {
  return api<PublicInterview>({
    path: `/interviews/${id}/complete`,
    method: 'POST',
    body: input,
  });
}

export function cancelInterview(id: string) {
  return api<PublicInterview>({
    path: `/interviews/${id}/cancel`,
    method: 'POST',
  });
}

export function deleteInterview(id: string) {
  return api<void>({ path: `/interviews/${id}`, method: 'DELETE' });
}

// ── React Query keys ────────────────────────────────────────────────

export const interviewsKeys = {
  all: ['interviews'] as const,
  list: (filter: ListInterviewsFilter = {}) => ['interviews', 'list', filter] as const,
  detail: (id: string) => ['interviews', 'detail', id] as const,
};
