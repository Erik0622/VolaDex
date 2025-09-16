import { formatCompact, formatCurrency, formatPercent } from '../../lib/format';

interface TradingStatsBarProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  source: 'birdeye' | 'sample';
}

export function TradingStatsBar({ symbol, name, price, change24h, high24h, low24h, volume24h, source }: TradingStatsBarProps) {
  const changeTone = change24h >= 0 ? 'text-accent-400' : 'text-rose-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 px-8 py-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">{symbol}</p>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-4xl font-semibold text-white">{formatCurrency(price, { maximumFractionDigits: price < 2 ? 4 : 2 })}</p>
          <span className={`text-sm font-semibold ${changeTone}`}>{formatPercent(change24h)}</span>
        </div>
        <p className="text-sm text-white/60">{name}</p>
      </div>
      <div className="flex flex-wrap gap-10 text-xs uppercase tracking-[0.3em] text-white/50">
        <div>
          <p>24H High</p>
          <p className="mt-2 text-base font-semibold text-white">{formatCurrency(high24h, { maximumFractionDigits: high24h < 2 ? 4 : 2 })}</p>
        </div>
        <div>
          <p>24H Low</p>
          <p className="mt-2 text-base font-semibold text-white">{formatCurrency(low24h, { maximumFractionDigits: low24h < 2 ? 4 : 2 })}</p>
        </div>
        <div>
          <p>24H Volume</p>
          <p className="mt-2 text-base font-semibold text-white">{formatCompact(volume24h)}</p>
        </div>
        <div>
          <p>Data source</p>
          <p className="mt-2 text-xs font-semibold text-accent-400">{source === 'birdeye' ? 'Birdeye live feed' : 'Simulated data'}</p>
        </div>
      </div>
    </div>
  );
}
