import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Brain, Radar, ShieldCheck, Sparkles, TimerReset } from 'lucide-react';
import { Link } from 'react-router-dom';

import { GlowCard } from '../components/ui/GlowCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { StatisticPill } from '../components/ui/StatisticPill';
import { marketSummaries } from '../data/sampleMarkets';
import { formatCompact, formatCurrency, formatPercent } from '../lib/format';

const heroStats = [
  { label: 'Execution', value: '<12ms', change: 'Latency' },
  { label: 'Coverage', value: '420+', change: 'Markets' },
  { label: 'Integrations', value: '35', change: 'Protocols' },
];

const features = [
  {
    title: 'Institutional-grade toolkit',
    description: 'Cross-margined portfolio view, latency-aware routing and custom Smart Order logic shaped for serious Solana teams.',
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: 'AI-guided execution',
    description: 'Proactive flow alerts, predictive liquidity modelling and AI generated strategy blocks to supercharge your desk.',
    icon: <Brain className="h-6 w-6" />,
  },
  {
    title: 'Global risk visibility',
    description: 'Unified perps + spot risk across venues with scenario stress-tests streamed in real time to every stakeholder.',
    icon: <Radar className="h-6 w-6" />,
  },
  {
    title: 'Pro-grade analytics',
    description: 'Volatility surfaces, liquidity maps and cross-chain capital flows natively embedded into the trading terminal.',
    icon: <BarChart2 className="h-6 w-6" />,
  },
];


const capabilityModules = [
  {
    title: 'Command center workspace',
    description:
      'Swap between macro watchlists, execution view and strategy builder instantly with synchronized context panes.',
    metrics: [
      { label: 'Workspace latency', value: '<8ms' },
      { label: 'Linked canvases', value: '6' },
      { label: 'Focus presets', value: 'Flow · Execution · Research' },
    ],
    tags: ['Focus mode', 'Keyboard-first', 'Adaptive grid'],
  },
  {
    title: 'Intelligence mesh',
    description:
      'Helius flows, Birdeye depth and Pump.fun launches braided into a single AI-ranked alert stack for your desk.',
    metrics: [
      { label: 'Signal refresh', value: '15s cadence' },
      { label: 'Wallet clusters', value: '120 tracked' },
      { label: 'Sentiment scoring', value: 'Neural contextual' },
    ],
    tags: ['Helius fused', 'Birdeye depth', 'AI curation'],
  },
  {
    title: 'Post-trade clarity',
    description:
      'Granular audit trails, smart reconciliations and automated reports so compliance is as elegant as the UI.',
    metrics: [
      { label: 'Reconciliation', value: 'Real time' },
      { label: 'Reports generated', value: 'SOC2 ready' },
      { label: 'Workflow automations', value: '30+ blocks' },
    ],
    tags: ['Audit-ready', 'Custody sync', 'Enterprise'],
  },
];

const connectivityHighlights = [
  {
    title: 'Liquidity venues',
    description: 'Phoenix, OpenBook, Meteora, Jupiter and more with adaptive routing heuristics.',
    metric: 'Depth coverage 99.4%',
  },
  {
    title: 'Risk systems',
    description: 'Real-time VaR, delta and gamma monitors with scenario modelling piped to every workspace.',
    metric: 'Updates every 60s',
  },
  {
    title: 'Operational stack',
    description: 'Ledger, Fireblocks, Slack, Notion and custom webhooks orchestrated through automation blocks.',
    metric: '38 integrations',
  },
];

const opsTimeline = [
  {
    phase: 'Scan',
    description: 'AI observes mempool, social velocity and funding skew to surface emerging catalysts.',
    status: 'Live',
  },
  {
    phase: 'Decide',
    description: 'Desk receives ranked playbooks with risk deltas, liquidity routes and automation suggestions.',
    status: 'In-flight',
  },
  {
    phase: 'Execute',
    description: 'Smart order router simulates impact, slices orders and syncs hedges without triggering real trades here.',
    status: 'Simulated',
  },
  {
    phase: 'Review',
    description: 'Post-trade dashboards log fills, compliance flags and alpha notes for every cycle.',
    status: 'Logged',
  },
];


