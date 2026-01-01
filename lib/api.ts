const API_URL = process.env.CONTROLLER_API_URL || 'http://192.168.30.20:3000';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'insecure-secret';

console.log('>>> [API] Active Controller URL:', API_URL);

interface FetchOptions extends RequestInit {
  data?: any;
}

export async function internalFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'x-internal-secret': INTERNAL_SECRET,
    ...options.headers,
  };

  console.log(`>>> [Fetch] URL: ${url}`);

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  try {
    const res = await fetch(url, config);
    
    if (!res.ok) {
        console.error(`[InternalFetch] API Error: ${res.status} ${res.statusText} for ${url}`);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error: any) {
    console.error(`[InternalFetch] CRITICAL: Failed to fetch ${url} | Error: ${error.name} | Message: ${error.message}`);
    throw error;
  }
}
