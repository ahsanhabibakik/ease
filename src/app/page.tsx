'use client'
import Link from 'next/link';
import { useTranslation } from '@/lib/intl';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-12">
      {/* Enhanced Hero (balanced) */}
      <section className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-[var(--c-accent)]/60 via-[var(--c-accent-alt)]/40 to-[var(--c-accent)]/60 shadow-md">
        <div className="relative rounded-[calc(1.5rem-1px)] bg-[var(--c-surface)]/90 backdrop-blur-sm px-6 py-12 sm:py-16 sm:px-12">
          <div className="mx-auto max-w-5xl grid gap-10 lg:grid-cols-2 items-center">
            {/* Text */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--c-border)] bg-[var(--c-surface-alt)] px-4 py-1 text-xs font-medium tracking-wide text-[var(--c-text-soft)] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--c-accent)] animate-pulse" /> Mind wellness toolkit
              </div>
              <h1 className="font-bold tracking-tight text-3xl sm:text-5xl leading-tight">
                <span className="bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] bg-clip-text text-transparent">Ease</span> your mind.
                <br className="hidden sm:block" /> Clarify, challenge & reframe.
              </h1>
              <p className="text-base sm:text-lg text-[var(--c-text-soft)] leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('dashboard.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-center lg:justify-start">
                <Link href="/add-worry" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] text-white px-7 py-3 text-sm font-semibold shadow hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/50">
                  {t('dashboard.addWorry')}
                </Link>
                <Link href="/companion" className="inline-flex items-center justify-center rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-alt)] px-7 py-3 text-sm font-medium text-[var(--c-text)] hover:bg-[var(--c-surface)] transition focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/40">
                  Learn how it works
                </Link>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3 text-left text-xs sm:text-sm">
                {[
                  'Capture worries fast',
                  'Evidence-based prompts',
                  'Track reframes & growth',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--c-accent)]" />
                    <span className="text-[var(--c-text-soft)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Accent Panel */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 bg-gradient-to-tr from-[var(--c-accent)]/20 to-[var(--c-accent-alt)]/20 blur-2xl" />
              <div className="relative rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface-alt)]/60 backdrop-blur-sm p-6 shadow-inner flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--c-accent)] to-[var(--c-accent-alt)] text-white font-semibold flex items-center justify-center shadow">📝</div>
                  <h2 className="text-sm font-semibold text-[var(--c-text)]">Your next gentle step</h2>
                </div>
                <p className="text-sm leading-relaxed text-[var(--c-text-soft)]">
                  Offload looping thoughts into a structured flow. Separate facts from fears, surface balanced perspectives and practice calmer narratives that stick.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  {['Log worry','Challenge belief','Reframe thought','Note action'].map(tag => (
                    <div key={tag} className="rounded-md bg-[var(--c-surface)] border border-[var(--c-border)] px-3 py-2 text-[var(--c-text-soft)] font-medium flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--c-accent)]" />{tag}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-[var(--c-text-soft)]">
                  Private by default • You own your data
                </div>
              </div>
            </div>
          </div>
          {/* Subtle corner accents */}
          <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent)]">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[var(--c-accent)]/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[var(--c-accent-alt)]/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">How Ease Helps</h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xl">A structured, science-informed flow to externalize worry, evaluate it rationally, and cultivate calm.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Capture', desc: 'Lighten mental load by safely storing and labeling worries with context.' },
            { title: 'Challenge', desc: 'Use cognitive techniques to examine evidence, distortions, and probability.' },
            { title: 'Reframe & Grow', desc: 'Generate balanced thoughts, track insights, and reinforce adaptive patterns.' },
          ].map((card, i) => (
            <div key={card.title} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200/70 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accentLavender/10 to-accentTeal/10 transition-opacity" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accentLavender to-accentTeal text-white flex items-center justify-center font-semibold mb-4 shadow-inner">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="grid gap-6 md:grid-cols-2">
        {[
          { href: '/calm-corner', title: 'Need Calm Right Now?', subtitle: 'Guided breathing & grounding tools', icon: '🫧' },
          { href: '/easeboard', title: 'Track Your Progress', subtitle: 'Patterns, insights & reframes', icon: '📊' },
        ].map(tile => (
          <Link key={tile.href} href={tile.href} className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-accentLavender/0 via-accentLavender/0 to-accentTeal/0 group-hover:from-accentLavender/10 group-hover:to-accentTeal/10 transition-colors" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="text-3xl" aria-hidden>{tile.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">{tile.title}</h3>
                <p className="text-sm text-gray-600">{tile.subtitle}</p>
              </div>
              <div className="mt-1 text-gray-400 group-hover:text-gray-500 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
