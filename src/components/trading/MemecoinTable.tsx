import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MemecoinData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  age: string;
  marketCap: number;
  marketCapChange: number;
  liquidity: number;
  volume: number;
  txns: number;
  buys: number;
  sells: number;
  tokenInfo: number[];
  chart: 'up' | 'down';
  price: number;
}

const memecoinData: MemecoinData[] = [
  {
    id: 'og-og',
    name: 'OG OG',
    symbol: 'OG',
    logo: '🟢',
    age: '23m',
    marketCap: 400000,
    marketCapChange: -16.2,
    liquidity: 86600,
    volume: 335000,
    txns: 1430,
    buys: 737,
    sells: 694,
    tokenInfo: [38.81, 3.48, 802, 448],
    chart: 'up',
    price: 0.000123
  },
  {
    id: 'grid-grid',
    name: 'GRID GRID',
    symbol: 'GRID',
    logo: '⚡',
    age: '3m',
    marketCap: 13900,
    marketCapChange: -61.2,
    liquidity: 20600,
    volume: 124000,
    txns: 634,
    buys: 365,
    sells: 269,
    tokenInfo: [45.2, 2.1, 156, 89],
    chart: 'down',
    price: 0.000089
  },
  {
    id: 'black-blackjack',
    name: 'black Blackjack',
    symbol: 'B',
    logo: '🃏',
    age: '1d',
    marketCap: 3930000,
    marketCapChange: 7.272,
    liquidity: 270000,
    volume: 129000,
    txns: 170,
    buys: 76,
    sells: 94,
    tokenInfo: [52.1, 4.8, 234, 156],
    chart: 'up',
    price: 0.000456
  },
  {
    id: 'ccm-criminal',
    name: 'CCM Criminal Creato...',
    symbol: 'CCM',
    logo: '🔫',
    age: '14m',
    marketCap: 54900,
    marketCapChange: 215.3,
    liquidity: 40900,
    volume: 51800,
    txns: 357,
    buys: 216,
    sells: 141,
    tokenInfo: [67.8, 1.2, 445, 123],
    chart: 'up',
    price: 0.000234
  },
  {
    id: 'sky-sky',
    name: 'SKY SKY',
    symbol: 'SKY',
    logo: '☁️',
    age: '2d',
    marketCap: 352000,
    marketCapChange: 110,
    liquidity: 77700,
    volume: 60700,
    txns: 270,
    buys: 124,
    sells: 146,
    tokenInfo: [41.3, 5.7, 189, 234],
    chart: 'up',
    price: 0.000567
  },
  {
    id: 'mic-pump',
    name: 'MIC pump mic',
    symbol: 'MIC',
    logo: '🎤',
    age: '6m',
    marketCap: 18900,
    marketCapChange: 20.93,
    liquidity: 24100,
    volume: 23500,
    txns: 226,
    buys: 106,
    sells: 120,
    tokenInfo: [48.9, 3.1, 167, 89],
    chart: 'up',
    price: 0.000345
  }
];

function formatCompact(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function MemecoinTable() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCoinClick = (coin: MemecoinData) => {
    setSelectedCoin(coin.id);
    // Navigate to trading terminal with selected coin
    navigate(`/trade?coin=${coin.symbol}&address=${coin.id}`);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-xs uppercase tracking-[0.3em] text-white/50">
                <th className="px-6 py-4 text-left">Pair Info</th>
                <th className="px-6 py-4 text-right">Market Cap</th>
                <th className="px-6 py-4 text-right">Liquidity</th>
                <th className="px-6 py-4 text-right">Volume</th>
                <th className="px-6 py-4 text-right">TXNS</th>
                <th className="px-6 py-4 text-right">Token Info</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {memecoinData.map((coin) => (
                <tr 
                  key={coin.id} 
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedCoin === coin.id ? 'bg-accent-400/10' : ''
                  }`}
                  onClick={() => handleCoinClick(coin)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{coin.logo}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{coin.name}</span>
                          <span className="text-xs text-white/50">{coin.age}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-16 h-1 rounded-full ${coin.chart === 'up' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-xs text-white/40">{coin.symbol}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.marketCap)}</div>
                    <div className={`text-xs flex items-center justify-end gap-1 ${
                      coin.marketCapChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.marketCapChange >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {coin.marketCapChange >= 0 ? '+' : ''}{coin.marketCapChange.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.liquidity)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.volume)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">{formatCompact(coin.txns)}</div>
                    <div className="text-xs text-white/50">
                      {coin.buys} buys / {coin.sells} sells
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="space-y-1">
                      <div className="text-xs text-white/60">{coin.tokenInfo[0]}% {coin.tokenInfo[1]}%</div>
                      <div className="text-xs text-white/40">{coin.tokenInfo[2]} {coin.tokenInfo[3]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-black hover:opacity-90 transition-opacity">
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
