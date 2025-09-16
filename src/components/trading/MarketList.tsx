import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import type { TokenMarket } from '../../data/markets';
import { formatCompact, formatPercent } from '../../lib/format';

interface MarketListProps {
  markets: TokenMarket[];
  selected: string;
  onSelect: (market: TokenMarket) => void;
}

const filters: { label: string; value: TokenMarket['tag'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Blue chip', value: 'bluechip' },
  { label: 'DeFi', value: 'defi' },
  { label: 'Perps', value: 'perp' },
  { label: 'Memes', value: 'meme' },
];

export function MarketList({ markets, selected, onSelect }: MarketListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all');

  const filtered = useMemo(() => {
    const lower = search.trim().toLowerCase();
    return markets.filter((market) => {
      const matchesFilter = filter === 'all' || market.tag === filter;
      const matchesSearch =
        !lower ||
        market.name.toLowerCase().includes(lower) ||
        market.symbol.toLowerCase().includes(lower);
      return matchesFilter && matchesSearch;
    });
  }, [filter, markets, search]);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search className="h-4 w-4 text-white/40" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tokens"
          className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/30 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-full border px-4 py-2 transition ${
              filter === item.value
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/5 bg-white/0 hover:border-white/20 hover:text-white/80'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {filtered.map((market) => {
          const isActive = market.symbol === selected;
          const changeTone = market.change24h >= 0 ? 'text-accent-400' : 'text-rose-400';
          return (
            <button
              key={market.symbol}
              onClick={() => onSelect(market)}
              className={`group flex w-full flex-col gap-2 rounded-3xl border px-5 py-4 text-left transition ${
                isActive
                  ? 'border-white/40 bg-white/10 shadow-[0_25px_60px_-20px_rgba(56,107,255,0.55)]'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{market.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">{market.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">${market.price.toFixed(market.price < 2 ? 4 : 2)}</p>
                  <p className={`text-xs font-semibold ${changeTone}`}>{formatPercent(market.change24h)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/40">
                <span>1H {formatPercent(market.change1h)}</span>
                <span>Vol {formatCompact(market.volume24h)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
