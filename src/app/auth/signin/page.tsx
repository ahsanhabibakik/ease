"use client";
import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface Provider {
  id: string; name: string; type: string; signinUrl: string; callbackUrl: string;
}

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  useEffect(() => { (async () => { const p = await getProviders(); setProviders(p); })(); }, []);
  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white/90 dark:bg-gray-900/70 backdrop-blur rounded-2xl p-8 ring-1 ring-gray-200/70 dark:ring-gray-700 shadow-sm">
        <h1 className="text-2xl font-bold mb-2 tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Sign in to sync your worries across devices.</p>
        <div className="space-y-3">
          {!providers && <div className="text-xs text-gray-500">Loading providers...</div>}
          {providers && Object.values(providers).map(p => (
            <button key={p.id} onClick={() => signIn(p.id)} className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300/60 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 ring-accentTeal/40">
              Continue with {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
