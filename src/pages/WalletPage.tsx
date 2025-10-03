import { useState, useEffect } from 'react';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Wallet, TrendingUp, TrendingDown, Coins, DollarSign } from 'lucide-react';
import { walletService, type WalletHoldings, type WalletConnection } from '../lib/wallet';
import { WalletTest } from '../components/WalletTest';

export default function WalletPage() {
  const [connection, setConnection] = useState<WalletConnection | null>(null);
  const [holdings, setHoldings] = useState<WalletHoldings | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    try {
      const walletConnection = await walletService.connectWallet();
      setConnection(walletConnection);
      
      // Fetch holdings after connection
      const walletHoldings = await walletService.getHoldings(walletConnection.address);
      setHoldings(walletHoldings);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Fehler beim Verbinden der Wallet. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    walletService.disconnect();
    setConnection(null);
    setHoldings(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatTokenAmount = (amount: number, decimals: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals > 4 ? 4 : decimals,
    }).format(amount);
  };

  if (connection && holdings) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">Wallet Portfolio</h1>
              <p className="mt-2 text-white/60 text-sm sm:text-base">
                {connection.name} • {connection.address.slice(0, 8)}...{connection.address.slice(-8)}
              </p>
            </div>
            <button
              onClick={disconnect}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-accent-400" />
              <span className="text-sm text-white/60">Total Value</span>
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(holdings.totalValue)}</div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              {holdings.pnl >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-400" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-400" />
              )}
              <span className="text-sm text-white/60">24h P&L</span>
            </div>
            <div className={`text-2xl font-bold ${holdings.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(holdings.pnl)}
            </div>
            <div className={`text-sm ${holdings.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {holdings.pnlPercentage >= 0 ? '+' : ''}{holdings.pnlPercentage.toFixed(2)}%
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-5 w-5 text-accent-400" />
              <span className="text-sm text-white/60">Tokens</span>
            </div>
            <div className="text-2xl font-bold text-white">{holdings.tokens.length}</div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="h-5 w-5 text-accent-400" />
              <span className="text-sm text-white/60">Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-sm font-medium text-white">Connected</span>
            </div>
          </div>
        </div>

        {/* Token Holdings */}
        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Token Holdings</h2>
          <div className="space-y-4">
            {holdings.tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {token.mint === 'So11111111111111111111111111111111111111112' ? 'SOL' :
                       token.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? 'USDC' : '?'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {token.mint === 'So11111111111111111111111111111111111111112' ? 'Solana' :
                       token.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? 'USD Coin' :
                       token.mint === 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' ? 'Bonk' : 'Unknown Token'}
                    </div>
                    <div className="text-sm text-white/60">
                      {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-white">
                    {formatTokenAmount(token.uiAmount, token.decimals)}
                  </div>
                  <div className="text-sm text-white/60">
                    {formatCurrency(token.uiAmount * (token.mint === 'So11111111111111111111111111111111111111112' ? 100 : 
                                                     token.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? 1 : 0.00001))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Test Component */}
        <div className="mt-8">
          <WalletTest />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6">
          <Wallet className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Connect your Solana wallet</h1>
        <p className="text-white/60 mb-8 text-sm sm:text-base">
          Verbinde deine Wallet, um Portfolio, PnL und personalisierte Streams zu sehen.
        </p>
        <AnimatedButton 
          onClick={connect} 
          variant="primary" 
          size="lg"
          disabled={loading}
        >
          <Wallet className="mr-2 h-5 w-5" /> 
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </AnimatedButton>
      </div>
    </div>
  );
}


