import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading sign in…</div>}>
      <AuthModal />
    </Suspense>
  );
}

// Client auth modal separated so useSearchParams is inside Suspense
// -----------------------------------------------
// eslint-disable-next-line react/display-name
const AuthModal = (() => {
  // wrap in IIFE to keep file concise
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const C: React.FC = () => null; // placeholder to satisfy types if needed
  return function InnerAuthModal() {
    // Client code
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return <AuthModalClient/>;
  };
})();

// Actual client component
// -----------------------
// Placed after to keep top-level clean
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AuthModalClient() {
  'use client';
  const { getProviders, signIn } = require('next-auth/react');
  const { useEffect, useState } = require('react');
  const { useSearchParams, useRouter } = require('next/navigation');
  type Provider = { id: string; name: string };
  const [providers, setProviders] = useState(null as null | Record<string, Provider>);
  const [mode, setMode] = useState('signin'); // mode narrowed by usage
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const search = useSearchParams();
  const router = useRouter();
  useEffect(() => { (async () => { const p = await getProviders(); setProviders(p); })(); }, []);
  const after = search.get('callbackUrl') || '/';
  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'Registration failed');
        }
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error(result.error);
      router.push(after);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }
  const oauthProviders: Provider[] = providers ? (Object.values(providers) as Provider[]).filter(p => p.id !== 'credentials') : [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-gradient-to-br from-accentLavender/25 via-white to-accentTeal/25 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-accentLavender/40 to-accentTeal/40 rounded-3xl blur-lg opacity-60" />
        <div className="relative rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl ring-1 ring-gray-200/60 dark:ring-gray-700 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight mb-1">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{mode === 'signin' ? 'Sign in to sync and protect your progress.' : 'Start keeping your worries in a safe, private space.'}</p>
            </div>
            <div className="space-y-3 mb-6">
              {!providers && <div className="text-xs text-gray-500">Loading providers…</div>}
              {oauthProviders.map((p) => (
                <button key={p.id} onClick={() => signIn(p.id, { callbackUrl: after })} className="group w-full relative flex items-center justify-center gap-3 rounded-xl border border-gray-300/70 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 ring-accentTeal/50 transition-colors">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-br from-accentLavender to-accentTeal text-white flex items-center justify-center text-[10px] font-semibold shadow-sm">{p.name[0]}</span>
                  Continue with {p.name}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accentLavender/10 to-accentTeal/10 transition-opacity" />
                </button>
              ))}
            </div>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
              <div className="relative flex justify-center"><span className="bg-white/80 dark:bg-gray-900/80 px-3 text-xs font-medium uppercase tracking-wide text-gray-500">or {mode === 'signin' ? 'sign in' : 'register'} with email</span></div>
            </div>
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {mode === 'register' && (
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Name</label><input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" /></div>
              )}
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Password</label><input type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-gray-300/70 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 ring-accentTeal/40" /></div>
              {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1">{error}</p>}
              <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accentLavender to-accentTeal text-white text-sm font-medium px-4 py-2.5 shadow-md hover:shadow-lg transition-shadow disabled:opacity-60">{loading ? (mode === 'signin' ? 'Signing in…' : 'Creating account…') : (mode === 'signin' ? 'Sign In' : 'Create Account')}</button>
            </form>
            <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">{mode === 'signin' ? (<button onClick={() => { setMode('register'); setError(null); }} className="text-accentTeal hover:underline font-medium">Need an account? Register</button>) : (<button onClick={() => { setMode('signin'); setError(null); }} className="text-accentTeal hover:underline font-medium">Have an account? Sign in</button>)}</div>
          </div>
          <button onClick={() => router.push(after)} className="absolute top-3 right-3 h-8 w-8 rounded-full border border-gray-300/60 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 ring-accentTeal/40" aria-label="Close auth modal"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>
        </div>
      </div>
    </div>
  );
}
