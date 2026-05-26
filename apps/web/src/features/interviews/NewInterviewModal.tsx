'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, ChevronDown, Send, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateInterviewInput } from '@ai-interview/shared';
import { cn } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';
import { createInterview, interviewsKeys } from '@/lib/api/interviews';

interface NewInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 1 | 2;
type ConductedBy = 'ai' | 'human';
type AIRole = 'copilot' | 'spectator';
type PersonaMode = 'voice' | 'video';

interface FormState {
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  location: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMin: number;
  language: 'en-PH' | 'ja-JP' | 'zh-CN';
  /** Primary choice — who actually conducts the conversation. */
  conductedBy: ConductedBy;
  /** Only meaningful when conductedBy === 'human'. */
  aiRole: AIRole;
  personaMode: PersonaMode;
  personaStyle: string;
  rubric: string;
  followUps: number;
}

const defaultState: FormState = {
  candidateName: '',
  candidateEmail: '',
  roleTitle: '',
  location: 'Manila',
  scheduledDate: '',
  scheduledTime: '14:00',
  durationMin: 45,
  language: 'en-PH',
  conductedBy: 'human',
  aiRole: 'copilot',
  personaMode: 'video',
  personaStyle: 'warm',
  rubric: 'senior-design',
  followUps: 2,
};

export function NewInterviewModal({ open, onOpenChange }: NewInterviewModalProps) {
  const t = useTranslations('NewInterview');
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(defaultState);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setStep(1);
    setForm(defaultState);
  };

  const close = () => {
    onOpenChange(false);
    // Defer state reset so the closing animation doesn't flash a step change
    setTimeout(reset, 200);
  };

  const mutation = useMutation({
    mutationFn: createInterview,
    onSuccess: (interview) => {
      queryClient.invalidateQueries({ queryKey: interviewsKeys.all });
      toast.success(
        t('successToast', { candidate: interview.candidate.name }),
      );
      close();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          const [field, message] = Object.entries(err.fieldErrors)[0] ?? [
            'form',
            err.message,
          ];
          toast.error(`${field}: ${message}`);
          return;
        }
        toast.error(err.message);
        return;
      }
      toast.error('Something went wrong.');
    },
  });

  const submit = (status: 'draft' | 'scheduled') => {
    // Both paths need at least date + time to satisfy the api schema.
    if (!form.scheduledDate || !form.scheduledTime) {
      toast.error('Please set a date and time.');
      return;
    }
    if (!form.candidateName.trim() || !form.candidateEmail.trim()) {
      toast.error('Candidate name and email are required.');
      setStep(1);
      return;
    }
    if (!form.roleTitle.trim()) {
      toast.error('Role title is required.');
      setStep(1);
      return;
    }

    // Treat the form's date+time as Manila wall-clock — matches brand TZ.
    const scheduledAt = `${form.scheduledDate}T${form.scheduledTime}:00+08:00`;

    const payload: CreateInterviewInput = {
      candidate: {
        name: form.candidateName.trim(),
        email: form.candidateEmail.trim().toLowerCase(),
      },
      roleTitle: form.roleTitle.trim(),
      roleLocation: form.location.trim(),
      scheduledAt,
      durationMin: form.durationMin,
      language: form.language,
      conductedBy: form.conductedBy,
      aiRole: form.conductedBy === 'human' ? form.aiRole : undefined,
      personaMode: form.personaMode,
      personaStyle: form.personaStyle,
      followUps: form.followUps,
      status,
    };

    mutation.mutate(payload);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-[oklch(0.18_0.020_60_/_0.55)] backdrop-blur-sm',
            'data-[state=open]:animate-[fade_220ms_var(--ease-out-quart)]',
          )}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2',
            'border border-[var(--color-rule-strong)] bg-[var(--color-paper)] text-[var(--color-ink)]',
            'shadow-[0_30px_80px_oklch(0.18_0.020_60_/_0.35)]',
            'data-[state=open]:animate-[rise_280ms_var(--ease-out-quart)]',
          )}
        >
          {/* ── Header strip ─────────────────────────────────────────── */}
          <header className="flex items-center justify-between border-b border-[var(--color-rule)] px-7 py-4">
            <div className="inline-flex items-center gap-3">
              <span className="text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
                {t('eyebrow')}
              </span>
              <span aria-hidden className="block h-px w-6 bg-[var(--color-rule-strong)]" />
              <span className="font-display text-[14px] italic text-[var(--color-ink-soft)]">
                {t('stepIndicator', { current: step, total: 2 })}
              </span>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="grid h-7 w-7 place-items-center text-[var(--color-muted)] transition-colors hover:bg-[var(--color-canvas)] hover:text-[var(--color-ink)]"
              >
                <X strokeWidth={1.4} className="h-3.5 w-3.5" />
              </button>
            </Dialog.Close>
          </header>

          {/* ── Body ──────────────────────────────────────────────────── */}
          <div className="px-7 py-7">
            <Dialog.Title asChild>
              <h2 className="font-display text-[34px] leading-[1.05] tracking-[-0.01em] text-[var(--color-ink)]">
                {step === 1 ? (
                  <>
                    {t('step1.headlineLine1')}{' '}
                    <em className="italic text-[var(--color-amber-deep)]">
                      {t('step1.headlineItalic')}
                    </em>
                  </>
                ) : (
                  <>
                    {t('step2.headlineLine1')}{' '}
                    <em className="italic text-[var(--color-amber-deep)]">
                      {t('step2.headlineItalic')}
                    </em>
                  </>
                )}
              </h2>
            </Dialog.Title>
            <p className="mt-2 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {step === 1 ? t('step1.subhead') : t('step2.subhead')}
            </p>

            <div className="mt-8 space-y-7">
              {step === 1 ? (
                <Step1 form={form} set={set} />
              ) : (
                <Step2 form={form} set={set} />
              )}
            </div>
          </div>

          {/* ── Footer actions ────────────────────────────────────────── */}
          <footer className="flex items-center justify-between border-t border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-paper)_82%,var(--color-canvas))] px-7 py-4">
            <button
              type="button"
              onClick={() => submit('draft')}
              disabled={mutation.isPending}
              className="text-[12px] tracking-tight text-[var(--color-muted)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] hover:underline disabled:opacity-60"
            >
              {t('saveDraft')}
            </button>

            <div className="flex items-center gap-2">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={mutation.isPending}
                  className="inline-flex items-center gap-2 border border-[var(--color-rule-strong)] bg-transparent px-4 py-2 text-[12.5px] tracking-[0.04em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)] disabled:opacity-60"
                >
                  <ArrowLeft strokeWidth={1.6} className="h-3.5 w-3.5" />
                  {t('back')}
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="group/cta inline-flex items-center gap-2 bg-[var(--color-ink)] px-4 py-2 text-[12.5px] tracking-[0.05em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
                >
                  {t('continue')}
                  <ArrowRight
                    strokeWidth={1.8}
                    className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => submit('scheduled')}
                  disabled={mutation.isPending}
                  className="group/cta inline-flex items-center gap-2 bg-[var(--color-ink)] px-4 py-2 text-[12.5px] tracking-[0.05em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)] disabled:opacity-60"
                >
                  <Send strokeWidth={1.6} className="h-3.5 w-3.5" />
                  {mutation.isPending ? '…' : t('sendInvite')}
                </button>
              )}
            </div>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Step components ──────────────────────────────────────────────────

