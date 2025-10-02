import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Bell, Star, Wallet, Filter, Grid, TrendingUp, Settings, HelpCircle, BookOpen } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { CandlestickChart } from '../components/chart/CandlestickChart';
import { MemecoinTable } from '../components/trading/MemecoinTable';
import { TimeframeSelector } from '../components/trading/TimeframeSelector';
import { TradingStatsBar } from '../components/trading/TradingStatsBar';

import { tokenMarkets } from '../data/markets';
import { usePriceData } from '../hooks/usePriceData';
import { formatPercent } from '../lib/format';

function TradingTerminal() {
  const [searchParams] = useSearchParams();
  const [selectedMarket, setSelectedMarket] = useState(tokenMarkets[0]);
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('5m');
  const [searchQuery, setSearchQuery] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const { candles, source } = usePriceData({ address: selectedMarket.address, interval });

  // Handle URL parameters for selected coin or search
  useEffect(() => {
    const coinParam = searchParams.get('coin');
    const addressParam = searchParams.get('address');
    const searchParam = searchParams.get('search');
    
    if (searchParam) {
      setSearchQuery(searchParam);
      // If search looks like a Solana address, use it
      if (searchParam.length >= 32 && searchParam.length <= 44) {
        setContractAddress(searchParam);
        // Try to find or load the token
        const market = tokenMarkets.find(m => m.address === searchParam);
        if (market) {
          setSelectedMarket(market);
        }
      }
    }
    
    if (coinParam && addressParam) {
      // Find the market by symbol or create a new one
      const market = tokenMarkets.find(m => m.symbol === coinParam);
      if (market) {
        setSelectedMarket(market);
      }
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if it's a contract address (Solana addresses are typically 32-44 chars)
      if (searchQuery.length >= 32 && searchQuery.length <= 44) {
        setContractAddress(searchQuery);
        // Try to find the token in our markets
        const market = tokenMarkets.find(m => 
          m.address.toLowerCase() === searchQuery.toLowerCase() ||
          m.symbol.toLowerCase() === searchQuery.toLowerCase() ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (market) {
          setSelectedMarket(market);
        }
      } else {
        // Search by name or symbol
        const market = tokenMarkets.find(m => 
          m.symbol.toLowerCase() === searchQuery.toLowerCase() ||
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (market) {
          setSelectedMarket(market);
        }
      }
    }
  };

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
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search by token or CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-accent-400 focus:outline-none"
                />
              </form>
              <Link to="/wallet" className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity">
                Connect Wallet
              </Link>
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white transition-colors">
                <Star className="h-5 w-5" />
              </button>
              <Link to="/wallet" className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white transition-colors">
                <Wallet className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
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

        {/* Selected Coin Chart Section */}
        {selectedMarket && (
          <div className="mb-8">
            <div className="glass-panel rounded-[32px] p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-white">
                    {selectedMarket.name} ({selectedMarket.symbol})
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-white/60">
                      {source === 'birdeye' ? 'Live data from Birdeye API' : 'Demo data'}
                    </p>
                    {contractAddress && (
                      <span className="text-xs text-white/40 font-mono truncate max-w-[200px]">
                        {contractAddress}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 font-mono mt-1 truncate">
                    CA: {selectedMarket.address}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <TimeframeSelector value={interval} onChange={setInterval} />
                  <span className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] whitespace-nowrap ${
                    source === 'birdeye' 
                      ? 'border-green-400/30 bg-green-400/10 text-green-400' 
                      : 'border-white/10 text-white/50'
                  }`}>
                    {source === 'birdeye' ? 'Live Data' : 'Demo Mode'}
                  </span>
                </div>
              </div>
              
              {/* Price Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-white/50 mb-1">Price</p>
                  <p className="text-lg font-semibold text-white">${analytics.price.toFixed(6)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-white/50 mb-1">24h Change</p>
                  <p className={`text-lg font-semibold ${analytics.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.change24h >= 0 ? '+' : ''}{analytics.change24h.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-white/50 mb-1">24h High</p>
                  <p className="text-lg font-semibold text-white">${analytics.high24h.toFixed(6)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs text-white/50 mb-1">24h Low</p>
                  <p className="text-lg font-semibold text-white">${analytics.low24h.toFixed(6)}</p>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-black/40 p-4">
                <CandlestickChart data={candles} />
              </div>
              
              {candles.length === 0 && (
                <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                  <p className="text-sm text-yellow-500">
                    No chart data available. Make sure the Birdeye API key is configured correctly in the .env file.
                  </p>
                </div>
              )}
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