import type { OrderBookLevel, TradeItem } from '../types/trading';

const basePrice = 162.35;

export const bids: OrderBookLevel[] = Array.from({ length: 12 }, (_, i) => {
  const price = basePrice - i * 0.08;
  const size = 950 + Math.pow(1.4, i) * 12;
  return {
    price: Number(price.toFixed(2)),
    size: Number(size.toFixed(2)),
    total: Number((size * price).toFixed(2)),
  };
});

export const asks: OrderBookLevel[] = Array.from({ length: 12 }, (_, i) => {
  const price = basePrice + i * 0.08;
  const size = 900 + Math.pow(1.35, i) * 11;
  return {
    price: Number(price.toFixed(2)),
    size: Number(size.toFixed(2)),
    total: Number((size * price).toFixed(2)),
  };
});

const now = new Date();

export const recentTrades: TradeItem[] = Array.from({ length: 18 }, (_, i) => {
  const side: TradeItem['side'] = i % 2 === 0 ? 'buy' : 'sell';
  const priceOffset = (Math.random() - 0.5) * 0.5;
  const price = basePrice + priceOffset;
  const size = 150 + Math.random() * 240;
  const timestamp = new Date(now.getTime() - i * 45_000);

  return {
    side,
    price: Number(price.toFixed(3)),
    size: Number(size.toFixed(2)),
    time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
});