interface StepProps {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Step1({ form, set }: StepProps) {
  const t = useTranslations('NewInterview');
  return (
    <>
      <Section eyebrow={t('section.candidate')}>
        <div className="grid gap-5 sm:grid-cols-2">
          <FieldLine
            label={t('field.candidateName')}
            placeholder="Jamie Rivera"
            value={form.candidateName}
            onChange={(v) => set('candidateName', v)}
          />
          <FieldLine
            label={t('field.candidateEmail')}
            type="email"
            placeholder="jamie@studio.work"
            value={form.candidateEmail}
            onChange={(v) => set('candidateEmail', v)}
          />
        </div>
      </Section>

      <Section eyebrow={t('section.role')}>
        <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
          <FieldLine
            label={t('field.roleTitle')}
            placeholder="Senior Product Designer"
            value={form.roleTitle}
            onChange={(v) => set('roleTitle', v)}
          />
          <FieldLine
            label={t('field.location')}
            placeholder="Manila"
            value={form.location}
            onChange={(v) => set('location', v)}
          />
        </div>
      </Section>

      <Section eyebrow={t('section.schedule')}>
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_1fr_1fr]">
          <FieldLine
            label={t('field.date')}
            type="date"
            value={form.scheduledDate}
            onChange={(v) => set('scheduledDate', v)}
          />
          <FieldLine
            label={t('field.time')}
            type="time"
            value={form.scheduledTime}
            onChange={(v) => set('scheduledTime', v)}
          />
          <SelectLine
            label={t('field.duration')}
            value={String(form.durationMin)}
            onChange={(v) => set('durationMin', Number(v))}
            options={[30, 45, 60, 90].map((m) => ({
              value: String(m),
              label: `${m} ${t('field.minutes')}`,
            }))}
          />
          <SelectLine
            label={t('field.language')}
            value={form.language}
            onChange={(v) => set('language', v as FormState['language'])}
            options={[
              { value: 'en-PH', label: 'EN · English' },
              { value: 'ja-JP', label: '日本語' },
              { value: 'zh-CN', label: '中文' },
            ]}
          />
        </div>
      </Section>
    </>
  );
}

