import Navbar from './Navbar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="px-4 py-8 max-w-4xl mx-auto">{children}</main>
    </div>
  );
}
