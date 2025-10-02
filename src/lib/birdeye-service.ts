// Birdeye API Service - Using working endpoints only
import { env } from './env';

export interface BirdeyeOHLCVParams {
  address: string;
  type: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  time_from?: number;
  time_to?: number;
}

export interface BirdeyeCandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BirdeyePriceHistoryItem {
  unixTime: number;
  value: number;
  type?: string;
}

export interface BirdeyePriceHistoryResponse {
  success: boolean;
  data: {
    items: BirdeyePriceHistoryItem[];
  };
}

export interface BirdeyeTokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  liquidity: number;
  price: number;
  priceChange24h: number | null;
  volume24h: number;
  marketCap: number;
  logoURI?: string;
}

/**
 * Fetch price history and convert to OHLCV candlestick data
 * This endpoint works with our API key!
 */
export async function fetchOHLCVData(params: BirdeyeOHLCVParams): Promise<{ success: boolean; data: { items: BirdeyeCandleData[] } }> {
  if (!env.birdeyeApiKey) {
    throw new Error('Birdeye API key is not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  const timeFrom = params.time_from || now - 60 * 60 * 24; // Default: 24h ago
  const timeTo = params.time_to || now;

  // Use price history endpoint (this one works!)
  const url = new URL('https://public-api.birdeye.so/defi/history_price');
  url.searchParams.set('address', params.address);
  url.searchParams.set('address_type', 'token');
  url.searchParams.set('type', params.type);
  url.searchParams.set('time_from', String(timeFrom));
  url.searchParams.set('time_to', String(timeTo));

  console.log('Fetching price history data:', {
    address: params.address,
    type: params.type,
    timeFrom: new Date(timeFrom * 1000).toISOString(),
    timeTo: new Date(timeTo * 1000).toISOString(),
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': env.birdeyeApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Birdeye API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Birdeye API error: ${response.status} - ${errorText}`);
    }

    const json: BirdeyePriceHistoryResponse = await response.json();
    console.log('Birdeye price history response:', {
      success: json.success,
      itemCount: json.data?.items?.length || 0,
    });

    if (!json.success || !json.data?.items) {
      throw new Error('No price history data returned');
    }

    // Convert price history to candlestick format
    const candles = convertPriceHistoryToCandles(json.data.items, params.type);
    console.log(`Converted to ${candles.length} candles`);

    return {
      success: true,
      data: {
        items: candles
      }
    };
  } catch (error) {
    console.error('Failed to fetch price history:', error);
    throw error;
  }
}

/**
 * Convert price history points to OHLCV candles
 */
function convertPriceHistoryToCandles(pricePoints: BirdeyePriceHistoryItem[], intervalType: string): BirdeyeCandleData[] {
  if (!pricePoints || pricePoints.length === 0) return [];

  // Determine interval in seconds
  const intervalMap: Record<string, number> = {
    '1m': 60,
    '5m': 5 * 60,
    '15m': 15 * 60,
    '1h': 60 * 60,
    '4h': 4 * 60 * 60,
    '1d': 24 * 60 * 60,
  };

  const intervalSeconds = intervalMap[intervalType] || 15 * 60;

  // Group prices by interval
  const candleMap = new Map<number, {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    prices: number[];
  }>();

  pricePoints.forEach(point => {
    const price = point.value;
    const time = point.unixTime;

    // Round down to nearest interval
    const candleTime = Math.floor(time / intervalSeconds) * intervalSeconds;

    if (!candleMap.has(candleTime)) {
      candleMap.set(candleTime, {
        time: candleTime,
        open: price,
        high: price,
        low: price,
        close: price,
        prices: [price]
      });
    } else {
      const candle = candleMap.get(candleTime)!;
      candle.high = Math.max(candle.high, price);
      candle.low = Math.min(candle.low, price);
      candle.close = price; // Last price in interval
      candle.prices.push(price);
    }
  });

  // Convert to array and sort by time
  return Array.from(candleMap.values())
    .sort((a, b) => a.time - b.time)
    .map(c => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: 0 // Price history endpoint doesn't provide volume
    }));
}

/**
 * Fetch trending/top tokens from Birdeye API
 * This endpoint works with our API key!
 */
export async function fetchTrendingTokens(limit: number = 50): Promise<BirdeyeTokenInfo[]> {
  if (!env.birdeyeApiKey) {
    console.warn('Birdeye API key is not configured');
    return [];
  }

  // Use tokenlist endpoint sorted by 24h volume (this works!)
  const url = `https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=${limit}`;

  console.log('Fetching trending tokens from Birdeye...');

  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': env.birdeyeApiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch trending tokens:', response.status, errorText);
      return [];
    }

    const json = await response.json();
    
    if (!json.success || !json.data?.tokens) {
      console.error('Invalid response format');
      return [];
    }

    console.log(`✅ Fetched ${json.data.tokens.length} trending tokens`);

    // Filter out stablecoins and only get real memecoins/tokens
    const filtered = json.data.tokens.filter((token: any) => {
      const symbol = token.symbol?.toUpperCase() || '';
      const name = token.name?.toUpperCase() || '';
      
      // Exclude stablecoins
      if (symbol === 'USDC' || symbol === 'USDT' || symbol === 'DAI' || 
          name.includes('USD COIN') || name.includes('TETHER') || name.includes('USDT')) {
        return false;
      }
      
      // Only include tokens with reasonable market cap (> $100k)
      if ((token.mc || 0) < 100000) {
        return false;
      }
      
      return true;
    });

    // Map to our interface
    return filtered.map((token: any) => ({
      address: token.address,
      symbol: token.symbol || '',
      name: token.name || '',
      decimals: token.decimals || 9,
      liquidity: token.liquidity || 0,
      price: token.price || 0,
      priceChange24h: token.v24hChangePercent ?? null,
      volume24h: token.v24hUSD || 0,
      marketCap: token.mc || 0,
      logoURI: token.logoURI,
    }));
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}

