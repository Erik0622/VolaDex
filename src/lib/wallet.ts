import { env } from './env';

export interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number;
  tokenAccount: string;
}

export interface WalletHoldings {
  address: string;
  tokens: TokenBalance[];
  totalValue: number;
  pnl: number;
  pnlPercentage: number;
}

export interface WalletConnection {
  address: string;
  connected: boolean;
  name?: string;
}

class WalletService {
  private connection: WalletConnection | null = null;

  async connectWallet(): Promise<WalletConnection> {
    // Mock wallet connection - in real implementation, use wallet adapter
    const mockAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    this.connection = {
      address: mockAddress,
      connected: true,
      name: 'Mock Wallet'
    };

    return this.connection;
  }

  async getHoldings(address: string): Promise<WalletHoldings> {
    if (!env.heliusApiKey) {
      throw new Error('Helius API key not configured');
    }

    try {
      // Use Helius API to get token accounts
      const response = await fetch(`https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${env.heliusApiKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the token balances
      const tokens: TokenBalance[] = data.tokens || [];
      
      // Calculate mock total value and PnL
      const totalValue = tokens.reduce((sum, token) => {
        // Mock price calculation - in real implementation, fetch from price API
        const mockPrice = Math.random() * 100;
        return sum + (token.uiAmount * mockPrice);
      }, 0);

      const pnl = totalValue * (Math.random() - 0.5) * 0.1; // Mock PnL calculation
      const pnlPercentage = (pnl / (totalValue - pnl)) * 100;

      return {
        address,
        tokens,
        totalValue,
        pnl,
        pnlPercentage
      };
    } catch (error) {
      console.error('Error fetching wallet holdings:', error);
      
      // Return mock data if API fails
      return this.getMockHoldings(address);
    }
  }

  private getMockHoldings(address: string): WalletHoldings {
    // Mock holdings data for testing
    const mockTokens: TokenBalance[] = [
      {
        mint: 'So11111111111111111111111111111111111111112', // SOL
        amount: '5000000000',
        decimals: 9,
        uiAmount: 5.0,
        tokenAccount: 'mock-account-1'
      },
      {
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        amount: '1000000000',
        decimals: 6,
        uiAmount: 1000.0,
        tokenAccount: 'mock-account-2'
      },
      {
        mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Bonk
        amount: '1000000000000',
        decimals: 5,
        uiAmount: 10000000.0,
        tokenAccount: 'mock-account-3'
      }
    ];

    const totalValue = 8500; // Mock total value
    const pnl = 425; // Mock profit
    const pnlPercentage = 5.27; // Mock percentage

    return {
      address,
      tokens: mockTokens,
      totalValue,
      pnl,
      pnlPercentage
    };
  }

  async getTokenMetadata(mintAddresses: string[]) {
    if (!env.heliusApiKey) {
      throw new Error('Helius API key not configured');
    }

    try {
      const response = await fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${env.heliusApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mintAccounts: mintAddresses,
          includeOffChain: false,
          disableCache: false
        })
      });

      if (!response.ok) {
        throw new Error(`Helius API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return [];
    }
  }

  disconnect(): void {
    this.connection = null;
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection?.connected || false;
  }
}

export const walletService = new WalletService();