import React from 'react';
import clsx from 'clsx';
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { radius?: 'sm' | 'md' | 'lg' | 'full'; }
export function Skeleton({ className, radius='md', ...rest }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-[var(--c-surface-alt)] animate-pulse',
        radius==='sm' && 'rounded-[var(--r-sm)]',
        radius==='md' && 'rounded-[var(--r-md)]',
        radius==='lg' && 'rounded-[var(--r-lg)]',
        radius==='full' && 'rounded-full',
        className
      )}
      {...rest}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40 animate-[shimmer_1.8s_infinite]" />
    </div>
  );
}
