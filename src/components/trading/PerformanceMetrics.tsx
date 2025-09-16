interface MetricItem {
  label: string;
  value: string;
  delta?: string;
  tone?: 'positive' | 'negative' | 'neutral';
  description?: string;
}

interface PerformanceMetricsProps {
  items: MetricItem[];
}

export function PerformanceMetrics({ items }: PerformanceMetricsProps) {
  const toneMap = {
    positive: 'text-accent-300',
    negative: 'text-rose-300',
    neutral: 'text-white/60',
  } as const;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Market intelligence</h3>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
            {item.delta && (
              <p className={`text-xs font-semibold ${toneMap[item.tone ?? 'neutral']}`}>{item.delta}</p>
            )}
            {item.description && <p className="mt-3 text-xs text-white/50">{item.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
