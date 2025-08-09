'use client'
import Link from 'next/link';
import { useTranslation } from '@/lib/intl';

export default function LocalePage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-white to-cyan-500/20 dark:from-purple-500/10 dark:via-gray-900 dark:to-cyan-500/10 p-8 sm:p-12 shadow-lg ring-1 ring-purple-200/50 dark:ring-purple-800/50">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-purple-800 to-cyan-600 dark:from-purple-400 dark:via-purple-300 dark:to-cyan-400">
            {t('home.hero.title')}
          </h1>
          <p className="mt-5 text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
            {t('dashboard.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/add-worry" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus-visible:ring-2 ring-purple-500/40 transition-all duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              {t('dashboard.addWorry')}
            </Link>
            <Link href="/companion" className="inline-flex items-center gap-2 rounded-xl border-2 border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-6 py-3 text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 focus:outline-none focus-visible:ring-2 ring-purple-500/40 transition-all duration-200">
              {t('home.hero.learnMore')}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 dark:bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-purple-500/20 dark:bg-purple-400/10 blur-3xl" />
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400">{t('home.howItWorks.title')}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl">{t('home.howItWorks.subtitle')}</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: t('home.steps.capture.title'), desc: t('home.steps.capture.desc'), color: 'from-purple-500 to-purple-600' },
            { title: t('home.steps.challenge.title'), desc: t('home.steps.challenge.desc'), color: 'from-indigo-500 to-purple-500' },
            { title: t('home.steps.reframe.title'), desc: t('home.steps.reframe.desc'), color: 'from-cyan-500 to-indigo-500' },
          ].map((card, i) => (
            <div key={card.title} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-purple-200/50 dark:border-purple-700/50 p-6 flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${card.color}/10 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg`}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="grid gap-6 md:grid-cols-2">
        {[
          { href: '/calm-corner', title: t('home.quickAccess.calmCorner.title'), subtitle: t('home.quickAccess.calmCorner.subtitle'), icon: '🫧', gradient: 'from-blue-500 to-cyan-500' },
          { href: '/easeboard', title: t('navigation.dashboard'), subtitle: t('home.quickAccess.dashboard.subtitle'), icon: '📊', gradient: 'from-purple-500 to-pink-500' },
        ].map(tile => (
          <Link key={tile.href} href={tile.href} className="group relative overflow-hidden rounded-2xl border border-purple-200/50 dark:border-purple-700/50 bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient}/0 group-hover:${tile.gradient}/10 transition-colors`} />
            <div className="relative z-10 flex items-start gap-4">
              <div className="text-4xl" aria-hidden>{tile.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">{tile.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tile.subtitle}</p>
              </div>
              <div className="mt-1 text-gray-400 group-hover:text-purple-500 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
