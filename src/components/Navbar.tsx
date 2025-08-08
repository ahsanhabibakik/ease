"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

const NAV = [
  { href:'/', label:'Home' },
  { href:'/add-worry', label:'Add Worry' },
  { href:'/worry-reflection', label:'Worry Reflection' },
  { href:'/calm-corner', label:'Calm Corner' },
  { href:'/easeboard', label:'Easeboard' },
  { href:'/profile', label:'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open,setOpen] = useState(false);
  useEffect(()=>{ setOpen(false); },[pathname]);

  const toggleTheme = () => {
    const root = document.documentElement; const dark = root.classList.toggle('dark');
    try { localStorage.setItem('ease-theme', dark ? 'dark':'light'); } catch {}
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-[var(--c-border)] bg-[color-mix(in_srgb,var(--c-bg)_80%,transparent)]">
      <nav aria-label="Main" className="layout-container h-[64px] flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight focus-outline">
          <span className="avatar-ring"><span className="w-9 h-9 rounded-full bg-[var(--c-surface)] text-sm font-semibold flex items-center justify-center text-[var(--c-accent)]">E</span></span>
          <span className="hidden sm:inline text-[var(--c-text)]">Ease</span>
        </Link>
        <button onClick={toggleTheme} className="hidden md:inline-flex btn-ghost btn px-3 py-2 !text-sm" aria-label="Toggle theme">Theme</button>
  <button onClick={()=>setOpen(o=>!o)} className="md:hidden ml-auto btn-ghost btn px-3 py-2 !text-sm" aria-label="Toggle menu">{open?'Close':'Menu'}</button>
        <ul className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map(i=>{ const active = pathname===i.href; return (
            <li key={i.href}>
              <Link href={i.href} aria-current={active? 'page':undefined} className={clsx('relative px-3 py-2 text-sm rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]', active ? 'text-[var(--c-text)] bg-[var(--c-surface-alt)]':'text-[var(--c-text-soft)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-alt)]')}>
                {i.label}
                {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-accent-alt)]" aria-hidden />}
              </Link>
            </li> ); })}
        </ul>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link href="/add-worry"><Button variant="subtle" leftIcon={<span>＋</span>}>Add</Button></Link>
          {!session && <Button variant="primary" onClick={()=>signIn()} className="min-w-[88px]">Sign In</Button>}
          {session && <div className="flex items-center gap-2">
            <Link href="/profile" className="focus-outline"><div className="avatar-ring"><div className="w-9 h-9 rounded-full bg-[var(--c-accent-soft)] flex items-center justify-center text-[var(--c-accent)] font-medium text-sm">{(session.user?.name || 'U').slice(0,1).toUpperCase()}</div></div></Link>
            <Button variant="ghost" onClick={()=>signOut()}>Sign Out</Button>
          </div>}
        </div>
        {open && <div className="md:hidden absolute top-[64px] left-0 right-0 px-4 pb-6 pt-2 bg-[var(--c-bg-soft)] border-b border-[var(--c-border)] shadow-sm"> <ul className="flex flex-col gap-1">{NAV.map(i=>{ const active = pathname===i.href; return <li key={i.href}><Link href={i.href} className={clsx('block w-full px-3 py-2 rounded-md text-sm font-medium', active ? 'bg-[var(--c-surface)] text-[var(--c-text)] shadow-sm':'text-[var(--c-text-soft)] hover:bg-[var(--c-surface)] hover:text-[var(--c-text)]')}>{i.label}</Link></li>; })}</ul><div className="mt-4 flex items-center gap-3">{!session ? <Button variant="primary" className="flex-1" onClick={()=>signIn()}>Sign In</Button>:<Button variant="subtle" className="flex-1" onClick={()=>signOut()}>Sign Out</Button>}</div></div>}
      </nav>
    </header>
  );
}
