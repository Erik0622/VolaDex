
import type { UTCTimestamp } from 'lightweight-charts';
=======

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
    throw new Error('Missing Birdeye API key');
  }

  const now = Math.floor(Date.now() / 1000);
  const timeFrom = now - 60 * 60 * 24; // 24h
  const url = new URL('https://public-api.birdeye.so/public/price_history');
  url.searchParams.set('address', address);
  url.searchParams.set('interval', interval);
  url.searchParams.set('time_from', String(timeFrom));
  url.searchParams.set('time_to', String(now));

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'X-API-KEY': env.birdeyeApiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Birdeye request failed: ${response.status}`);
  }

  const json = await response.json();
  const rawItems =
    json?.data?.items ??
    json?.data?.priceHistory ??
    json?.data ??
    json?.items ??
    [];

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('Empty Birdeye payload');
  }

  const mapped: CandleDatum[] = rawItems
    .map((item: any) => {

      const rawTime = Number(item?.unixTime ?? item?.time ?? item?.timestamp ?? 0);
=======
      const time = Number(item?.unixTime ?? item?.time ?? item?.timestamp ?? 0);

      const open = Number(item?.open ?? item?.o ?? item?.priceOpen ?? item?.startPrice ?? item?.value ?? 0);
      const high = Number(item?.high ?? item?.h ?? item?.priceHigh ?? item?.max ?? open);
      const low = Number(item?.low ?? item?.l ?? item?.priceLow ?? item?.min ?? open);
      const close = Number(item?.close ?? item?.c ?? item?.priceClose ?? item?.endPrice ?? item?.value ?? open);
      const volume = Number(item?.volume ?? item?.v ?? item?.baseVolume ?? item?.quoteVolume ?? 0);

      if (!Number.isFinite(rawTime) || rawTime <= 0) return null;

      const normalizedTime = (rawTime > 1e12 ? Math.floor(rawTime / 1000) : Math.floor(rawTime)) as UTCTimestamp;

      return {
        time: normalizedTime,
=======
      if (!time) return null;
      return {
        time,

        open,
        high,
        low,
        close,
        volume,
      } satisfies CandleDatum;
    })

    .filter((item): item is CandleDatum => Boolean(item));
=======
    .filter(Boolean);


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
  });

  return useMemo(() => {
    if (query.isSuccess && query.data.length > 0) {
      return {
        source: 'birdeye' as const,
        candles: query.data,
      };
    }

    return {
      source: 'sample' as const,
      candles: sampleCandles,
    };
  }, [query.data, query.isSuccess]);
}
