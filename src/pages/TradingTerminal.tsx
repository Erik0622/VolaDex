import { useMemo, useState } from 'react';
import { ArrowLeft, Rocket, Waves, Bell, Star, Wallet, Filter, Grid, TrendingUp, Settings, HelpCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CandlestickChart } from '../components/chart/CandlestickChart';
import { MarketList } from '../components/trading/MarketList';
import { MemecoinTable } from '../components/trading/MemecoinTable';
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
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-accent-400">
              <ArrowLeft className="h-4 w-4" /> Back to Discover
            </Link>
            <h1 className="text-2xl font-bold text-white">VolaDex Pro</h1>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-white/60 hover:text-white">Pulse</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Trackers</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Perpetuals</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Yield</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Vision</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Portfolio</a>
              <a href="#" className="text-sm text-white/60 hover:text-white">Rewards</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by token or CA..."
                className="w-64 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-accent-400 focus:outline-none"
              />
            </div>
            <button className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black">
              Deposit
            </button>
            <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Star className="h-5 w-5" />
            </button>
            <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Wallet className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {['Trending', 'Surge', 'DEX Screener', 'Pump Live'].map((category, index) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  index === 0
                    ? 'bg-accent-400 text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {['1m', '5m', '30m', '1h'].map((timeframe, index) => (
                <button
                  key={timeframe}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    index === 1
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            
            <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Filter className="h-4 w-4" />
            </button>
            <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Grid className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-xs text-white/60">Quick Buy</span>
              <input
                type="text"
                placeholder="0.0"
                className="w-16 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
              />
              <div className="flex gap-1">
                <button className="rounded px-2 py-1 text-xs font-medium bg-accent-400 text-black">P1</button>
                <button className="rounded px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10">P2</button>
                <button className="rounded px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10">P3</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Memecoin Table */}
        <div className="mb-8">
          <MemecoinTable />
        </div>

        {/* Status Bar */}
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-6 py-4">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-white">PRESET 1</span>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                PnL
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="font-mono">$116.8K</span>
              <span className="font-mono">$4505</span>
              <span className="font-mono">$236.94</span>
              <span className="font-mono">$97.4K</span>
              <span className="font-mono">0.0184</span>
              <span className="font-mono">0.0296</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm">Connection is stable</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">GLOBAL</span>
            <button className="text-white/60 hover:text-white">
              <Settings className="h-4 w-4" />
            </button>
            <button className="text-white/60 hover:text-white">
              <HelpCircle className="h-4 w-4" />
            </button>
            <button className="text-white/60 hover:text-white">
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chart and Analytics Section */}
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
                <span className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] ${
                  source === 'birdeye' 
                    ? 'border-green-400/30 bg-green-400/10 text-green-400' 
                    : 'border-white/10 text-white/50'
                }`}>
                  {source === 'birdeye' ? 'Live Data' : 'Demo Mode'}
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
