export interface CandleDatum {
  time: number;
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
