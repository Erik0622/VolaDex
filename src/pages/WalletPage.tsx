import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Wallet } from 'lucide-react';

export default function WalletPage() {
  const connect = () => {
    alert('Wallet Connect Platzhalter – hier kann z.B. wallet-adapter integriert werden.');
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Connect your Solana wallet</h1>
      <p className="mt-2 text-white/60">Verbinde deine Wallet, um Portfolio, PnL und personalisierte Streams zu sehen.</p>
      <div className="mt-8">
        <AnimatedButton onClick={connect} variant="primary" size="lg">
          <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
        </AnimatedButton>
      </div>
    </div>
  );
}


