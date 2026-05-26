import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { AppHeader } from '@/components/organisms/AppHeader';
import { SectionHeader } from '@/components/molecules/SectionHeader';
import { StatTile } from '@/components/molecules/StatTile';
import { RoomRow } from '@/components/molecules/RoomRow';
import { EvaluationCard } from '@/components/molecules/EvaluationCard';
import { InsightTile } from '@/components/molecules/InsightTile';
import { currentUser } from '@/lib/auth/server';
import { buildTodayEyebrow } from '@/lib/header-eyebrow';

export default async function DashboardPage() {
  const user = await currentUser();
  const t = await getTranslations('Dashboard');
  const tSidebar = await getTranslations('AppSidebar');
  const eyebrow = await buildTodayEyebrow();
  const firstName = user?.firstName ?? '';

  return (
    <>
      <AppHeader eyebrow={eyebrow} title={tSidebar('dashboard')} />
      <main className="relative flex-1 px-10 py-10">
        <div className="mx-auto w-full max-w-[1240px] space-y-14">
      {/* ────────────── Greeting hero ────────────── */}
      <section className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[34rem]">
            <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
              <span aria-hidden className="block h-px w-6 bg-[var(--color-rule-strong)]" />
              {t('eyebrow')}
            </span>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.02] tracking-[-0.015em] text-[var(--color-ink)]">
              {t('greetingAfternoon')}{' '}
              <em className="italic text-[var(--color-amber-deep)]">{firstName}.</em>
            </h1>
            <p className="mt-4 max-w-[40ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)]">
              {t('greetingBlurb')}
            </p>
          </div>

          <Link
            href="/rooms/sess_01h9k2x3"
            className="group/now relative flex w-full max-w-[26rem] flex-col gap-3 border border-[var(--color-rule-strong)] bg-[var(--color-paper)] p-5 transition-colors hover:border-[var(--color-ink)] lg:max-w-[24rem]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-amber-deep)]">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--color-amber)]" />
                {t('liveInMinutes', { minutes: 18 })}
              </span>
              <span className="font-display text-[22px] italic leading-none text-[var(--color-ink)]">
                14:00
              </span>
            </div>
            <h3 className="font-display text-[22px] leading-tight tracking-tight text-[var(--color-ink)]">
              {t('nowTitle')}
            </h3>
            <p className="text-[12.5px] text-[var(--color-muted)]">{t('nowMeta')}</p>
            <div className="mt-1 flex items-center justify-between border-t border-[var(--color-rule)] pt-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
                {t('tapToOpen')}
              </span>
              <ArrowRight
                strokeWidth={1.3}
                className="h-4 w-4 text-[var(--color-ink)] transition-transform group-hover/now:translate-x-1"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* ────────────── Stat row ────────────── */}
      <DashboardStats />

      {/* ────────────── Today's rooms ────────────── */}
      <section>
        <SectionHeader
          eyebrow={t('scheduleEyebrow')}
          title={t('scheduleTitle')}
          trailingHref="/schedule"
          trailingLabel={t('scheduleLink')}
        />
        <div className="border border-[var(--color-rule)] bg-[var(--color-paper)] px-5">
          <RoomRow
            time="14:00"
            type="interview"
            title="Senior Product Designer"
            subtitle="Jamie Rivera · 45 min · AI + co-pilot"
            status="queued"
            href="/rooms/sess_01h9k2x3"
          />
          <RoomRow
            time="15:30"
            type="meeting"
            title="Frontier weekly sync"
            subtitle="6 attendees · agenda reviewed · 30 min"
            status="upcoming"
          />
          <RoomRow
            time="16:45"
            type="interview"
            title="PM Lead · second round"
            subtitle="Aiko Tanaka · 60 min · ja-JP audio"
            status="upcoming"
          />
          <RoomRow
            time="18:00"
            type="meeting"
            title="Retro · launch retrospective"
            subtitle="9 attendees · async-leaning · 45 min"
            status="upcoming"
          />
        </div>
      </section>

      {/* ────────────── Two-up: evaluations + awareness ────────────── */}
      <DashboardLowerGrid />

      {/* ────────────── Closing strip ────────────── */}
      <section className="relative grid grid-cols-1 gap-6 border border-[var(--color-rule)] bg-[var(--color-paper)] p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-center lg:p-10">
        <div>
          <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-5 bg-[var(--color-rule-strong)]" />
            {t('closingEyebrow')}
          </span>
          <p className="mt-3 max-w-[44ch] font-display text-[26px] italic leading-[1.15] tracking-[-0.005em] text-[var(--color-ink)]">
            {t('closingQuote')}
          </p>
          <p className="mt-3 text-[12.5px] text-[var(--color-muted)]">{t('closingBlurb')}</p>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <Link
            href="/signals"
            className="inline-flex items-center justify-between gap-3 bg-[var(--color-ink)] px-5 py-3 text-[13px] tracking-[0.04em] text-[var(--color-canvas)] transition-colors hover:bg-[var(--color-amber-deep)]"
          >
            <span>{t('calibrate')}</span>
            <ArrowRight strokeWidth={1.6} className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/roles"
            className="inline-flex items-center justify-between gap-3 border border-[var(--color-rule-strong)] px-5 py-3 text-[13px] tracking-[0.04em] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
          >
            <span>{t('reviewPersonas')}</span>
            <ArrowRight strokeWidth={1.4} className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
        </div>
      </main>
    </>
  );
}