function Step2({ form, set }: StepProps) {
  const t = useTranslations('NewInterview');
  const tConducted = useTranslations('NewInterview.conductedBy');
  const tRole = useTranslations('NewInterview.aiRole');

  const conductedOptions: { value: ConductedBy; label: string; body: string }[] = [
    { value: 'ai', label: tConducted('ai.label'), body: tConducted('ai.body') },
    { value: 'human', label: tConducted('human.label'), body: tConducted('human.body') },
  ];

  const aiRoleOptions: { value: AIRole; label: string; body: string }[] = [
    { value: 'copilot', label: tRole('copilot.label'), body: tRole('copilot.body') },
    { value: 'spectator', label: tRole('spectator.label'), body: tRole('spectator.body') },
  ];

  return (
    <>
      <Section eyebrow={t('section.conductedBy')}>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {conductedOptions.map((c) => {
            const active = form.conductedBy === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => set('conductedBy', c.value)}
                className={cn(
                  'flex flex-col items-start gap-2 border px-5 py-4 text-left transition-colors',
                  active
                    ? 'border-[var(--color-amber)] bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-amber-soft))]'
                    : 'border-[var(--color-rule)] bg-transparent hover:border-[var(--color-rule-strong)]',
                )}
              >
                <span
                  className={cn(
                    'text-[10.5px] uppercase tracking-[0.22em]',
                    active ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-muted)]',
                  )}
                >
                  {c.label}
                </span>
                <span className="font-display text-[16px] italic leading-snug text-[var(--color-ink)]">
                  {c.body}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {form.conductedBy === 'human' && (
        <Section
          eyebrow={t('section.aiRole')}
          className="fade"
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {aiRoleOptions.map((r) => {
              const active = form.aiRole === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => set('aiRole', r.value)}
                  className={cn(
                    'flex flex-col items-start gap-2 border px-4 py-3.5 text-left transition-colors',
                    active
                      ? 'border-[var(--color-amber)] bg-[color-mix(in_oklch,var(--color-paper)_70%,var(--color-amber-soft))]'
                      : 'border-[var(--color-rule)] bg-transparent hover:border-[var(--color-rule-strong)]',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10.5px] uppercase tracking-[0.22em]',
                      active ? 'text-[var(--color-amber-deep)]' : 'text-[var(--color-muted)]',
                    )}
                  >
                    {r.label}
                  </span>
                  <span className="font-display text-[13.5px] italic leading-snug text-[var(--color-ink)]">
                    {r.body}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section eyebrow={t('section.persona')}>
        <div className="grid gap-5 sm:grid-cols-[1fr_1.4fr]">
          <PillSwitch
            label={t('field.personaMode')}
            value={form.personaMode}
            options={[
              { value: 'voice', label: t('personaMode.voice') },
              { value: 'video', label: t('personaMode.video') },
            ]}
            onChange={(v) => set('personaMode', v as PersonaMode)}
          />
          <SelectLine
            label={t('field.personaStyle')}
            value={form.personaStyle}
            onChange={(v) => set('personaStyle', v)}
            options={[
              { value: 'warm', label: t('personaStyle.warm') },
              { value: 'curious', label: t('personaStyle.curious') },
              { value: 'quiet', label: t('personaStyle.quiet') },
              { value: 'formal', label: t('personaStyle.formal') },
            ]}
          />
        </div>
      </Section>

      <Section eyebrow={t('section.questions')}>
        <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
          <SelectLine
            label={t('field.rubric')}
            value={form.rubric}
            onChange={(v) => set('rubric', v)}
            options={[
              { value: 'senior-design', label: 'Senior IC design — v2' },
              { value: 'pm-behavioral', label: 'PM behavioral' },
              { value: 'eng-leadership', label: 'Engineering leadership' },
              { value: 'custom', label: t('rubric.custom') },
            ]}
          />
          <SelectLine
            label={t('field.followUps')}
            value={String(form.followUps)}
            onChange={(v) => set('followUps', Number(v))}
            options={[
              { value: '0', label: t('followUps.none') },
              { value: '1', label: t('followUps.upTo', { n: 1 }) },
              { value: '2', label: t('followUps.upTo', { n: 2 }) },
              { value: '3', label: t('followUps.upTo', { n: 3 }) },
            ]}
          />
        </div>
      </Section>
    </>
  );
}

// ── Atoms scoped to the modal ────────────────────────────────────────

function Section({
  eyebrow,
  className,
  children,
}: {
  eyebrow: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={className}>
      <div className="mb-3 inline-flex items-center gap-2">
        <span aria-hidden className="block h-px w-4 bg-[var(--color-rule-strong)]" />
        <span className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
          {eyebrow}
        </span>
      </div>
      {children}
    </section>
  );
}

function FieldLine({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field-line text-[14px]"
      />
    </label>
  );
}

function SelectLine({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="relative flex flex-col gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field-line w-full appearance-none pr-7 text-[14px] text-[var(--color-ink)]"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          strokeWidth={1.4}
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]"
        />
      </div>
    </label>
  );
}

function PillSwitch({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </span>
      <div className="inline-flex w-fit gap-px border border-[var(--color-rule)] bg-[var(--color-rule)]">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cn(
                'px-3.5 py-2 text-[12.5px] tracking-tight transition-colors',
                active
                  ? 'bg-[var(--color-ink)] text-[var(--color-canvas)]'
                  : 'bg-[var(--color-paper)] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
