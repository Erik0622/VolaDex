import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Wallet, Bell, Filter, Grid, Zap, TrendingUp, BarChart3, Eye, Settings, HelpCircle, BookOpen, Play, Users, Target, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GlowCard } from '../components/ui/GlowCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatisticPill } from '../components/ui/StatisticPill';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { formatCompact } from '../lib/format';
import { useTrendingMemecoins } from '../hooks/useTrending';

// Live trending via Birdeye with fallback inside the hook

const features = [
  {
    title: 'Real-time Memecoin Tracking',
    description: 'Live price feeds and volume data for all Solana memecoins with sub-second updates',
    icon: <TrendingUp className="h-6 w-6" />,
    metric: '< 100ms latency'
  },
  {
    title: 'Advanced Charting',
    description: 'Professional candlestick charts with technical indicators and trend analysis',
    icon: <BarChart3 className="h-6 w-6" />,
    metric: '15+ indicators'
  },
  {
    title: 'Smart Alerts',
    description: 'AI-powered alerts for memecoin opportunities, pumps, and market movements',
    icon: <Eye className="h-6 w-6" />,
    metric: 'Instant notifications'
  },
  {
    title: 'Portfolio Management',
    description: 'Track your memecoin holdings with real-time P&L and performance metrics',
    icon: <Wallet className="h-6 w-6" />,
    metric: 'Multi-wallet support'
  }
];

const categories = ['Trending', 'Surge', 'DEX Screener', 'Pump Live'];

function MemecoinInsights() {
  const { data: trending, isSuccess, isLoading } = useTrendingMemecoins();
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Trending Memecoins</h3>
        <Link to="/trade" className="text-sm text-accent-400 hover:text-accent-300">
          View All →
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(trending ?? []).slice(0, 8).map((coin) => (
          <motion.div
            key={coin.symbol}
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/10 bg-black/40 p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="font-semibold text-white">{coin.name}</div>
                <div className="text-xs text-white/50">{coin.symbol}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Price</span>
                <span className="font-mono text-sm text-white">{coin.price ? `$${Number(coin.price).toLocaleString()}` : '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">24h Change</span>
                <span className={`text-sm font-semibold ${Number(coin.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Number(coin.change24h) >= 0 ? '+' : ''}{Number(coin.change24h).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Volume</span>
                <span className="font-mono text-xs text-white/70">${formatCompact(Number(coin.volume24h))}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoryTabs() {
  return (
    <div className="flex items-center gap-1 mb-8">
      {categories.map((category, index) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            index === 0
              ? 'bg-accent-400 text-black'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          {category}
        </motion.button>
      ))}
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
              {/* Branding entfernt */}
              <div className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-accent-400">Discover</Link>
                <a href="#pulse" className="text-sm text-white/60 hover:text-white">Pulse</a>
                <a href="#trackers" className="text-sm text-white/60 hover:text-white">Trackers</a>
                <a href="#perpetuals" className="text-sm text-white/60 hover:text-white">Perpetuals</a>
                <a href="#yield" className="text-sm text-white/60 hover:text-white">Yield</a>
                <a href="#vision" className="text-sm text-white/60 hover:text-white">Vision</a>
                <Link to="/portfolio" className="text-sm text-white/60 hover:text-white">Portfolio</Link>
                <a href="#rewards" className="text-sm text-white/60 hover:text-white">Rewards</a>
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
              <AnimatedButton variant="primary" size="md">
                Deposit
              </AnimatedButton>
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Bell className="h-5 w-5" />
              </button>
              <button className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Star className="h-5 w-5" />
              </button>
              <Link to="/wallet" className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Wallet className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Category Tabs */}
        <CategoryTabs />

        {/* Memecoin Insights */}
        <MemecoinInsights />

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
                <motion.span 
                  className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-1"
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 px-8 py-4 text-lg font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
              >
                View Documentation
                <BookOpen className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mt-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlowCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                >
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">{feature.metric}</p>
                  <p className="mt-1 text-sm text-white/70">
                    Professional-grade tools for serious memecoin traders and investors.
                  </p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-24">
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent-400">500+</div>
              <div className="text-sm text-white/60">Memecoins Tracked</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent-400">&lt;100ms</div>
              <div className="text-sm text-white/60">Data Latency</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-accent-400">24/7</div>
              <div className="text-sm text-white/60">Live Monitoring</div>
            </motion.div>
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