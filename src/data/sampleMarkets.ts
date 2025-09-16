export interface MarketSummary {
  name: string;
  symbol: string;
  address: string;
  price: number;
  change24h: number;
  liquidity: number;
  volume24h: number;
}

export const marketSummaries: MarketSummary[] = [
  {
    name: 'Solana',
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    price: 162.35,
    change24h: 5.42,
    liquidity: 823_400_000,
    volume24h: 1_245_000_000,
  },
  {
    name: 'Jupiter',
    symbol: 'JUP',
    address: 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
    price: 1.23,
    change24h: -2.18,
    liquidity: 164_000_000,
    volume24h: 432_500_000,
  },
  {
    name: 'Pyth Network',
    symbol: 'PYTH',
    address: 'PYTHm14mYh5sEaMdWrmxpry3X7DytHQZt81uAhvCUiQ',
    price: 0.87,
    change24h: 3.91,
    liquidity: 96_200_000,
    volume24h: 215_400_000,
  },
  {
    name: 'Tensor',
    symbol: 'TNSR',
    address: 'TNSR6P7CkGyUz7Dnk3a1JpNggCB2A2nYqSCDtnznuaA',
    price: 4.18,
    change24h: 8.34,
    liquidity: 42_800_000,
    volume24h: 110_500_000,
  },
];
