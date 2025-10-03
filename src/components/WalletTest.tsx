import { useState } from 'react';
import { walletService } from '../lib/wallet';
import { testHeliusAPI } from '../lib/helius-test';

export function WalletTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setTestResult('Running tests...\n');
    
    try {
      // Test Helius API
      setTestResult(prev => prev + 'Testing Helius API...\n');
      const heliusSuccess = await testHeliusAPI();
      setTestResult(prev => prev + `Helius API: ${heliusSuccess ? '✅ Success' : '❌ Failed'}\n`);
      
      // Test wallet service
      setTestResult(prev => prev + 'Testing wallet service...\n');
      try {
        const mockAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        const holdings = await walletService.getHoldings(mockAddress);
        setTestResult(prev => prev + `Wallet Service: ✅ Success - Found ${holdings.tokens.length} tokens\n`);
        setTestResult(prev => prev + `Total Value: $${holdings.totalValue.toFixed(2)}\n`);
        setTestResult(prev => prev + `P&L: $${holdings.pnl.toFixed(2)} (${holdings.pnlPercentage.toFixed(2)}%)\n`);
      } catch (error) {
        setTestResult(prev => prev + `Wallet Service: ❌ Failed - ${error}\n`);
      }
      
      setTestResult(prev => prev + '\n🎉 Test completed!');
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Wallet Integration Test</h3>
      <p className="text-white/60 mb-4">
        This component tests the Helius API integration and wallet service functionality.
      </p>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>
      
      {testResult && (
        <div className="bg-black/40 rounded-lg p-4">
          <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono">
            {testResult}
          </pre>
        </div>
      )}
    </div>
  );
}