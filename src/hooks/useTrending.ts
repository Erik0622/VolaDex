import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { env } from '../lib/env';

export interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

async function fetchFromEndpoints(): Promise<TrendingToken[]> {
  if (!env.birdeyeApiKey) throw new Error('Missing Birdeye API key');

  const endpoints = [
    'https://api.birdeye.so/defi/trending',
    'https://public-api.birdeye.so/public/v1/defi/trending',
    'https://public-api.birdeye.so/public/defi/trending',
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${env.birdeyeApiKey}`,
          'X-API-KEY': env.birdeyeApiKey,
        },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const items =
        json?.data?.tokens ??
        json?.data?.items ??
        json?.tokens ??
        json?.items ??
        [];
      const mapped: TrendingToken[] = (items as any[]).map((it) => ({
        address:
          it?.address ?? it?.mint ?? it?.mintAddress ?? it?.tokenAddress ?? '',
        symbol: String(it?.symbol ?? it?.tokenSymbol ?? it?.ticker ?? '').toUpperCase(),
        name: String(it?.name ?? it?.tokenName ?? it?.symbol ?? ''),
        price: Number(
          it?.price ?? it?.value ?? it?.priceUsd ?? it?.currentPrice ?? 0,
        ),
        change24h: Number(
          it?.priceChange24h ?? it?.change24h ?? it?.priceChangePercent ?? 0,
        ),
        volume24h: Number(
          it?.volume24h ?? it?.vol24h ?? it?.volumeUSD24h ?? it?.volume ?? 0,
        ),
        marketCap: Number(
          it?.marketCap ?? it?.mcap ?? it?.mc ?? it?.market_cap ?? 0,
        ),
      }));
      const filtered = mapped.filter((t) => t.address && t.symbol);
      if (filtered.length) return filtered;
    } catch (err) {
      // try next
    }
  }
  throw new Error('All endpoints failed');
}

export function useTrendingMemecoins() {
  const query = useQuery({
    queryKey: ['trending-memecoins'],
    queryFn: fetchFromEndpoints,
    enabled: Boolean(env.birdeyeApiKey),
    staleTime: 30_000,
    retry: 1,
  });

  const data = useMemo(() => {
    if (query.isSuccess && Array.isArray(query.data)) return query.data;
    // fallback curated minimal list (addresses must be valid)
    const fallback: TrendingToken[] = [
      {
        name: 'dogwifhat',
        symbol: 'WIF',
        address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        price: 0,
        change24h: 0,
        volume24h: 0,
        marketCap: 0,
      },
      {
        name: 'Bonk',
        symbol: 'BONK',
        address: 'DezXAzRQB8hY2V6hW5jLCTH9rAPR7Xo4jua9whV7A6f',
        price: 0,
        change24h: 0,
        volume24h: 0,
        marketCap: 0,
      },
      {
        name: 'Popcat',
        symbol: 'POPCAT',
        address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
        price: 0,
        change24h: 0,
        volume24h: 0,
        marketCap: 0,
      },
    ];
    return fallback;
  }, [query.data, query.isSuccess]);

  return { ...query, data };
}


