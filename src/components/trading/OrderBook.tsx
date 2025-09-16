import type { OrderBookLevel } from '../../types/trading';
import { formatCompact } from '../../lib/format';

interface OrderBookProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export function OrderBook({ bids, asks }: OrderBookProps) {
  const maxSize = Math.max(
    ...bids.map((bid) => bid.size),
    ...asks.map((ask) => ask.size),
  );

  const renderRow = (level: OrderBookLevel, side: 'bid' | 'ask') => {
    const width = `${(level.size / maxSize) * 100}%`;
    const gradientColor = side === 'bid' ? 'from-accent-500/30' : 'from-rose-500/25';
    const gradientDirection = side === 'bid' ? 'bg-gradient-to-l' : 'bg-gradient-to-r';
    const textTone = side === 'bid' ? 'text-accent-200' : 'text-rose-200';

    return (
      <div key={`${side}-${level.price}`} className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40">
        <div className={`absolute inset-y-0 ${side === 'bid' ? 'right-0' : 'left-0'} w-full`}>
          <div className={`${gradientDirection} ${gradientColor} via-transparent to-transparent h-full opacity-60`} style={{ width }} />
        </div>
        <div className="relative grid grid-cols-3 px-4 py-3 text-xs font-mono">
          <span className={`text-left ${textTone}`}>{level.price.toFixed(2)}</span>
          <span className="text-center text-white/70">{formatCompact(level.size)}</span>
          <span className="text-right text-white/40">{formatCompact(level.total)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Order book depth</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-white/30">Size × Price</span>
      </div>
      <div className="mt-5 grid gap-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Asks</p>
        {asks.map((ask) => renderRow(ask, 'ask'))}
      </div>
      <div className="mt-6 grid gap-3">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Bids</p>
        {bids.map((bid) => renderRow(bid, 'bid'))}
      </div>
    </div>
  );
}
