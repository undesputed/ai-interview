import { Sparkles } from 'lucide-react';
import { AwarenessNudge } from './AwarenessNudge';
import { TranscriptPane } from './TranscriptPane';
import { QuestionList } from './QuestionList';
import type { MockSession } from '../mockSession';

/**
 * Right-rail "voice" of the room. Awareness nudges live up top (always
 * visible), transcript collapses by default, questions list anchors the
 * bottom. This is the molave.ai signature surface.
 */
export function AwarenessRail({ session }: { session: MockSession }) {
  const liveNudges = session.nudges.filter((n) => !n.dismissed);

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col gap-6 overflow-y-auto border-l border-[var(--color-rule)] bg-[var(--color-canvas)] px-5 py-6">
      {/* Awareness */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-3 bg-[var(--color-rule-strong)]" />
            Room Awareness
          </span>
          <Sparkles strokeWidth={1.3} className="h-3.5 w-3.5 text-[var(--color-amber)]" />
        </div>

        {liveNudges.length === 0 ? (
          <p className="font-display text-[13.5px] italic leading-snug text-[var(--color-muted)]">
            Listening. The room will speak when several signals agree.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {liveNudges.map((n) => (
              <AwarenessNudge key={n.id} nudge={n} />
            ))}
          </div>
        )}

        <p className="text-[10.5px] leading-snug text-[var(--color-muted)]">
          Private to you — never broadcast. Dismiss any time.
        </p>
      </section>

      <hr className="border-t border-[var(--color-rule)]" />

      {/* Transcript (collapsible) */}
      <TranscriptPane lines={session.transcript} />

      <hr className="border-t border-[var(--color-rule)]" />

      {/* Questions */}
      <QuestionList questions={session.questions} />
    </aside>
  );
}
