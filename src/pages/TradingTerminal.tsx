import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Bell, Star, Wallet, Filter, Grid, TrendingUp, Settings, HelpCircle, BookOpen } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { walletService } from '../lib/wallet';

import { CandlestickChart } from '../components/chart/CandlestickChart';
import { MemecoinTable } from '../components/trading/MemecoinTable';
import { TimeframeSelector } from '../components/trading/TimeframeSelector';
import { TradingStatsBar } from '../components/trading/TradingStatsBar';

import { tokenMarkets } from '../data/markets';
import { usePriceData } from '../hooks/usePriceData';
import { formatPercent } from '../lib/format';

function TradingTerminal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedMarket, setSelectedMarket] = useState(tokenMarkets[0]);
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('5m');
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const { candles, source } = usePriceData({ address: selectedMarket.address, interval });

  // Handle URL parameters for selected coin
  useEffect(() => {
    const coinParam = searchParams.get('coin');
    const addressParam = searchParams.get('address');
    
    if (coinParam && addressParam) {
      // Find the market by symbol or create a new one
      const market = tokenMarkets.find(m => m.symbol === coinParam);
      if (market) {
        setSelectedMarket(market);
      }
    }
  }, [searchParams]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-accent-400">
                <ArrowLeft className="h-4 w-4" /> Back to Discover
              </Link>
              {/* Branding entfernt */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/#pulse" className="text-sm text-white/60 hover:text-white">Pulse</Link>
                <Link to="/#trackers" className="text-sm text-white/60 hover:text-white">Trackers</Link>
                <Link to="/#perpetuals" className="text-sm text-white/60 hover:text-white">Perpetuals</Link>
                <Link to="/#yield" className="text-sm text-white/60 hover:text-white">Yield</Link>
                <Link to="/#vision" className="text-sm text-white/60 hover:text-white">Vision</Link>
                <Link to="/portfolio" className="text-sm text-white/60 hover:text-white">Portfolio</Link>
                <Link to="/#rewards" className="text-sm text-white/60 hover:text-white">Rewards</Link>
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
              <button 
                onClick={() => navigate('/wallet')}
                className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white"
              >
                <Wallet className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile-First Category Tabs */}
        <div className="mb-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {['Trending', 'Surge', 'DEX Screener', 'Pump Live', 'Top Gainers', 'New Listings', 'High Volume'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-accent-400 text-black'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Controls - Stacked Layout */}
        <div className="mb-6 space-y-4">
          {/* Timeframe and Filter Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {['1m', '5m', '30m', '1h'].map((timeframe, index) => (
                <button
                  key={timeframe}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    index === 1
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Filter className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Quick Buy Section - Mobile Optimized */}
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <span className="text-xs text-white/60">Quick Buy</span>
            <input
              type="text"
              placeholder="0.0"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
            />
            <div className="flex gap-1">
              <button className="rounded px-2 py-1 text-xs font-medium bg-accent-400 text-black">P1</button>
              <button className="rounded px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10">P2</button>
              <button className="rounded px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10">P3</button>
            </div>
          </div>
        </div>

        {/* Main Memecoin Table */}
        <div className="mb-8">
          <MemecoinTable category={selectedCategory} />
        </div>

        {/* Selected Coin Chart Section */}
        {selectedMarket && (
          <div className="mb-8">
            <div className="glass-panel rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {selectedMarket.name} ({selectedMarket.symbol})
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <TimeframeSelector value={interval} onChange={setInterval} />
                  <span className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] ${
                    source === 'birdeye' 
                      ? 'border-green-400/30 bg-green-400/10 text-green-400' 
                      : 'border-white/10 text-white/50'
                  }`}>
                    {source === 'birdeye' ? 'Live Data' : 'Demo Mode'}
                  </span>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-black/40 p-4">
                <CandlestickChart data={candles} />
              </div>
            </div>
          </div>
        )}

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

        {/* Additional Analytics */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="glass-panel rounded-[32px] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Market Insights</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p>
                • Live data from <span className="text-accent-300">Birdeye API</span> for real-time price feeds
              </p>
              <p>
                • Track <span className="text-accent-300">500+ memecoins</span> on Solana blockchain
              </p>
              <p>
                • <span className="text-accent-300">Sub-second updates</span> for all market data
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Trading Tools</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p>
                • Professional <span className="text-accent-300">candlestick charts</span>
              </p>
              <p>
                • <span className="text-accent-300">Technical indicators</span> and analysis
              </p>
              <p>
                • <span className="text-accent-300">Real-time alerts</span> for price movements
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Portfolio</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p>
                • Track your <span className="text-accent-300">memecoin holdings</span>
              </p>
              <p>
                • Real-time <span className="text-accent-300">P&L calculations</span>
              </p>
              <p>
                • <span className="text-accent-300">Performance metrics</span> and analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradingTerminal;