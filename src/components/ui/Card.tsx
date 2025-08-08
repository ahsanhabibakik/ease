import React, { ElementType } from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { elevated?: boolean; muted?: boolean; as?: ElementType; }

export function Card({ elevated, muted, as: Tag = 'div', className, ...rest }: CardProps) {
  const Comp: ElementType = Tag || 'div';
  return <Comp className={clsx('card', elevated && 'card-elevated', muted && 'card-muted', className)} {...rest} />;
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={clsx('mb-4 flex items-start justify-between gap-3', props.className)} />; }
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 {...props} className={clsx('h3', props.className)} />; }
export function CardSubtitle(props: React.HTMLAttributes<HTMLParagraphElement>) { return <p {...props} className={clsx('text-soft text-sm', props.className)} />; }
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={clsx('space-y-4', props.className)} />; }
// Alias for clearer semantics in forms/pages
export const CardBody = CardContent;
export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props} className={clsx('pt-4 mt-2 border-t border-[var(--c-border)] flex items-center gap-3', props.className)} />; }
