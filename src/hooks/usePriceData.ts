
import type { UTCTimestamp } from 'lightweight-charts';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { sampleCandles } from '../data/sampleCandles';
import type { CandleDatum } from '../types/trading';
import { env, validateApiKeys, getSecurityWarning } from '../lib/env';
import { fetchBirdeyeViaProxy } from '../lib/api-proxy';

interface UsePriceDataOptions {
  address: string;
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
}

interface PriceDataResult {
  source: 'birdeye' | 'sample';
  candles: CandleDatum[];
}

async function fetchBirdeyeCandles(address: string, type: string): Promise<CandleDatum[]> {
  // Validierung und Sicherheitshinweis
  const apiStatus = validateApiKeys();
  getSecurityWarning();

  if (!env.birdeyeApiKey) {
    console.warn('Missing Birdeye API key, falling back to sample data');
    throw new Error('Missing Birdeye API key');
  }

  console.log('Fetching Birdeye data for:', { address, type, apiKey: env.birdeyeApiKey.substring(0, 8) + '...' });

  const now = Math.floor(Date.now() / 1000);
  const timeFrom = now - 60 * 60 * 24; // 24h

  try {
    // Versuche zuerst den Proxy (CORS-frei)
    const proxyData = await fetchBirdeyeViaProxy({
      address,
      type,
      time_from: timeFrom,
      time_to: now,
      chain: 'solana'
    });

    const rawItems = proxyData?.data?.items ?? proxyData?.data ?? proxyData?.items ?? [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      console.log('Successfully fetched Birdeye data via proxy:', rawItems.length, 'items');
      return mapBirdeyeData(rawItems);
    }
  } catch (proxyError) {
    console.warn('Proxy failed, trying direct API call:', proxyError);
  }

  // Fallback: Direkte API mit verbesserter Fehlerbehandlung
  const url = new URL('https://public-api.birdeye.so/defi/ohlcv');
  url.searchParams.set('address', address);
  url.searchParams.set('type', type);
  url.searchParams.set('time_from', String(timeFrom));
  url.searchParams.set('time_to', String(now));

  console.log('Trying direct Birdeye API URL:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': env.birdeyeApiKey,
        'x-chain': 'solana',
      },
    });

    console.log('Birdeye response status:', response.status);

    if (!response.ok) {
      let errorDetails = '';
      try {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } catch {
        errorDetails = await response.text();
      }
      throw new Error(`Birdeye ${response.status}: ${errorDetails}`);
    }

    const json = await response.json();
    console.log('Birdeye API response:', json);

    const rawItems = json?.data?.items ?? json?.data ?? json?.items ?? [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      console.log('Successfully fetched Birdeye data:', rawItems.length, 'items');
      return mapBirdeyeData(rawItems);
    } else {
      throw new Error('No data items found in Birdeye response');
    }
  } catch (error) {
    console.warn('All Birdeye API methods failed:', error);
    throw error;
  }
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
