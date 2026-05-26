import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth/server';
import { RoomShell } from '@/features/room/components/RoomShell';
import { MOCK_SESSION } from '@/features/room/mockSession';

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoomPage({ params: _params }: RoomPageProps) {
  const user = await currentUser();
  if (!user) redirect('/login');

  // TODO: fetch the real session by id from /api/sessions/:id.
  // For now we serve the mock so the UI can be reviewed in isolation.
  return <RoomShell session={MOCK_SESSION} />;
}
