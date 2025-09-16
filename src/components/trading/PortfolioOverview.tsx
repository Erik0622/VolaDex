import { ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

const positions = [
  {
    asset: 'SOL-PERP',
    side: 'Long bias',
    notional: '$12.5M',
    pnl: '+$420k',
    risk: 'Δ +1.2',
    status: 'Hedged',
  },
  {
    asset: 'JUP-SPOT',
    side: 'Accumulating',
    notional: '$6.3M',
    pnl: '+$120k',
    risk: 'Δ +0.4',
    status: 'Auto ladder',
  },
  {
    asset: 'mSOL/SOL LP',
    side: 'Neutral vault',
    notional: '$9.8M',
    pnl: '+$86k',
    risk: 'Δ flat',
    status: 'Auto rebalance',
  },
];

const aggregates = [
  { label: 'Net exposure', value: '$32.8M' },
  { label: 'Leverage', value: '3.2×' },
  { label: 'VaR 95%', value: '$2.4M' },
];

export function PortfolioOverview() {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-black/40 to-black/80 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Portfolio overview</p>
          <p className="mt-2 text-sm text-white/60">
            Simulated exposures from the demo desk. No live trades are routed – the view is here to showcase precision.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-accent-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Custody synced
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-5 text-xs uppercase tracking-[0.3em] text-white/50">
        {aggregates.map((aggregate) => (
          <div key={aggregate.label} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p>{aggregate.label}</p>
            <p className="mt-2 text-base font-semibold text-white">{aggregate.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {positions.map((position) => (
          <div key={position.asset} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{position.asset}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">{position.side}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/50">
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-sm text-white">{position.notional}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-sm text-accent-300">{position.pnl}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-sm text-white/80">{position.risk}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-white/50">
              <p>Status: <span className="text-accent-300">{position.status}</span></p>
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.3em] text-white/40">
                View leg <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
