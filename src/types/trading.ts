import type { UTCTimestamp } from 'lightweight-charts';

export interface CandleDatum {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface TradeItem {
  side: 'buy' | 'sell';
  price: number;
  size: number;
  time: string;
}
