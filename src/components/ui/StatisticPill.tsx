import type { ReactNode } from 'react';

interface StatisticPillProps {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}

export function StatisticPill({ label, value, change, icon }: StatisticPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60">
      {icon && <span className="text-accent-400">{icon}</span>}
      <span>{label}</span>
      <span className="text-white/80">{value}</span>
      {change && <span className="font-semibold text-accent-400">{change}</span>}
    </div>
  );
}
