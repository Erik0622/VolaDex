import type { CandleDatum } from '../types/trading';

const startTimestamp = Math.floor(Date.now() / 1000) - 60 * 120;

function generateCandle(index: number): CandleDatum {
  const basePrice = 150 + Math.sin(index / 6) * 5 + Math.cos(index / 14) * 3;
  const drift = index * 0.05;
  const open = basePrice + drift;
  const close = open + (Math.sin(index / 3) * 2 + Math.random() * 1.5 - 0.75);
  const high = Math.max(open, close) + Math.random() * 1.4;
  const low = Math.min(open, close) - Math.random() * 1.4;
  const volume = 1200 + Math.sin(index / 5) * 400 + Math.random() * 150;

  return {
    time: startTimestamp + index * 60,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume: Number(volume.toFixed(2)),
  };
}

export const sampleCandles: CandleDatum[] = Array.from({ length: 120 }, (_, index) => generateCandle(index));
