"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from '@/lib/intl';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

const SignInMenu = dynamic(()=>import('@/components/auth/SignInMenu'),{ ssr:false });

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signInMenuOpen, setSignInMenuOpen] = useState(false);
  
  useEffect(()=>{ setMobileMenuOpen(false); },[pathname]);

  const NAV = [
    { href:'/', label: t('navigation.home') },
    { href:'/add-worry', label: t('navigation.addWorry'), icon: '＋' },
    { href:'/worry-reflection', label: t('navigation.reflections') },
    { href:'/calm-corner', label: t('navigation.calmCorner') },
    { href:'/easeboard', label: t('navigation.dashboard') },
    { href:'/companion', label: t('navigation.help') },
  ];

  const toggleTheme = () => {
    const root = document.documentElement; const dark = root.classList.toggle('dark');
    try { localStorage.setItem('ease-theme', dark ? 'dark':'light'); } catch {}
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-[var(--c-border)] bg-[color-mix(in_srgb,var(--c-bg)_85%,transparent)] supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--c-bg)_80%,transparent)]">
      <nav aria-label="Main" className="layout-container h-[64px] flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight focus-outline">
          <span className="avatar-ring"><span className="w-9 h-9 rounded-full bg-[var(--c-surface)] text-sm font-semibold flex items-center justify-center text-[var(--c-accent)]">E</span></span>
          <span className="hidden sm:inline text-[var(--c-text)]">Ease</span>
        </Link>
        
        <button onClick={toggleTheme} className="hidden lg:inline-flex btn-ghost btn px-3 py-2 !text-sm" aria-label="Toggle theme">
          <span className="text-base">🌙</span>
        </button>
        
        {/* Mobile menu button (hidden ≥ md) */}
        <button
          onClick={()=>setMobileMenuOpen(o=>!o)}
          className="md:hidden ml-auto btn-ghost btn px-2 py-2 !text-sm flex items-center justify-center gap-1"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
        >
          <span className="relative inline-block w-5 h-3">
            <span className={clsx('absolute inset-x-0 top-0 h-0.5 rounded bg-[var(--c-text)] transition-transform', mobileMenuOpen && 'translate-y-1.5 rotate-45')} />
            <span className={clsx('absolute inset-x-0 top-1.5 h-0.5 rounded bg-[var(--c-text)] transition-opacity', mobileMenuOpen && 'opacity-0')} />
            <span className={clsx('absolute inset-x-0 bottom-0 h-0.5 rounded bg-[var(--c-text)] transition-transform', mobileMenuOpen && '-translate-y-1.5 -rotate-45')} />
          </span>
          <span className="sr-only">Menu</span>
        </button>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map(i=>{ const active = pathname===i.href; return (
            <li key={i.href}>
              <Link href={i.href} aria-current={active? 'page':undefined} className={clsx('relative px-3 py-2 text-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] flex items-center gap-1.5', active ? 'text-[var(--c-text)] bg-[var(--c-surface-alt)]':'text-[var(--c-text-soft)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-alt)]')}>
                {i.icon && <span className="text-base font-bold">{i.icon}</span>}
                <span className={clsx(i.href === '/add-worry' ? 'text-xs md:text-sm' : '')}>{i.label}</span>
                {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)]" aria-hidden />}
              </Link>
            </li> ); })}
        </ul>
        {/* Desktop Navigation Actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <LanguageSwitcher />
          
          {/* Authentication Section */}
          {!session ? (
            <div className="relative">
              <Button variant="primary" onClick={() => { setSignInMenuOpen(o=>!o); toast.message('Sign in to sync your progress'); }} className="min-w-[110px]">{t('auth.signIn')}</Button>
              {signInMenuOpen && <SignInMenu onClose={()=>setSignInMenuOpen(false)} className="absolute right-0 mt-2" />}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="focus-outline" aria-label="Profile">
                <div className="avatar-ring">
                  <div className="w-9 h-9 rounded-full bg-[var(--c-accent-soft)] flex items-center justify-center text-[var(--c-accent)] font-medium text-sm">
                    {(session.user?.name || 'U').slice(0,1).toUpperCase()}
                  </div>
                </div>
              </Link>
              <Button variant="ghost" onClick={()=>{ signOut({ callbackUrl: '/' }); toast.success('Signed out'); }}>{t('auth.signOut')}</Button>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[64px] left-0 right-0 px-4 pb-6 pt-2 bg-[var(--c-bg-soft)] border-b border-[var(--c-border)] shadow-sm">
            <ul className="flex flex-col gap-1">
              {NAV.map(i=>{ 
                const active = pathname===i.href; 
                return (
                  <li key={i.href}>
                    <Link href={i.href} className={clsx('w-full px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2', active ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm':'text-[var(--c-text-soft)] hover:bg-[var(--c-surface)] hover:text-[var(--c-text)]')}>
                      {i.icon && <span className="text-base font-bold">{i.icon}</span>}
                      <span className={clsx(i.href === '/add-worry' ? 'text-sm' : '')}>{i.label}</span>
                    </Link>
                  </li>
                ); 
              })}
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <LanguageSwitcher />
              {!session ? (
                <Button variant="primary" className="flex-1" onClick={()=>signIn()}>
                  {t('auth.signIn')}
                </Button>
              ) : (
                <Button variant="subtle" className="flex-1" onClick={()=>signOut()}>
                  {t('auth.signOut')}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
