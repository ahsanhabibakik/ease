'use client'
import Link from 'next/link';
import { useTranslation } from '@/lib/intl';

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--c-accent)]/20 via-[var(--c-bg)] to-[var(--c-accent-alt)]/20 p-8 sm:p-16 shadow-lg ring-1 ring-[var(--c-border)]">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] flex items-center justify-center shadow-lg">
              <span className="text-3xl">🤗</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-[var(--c-text)] to-[var(--c-text-soft)] bg-clip-text text-transparent">
                Ease Your Mind,
              </span>
              <br />
              <span className="bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] bg-clip-text text-transparent">
                Find Your Peace
              </span>
            </h1>
            <p className="text-xl text-[var(--c-text-soft)] leading-relaxed max-w-3xl mx-auto">
              {t('dashboard.subtitle')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link href="/add-worry" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)] text-white px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/40">
              <span>🫙</span>
              {t('dashboard.addWorry')}
            </Link>
            <Link href="/companion" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-[var(--c-border)] bg-[var(--c-surface)]/70 backdrop-blur px-8 py-4 text-base font-medium text-[var(--c-text)] hover:bg-[var(--c-surface)] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 ring-[var(--c-accent)]/40">
              <span>💡</span>
              Learn How It Works
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[var(--c-accent-alt)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[var(--c-accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[var(--c-accent-alt)]/5 blur-2xl" />
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
