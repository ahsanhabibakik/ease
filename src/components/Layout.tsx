'use client';
import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5f7fb] via-[#f2f7f5] to-[#edf1f8] text-gray-900 selection:bg-accentTeal/20 selection:text-gray-900">
      <Navbar />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="mt-auto border-t border-gray-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <p className="text-gray-500">© {new Date().getFullYear()} Ease. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500">
            <a href="/companion#about" className="hover:text-gray-800 transition-colors">About</a>
            <a href="/companion#research" className="hover:text-gray-800 transition-colors">Research</a>
            <a href="/easeboard" className="hover:text-gray-800 transition-colors">Progress</a>
            <a href="/calm-corner" className="hover:text-gray-800 transition-colors">Calm Corner</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
