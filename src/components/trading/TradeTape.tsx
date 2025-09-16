import type { TradeItem } from '../../types/trading';
import { formatCompact } from '../../lib/format';

interface TradeTapeProps {
  trades: TradeItem[];
}

export function TradeTape({ trades }: TradeTapeProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Recent trades</h3>
        <span className="text-xs text-white/30">Simulated stream</span>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40">
        <span>Time</span>
        <span>Side</span>
        <span>Size</span>
        <span className="text-right">Price</span>
      </div>
      <div className="mt-4 space-y-2">
        {trades.map((trade) => (
          <div
            key={`${trade.time}-${trade.price}-${trade.size}`}
            className="grid grid-cols-4 gap-2 rounded-2xl bg-black/40 px-4 py-3 text-xs font-mono text-white/70"
          >
            <span>{trade.time}</span>
            <span className={trade.side === 'buy' ? 'text-accent-300' : 'text-rose-300'}>{trade.side.toUpperCase()}</span>
            <span>{formatCompact(trade.size)}</span>
            <span className="text-right">{trade.price.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
