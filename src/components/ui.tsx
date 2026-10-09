import type { ReactNode, ButtonHTMLAttributes, SelectHTMLAttributes, InputHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'btn-primary',
    secondary: 'surface text-[var(--color-text)] hover:surface-2',
    ghost: 'text-muted hover:text-[var(--color-text)]',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`surface rounded-xl ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            {title && <h3 className="font-semibold text-[var(--color-text)]">{title}</h3>}
            {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export function Select({ label, children, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-muted uppercase tracking-wide">{label}</label>}
      <select className={`input-base rounded-lg px-3 py-2 text-sm ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-muted uppercase tracking-wide">{label}</label>}
      <input className={`input-base rounded-lg px-3 py-2 text-sm ${className}`} {...props} />
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: ReactNode; variant?: 'default' | 'primary' | 'warning' | 'danger' }) {
  const variants = {
    default: 'surface-2 text-muted',
    primary: 'text-primary',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl surface-2 flex items-center justify-center mb-4 text-muted">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="surface rounded-xl p-4">
      <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1 text-[var(--color-text)]">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 rounded-full surface-2 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color || 'var(--color-primary)' }} />
    </div>
  );
}
