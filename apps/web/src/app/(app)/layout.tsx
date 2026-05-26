import { redirect } from 'next/navigation';
import { AppShell } from '@/components/templates/AppShell';
import { currentUser } from '@/lib/auth/server';

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect('/login');

  return <AppShell user={user}>{children}</AppShell>;
}
