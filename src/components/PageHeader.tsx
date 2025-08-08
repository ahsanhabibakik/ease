import React from 'react';
import clsx from 'clsx';
interface PageHeaderProps { title: string; subtitle?: string; actions?: React.ReactNode; className?: string; }
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={clsx('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="space-y-2 max-w-[var(--content-max)]">
        <h1 className="h1">{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}
