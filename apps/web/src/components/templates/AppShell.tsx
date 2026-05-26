import type { PublicUser } from '@ai-interview/shared';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { AppHeader } from '@/components/organisms/AppHeader';

interface AppShellProps {
  user: PublicUser;
  headerEyebrow: string;
  headerTitle?: string;
  children: React.ReactNode;
}

export function AppShell({ user, headerEyebrow, headerTitle, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--color-canvas)]">
      <AppSidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader eyebrow={headerEyebrow} title={headerTitle} />
        <main className="relative flex-1 px-10 py-10">
          <div className="mx-auto w-full max-w-[1240px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
