'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockTranscriptLine } from '../mockSession';

const SPEAKER_LABELS: Record<MockTranscriptLine['speaker'], string> = {
  candidate: 'Candidate',
  interviewer: 'You',
  ai: 'molave',
};

const SPEAKER_TONES: Record<MockTranscriptLine['speaker'], string> = {
  candidate: 'text-[var(--color-amber)]',
  interviewer: 'text-[var(--color-ink-soft)]',
  ai: 'text-[var(--color-amber-deep)]',
};

/** Collapsible live transcript. Default-closed. */
export function TranscriptPane({ lines }: { lines: MockTranscriptLine[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-2 py-2 text-left transition-colors hover:text-[var(--color-ink)]"
      >
        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          <span aria-hidden className="block h-px w-3 bg-[var(--color-rule-strong)]" />
          Transcript
        </span>
        <span className="inline-flex items-center gap-1 text-[10.5px] text-[var(--color-muted)]">
          {lines.length} lines
          {open ? (
            <ChevronUp strokeWidth={1.4} className="h-3 w-3" />
          ) : (
            <ChevronDown strokeWidth={1.4} className="h-3 w-3" />
          )}
        </span>
      </button>

      {open && (
        <ol className="mt-2 max-h-[280px] overflow-y-auto pr-1">
          {lines.map((line) => (
            <li
              key={line.id}
              className="grid grid-cols-[40px_72px_1fr] items-start gap-3 border-b border-[var(--color-rule)] py-2.5 last:border-b-0"
            >
              <span className="font-mono text-[10px] text-[var(--color-muted)]">{line.at}</span>
              <span
                className={cn(
                  'text-[10px] uppercase tracking-[0.22em]',
                  SPEAKER_TONES[line.speaker],
                )}
              >
                {SPEAKER_LABELS[line.speaker]}
              </span>
              <p className="text-[12.5px] leading-snug text-[var(--color-ink)]">{line.text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
