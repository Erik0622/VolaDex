import { motion } from 'framer-motion';
import { ArrowRight, Search, Star, Wallet, Bell, Filter, Grid, Zap, TrendingUp, BarChart3, Eye, Settings, HelpCircle, BookOpen, Play, Users, Target, Activity, Flame, Sparkles, Shield, LineChart, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

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
  const { data: trending, isSuccess, isLoading, isError } = useTrendingMemecoins();
  const navigate = Link;

  const handleCoinClick = (coin: any) => {
    // Navigate to chart page with the selected coin
    window.location.href = `/chart?address=${coin.address}&symbol=${coin.symbol}&name=${encodeURIComponent(coin.name)}`;
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Trending Memecoins</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/40 p-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/10 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !trending || trending.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <p className="text-sm text-yellow-500">
            Unable to load trending tokens. Please check your API key configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Trending Memecoins</h3>
          <p className="text-xs text-white/50 mt-1">✅ Live data from Birdeye API</p>
        </div>
        <Link to="/trade" className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-2">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trending.slice(0, 8).map((coin, index) => (
          <motion.div
            key={coin.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCoinClick(coin)}
            className="rounded-2xl border border-white/10 bg-black/40 p-4 hover:bg-white/5 hover:border-accent-400/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              {coin.logoURI ? (
                <img 
                  src={coin.logoURI} 
                  alt={coin.symbol}
                  className="h-10 w-10 rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 ${coin.logoURI ? 'hidden' : ''}`}>
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{coin.name}</div>
                <div className="text-xs text-white/50">{coin.symbol}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Price</span>
                <span className="font-mono text-sm text-white">
                  ${coin.price < 0.01 ? coin.price.toExponential(2) : coin.price.toFixed(4)}
                </span>
              </div>
              {coin.change24h !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">24h</span>
                  <span className={`text-sm font-semibold ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Vol</span>
                <span className="font-mono text-xs text-white/70">${formatCompact(coin.volume24h)}</span>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to trading terminal with search query
      window.location.href = `/trade?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-8 flex-1">
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-white">VolaDex</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-6">
                <Link to="/" className="text-sm font-medium text-accent-400">Discover</Link>
                <Link to="/trade" className="text-sm text-white/60 hover:text-white transition-colors">Trade</Link>
                <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
                <a href="#stats" className="text-sm text-white/60 hover:text-white transition-colors">Stats</a>
                <Link to="/portfolio" className="text-sm text-white/60 hover:text-white transition-colors">Portfolio</Link>
                <Link to="/wallet" className="text-sm text-white/60 hover:text-white transition-colors">Wallet</Link>
              </div>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search token or CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 rounded-lg border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder-white/40 focus:border-accent-400 focus:outline-none"
                />
              </form>
              <Link to="/trade" className="hidden lg:inline-flex rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity">
                Launch Terminal
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg border border-white/10 p-2 text-white/60 hover:text-white"
            >
              {mobileMenuOpen ? <Filter className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search token or CA..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2 text-sm text-white placeholder-white/40 focus:border-accent-400 focus:outline-none"
                />
              </form>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm font-medium text-accent-400 px-3 py-2 rounded-lg hover:bg-white/5">Discover</Link>
                <Link to="/trade" className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Trade</Link>
                <a href="#features" className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Features</a>
                <a href="#stats" className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Stats</a>
                <Link to="/portfolio" className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Portfolio</Link>
                <Link to="/wallet" className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5">Wallet</Link>
              </div>
              <Link to="/trade" className="block text-center rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black">
                Launch Terminal
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Category Tabs */}
        <CategoryTabs />

        {/* Memecoin Insights */}
        <MemecoinInsights />

        {/* Hero Section */}
        <section className="mt-16 sm:mt-24 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <StatisticPill label="NEXT-GEN SOLANA" value="MEMECOIN TERMINAL" icon={<Zap className="h-4 w-4" />} />
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              The ultimate <span className="text-accent-400">memecoin</span> trading terminal for Solana
            </h1>
            <p className="mx-auto max-w-3xl text-base sm:text-lg text-white/70 px-4">
              Track trending memecoins, analyze market data, and execute trades with institutional-grade tools. 
              Built for the fastest and most volatile assets on Solana.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/trade"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black shadow-glow transition hover:scale-[1.02] w-full sm:w-auto justify-center"
              >
                Launch Trading Terminal
                <motion.span 
                  className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-1"
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </Link>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white/70 transition hover:border-white/20 hover:text-white w-full sm:w-auto justify-center"
              >
                View Features
                <Eye className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mt-16 sm:mt-24">
          <SectionHeader 
            eyebrow="Features"
            title="Professional Trading Tools"
            description="Everything you need for successful memecoin trading on Solana"
          />
          <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Additional Features Section */}
        <section className="mt-16 sm:mt-24">
          <SectionHeader 
            eyebrow="Analytics"
            title="Advanced Analytics & Insights"
            description="Real-time data powered by Birdeye API for informed trading decisions"
          />
          <div className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                  <LineChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Live Price Charts</h3>
              </div>
              <p className="text-sm text-white/70">
                Real-time candlestick charts with OHLCV data for every Solana memecoin. Powered by Birdeye API for accuracy and speed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Market Analytics</h3>
              </div>
              <p className="text-sm text-white/70">
                Track volume, liquidity, transactions, and market cap changes in real-time. Identify trends before they explode.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Smart Filters</h3>
              </div>
              <p className="text-sm text-white/70">
                Filter by market cap, volume, age, and custom criteria. Search by contract address to find any token instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Multi-Timeframe Analysis</h3>
              </div>
              <p className="text-sm text-white/70">
                Analyze charts across 1m, 5m, 15m, 1h, 4h, and 1d timeframes. Perfect for both scalpers and swing traders.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Trending Discovery</h3>
              </div>
              <p className="text-sm text-white/70">
                Discover trending memecoins before they moon. Surge detection and DEX screener integration for alpha.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Portfolio Tracking</h3>
              </div>
              <p className="text-sm text-white/70">
                Track your memecoin portfolio with real-time P&L, performance metrics, and comprehensive analytics.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="mt-16 sm:mt-24">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent-400">500+</div>
              <div className="text-sm text-white/60 mt-2">Memecoins Tracked</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent-400">&lt;100ms</div>
              <div className="text-sm text-white/60 mt-2">Data Latency</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent-400">24/7</div>
              <div className="text-sm text-white/60 mt-2">Live Monitoring</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent-400">∞</div>
              <div className="text-sm text-white/60 mt-2">Trading Volume</div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 sm:mt-24 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 p-8 sm:p-12 text-center"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
              Ready to start trading?
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of traders using VolaDex to discover and trade the hottest Solana memecoins
            </p>
            <Link
              to="/trade"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 text-lg font-semibold text-black shadow-glow transition hover:scale-[1.02]"
            >
              Launch Terminal Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </section>
      </div>

      {/* Bottom Status Bar - Hidden on small screens, visible on desktop */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur-xl z-40">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-white">LIVE</span>
              <div className="flex items-center gap-2 text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="font-mono">Real-time Data</span>
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Birdeye API</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/wallet" className="text-white/60 hover:text-white transition-colors">
                <Wallet className="h-4 w-4" />
              </Link>
              <a href="#features" className="text-white/60 hover:text-white transition-colors">
                <Settings className="h-4 w-4" />
              </a>
              <a href="https://docs.birdeye.so" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <HelpCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;