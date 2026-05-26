import { Bot, EyeOff, Headphones } from 'lucide-react';
import type { AIMode } from '../mockSession';

const MODE_CONFIG: Record<AIMode, { Icon: typeof Bot; label: string; tone: string }> = {
  active: {
    Icon: Bot,
    label: 'AI active',
    tone: 'text-[var(--color-amber)] border-[var(--color-amber)]',
  },
  copilot: {
    Icon: Headphones,
    label: 'AI co-pilot',
    tone: 'text-[var(--color-amber-deep)] border-[color-mix(in_oklch,var(--color-amber)_60%,var(--color-rule))]',
  },
  spectator: {
    Icon: EyeOff,
    label: 'AI spectator',
    tone: 'text-[var(--color-ink-soft)] border-[var(--color-rule-strong)]',
  },
};

/** Shows the AI's current role in this session. Compact. */
export function AIModeChip({ mode }: { mode: AIMode }) {
  const { Icon, label, tone } = MODE_CONFIG[mode];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10.5px] uppercase tracking-[0.22em] ${tone}`}
    >
      <Icon strokeWidth={1.4} className="h-3 w-3" />
      {label}
    </span>
  );
}
