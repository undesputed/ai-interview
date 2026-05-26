'use client';

import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface InterviewFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  aiMode: string;
  onAIModeChange: (value: string) => void;
  roleOptions: string[];
  className?: string;
}

export function InterviewFilters({
  query,
  onQueryChange,
  role,
  onRoleChange,
  aiMode,
  onAIModeChange,
  roleOptions,
  className,
}: InterviewFiltersProps) {
  const t = useTranslations('Interviews');

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Search */}
      <label className="inline-flex flex-1 min-w-[260px] items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-[13px] text-[var(--color-muted)] transition-colors focus-within:border-[var(--color-rule-strong)]">
        <Search strokeWidth={1.4} className="h-3.5 w-3.5" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-transparent text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
        />
        <kbd className="border border-[var(--color-rule)] bg-[var(--color-canvas)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
          /
        </kbd>
      </label>

      {/* Role select */}
      <FilterSelect
        label={t('filter.role')}
        value={role}
        onChange={onRoleChange}
        options={[
          { value: 'all', label: t('filter.allRoles') },
          ...roleOptions.map((r) => ({ value: r, label: r })),
        ]}
      />

      {/* AI mode select */}
      <FilterSelect
        label={t('filter.aiMode')}
        value={aiMode}
        onChange={onAIModeChange}
        options={[
          { value: 'all', label: t('filter.allModes') },
          { value: 'active', label: t('aiMode.active') },
          { value: 'copilot', label: t('aiMode.copilot') },
          { value: 'spectator', label: t('aiMode.spectator') },
        ]}
      />

      <button className="inline-flex items-center gap-2 border border-[var(--color-rule)] bg-transparent px-3 py-2 text-[12.5px] tracking-tight text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]">
        <SlidersHorizontal strokeWidth={1.4} className="h-3.5 w-3.5" />
        {t('moreFilters')}
      </button>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label className="relative inline-flex items-center gap-2 border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-2 text-[12.5px] text-[var(--color-ink-soft)] transition-colors focus-within:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)]">
      <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-4 text-[var(--color-ink)] outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-[var(--color-ink)]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        strokeWidth={1.4}
        aria-hidden
        className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-muted)]"
      />
    </label>
  );
}
