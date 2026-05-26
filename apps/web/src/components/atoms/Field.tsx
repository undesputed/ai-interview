import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, trailing, className, id, ...props },
  ref,
) {
  const inputId = id ?? `f-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={cn('group flex flex-col', className)}>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={inputId}
          className="text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]"
        >
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-[var(--color-muted)]">{hint}</span>
        )}
      </div>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          {...props}
          className="field-line text-[15px] leading-7 placeholder:opacity-60"
        />
        {trailing && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
});
