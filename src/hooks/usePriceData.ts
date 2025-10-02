
import type { UTCTimestamp } from 'lightweight-charts';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { sampleCandles } from '../data/sampleCandles';
import type { CandleDatum } from '../types/trading';
import { env, validateApiKeys, getSecurityWarning } from '../lib/env';
import { fetchOHLCVData, type BirdeyeOHLCVParams } from '../lib/birdeye-service';

interface UsePriceDataOptions {
  address: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

interface PriceDataResult {
  source: 'birdeye' | 'sample';
  candles: CandleDatum[];
}

async function fetchBirdeyeCandles(address: string, type: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'): Promise<CandleDatum[]> {
  // Validierung und Sicherheitshinweis
  validateApiKeys();
  getSecurityWarning();

  if (!env.birdeyeApiKey) {
    console.warn('Missing Birdeye API key, falling back to sample data');
    throw new Error('Missing Birdeye API key');
  }

  console.log('🔄 Fetching Birdeye price history for:', { 
    address, 
    type, 
    apiKey: env.birdeyeApiKey.substring(0, 8) + '...' 
  });

  try {
    const response = await fetchOHLCVData({
      address,
      type,
    });

    if (!response.success || !response.data?.items || response.data.items.length === 0) {
      console.warn('No data returned from Birdeye API');
      throw new Error('No data items found in Birdeye response');
    }

    const candles = mapBirdeyeData(response.data.items);
    console.log('✅ Successfully fetched Birdeye data:', candles.length, 'candles');
    return candles;
  } catch (error) {
    console.error('❌ Failed to fetch Birdeye data:', error);
    throw error;
  }
}

function mapBirdeyeData(rawItems: any[]): CandleDatum[] {
  const mapped: CandleDatum[] = rawItems
    .map((item: any) => {
      // BirdeyeCandleData from our service already has the right format
      const rawTime = Number(item?.time ?? 0);
      const open = Number(item?.open ?? 0);
      const high = Number(item?.high ?? open);
      const low = Number(item?.low ?? open);
      const close = Number(item?.close ?? open);
      const volume = Number(item?.volume ?? 0);

      if (!Number.isFinite(rawTime) || rawTime <= 0) return null;
      if (!Number.isFinite(open) || !Number.isFinite(high) || !Number.isFinite(low) || !Number.isFinite(close)) return null;

      // Time is already in seconds from our service
      const normalizedTime = rawTime as UTCTimestamp;

      return {
        time: normalizedTime,
        open,
        high,
        low,
        close,
        volume,
      } satisfies CandleDatum;
    })
    .filter((item): item is CandleDatum => Boolean(item));

  if (!mapped.length) {
    throw new Error('Unable to map Birdeye candles - no valid data');
  }

  return mapped;
}

export function usePriceData({ address, interval = '5m' }: UsePriceDataOptions): PriceDataResult {
  const type = interval; // Alias für bessere Konsistenz mit Birdeye API
  
  const query = useQuery({
    queryKey: ['price', address, type],
    queryFn: () => fetchBirdeyeCandles(address, type),
    enabled: Boolean(address && env.birdeyeApiKey),
    retry: 2,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
  });

  return useMemo(() => {
    // Debug logging
    console.log('usePriceData debug:', {
      hasApiKey: !!env.birdeyeApiKey,
      apiKeyLength: env.birdeyeApiKey?.length || 0,
      queryStatus: query.status,
      queryError: query.error,
      dataLength: query.data?.length || 0,
      address,
    });

    if (query.isSuccess && query.data && query.data.length > 0) {
      return {
        source: 'birdeye' as const,
        candles: query.data,
      };
    }

    return {
      source: 'sample' as const,
      candles: sampleCandles,
    };
  }, [query.data, query.isSuccess, query.status, query.error, address]);
}
