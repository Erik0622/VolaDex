import type { ComponentType } from 'react';
import { Flame, Megaphone, Sparkles } from 'lucide-react';

type AlphaTone = 'positive' | 'warning';

interface AlphaEvent {
  time: string;
  title: string;
  detail: string;
  sentiment: string;
  tone: AlphaTone;
  icon: ComponentType<{ className?: string }>;
}

const events: AlphaEvent[] = [
  {
    time: '2m ago',
    title: 'Options desk unloads 5k SOL calls',
    detail: 'Gamma rolling lower; hedge flows likely to support spot on dips.',
    sentiment: 'VOL ↓',
    tone: 'positive' as const,
    icon: Flame,
  },
  {
    time: '8m ago',
    title: 'Helius cluster accumulation',
    detail: 'Three high-score wallets rotating into JUP – monitor liquidity corridors.',
    sentiment: 'Flow ↑',
    tone: 'positive' as const,
    icon: Sparkles,
  },
  {
    time: '14m ago',
    title: 'Pump.fun derivative frenzy',
    detail: 'New perps launching around meme assets. Expect spillover volatility.',
    sentiment: 'Risk ⚠',
    tone: 'warning' as const,
    icon: Megaphone,
  },
];

const toneClasses: Record<AlphaTone, string> = {
  positive: 'text-accent-300',
  warning: 'text-amber-300',
};

export function AlphaFeed() {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Alpha stream</p>
          <p className="mt-2 text-sm text-white/60">
            Narrative shifts and liquidity alerts fused from Helius, Birdeye and Pump.fun. Demo stream only – no execution.
          </p>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {events.map((event) => {
          const Icon = event.icon;
          return (
            <li key={event.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{event.title}</p>
                    <p className="text-xs text-white/50">{event.detail}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-right text-xs text-white/50">
                  <span>{event.time}</span>
                  <span className={`font-semibold uppercase tracking-[0.3em] ${toneClasses[event.tone]}`}>{event.sentiment}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
