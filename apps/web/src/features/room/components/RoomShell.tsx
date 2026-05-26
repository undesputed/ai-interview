import { RoomHeader } from './RoomHeader';
import { VideoStage } from './VideoStage';
import { AwarenessRail } from './AwarenessRail';
import { RoomControls } from './RoomControls';
import type { MockSession } from '../mockSession';

/**
 * Three-zone layout: header, stage+controls, awareness rail.
 * `.room-dark` scopes the dark token set just to this subtree —
 * the rest of the app stays in warm light editorial.
 */
export function RoomShell({ session }: { session: MockSession }) {
  return (
    <div className="room-dark fixed inset-0 flex h-screen w-screen flex-col bg-[var(--color-canvas)]">
      <RoomHeader session={session} />

      <div className="flex min-h-0 flex-1">
        {/* Stage column — video + controls */}
        <div className="flex min-w-0 flex-1 flex-col">
          <VideoStage session={session} />
          <RoomControls aiMode={session.aiMode} />
        </div>

        {/* Awareness rail */}
        <AwarenessRail session={session} />
      </div>
    </div>
  );
}