function DashboardStats() {
  const t = useTranslations('Dashboard');
  return (
    <section>
      <div className="grid grid-cols-1 gap-px overflow-hidden border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={t('statHoursLabel')}
          value="4.7"
          unit="hrs"
          caption={t('statHoursCaption')}
          delta={{ value: '+0.9', trend: 'up' }}
          glyph="①"
        />
        <StatTile
          label={t('statInterviewsLabel')}
          value="12"
          caption={t('statInterviewsCaption')}
          delta={{ value: '+3', trend: 'up' }}
          glyph="②"
        />
        <StatTile
          label={t('statMeetingsLabel')}
          value="38"
          caption={t('statMeetingsCaption')}
          delta={{ value: '+12', trend: 'up' }}
          glyph="③"
        />
        <StatTile
          label={t('statAcceptLabel')}
          value="87"
          unit="%"
          caption={t('statAcceptCaption')}
          delta={{ value: '−2', trend: 'down' }}
          glyph="④"
        />
      </div>
    </section>
  );
}

function DashboardLowerGrid() {
  const t = useTranslations('Dashboard');
  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div>
        <SectionHeader
          eyebrow={t('substanceEyebrow')}
          title={t('substanceTitle')}
          trailingHref="/evaluations"
          trailingLabel={t('viewAll')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EvaluationCard
            candidate="Maria Santos"
            role="Senior Designer · Manila"
            score="8.4"
            recommendation="advance"
            pullQuote="Reframed the brief twice — chose the question over the solution."
            date="May 24"
          />
          <EvaluationCard
            candidate="Hiro Watanabe"
            role="PM · Tokyo"
            score="7.1"
            recommendation="hold"
            pullQuote="Strong on rollout cadence; cautious on novel discovery."
            date="May 23"
          />
          <EvaluationCard
            candidate="Lia Reyes"
            role="Eng Manager · Manila"
            score="8.8"
            recommendation="advance"
            pullQuote="Held space for the quietest engineer in the story."
            date="May 22"
          />
          <EvaluationCard
            candidate="Noah Bautista"
            role="Designer · Manila"
            score="5.2"
            recommendation="pass"
            date="May 21"
          />
        </div>
      </div>

      <aside className="flex flex-col border border-[var(--color-rule)] bg-[var(--color-paper)] p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]">
            <span aria-hidden className="block h-px w-5 bg-[var(--color-rule-strong)]" />
            {t('awarenessEyebrow')}
          </span>
          <Sparkles strokeWidth={1.3} className="h-4 w-4 text-[var(--color-amber)]" />
        </div>
        <h2 className="mt-3 font-display text-[22px] leading-tight tracking-[-0.005em] text-[var(--color-ink)]">
          {t('awarenessTitle')}
        </h2>
        <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {t('awarenessBlurb')}
        </p>
        <div className="mt-2">
          <InsightTile
            signal="Composing a thought — give a moment"
            count={14}
            percent={92}
            caption="Most accepted nudge this week."
          />
          <InsightTile
            signal="Quiet contributor — invite into the conversation"
            count={9}
            percent={71}
            caption="Helped 4 meetings hear from 6 quiet voices."
          />
          <InsightTile
            signal="Energy dropping — consider a short pause"
            count={7}
            percent={55}
            caption="Two pauses taken, one declined."
          />
          <InsightTile
            signal="Multiple people scanning — agenda check"
            count={6}
            percent={48}
            caption="Tied to longer meetings (>45 min)."
          />
        </div>

        <Link
          href="/insights"
          className="mt-5 inline-flex w-full items-center justify-between border border-[var(--color-rule-strong)] px-4 py-2.5 text-[12.5px] tracking-tight text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas)]"
        >
          {t('openLibrary')}
          <ArrowRight strokeWidth={1.3} className="h-3.5 w-3.5" />
        </Link>
      </aside>
    </section>
  );
}
