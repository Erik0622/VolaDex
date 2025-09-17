
import type { UTCTimestamp } from 'lightweight-charts';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { sampleCandles } from '../data/sampleCandles';
import type { CandleDatum } from '../types/trading';
import { env } from '../lib/env';

interface UsePriceDataOptions {
  address: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

interface PriceDataResult {
  source: 'birdeye' | 'sample';
  candles: CandleDatum[];
}

async function fetchBirdeyeCandles(address: string, interval: string): Promise<CandleDatum[]> {
  if (!env.birdeyeApiKey) {
    console.warn('Missing Birdeye API key, falling back to sample data');
    throw new Error('Missing Birdeye API key');
  }

  console.log('Fetching Birdeye data for:', { address, interval, apiKey: env.birdeyeApiKey.substring(0, 8) + '...' });

  const now = Math.floor(Date.now() / 1000);
  const timeFrom = now - 60 * 60 * 24; // 24h
  
  // Use the correct Birdeye API endpoint for OHLCV data
  const endpoints = [
    'https://api.birdeye.so/defi/ohlcv',
    'https://public-api.birdeye.so/public/v1/token/price_history',
    'https://public-api.birdeye.so/public/price_history'
  ];

  for (const endpoint of endpoints) {
    try {
      const url = new URL(endpoint);
      url.searchParams.set('address', address);
      url.searchParams.set('interval', interval);
      url.searchParams.set('time_from', String(timeFrom));
      url.searchParams.set('time_to', String(now));

      console.log('Trying Birdeye API URL:', url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${env.birdeyeApiKey}`,
          'X-API-KEY': env.birdeyeApiKey,
        },
      });

      console.log('Birdeye response status:', response.status);

      if (response.ok) {
        const json = await response.json();
        console.log('Birdeye API response:', json);

        const rawItems =
          json?.data?.items ??
          json?.data?.priceHistory ??
          json?.data ??
          json?.items ??
          [];

        if (Array.isArray(rawItems) && rawItems.length > 0) {
          console.log('Successfully fetched Birdeye data:', rawItems.length, 'items');
          return mapBirdeyeData(rawItems);
        }
      } else {
        const errorText = await response.text();
        console.warn(`Birdeye API error (${endpoint}):`, response.status, errorText);
      }
    } catch (error) {
      console.warn(`Birdeye API error (${endpoint}):`, error);
    }
  }

  console.warn('All Birdeye API endpoints failed, falling back to sample data');
  throw new Error('All Birdeye API endpoints failed');
}

function mapBirdeyeData(rawItems: any[]): CandleDatum[] {
  const mapped: CandleDatum[] = rawItems
    .map((item: any) => {
      const rawTime = Number(item?.unixTime ?? item?.time ?? item?.timestamp ?? 0);
      const open = Number(item?.open ?? item?.o ?? item?.priceOpen ?? item?.startPrice ?? item?.value ?? 0);
      const high = Number(item?.high ?? item?.h ?? item?.priceHigh ?? item?.max ?? open);
      const low = Number(item?.low ?? item?.l ?? item?.priceLow ?? item?.min ?? open);
      const close = Number(item?.close ?? item?.c ?? item?.priceClose ?? item?.endPrice ?? item?.value ?? open);
      const volume = Number(item?.volume ?? item?.v ?? item?.baseVolume ?? item?.quoteVolume ?? 0);

      if (!Number.isFinite(rawTime) || rawTime <= 0) return null;

      const normalizedTime = (rawTime > 1e12 ? Math.floor(rawTime / 1000) : Math.floor(rawTime)) as UTCTimestamp;

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
    throw new Error('Unable to map Birdeye candles');
  }

  return mapped;
}

export function usePriceData({ address, interval = '5m' }: UsePriceDataOptions): PriceDataResult {
  const query = useQuery({
    queryKey: ['price', address, interval],
    queryFn: () => fetchBirdeyeCandles(address, interval),
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
