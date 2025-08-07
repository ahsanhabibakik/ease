'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

interface NavItem { label: string; href: string; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Add Worry', href: '/add-worry' },
  { label: 'Worry Reflection', href: '/worry-reflection' },
  { label: 'Calm Corner', href: '/calm-corner' },
  { label: 'Easeboard', href: '/easeboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false); // close on route change
  }, [pathname]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    try { localStorage.setItem('ease-theme', isDark ? 'dark' : 'light'); } catch(e) {}
  };

  return (
    <header className={`sticky top-0 z-40 transition-shadow ${scrolled ? 'shadow-sm shadow-gray-300/40 dark:shadow-gray-900/40' : ''}`}>
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accentLavender to-accentTeal flex items-center justify-center text-white font-semibold shadow-inner">
                E
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-gray-800">Ease</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Worry Companion</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-accentTeal/40 ${
                    active
                      ? 'text-gray-900 bg-accentTeal/15 ring-1 ring-accentTeal/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accentLavender to-accentTeal" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} aria-label="Toggle theme" className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-gray-300/60 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              <svg className="h-5 w-5 hidden dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
              <svg className="h-5 w-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
            <Link href="/add-worry" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accentLavender to-accentTeal text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              Add
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300/60 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 ring-accentTeal/40"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="relative w-5 h-5">
              <span className={`absolute left-0 top-1 h-0.5 w-5 bg-current transition-all ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-2.5 h-0.5 w-5 bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition-all ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Panel */}
      {mobileOpen && (
        <div className="md:hidden border-b border-gray-200/70 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-2">
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 ring-accentTeal/40 transition-colors ${
                    active
                      ? 'text-gray-900 bg-accentTeal/15 ring-1 ring-accentTeal/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button onClick={toggleTheme} className="mt-2 inline-flex items-center justify-center rounded-lg border border-gray-300/60 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              Toggle Theme
            </button>
            <Link href="/add-worry" className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-accentLavender to-accentTeal text-white px-4 py-2 text-sm font-medium shadow hover:shadow-md focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              Add Worry
            </Link>
          </div>
        </div> )}
    </header>
  );
}
