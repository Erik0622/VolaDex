import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { CandlestickChart } from '../components/chart/CandlestickChart';
import { TimeframeSelector } from '../components/trading/TimeframeSelector';
import { usePriceData } from '../hooks/usePriceData';

interface TokenData {
  name: string;
  symbol: string;
  address: string;
}

function ChartPage() {
  const [searchParams] = useSearchParams();
  const [interval, setInterval] = useState<'1m' | '5m' | '15m' | '1h' | '4h' | '1d'>('15m');
  const [token, setToken] = useState<TokenData | null>(null);

  // Get token data from URL
  useEffect(() => {
    const address = searchParams.get('address');
    const symbol = searchParams.get('symbol');
    const name = searchParams.get('name');

    if (address) {
      setToken({
        address,
        symbol: symbol || '???',
        name: name || symbol || 'Unknown Token',
      });
    }
  }, [searchParams]);

  const { candles, source } = usePriceData({ 
    address: token?.address || '', 
    interval 
  });

  // Calculate statistics from candle data
  const stats = candles.length > 0 ? {
    current: candles[candles.length - 1].close,
    open: candles[0].open,
    high: Math.max(...candles.map(c => c.high)),
    low: Math.min(...candles.map(c => c.low)),
    change: ((candles[candles.length - 1].close - candles[0].open) / candles[0].open) * 100,
  } : null;

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">No token selected</p>
          <Link to="/" className="text-accent-400 hover:text-accent-300 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            
            <div className="flex items-center gap-4">
              <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                source === 'birdeye' 
                  ? 'border-green-400/30 bg-green-400/10 text-green-400' 
                  : 'border-white/10 text-white/50'
              }`}>
                {source === 'birdeye' ? '🟢 Live Data' : 'Demo Mode'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Token Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {token.name} ({token.symbol})
              </h1>
              <p className="text-xs text-white/40 font-mono mt-1">
                {token.address}
              </p>
            </div>
            
            <TimeframeSelector value={interval} onChange={setInterval} />
          </div>

          {/* Price Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
                <p className="text-xs text-white/50 mb-1">Current Price</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  ${stats.current < 0.01 ? stats.current.toExponential(4) : stats.current.toFixed(4)}
                </p>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
                <p className="text-xs text-white/50 mb-1">24h Change</p>
                <div className={`text-base sm:text-lg font-semibold flex items-center gap-1 ${
                  stats.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stats.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
                </div>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
                <p className="text-xs text-white/50 mb-1">24h High</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  ${stats.high < 0.01 ? stats.high.toExponential(4) : stats.high.toFixed(4)}
                </p>
              </div>
              
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
                <p className="text-xs text-white/50 mb-1">24h Low</p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  ${stats.low < 0.01 ? stats.low.toExponential(4) : stats.low.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-6">
          {candles.length > 0 ? (
            <CandlestickChart data={candles} />
          ) : (
            <div className="flex items-center justify-center h-[420px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
                <p className="text-white/60">Loading chart data...</p>
                <p className="text-white/40 text-sm mt-2">Fetching from Birdeye API</p>
              </div>
            </div>
          )}
          
          {source === 'sample' && (
            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <p className="text-sm text-yellow-500">
                ⚠️ Unable to load live data. Please check your API key configuration.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Chart Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Timeframe</span>
                <span className="text-white font-mono">{interval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Candles</span>
                <span className="text-white font-mono">{candles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Data Source</span>
                <span className="text-white">{source === 'birdeye' ? 'Birdeye API' : 'Demo'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Token Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/60 block mb-1">Name</span>
                <span className="text-white">{token.name}</span>
              </div>
              <div>
                <span className="text-white/60 block mb-1">Symbol</span>
                <span className="text-white font-mono">{token.symbol}</span>
              </div>
              <div>
                <span className="text-white/60 block mb-1">Network</span>
                <span className="text-white">Solana</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity">
                Trade on Jupiter
              </button>
              <button className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
                Add to Watchlist
              </button>
              <button className="w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
                Share Chart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartPage;
