import { useMemo, useState } from 'react';
import { ArrowLeft, Rocket, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CandlestickChart } from '../components/chart/CandlestickChart';
import { MarketList } from '../components/trading/MarketList';
import { OrderBook } from '../components/trading/OrderBook';
import { PerformanceMetrics } from '../components/trading/PerformanceMetrics';
import { StrategyPanel } from '../components/trading/StrategyPanel';
import { TimeframeSelector } from '../components/trading/TimeframeSelector';
import { TradeTape } from '../components/trading/TradeTape';
import { TradingStatsBar } from '../components/trading/TradingStatsBar';
import { PortfolioOverview } from '../components/trading/PortfolioOverview';
import { SystemHealth } from '../components/trading/SystemHealth';
import { AlphaFeed } from '../components/trading/AlphaFeed';
import { tokenMarkets } from '../data/markets';
import { asks, bids, recentTrades } from '../data/sampleOrderBook';
import { usePriceData } from '../hooks/usePriceData';
import { formatPercent } from '../lib/format';

function createPerformanceMetrics(symbol: string) {
  if (symbol === 'SOL') {
    return [
      {
        label: 'Funding bias',
        value: '+12.4bps',
        delta: 'Stable last 4h',
        tone: 'positive' as const,
        description: 'Phoenix, Drift and Zeta perps converged. Bias remains long favouring makers.',
      },
      {
        label: 'Cross-venue OI',
        value: '$1.62B',
        delta: '+4.2% 24h',
        tone: 'positive' as const,
        description: 'Open interest dominated by Drift (42%) with Jito vaults accumulating delta.',
      },
      {
        label: 'Liquidity pockets',
        value: '$324M',
        delta: 'Stacked at $158.40',
        tone: 'neutral' as const,
        description: 'Meteora pools hold dense liquidity band between $158.4 – $160.2.',
      },
      {
        label: 'Volatility surface',
        value: '47% IV',
        delta: '-3.1% daily',
        tone: 'positive' as const,
        description: '1W skew pricing risk premium lower as market anticipates compression.',
      },
    ];
  }

  return [
    {
      label: 'Funding bias',
      value: '+4.3bps',
      delta: 'Muted flow',
      tone: 'neutral' as const,
      description: 'Perp venues in balance. Expect chop with mean reversion bots dominating.',
    },
    {
      label: 'Cross-venue OI',
      value: '$324M',
      delta: '+1.8% 24h',
      tone: 'positive' as const,
      description: 'Gradual inflows with no forced liquidations detected on-chain.',
    },
    {
      label: 'Liquidity pockets',
      value: '$68M',
      delta: 'Stacked at range high',
      tone: 'negative' as const,
      description: 'Expect sell pressure near recent highs – run iceberg logic to slip less.',
    },
    {
      label: 'Volatility surface',
      value: '62% IV',
      delta: '+6.2% daily',
      tone: 'negative' as const,
      description: 'Options desks repricing wings. Manage gamma if running neutral books.',
    },
  ];
}

const executionBlocks = [
  { label: 'Smart routing', description: 'Auto routes across Phoenix, OpenBook, Meteora with failover in <30ms.' },
  { label: 'Slippage guard', description: 'Dynamic slippage bands adjust with volatility & mempool density.' },
  { label: 'Post-trade sync', description: 'Ledger, Fireblocks and Slack alerts triggered instantly after fills.' },
];

