"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--c-accent-soft)] selection:text-[var(--c-text)]">
      <Navbar />
      <main className="flex-1 layout-container py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}

function Footer(){
  return (
    <footer className="mt-auto border-t border-[var(--c-border)] bg-[var(--c-bg-soft)]/70 backdrop-blur supports-[backdrop-filter]:bg-[var(--c-bg-soft)]/55 text-[var(--c-text-soft)] text-sm">
      <div className="layout-container py-6 flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <p>© {new Date().getFullYear()} Ease. All rights reserved.</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/companion#about" className="hover:text-[var(--c-text)] transition-colors">About</Link>
          <Link href="/companion#research" className="hover:text-[var(--c-text)] transition-colors">Research</Link>
          <Link href="/easeboard" className="hover:text-[var(--c-text)] transition-colors">Progress</Link>
          <Link href="/calm-corner" className="hover:text-[var(--c-text)] transition-colors">Calm Corner</Link>
        </nav>
      </div>
    </footer>
  );
}
