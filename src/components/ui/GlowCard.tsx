import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

interface GlowCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function GlowCard({ title, description, icon, children, className }: GlowCardProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:border-white/20 hover:shadow-[0_30px_60px_-15px_rgba(56,107,255,0.55)]',
        className,
      )}
    >
      <div className="absolute inset-0 opacity-0 transition duration-500 hover:opacity-100">
        <div className="absolute -top-16 right-0 h-48 w-48 rounded-full bg-primary-500/30 blur-[120px]" />
        <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-accent-500/30 blur-[120px]" />
      </div>
      <div className="relative flex flex-col gap-5">
        {icon && (
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-400">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-white/60">{description}</p>}
        </div>
        {children && <div className="text-sm text-white/70">{children}</div>}
      </div>
    </div>
  );
}
