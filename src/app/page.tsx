'use client'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accentLavender/30 via-white to-accentTeal/30 p-8 sm:p-12 shadow-sm ring-1 ring-gray-200/70">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Ease Your Mind
          </h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">
            Your compassionate, evidence-based companion to capture worries, challenge unhelpful thinking, and build resilient calm.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/add-worry" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accentLavender to-accentTeal text-white px-6 py-3 text-sm font-semibold shadow hover:shadow-md focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Start Now
            </Link>
            <Link href="/companion" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              Learn More
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accentTeal/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accentLavender/20 blur-3xl" />
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
