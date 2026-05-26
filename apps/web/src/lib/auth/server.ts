import { cache } from 'react';
import { cookies } from 'next/headers';
import { ApiError } from '../api/client';
import { getMe } from '../api/auth';
import type { PublicUser } from '@ai-interview/shared';

/**
 * Server-side: resolve the current user by forwarding the request cookies
 * to the api. Returns null on 401, throws on other errors.
 *
 * Wrapped in React `cache()` so the layout, the page, and any nested
 * server components share one api call per render.
 */
export const currentUser = cache(async (): Promise<PublicUser | null> => {
  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
  if (!cookieHeader) return null;
  try {
    const { user } = await getMe(cookieHeader);
    return user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});
