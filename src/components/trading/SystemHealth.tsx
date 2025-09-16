import type { ComponentType } from 'react';
import { Activity, CloudLightning, Radar, Server } from 'lucide-react';

type ServiceStatus = 'Operational' | 'Live' | 'Elevated' | 'Simulated';

const services: Array<{
  name: string;
  status: ServiceStatus;
  latency: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    name: 'Birdeye market feed',
    status: 'Operational',
    latency: '182ms',
    description: 'Streaming OHLC, liquidity profiles and sentiment merges every five minutes.',
    icon: Radar,
  },
  {
    name: 'Helius wallet radar',
    status: 'Live',
    latency: '92ms',
    description: 'Tracking 120 smart money clusters with push notifications into the console.',
    icon: Activity,
  },
  {
    name: 'Pump.fun monitor',
    status: 'Elevated',
    latency: '240ms',
    description: 'Spike in new token launches detected – alerting risk desk to watch mempool.',
    icon: CloudLightning,
  },
  {
    name: 'Automation engine',
    status: 'Simulated',
    latency: '—',
    description: 'Execution disabled in demo – strategies run in sandbox for design showcase.',
    icon: Server,
  },
];

const statusTone: Record<ServiceStatus, string> = {
  Operational: 'text-accent-300',
  Live: 'text-accent-300',
  Elevated: 'text-amber-300',
  Simulated: 'text-white/50',
};

export function SystemHealth() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">System health</p>
          <p className="mt-2 text-sm text-white/60">
            Infrastructure telemetry across integrations so your desk knows exactly what is humming.
          </p>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <li key={service.name} className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{service.name}</p>
                    <p className="text-xs text-white/50">{service.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${statusTone[service.status]}`}>
                    {service.status}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">{service.latency}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
