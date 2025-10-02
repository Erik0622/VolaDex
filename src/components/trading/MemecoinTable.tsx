import { useState } from 'react';
import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrendingMemecoins } from '../../hooks/useTrending';
import { formatCompact } from '../../lib/format';


export function MemecoinTable() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: trending, isLoading } = useTrendingMemecoins();

  const handleCoinClick = (coin: any) => {
    setSelectedCoin(coin.address);
    // Navigate to chart page with selected coin
    navigate(`/chart?address=${coin.address}&symbol=${coin.symbol}&name=${encodeURIComponent(coin.name)}`);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400 mx-auto mb-4"></div>
            <p className="text-white/60">Loading trending tokens...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trending || trending.length === 0) {
    return (
      <div className="w-full">
        <div className="overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
          <p className="text-sm text-yellow-500">
            Unable to load trending tokens. Please check your API configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Trending Tokens</h3>
        <span className="text-xs text-green-400">🟢 Live Data from Birdeye</span>
      </div>
      
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr className="text-xs uppercase tracking-[0.3em] text-white/50">
                <th className="px-6 py-4 text-left">Token</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">24h Change</th>
                <th className="px-6 py-4 text-right">Volume 24h</th>
                <th className="px-6 py-4 text-right">Market Cap</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {trending.slice(0, 20).map((coin) => (
                <tr 
                  key={coin.address} 
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                    selectedCoin === coin.address ? 'bg-accent-400/10' : ''
                  }`}
                  onClick={() => handleCoinClick(coin)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {coin.logoURI ? (
                        <img 
                          src={coin.logoURI} 
                          alt={coin.symbol}
                          className="h-10 w-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-500 ${coin.logoURI ? 'hidden' : ''}`}>
                        <Flame className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{coin.name}</div>
                        <div className="text-xs text-white/50">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">
                      ${coin.price < 0.01 ? coin.price.toExponential(2) : coin.price.toFixed(4)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {coin.change24h !== null ? (
                      <div className={`flex items-center justify-end gap-1 ${
                        coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span className="text-sm font-semibold">
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-white/40">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.volume24h)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-sm text-white">${formatCompact(coin.marketCap)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCoinClick(coin);
                      }}
                      className="rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-xs font-semibold text-black hover:opacity-90 transition-opacity"
                    >
                      View Chart
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