function TradingTerminal() {
  const [selectedMarket, setSelectedMarket] = useState(tokenMarkets[0]);
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('5m');
  const { candles, source } = usePriceData({ address: selectedMarket.address, interval });

  const analytics = useMemo(() => {
    if (!candles.length) {
      return {
        price: selectedMarket.price,
        change24h: selectedMarket.change24h,
        high24h: selectedMarket.price,
        low24h: selectedMarket.price,
        volume24h: selectedMarket.volume24h,
      };
    }

    const sorted = [...candles].sort((a, b) => Number(a.time) - Number(b.time));
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const high = sorted.reduce((max, item) => Math.max(max, item.high), -Infinity);
    const low = sorted.reduce((min, item) => Math.min(min, item.low), Infinity);
    const volume = sorted.reduce((sum, item) => sum + item.volume, 0);
    const change = ((last.close - first.open) / first.open) * 100;

    return {
      price: last.close,
      change24h: change,
      high24h: high,
      low24h: low,
      volume24h: volume,
    };
  }, [candles, selectedMarket]);

  const performanceItems = useMemo(() => createPerformanceMetrics(selectedMarket.symbol), [selectedMarket.symbol]);

  const executionStats = useMemo(() => {
    const base = selectedMarket.symbol === 'SOL' ? 0.95 : 0.82;
    return {
      confidence: Math.round(base * 100),
      latency: selectedMarket.symbol === 'SOL' ? '11.2ms' : '18.6ms',
      venues: ['Phoenix', 'OpenBook', 'Meteora', 'Jupiter'],
    };
  }, [selectedMarket.symbol]);

  return (
    <div className="relative overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/3 top-0 h-[45vh] w-[55vw] rounded-full bg-primary-600/20 blur-3xl" />
        <div className="absolute right-[-20vw] top-1/3 h-[50vh] w-[60vw] rounded-full bg-accent-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10 px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
              <ArrowLeft className="h-4 w-4" /> Back to discover
            </Link>
            <h1 className="text-4xl font-semibold text-white">VolaDex Terminal</h1>
            <p className="max-w-xl text-sm text-white/60">
              Precision-engineered Solana trading workstation. Charts, liquidity, automation, portfolio health and alpha streams –
              all elevated. Trading actions are disabled in this showcase so you can explore design and analytics freely.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-xs uppercase tracking-[0.3em] text-white/50">
            <p>Environment: <span className="font-semibold text-white">Simulation Mode</span></p>
            <p>Data blend: Birdeye × Helius × Sample Streams</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
          <div className="glass-panel h-full rounded-[32px] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Markets</h2>
            <p className="mt-2 text-xs text-white/40">Tap any market to load analytics in the terminal canvas.</p>
            <div className="mt-5 h-[720px] overflow-hidden">
              <MarketList markets={tokenMarkets} selected={selectedMarket.symbol} onSelect={setSelectedMarket} />
            </div>
          </div>

          <div className="glass-panel col-span-1 h-full rounded-[32px] p-6 lg:col-span-1">
            <div className="space-y-6">
              <TradingStatsBar
                symbol={selectedMarket.symbol}
                name={selectedMarket.name}
                price={analytics.price}
                change24h={analytics.change24h}
                high24h={analytics.high24h}
                low24h={analytics.low24h}
                volume24h={analytics.volume24h}
                source={source}
              />

              <div className="flex flex-wrap items-center justify-between gap-4">
                <TimeframeSelector value={interval} onChange={setInterval} />
                <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                  {source === 'birdeye' ? 'Live network' : 'Local demo'}
                </span>
              </div>

              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-black/40 p-4">
                <CandlestickChart data={candles} />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Execution confidence</p>
                    <span className="text-xs text-white/40">{executionStats.latency}</span>
                  </div>
                  <div className="mt-4">
                    <div className="relative h-3 rounded-full bg-white/10">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500"
                        style={{ width: `${executionStats.confidence}%` }}
                      />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-white">{executionStats.confidence}%</p>
                    <p className="text-xs text-white/50">Signal derived from venue depth, volatility and latency sensors.</p>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.3em] text-white/40">
                    {executionStats.venues.map((venue) => (
                      <span key={venue} className="rounded-full border border-white/10 px-3 py-1">
                        {venue}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/50">Playbook</p>
                    <Rocket className="h-4 w-4 text-accent-400" />
                  </div>
                  <ul className="mt-4 space-y-3 text-sm text-white/70">
                    {executionBlocks.map((item) => (
                      <li key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="font-semibold text-white">{item.label}</p>
                        <p className="text-xs text-white/50">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel h-full rounded-[32px] p-6">
            <div className="space-y-6">
              <OrderBook bids={bids} asks={asks} />
              <TradeTape trades={recentTrades} />
              <StrategyPanel />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
          <div className="glass-panel rounded-[32px] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Flow annotations</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p>
                • Helius smart money map flagged <span className="text-accent-300">12 wallet clusters</span> acquiring {selectedMarket.symbol} across 5 venues.
              </p>
              <p>
                • Pump.fun radar detected <span className="text-accent-300">4 derivative launches</span> – track volatility bleed into spot markets.
              </p>
              <p>
                • Birdeye liquidity sensors show <span className="text-accent-300">{formatPercent(selectedMarket.change24h)}</span> flow skew to aggressive buys.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-6 lg:col-span-1">
            <PerformanceMetrics items={performanceItems} />
          </div>

          <div className="glass-panel rounded-[32px] p-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Risk simulator</p>
                <Waves className="h-4 w-4 text-accent-400" />
              </div>
              <div className="mt-4 space-y-4 text-sm text-white/70">
                <p>
                  Adjust exposures and stress-test delta, gamma and liquidity shocks. Outputs update instantly without triggering on-chain
                  actions.
                </p>
                <div className="grid gap-2 text-xs text-white/50">
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    Position size
                    <input type="range" min="0" max="100" defaultValue={60} className="ml-4 h-1 w-32 accent-accent-400" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    Hedge ratio
                    <input type="range" min="0" max="100" defaultValue={40} className="ml-4 h-1 w-32 accent-primary-400" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    Drawdown limit
                    <input type="range" min="0" max="100" defaultValue={25} className="ml-4 h-1 w-32 accent-rose-400" />
                  </label>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/60">
                  <p>Projected VaR (95%): <span className="font-semibold text-white">$2.4M</span></p>
                  <p>Stress PnL @ -15% move: <span className="font-semibold text-rose-300">-$3.1M</span></p>
                  <p>Hedge suggestion: tighten delta by <span className="text-accent-300">8.5%</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <PortfolioOverview />
        <SystemHealth />
        <AlphaFeed />
      </div>
    </div>
  );
}

export default TradingTerminal;
