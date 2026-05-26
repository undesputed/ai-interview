import type { PublicUser } from '@ai-interview/shared';
import { AppSidebar } from '@/components/organisms/AppSidebar';

interface AppShellProps {
  user: PublicUser;
  children: React.ReactNode;
}

/**
 * App chrome: persistent sidebar + content slot. Each page is responsible
 * for rendering its own AppHeader at the top of `children` so titles and
 * eyebrows can vary per route.
 */
export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--color-canvas)]">
      <AppSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
