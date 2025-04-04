// Custom ProblemDetail interface to avoid dependencies on auto-generated code
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  properties?: Record<string, Record<string, unknown>>;
}

// Custom ApiError interface to avoid dependencies on auto-generated code
export interface ApiError {
  status: number;
  statusText: string;
  body: ProblemDetail;
}

/**
 * Custom fetch utility for API calls
 * @param endpoint API endpoint path (without base URL)
 * @param options Fetch options (method, headers, body, etc.)
 * @returns Promise with parsed response
 * @throws ApiError with response details if fetch fails
 */
export async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  // Build complete URL with base path
  const url = `/api${endpoint}`;
  
  // Default headers
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // Add Content-Type for requests with body
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Perform the fetch
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  // Handle error responses
  if (!response.ok) {
    let errorBody: ProblemDetail;
    
    // Try to parse error body
    try {
      errorBody = await response.json() as ProblemDetail;
    } catch (_e) {
      errorBody = {
        title: response.statusText,
        status: response.status,
        detail: response.statusText
      };
    }
    
    throw {
      status: response.status,
      statusText: response.statusText,
      body: errorBody
    };
  }
  
  // Parse successful response
  // Check if response has content
  const contentType = response.headers.get('Content-Type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  } else if (response.status !== 204) { // No content
    return await response.text() as unknown as T;
  }
  
  return undefined as unknown as T;
}

/**
 * Helper to build query string from parameters
 * @param params Object containing query parameters
 * @returns Formatted query string starting with '?' or empty string
 */
export function buildQueryString(params: Record<string, unknown>): string {
  // Filter out undefined or null values
  const validParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null);
  
  if (validParams.length === 0) {
    return '';
  }
  
  // Build query string with URLSearchParams
  const searchParams = new URLSearchParams();
  
  validParams.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  
  return `?${searchParams.toString()}`;
}
