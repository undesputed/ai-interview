'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/atoms/Logo';
import { LocaleSwitcher } from '@/components/organisms/LocaleSwitcher';
import { cn } from '@/lib/utils';

export function LandingNav() {
  const t = useTranslations('Nav');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: t('theRoom'), href: '#room' },
    { label: t('features'), href: '#features' },
    { label: t('safeguards'), href: '#safeguards' },
    { label: t('demo'), href: '#scenario' },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-30 transition-colors duration-300',
        scrolled
          ? 'border-b border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-canvas)_88%,transparent)] backdrop-blur'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[64px] w-full max-w-[1320px] items-center gap-8 px-6 sm:px-10">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[12.5px] tracking-tight text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:gap-4">
          <LocaleSwitcher variant="inline" className="hidden md:inline-flex" />
          <Link
            href="/login"
            className="hidden px-3 py-2 text-[12.5px] tracking-tight text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)] sm:inline"
          >
            {t('signIn')}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[var(--color-ink)] px-3.5 py-2 text-[12.5px] tracking-[0.04em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
          >
            {t('requestAccess')}
            <span aria-hidden className="font-display italic">⟶</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
