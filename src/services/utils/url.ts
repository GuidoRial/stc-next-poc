/**
 * Appends query parameters to a URL
 */
export function appendQueryParamsToUrl(
  baseUrl: string, 
  params: Record<string, unknown>
): string {
  const url = new URL(baseUrl, 'http://localhost'); // dummy base for relative URLs
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.pathname + url.search;
}

/**
 * Builds a complete API URL with query parameters
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, unknown>
): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  
  return appendQueryParamsToUrl(endpoint, params);
}