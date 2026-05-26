/**
 * Thin fetch wrapper used both on the client and on the server.
 *
 *  - Client: omit `cookieHeader`. The browser sends/receives the httpOnly
 *    auth cookies automatically because `credentials: 'include'`.
 *  - Server (SSR / route handlers / server actions): pass the cookie header
 *    from `cookies().toString()` so the api sees the same session.
 *
 * Errors thrown are { status, message, fieldErrors? }.
 */

export interface ApiErrorPayload {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;
  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'ApiError';
    this.status = payload.status;
    this.fieldErrors = payload.fieldErrors;
  }
}

const browserBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';
/**
 * Server-side requests inside docker reach the api at `http://api:8787`,
 * not `localhost:8787`. Allow overriding via INTERNAL_API_URL.
 */
const serverBase =
  process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

function baseFor(isServer: boolean): string {
  return isServer ? serverBase : browserBase;
}

export interface ApiRequest {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Pass on the server; omit on the client. */
  cookieHeader?: string;
  /** When true, return the raw Response (e.g. to capture Set-Cookie). */
  raw?: boolean;
  signal?: AbortSignal;
}

export async function api<T = unknown>(req: ApiRequest): Promise<T> {
  const isServer = typeof window === 'undefined';
  const url = `${baseFor(isServer)}${req.path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (req.body !== undefined) headers['Content-Type'] = 'application/json';
  if (req.cookieHeader) headers.Cookie = req.cookieHeader;

  const res = await fetch(url, {
    method: req.method ?? 'GET',
    headers,
    body: req.body === undefined ? undefined : JSON.stringify(req.body),
    credentials: 'include',
    cache: 'no-store',
    signal: req.signal,
  });

  if (!res.ok) {
    let payload: ApiErrorPayload = {
      status: res.status,
      message: `Request failed (${res.status}).`,
    };
    try {
      const data = (await res.json()) as Partial<ApiErrorPayload> & {
        error?: string;
      };
      payload = {
        status: res.status,
        message: data.message ?? data.error ?? payload.message,
        fieldErrors: data.fieldErrors,
      };
    } catch {
      /* fall through with default payload */
    }
    throw new ApiError(payload);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
