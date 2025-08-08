'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Lightweight client-side route transition bar (heuristic for App Router)
export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setVisible(true);
      setProgress(0);
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const target = Math.min(90, (elapsed / 4));
        setProgress(p => (p < target ? target : p));
        if (visible) rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setProgress(100);
        setTimeout(() => setVisible(false), 180);
      }, 600);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 overflow-hidden">
      <div
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accentLavender via-accentTeal to-accentLavender transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
