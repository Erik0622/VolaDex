// API Proxy für CORS-freie Birdeye API Calls
// Dies löst das CORS-Problem durch serverseitige Proxying

interface ProxyRequest {
  address: string;
  type: string;
  time_from?: number;
  time_to?: number;
  chain?: string;
}

interface ProxyResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function fetchBirdeyeViaProxy({
  address,
  type,
  time_from,
  time_to,
  chain = 'solana'
}: ProxyRequest): Promise<any> {
  // Fallback zu direkter API wenn kein Proxy verfügbar
  if (typeof window === 'undefined') {
    throw new Error('Proxy only works in browser environment');
  }

  try {
    // Versuche zuerst einen lokalen Proxy (falls vorhanden)
    const proxyUrl = '/api/birdeye/ohlcv';
    const params = new URLSearchParams({
      address,
      type,
      chain,
      ...(time_from && { time_from: String(time_from) }),
      ...(time_to && { time_to: String(time_to) })
    });

    const response = await fetch(`${proxyUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.warn('Proxy not available, falling back to direct API call:', error);
  }

  // Fallback: Direkte API mit CORS-Handling
  return fetchBirdeyeDirect({ address, type, time_from, time_to, chain });
}

async function fetchBirdeyeDirect({
  address,
  type,
  time_from,
  time_to,
  chain = 'solana'
}: ProxyRequest): Promise<any> {
  const now = Math.floor(Date.now() / 1000);
  const timeFrom = time_from || now - 60 * 60 * 24; // 24h
  const timeTo = time_to || now;

  const url = new URL('https://public-api.birdeye.so/defi/ohlcv');
  url.searchParams.set('address', address);
  url.searchParams.set('type', type);
  url.searchParams.set('time_from', String(timeFrom));
  url.searchParams.set('time_to', String(timeTo));

  const response = await fetch(url.toString(), {
    method: 'GET',
    mode: 'cors', // Explizit CORS-Modus setzen
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Birdeye API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
