'use client'
import Link from 'next/link';
import { useTranslation } from '@/lib/intl';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-12">
      {/* Simplified Hero */}
      <section className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] px-6 py-12 sm:py-14 sm:px-10 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--c-text)]">
            Ease your mind. Track, challenge & reframe worries.
          </h1>
          <p className="text-base sm:text-lg text-[var(--c-text-soft)] max-w-2xl mx-auto leading-relaxed">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center sm:items-center max-w-md mx-auto">
            <Link href="/add-worry" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[var(--c-accent)] text-white px-6 py-3 text-sm font-medium shadow hover:shadow-md transition focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/50">
              {t('dashboard.addWorry')}
            </Link>
            <Link href="/companion" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-alt)] px-6 py-3 text-sm font-medium text-[var(--c-text)] hover:bg-[var(--c-surface)] transition focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/40">
              Learn how it works
            </Link>
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
