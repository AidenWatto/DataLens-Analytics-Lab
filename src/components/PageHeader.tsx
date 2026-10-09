import type { ReactNode } from 'react';
import { useColors } from '@/context/useColors';

export function PageHeader({ title, subtitle, action, icon }: { title: string; subtitle?: string; action?: ReactNode; icon?: ReactNode }) {
  const colors = useColors();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.surface2, color: colors.primary }}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>{title}</h1>
          {subtitle && <p className="text-sm mt-1" style={{ color: colors.textMuted }}>{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
