import type {
  LoginInput,
  PublicUser,
  RegisterInput,
} from '@ai-interview/shared';
import { api } from './client';

interface AuthResponse {
  user: PublicUser;
}

export function register(input: RegisterInput) {
  return api<AuthResponse>({
    path: '/auth/register',
    method: 'POST',
    body: input,
  });
}

export function login(input: LoginInput) {
  return api<AuthResponse>({
    path: '/auth/login',
    method: 'POST',
    body: input,
  });
}

export function logout() {
  return api<void>({ path: '/auth/logout', method: 'POST' });
}

export function getMe(cookieHeader?: string) {
  return api<AuthResponse>({ path: '/auth/me', cookieHeader });
}
