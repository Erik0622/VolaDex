// Birdeye API Service with proper error handling and API key usage
import { env } from './env';

export interface BirdeyeOHLCVParams {
  address: string;
  type: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  time_from?: number;
  time_to?: number;
}

export interface BirdeyeOHLCVItem {
  unixTime: number;
  o: number;  // open
  h: number;  // high
  l: number;  // low
  c: number;  // close
  v: number;  // volume
}

export interface BirdeyeOHLCVResponse {
  success: boolean;
  data: {
    items: BirdeyeOHLCVItem[];
  };
}

export interface BirdeyeTokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  liquidity: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

/**
 * Fetch OHLCV (candlestick) data from Birdeye API
 */
export async function fetchOHLCVData(params: BirdeyeOHLCVParams): Promise<BirdeyeOHLCVResponse> {
  if (!env.birdeyeApiKey) {
    throw new Error('Birdeye API key is not configured');
  }

  const now = Math.floor(Date.now() / 1000);
  const timeFrom = params.time_from || now - 60 * 60 * 24; // Default: 24h ago
  const timeTo = params.time_to || now;

  const url = new URL('https://public-api.birdeye.so/defi/ohlcv');
  url.searchParams.set('address', params.address);
  url.searchParams.set('type', params.type);
  url.searchParams.set('time_from', String(timeFrom));
  url.searchParams.set('time_to', String(timeTo));

  console.log('Fetching OHLCV data:', {
    address: params.address,
    type: params.type,
    timeFrom: new Date(timeFrom * 1000).toISOString(),
    timeTo: new Date(timeTo * 1000).toISOString(),
  });

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
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

    const json = await response.json();
    console.log('Birdeye OHLCV response:', {
      success: json.success,
      itemCount: json.data?.items?.length || 0,
    });

    return json;
  } catch (error) {
    console.error('Failed to fetch OHLCV data:', error);
    throw error;
  }
}

/**
 * Fetch token information from Birdeye API
 */
export async function fetchTokenInfo(address: string): Promise<BirdeyeTokenInfo | null> {
  if (!env.birdeyeApiKey) {
    console.warn('Birdeye API key is not configured');
    return null;
  }

  const url = `https://public-api.birdeye.so/defi/token_overview?address=${address}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': env.birdeyeApiKey,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch token info:', response.status);
      return null;
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      return null;
    }

    const data = json.data;
    return {
      address: data.address || address,
      symbol: data.symbol || '',
      name: data.name || '',
      decimals: data.decimals || 9,
      liquidity: data.liquidity || 0,
      price: data.price || 0,
      priceChange24h: data.priceChange24h || 0,
      volume24h: data.volume24h || data.v24h || 0,
      marketCap: data.marketCap || data.mc || 0,
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

/**
 * Search for tokens by symbol or name
 */
export async function searchTokens(query: string): Promise<BirdeyeTokenInfo[]> {
  if (!env.birdeyeApiKey) {
    console.warn('Birdeye API key is not configured');
    return [];
  }

  const url = `https://public-api.birdeye.so/defi/search?keyword=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': env.birdeyeApiKey,
      },
    });

    if (!response.ok) {
      console.error('Failed to search tokens:', response.status);
      return [];
    }

    const json = await response.json();
    if (!json.success || !json.data) {
      return [];
    }

    return (json.data.tokens || []).map((token: any) => ({
      address: token.address,
      symbol: token.symbol || '',
      name: token.name || '',
      decimals: token.decimals || 9,
      liquidity: token.liquidity || 0,
      price: token.price || 0,
      priceChange24h: token.priceChange24h || 0,
      volume24h: token.volume24h || token.v24h || 0,
      marketCap: token.marketCap || token.mc || 0,
    }));
  } catch (error) {
    console.error('Error searching tokens:', error);
    return [];
  }
}
