import { useQuery } from '@tanstack/react-query';
import { env } from '../lib/env';
import { fetchTrendingTokens, type BirdeyeTokenInfo } from '../lib/birdeye-service';

export interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number | null;
  volume24h: number;
  marketCap: number;
  logoURI?: string;
}

async function fetchTrending(): Promise<TrendingToken[]> {
  if (!env.birdeyeApiKey) {
    console.warn('Missing Birdeye API key');
    throw new Error('Missing Birdeye API key');
  }

  try {
    const tokens = await fetchTrendingTokens(20);
    
    // Convert to TrendingToken format
    return tokens.map((token: BirdeyeTokenInfo) => ({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      price: token.price,
      change24h: token.priceChange24h,
      volume24h: token.volume24h,
      marketCap: token.marketCap,
      logoURI: token.logoURI,
    }));
  } catch (error) {
    console.error('Failed to fetch trending tokens:', error);
    throw error;
  }
}

export function useTrendingMemecoins() {
  const query = useQuery({
    queryKey: ['trending-memecoins'],
    queryFn: fetchTrending,
    enabled: Boolean(env.birdeyeApiKey),
    staleTime: 60_000, // Cache for 1 minute
    retry: 2,
    retryDelay: 1000,
  });

  return query;
}


