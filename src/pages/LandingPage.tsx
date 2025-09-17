import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Wallet, Bell, Filter, Grid, Zap, TrendingUp, BarChart3, Eye, Settings, HelpCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GlowCard } from '../components/ui/GlowCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatisticPill } from '../components/ui/StatisticPill';
import { marketSummaries } from '../data/sampleMarkets';
import { formatCompact, formatCurrency, formatPercent } from '../lib/format';

// Memecoin data for the main table
const memecoinData = [
  {
    id: 'og-og',
    name: 'OG OG',
    symbol: 'OG',
    logo: '🟢',
    age: '23m',
    marketCap: 400000,
    marketCapChange: -16.2,
    liquidity: 86600,
    volume: 335000,
    txns: 1430,
    buys: 737,
    sells: 694,
    tokenInfo: [38.81, 3.48, 802, 448],
    chart: 'up',
    price: 0.000123
  },
  {
    id: 'grid-grid',
    name: 'GRID GRID',
    symbol: 'GRID',
    logo: '⚡',
    age: '3m',
    marketCap: 13900,
    marketCapChange: -61.2,
    liquidity: 20600,
    volume: 124000,
    txns: 634,
    buys: 365,
    sells: 269,
    tokenInfo: [45.2, 2.1, 156, 89],
    chart: 'down',
    price: 0.000089
  },
  {
    id: 'black-blackjack',
    name: 'black Blackjack',
    symbol: 'B',
    logo: '🃏',
    age: '1d',
    marketCap: 3930000,
    marketCapChange: 7.272,
    liquidity: 270000,
    volume: 129000,
    txns: 170,
    buys: 76,
    sells: 94,
    tokenInfo: [52.1, 4.8, 234, 156],
    chart: 'up',
    price: 0.000456
  },
  {
    id: 'ccm-criminal',
    name: 'CCM Criminal Creato...',
    symbol: 'CCM',
    logo: '🔫',
    age: '14m',
    marketCap: 54900,
    marketCapChange: 215.3,
    liquidity: 40900,
    volume: 51800,
    txns: 357,
    buys: 216,
    sells: 141,
    tokenInfo: [67.8, 1.2, 445, 123],
    chart: 'up',
    price: 0.000234
  },
  {
    id: 'sky-sky',
    name: 'SKY SKY',
    symbol: 'SKY',
    logo: '☁️',
    age: '2d',
    marketCap: 352000,
    marketCapChange: 110,
    liquidity: 77700,
    volume: 60700,
    txns: 270,
    buys: 124,
    sells: 146,
    tokenInfo: [41.3, 5.7, 189, 234],
    chart: 'up',
    price: 0.000567
  },
  {
    id: 'mic-pump',
    name: 'MIC pump mic',
    symbol: 'MIC',
    logo: '🎤',
    age: '6m',
    marketCap: 18900,
    marketCapChange: 20.93,
    liquidity: 24100,
    volume: 23500,
    txns: 226,
    buys: 106,
    sells: 120,
    tokenInfo: [48.9, 3.1, 167, 89],
    chart: 'up',
    price: 0.000345
  }
];

const categories = ['Trending', 'Surge', 'DEX Screener', 'Pump Live'];
const timeframes = ['1m', '5m', '30m', '1h'];

function MemecoinTable() {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-xs uppercase tracking-[0.3em] text-white/50">
                <th className="px-6 py-4 text-left">Pair Info</th>
                <th className="px-6 py-4 text-right">Market Cap</th>
                <th className="px-6 py-4 text-right">Liquidity</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">TXNS</th>
                <th className="px-6 py-4 text-right">Token Info</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {memecoinData.map((coin, index) => (
                <tr key={coin.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{coin.logo}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{coin.name}</span>
                          <span className="text-xs text-white/50">{coin.age}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-16 h-1 rounded-full ${coin.chart === 'up' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-xs text-white/40">{coin.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.marketCap)}</div>
                    <div className={`text-xs ${coin.marketCapChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.marketCapChange >= 0 ? '+' : ''}{coin.marketCapChange.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.liquidity)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.volume)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">{formatCompact(coin.txns)}</div>
                    <div className="text-xs text-white/50">
                      {coin.buys} buys / {coin.sells} sells
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-1">
                      <div className="text-xs text-white/60">{coin.tokenInfo[0]}% {coin.tokenInfo[1]}%</div>
                      <div className="text-xs text-white/40">{coin.tokenInfo[2]} {coin.tokenInfo[3]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-black hover:opacity-90 transition-opacity">
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-xl font-bold text-white">VolaDex Pro</div>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-accent-400">Discover</Link>
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
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search by token or CA..."
                  className="w-64 rounded-lg border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder-white/40 focus:border-accent-400 focus:outline-none"
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Tabs and Controls */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {categories.map((category, index) => (
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
              {timeframes.map((timeframe, index) => (
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

        {/* Memecoin Table */}
        <MemecoinTable />

        {/* Hero Section */}
        <section className="mt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <StatisticPill label="NEXT-GEN SOLANA" value="MEMECOIN TERMINAL" icon={<Zap className="h-4 w-4" />} />
            <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
              The ultimate <span className="text-accent-400">memecoin</span> trading terminal for Solana
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-white/70">
              Track trending memecoins, analyze market data, and execute trades with institutional-grade tools. 
              Built for the fastest and most volatile assets on Solana.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/trade"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-8 py-4 text-lg font-semibold text-black shadow-glow transition hover:scale-[1.02]"
              >
                Launch Trading Terminal
                <span className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Link>
              <button className="inline-flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 text-lg font-semibold text-white/70 transition hover:border-white/20 hover:text-white">
                View Documentation
                <BookOpen className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mt-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <GlowCard
              title="Real-time Data"
              description="Live price feeds from Birdeye API with sub-second updates"
              icon={<TrendingUp className="h-6 w-6" />}
            >
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">Live Updates</p>
              <p className="mt-1 text-sm text-white/70">
                Get real-time market data, volume, and liquidity information for all Solana memecoins.
              </p>
            </GlowCard>
            
            <GlowCard
              title="Advanced Charts"
              description="Professional candlestick charts with technical indicators"
              icon={<BarChart3 className="h-6 w-6" />}
            >
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">Technical Analysis</p>
              <p className="mt-1 text-sm text-white/70">
                Analyze price action with institutional-grade charting tools and indicators.
              </p>
            </GlowCard>
            
            <GlowCard
              title="Smart Alerts"
              description="AI-powered alerts for memecoin opportunities and risks"
              icon={<Eye className="h-6 w-6" />}
            >
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">AI Detection</p>
              <p className="mt-1 text-sm text-white/70">
                Never miss a pump with intelligent alerts and trend detection algorithms.
              </p>
            </GlowCard>
          </div>
        </section>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
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
        </div>
      </div>
    </div>
  );
}

export default LandingPage;