export interface TokenMarket {
  name: string;
  symbol: string;
  address: string;
  tag: 'bluechip' | 'defi' | 'perp' | 'meme';
  price: number;
  change1h: number;
  change24h: number;
  volume24h: number;
}

export const tokenMarkets: TokenMarket[] = [
  {
    name: 'Solana',
    symbol: 'SOL',
    address: 'So11111111111111111111111111111111111111112',
    tag: 'bluechip',
    price: 162.35,
    change1h: 1.23,
    change24h: 5.42,
    volume24h: 1_245_000_000,
  },
  {
    name: 'Jupiter',
    symbol: 'JUP',
    address: 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
    tag: 'defi',
    price: 1.23,
    change1h: -0.42,
    change24h: -2.18,
    volume24h: 432_500_000,
  },
  {
    name: 'Pyth Network',
    symbol: 'PYTH',
    address: 'PYTHm14mYh5sEaMdWrmxpry3X7DytHQZt81uAhvCUiQ',
    tag: 'defi',
    price: 0.87,
    change1h: 0.86,
    change24h: 3.91,
    volume24h: 215_400_000,
  },
  {
    name: 'Tensor',
    symbol: 'TNSR',
    address: 'TNSR6P7CkGyUz7Dnk3a1JpNggCB2A2nYqSCDtnznuaA',
    tag: 'defi',
    price: 4.18,
    change1h: 1.18,
    change24h: 8.34,
    volume24h: 110_500_000,
  },
  {
    name: 'dogwifhat',
    symbol: 'WIF',
    address: '8k4u8uGQCJpWznuaCG2KC9VmWHAXoJ1Bs8LojRx7iW4u',
    tag: 'meme',
    price: 2.34,
    change1h: 2.8,
    change24h: 12.6,
    volume24h: 324_200_000,
  },
  {
    name: 'Bonk',
    symbol: 'BONK',
    address: 'DezXAzRQB8hY2V6hW5jLCTH9rAPR7Xo4jua9whV7A6f',
    tag: 'meme',
    price: 0.000032,
    change1h: -1.2,
    change24h: 7.45,
    volume24h: 298_000_000,
  },
  {
    name: 'Meteora',
    symbol: 'MET',
    address: 'METoRALqVqD6oZX6mE6xPD58x35H5T6aBrZEcD3gjKUp',
    tag: 'defi',
    price: 18.45,
    change1h: 0.76,
    change24h: 4.21,
    volume24h: 88_200_000,
  },
  {
    name: 'Phoenix',
    symbol: 'PHNX',
    address: 'PHNXdo7E5Wn66iRSuLhM1cBh73PvvrLpzjAU6YewsG3x',
    tag: 'perp',
    price: 0.82,
    change1h: -0.8,
    change24h: 1.34,
    volume24h: 65_700_000,
  },
];
