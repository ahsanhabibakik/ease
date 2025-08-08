"use client";
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 font-medium whitespace-nowrap select-none outline-none disabled:opacity-60 disabled:pointer-events-none transition-colors rounded-md text-sm h-10 px-4 py-2 focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--c-bg)]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--c-accent)] text-white shadow-sm hover:bg-[var(--c-accent-alt)]',
        subtle: 'bg-[var(--c-surface-alt)] text-[var(--c-text)] border border-[var(--c-border)] hover:bg-[var(--c-surface)]',
        ghost: 'bg-transparent text-[var(--c-text-soft)] hover:text-[var(--c-text)] hover:bg-[var(--c-surface-alt)]',
        danger: 'bg-[var(--c-danger)] text-white hover:brightness-110',
        outline: 'border border-[var(--c-border)] bg-transparent hover:bg-[var(--c-surface-alt)]',
        link: 'bg-transparent text-[var(--c-accent)] underline-offset-4 hover:underline px-0',
      },
      size: {
        sm: 'h-8 text-xs px-3',
        md: 'h-10 text-sm px-4',
        lg: 'h-11 text-sm px-5',
        icon: 'h-10 w-10 p-0',
      },
      shape: {
        default: '',
        pill: 'rounded-full px-5',
      },
      tone: { // allows accent swapping later
        default: '',
      },
      loading: {
        true: 'relative cursor-wait opacity-80',
        false: '',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'default',
      loading: false,
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, leftIcon, rightIcon, loading, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, shape, loading, className }))} disabled={props.disabled || !!loading} {...props}>
        {leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>}
        <span className="inline-flex items-center gap-1">{children}</span>
        {rightIcon && <span className="shrink-0 inline-flex items-center">{rightIcon}</span>}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center text-current/70">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10" className="opacity-25"/><path d="M22 12a10 10 0 0 1-10 10" className="opacity-75"/></svg>
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