function TerminalPreview() {
  return (
    <div className="relative mx-auto max-w-3xl rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-panel backdrop-blur-2xl">
      <div className="absolute inset-x-10 top-10 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">SOL / USDC</p>
            <p className="mt-2 text-3xl font-semibold text-white">$162.35</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white/60">
            <p className="font-mono text-accent-400">Latency 11.2ms</p>
            <p className="font-mono text-white/40">Route: Meteora · Phoenix</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-6">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-[0.3em]">Price action</span>
              <span className="font-mono text-accent-400">1H +5.4%</span>
            </div>
            <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/20">
              <div className="relative h-full w-full">
                <div className="absolute inset-10 rounded-2xl bg-grid-pattern bg-[length:20px_20px] opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 320 160" className="h-40 w-full text-primary-400">
                    <path
                      d="M0 120 C40 100 70 110 110 80 C140 60 170 30 210 40 C240 48 260 90 320 70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0 140 C35 130 70 136 110 110 C150 86 180 50 220 60 C260 68 280 110 320 96"
                      fill="none"
                      stroke="rgba(80,227,194,0.55)"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Flow radar</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="flex items-center justify-between text-white/70">
                  <span>Perp OI</span>
                  <span className="font-mono text-white">$1.62B</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Spot Depth</span>
                  <span className="font-mono text-white">$324M</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Funding Bias</span>
                  <span className="font-mono text-accent-400">+12.4%</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Automation</p>
              <div className="mt-3 space-y-2 text-xs text-white/60">
                <p>• Iceberg order triggered at $161.90</p>
                <p>• Smart TWAP streaming via Phoenix</p>
                <p>• Delta hedge rebalanced +8bps</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketPulse() {
  return (
    <div className="glass-panel rounded-[32px] border border-white/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent-400">Market pulse</p>
          <p className="mt-2 text-lg font-semibold text-white">Live liquidity overview</p>
        </div>
        <Link to="/trade" className="text-sm font-medium text-accent-400 transition hover:text-accent-500">
          Launch terminal →
        </Link>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {marketSummaries.map((market) => (
          <div key={market.symbol} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{market.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{market.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{formatCurrency(market.price, { maximumFractionDigits: 3 })}</p>
                <p className={market.change24h >= 0 ? 'text-xs font-semibold text-accent-400' : 'text-xs font-semibold text-rose-400'}>
                  {formatPercent(market.change24h)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-white/60">
              <div>
                <p className="uppercase tracking-[0.2em]">Liquidity</p>
                <p className="mt-1 font-mono text-sm text-white">{formatCompact(market.liquidity)}</p>
              </div>
              <div>
                <p className="uppercase tracking-[0.2em]">24h Volume</p>
                <p className="mt-1 font-mono text-sm text-white">{formatCompact(market.volume24h)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function ExperienceStack() {
  return (
    <section className="border-y border-white/5 py-24" id="workflow">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <SectionHeader
          eyebrow="Workflow engine"
          title="Every trading discipline wired into one command center"
          description="Purpose-built modules keep discovery, execution and reporting inside a single cinematic flow."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {capabilityModules.map((module) => (
            <div
              key={module.title}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-black/40 to-black/80 p-8"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative flex h-full flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-300">Desk module</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{module.title}</h3>
                  <p className="mt-3 text-sm text-white/70">{module.description}</p>
                </div>
                <div className="space-y-3 text-xs">
                  {module.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white/60"
                    >
                      <span className="uppercase tracking-[0.3em]">{metric.label}</span>
                      <span className="font-mono text-sm text-white">{metric.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
                  {module.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-panel grid gap-8 rounded-[36px] border border-white/10 bg-white/5 p-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Connectivity matrix</h4>
            <ul className="space-y-4 text-sm text-white/70">
              {connectivityHighlights.map((item) => (
                <li key={item.title} className="rounded-3xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent-300">{item.metric}</span>
                  </div>
                  <p className="mt-3 text-xs text-white/50">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Operator timeline</h4>
            <div className="relative rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-accent-400/60 via-white/10 to-transparent" />
              <div className="space-y-6">
                {opsTimeline.map((step, index) => (
                  <div key={step.phase} className="relative pl-10">
                    <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/80 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-white">{step.phase}</p>
                    <p className="mt-1 text-xs text-white/50">{step.description}</p>
                    <span className="mt-2 inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-300">
                      {step.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function LandingPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pb-24 pt-12">
        <div className="absolute inset-0">
          <div className="absolute inset-x-0 top-20 mx-auto h-[400px] w-[90%] rounded-[40px] bg-gradient-to-br from-white/10 via-primary-500/10 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,107,255,0.18),_transparent_55%)]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row lg:items-start">
          <motion.div
            className="max-w-2xl space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <StatisticPill label="NEXT-GEN SOLANA" value="INSTITUTIONAL TERMINAL" icon={<Sparkles className="h-4 w-4" />} />
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
              The Solana trading operating system built for desks that need to move <span className="text-accent-400">faster</span> than
              the market.
            </h1>
            <p className="text-lg text-white/70">
              Route liquidity across every major venue, visualize risk in real time and orchestrate automated strategies with an
              experience that outclasses every CeFi terminal you have ever used.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/trade"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-6 py-3 text-sm font-semibold text-black shadow-glow transition hover:scale-[1.02]"
              >
                Launch trading terminal
                <span className="rounded-full bg-black/10 p-1 transition group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
              <button className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white">
                Explore research deck
                <TimerReset className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/60">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col rounded-2xl border border-white/5 bg-white/5 px-5 py-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-white/50">{stat.label}</span>
                  <span className="mt-2 text-2xl font-semibold text-white">{stat.value}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-accent-400">{stat.change}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          >
            <TerminalPreview />
          </motion.div>
        </div>
      </section>

      <section id="analytics" className="section-gradient border-y border-white/5 py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
          <SectionHeader
            eyebrow="Signal engineered"
            title="A complete execution & intelligence stack"
            description="We rebuilt every primitive to feel cinematic. Rapid-scan liquidity heatmaps, AI risk copilots and modular automation blocks make
              VolaDex the new benchmark for crypto-native teams."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <GlowCard key={feature.title} title={feature.title} description={feature.description} icon={feature.icon}>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">Realtime</p>
                <p className="mt-1 text-sm text-white/70">
                  Latency dashboards, split-second failover logic and continuous market replay ensure you never miss the move.
                </p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>


      <ExperienceStack />



      <section className="py-24" id="insights">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 lg:flex-row lg:items-center">
          <div className="lg:w-1/2">
            <SectionHeader
              eyebrow="Research intelligence"
              title="Discover catalysts before they become consensus"
              description="Monitor social velocity, pool depth, unlock schedules and whale movement in a single adaptive dashboard."
            />
            <div className="mt-10 space-y-4 text-sm text-white/70">
              <p>
                Our discovery engine syncs with Helius, Birdeye and Pump.fun to curate what matters. Every data point is contextualized
                with AI summaries and risk scores so you can deploy capital with conviction.
              </p>
              <p>
                Trigger alerts on memecoin launches, NFT floor dislocations or perp skew – then one-click route liquidity through your
                preferred venues, all inside VolaDex.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4 text-xs text-white/40">
              <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">Helius Signals</span>
              <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">Birdeye Depth</span>
              <span className="rounded-full border border-white/10 px-4 py-2 uppercase tracking-[0.3em]">Pump.fun Radar</span>
            </div>
          </div>
          <div className="lg:w-1/2">
            <MarketPulse />
          </div>
        </div>
      </section>

      <section className="section-gradient border-y border-white/5 py-24" id="docs">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent-400">No more compromise</p>
          <h3 className="text-4xl font-semibold">
            Experience a trading environment where design meets execution. <span className="text-accent-400">Every pixel</span> has a job.
          </h3>
          <p className="max-w-3xl text-base text-white/70">
            Deploy the VolaDex terminal within minutes. API-first architecture, granular permissioning, SOC2-ready audit trails and
            enterprise support create a platform that scales with your ambitions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/50">
            <span className="rounded-full border border-white/10 px-5 py-2 uppercase tracking-[0.3em]">SAML / SSO</span>
            <span className="rounded-full border border-white/10 px-5 py-2 uppercase tracking-[0.3em]">Granular Roles</span>
            <span className="rounded-full border border-white/10 px-5 py-2 uppercase tracking-[0.3em]">99.99% SLA</span>
            <span className="rounded-full border border-white/10 px-5 py-2 uppercase tracking-[0.3em]">24/7 Support</span>
          </div>
          <Link
            to="/trade"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500 px-6 py-3 text-sm font-semibold text-black shadow-glow transition hover:scale-[1.02]"
          >
            Launch the experience
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
