
import { Bolt, Cpu, Radar, Shield, Sparkles } from 'lucide-react';


export function StrategyPanel() {
  const items = [
    {
      icon: <Bolt className="h-4 w-4" />,
      title: 'Adaptive TWAP',
      description: 'Slices 120k SOL with venue-aware speed control and liquidity backtesting.',
      status: 'Armed',
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      title: 'AI risk copilot',
      description: 'Predictive VaR monitors perp skew and flags when delta hedges drift 10bps.',
      status: 'Monitoring',
    },
    {
      icon: <Radar className="h-4 w-4" />,
      title: 'Whale radar',
      description: 'Pulls Helius wallet clusters to detect inflows to top 25 vaults in real time.',
      status: 'Live',
    },

    {
      icon: <Shield className="h-4 w-4" />,
      title: 'Compliance autopilot',
      description: 'Captures immutable audit trails, policy notes and desk sign-offs with zero friction.',
      status: 'Ready',
    },
    {
      icon: <Sparkles className="h-4 w-4" />,
      title: 'Alpha synthesizer',
      description: 'LLM-powered summaries translate data spikes into desk-ready talking points.',
      status: 'Drafting',
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/50 to-black/80 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Automation cockpit</h3>
          <p className="mt-2 text-sm text-white/60">
            Orchestrate strategies with drag-and-drop logic. No trades will be executed in this showcase – everything is simulated for
            design clarity.
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-accent-300">
          Simulated
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-accent-400">{item.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/50">{item.description}</p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
