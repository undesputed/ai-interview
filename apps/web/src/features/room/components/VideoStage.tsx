import { VideoTile } from './VideoTile';
import type { MockSession } from '../mockSession';

/**
 * The video region. Candidate tile fills the stage; AI persona sits in the
 * top-left corner; self-preview sits in the bottom-right.
 */
export function VideoStage({ session }: { session: MockSession }) {
  return (
    <div className="relative flex-1 p-6">
      {/* Primary candidate tile */}
      <div className="relative h-full w-full">
        <VideoTile participant={session.candidate} variant="primary" className="h-full" />

        {/* AI persona — top-left corner */}
        <div className="absolute left-9 top-9">
          <VideoTile participant={session.ai} variant="ai-corner" />
        </div>

        {/* Self preview — bottom-right corner */}
        <div className="absolute bottom-9 right-9">
          <VideoTile participant={session.interviewer} variant="corner" />
        </div>

        {/* Caption (current question for visible-when-spoken context) */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 max-w-[64ch] -translate-x-1/2 border border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-canvas)_75%,transparent)] px-5 py-3 backdrop-blur">
          <p className="text-balance text-center font-display text-[15px] italic leading-snug text-[var(--color-ink)]">
            “{session.questions.find((q) => q.status === 'current')?.text}”
          </p>
        </div>
      </div>
    </div>
  );
}
