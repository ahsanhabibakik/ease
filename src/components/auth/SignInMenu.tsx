"use client";
import { useEffect, useRef, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/lib/intl';
import { cn } from '@/lib/utils';

interface SignInMenuProps { onClose?: ()=>void; className?: string; }

export default function SignInMenu({ onClose, className }: SignInMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  type ProviderInfo = { id: string; name: string } & Record<string, unknown>;
  const [providers,setProviders] = useState<Record<string, ProviderInfo> | null>(null);
  const [email,setEmail] = useState('');
  const [submitting,setSubmitting] = useState(false);

  useEffect(()=>{ getProviders().then(p=> {
    if (!p) { setProviders(null); return; }
    const mapped: Record<string, ProviderInfo> = {};
  Object.entries(p).forEach(([k,v])=> { mapped[k] = { ...v, id: v.id, name: v.name } as ProviderInfo; });
    setProviders(mapped);
  }); },[]);
  useEffect(()=>{
    function onKey(e:KeyboardEvent){ if(e.key==='Escape'){ onClose?.(); }}
    function onClick(e:MouseEvent){ if(ref.current && !ref.current.contains(e.target as Node)){ onClose?.(); }}
    window.addEventListener('keydown',onKey);
    window.addEventListener('mousedown',onClick);
    return ()=>{ window.removeEventListener('keydown',onKey); window.removeEventListener('mousedown',onClick); };
  },[onClose]);

  async function handleEmail(e:React.FormEvent){
    e.preventDefault(); if(!email) return; setSubmitting(true);
    try { await signIn('email',{ email, redirect:true }); } finally { setSubmitting(false); }
  }

  const list: ProviderInfo[] = providers ? Object.values(providers) : [];
  const emailProvider = list.find(p=>p.id==='email');
  const credentialLess = list.filter(p=> p.id!=='email' && p.id!=='credentials');

  return (
    <div ref={ref} className={cn('w-72 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-lg p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 origin-top', className)}>
      <p className="text-xs font-medium tracking-wide text-[var(--c-text-faint)] px-1">{t('auth.orContinueWith')}</p>
      {credentialLess.length === 0 && <p className="text-[10px] text-[var(--c-text-faint)] px-1">No OAuth providers configured.</p>}
      {credentialLess.map(p => (
        <Button key={p.id} variant="subtle" className="w-full justify-start" onClick={()=> signIn(p.id)}>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--c-accent-soft)] text-[11px] font-semibold text-[var(--c-accent)]">{p.name[0]}</span>
          {p.name}
        </Button>
      ))}
      {emailProvider && (
        <form onSubmit={handleEmail} className="pt-1 space-y-2">
          <label className="text-[10px] font-medium uppercase tracking-wide text-[var(--c-text-faint)] px-1">{t('auth.email')}</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" className="field-input text-xs" />
          <Button type="submit" size="sm" variant="primary" loading={submitting} className="w-full">{t('auth.sendMagicLink')}</Button>
        </form>
      )}
      <p className="text-[9px] leading-snug text-[var(--c-text-faint)] px-1 pt-1">By continuing you agree to our Terms & Privacy.</p>
    </div>
  );
}
