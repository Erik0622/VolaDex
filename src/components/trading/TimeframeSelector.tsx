const intervals: { label: string; value: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' }[] = [
  { label: '1M', value: '1m' },
  { label: '5M', value: '5m' },
  { label: '15M', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
];

interface TimeframeSelectorProps {
  value: (typeof intervals)[number]['value'];
  onChange: (value: (typeof intervals)[number]['value']) => void;
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {intervals.map((interval) => (
        <button
          key={interval.value}
          onClick={() => onChange(interval.value)}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
            value === interval.value
              ? 'bg-white text-black shadow-glow'
              : 'border border-white/10 bg-white/0 text-white/60 hover:border-white/20 hover:text-white'
          }`}
        >
          {interval.label}
        </button>
      ))}
    </div>
  );
}
