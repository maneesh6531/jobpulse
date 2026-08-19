// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Helper to execute fetch requests with error handling
 */
async function fetchJson(endpoint, options) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (endpoint.startsWith('/') && !API_BASE_URL.includes('/api-proxy')) {
      try {
        const proxyUrl = `/api-proxy${endpoint}`;
        const proxyResponse = await fetch(proxyUrl, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });
        if (proxyResponse.ok) {
          return await proxyResponse.json();
        }
      } catch {
        // Ignore fallback failure and throw primary error
      }
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export const apiService = {
  /**
   * Fetch jobs list with backend pagination and filters
   */
  async getJobs(filters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.page_size) queryParams.append('page_size', filters.page_size.toString());

    if (filters.geo && filters.geo.trim() !== '') {
      queryParams.append('geo', filters.geo.trim());
    }

    if (filters.industry && filters.industry.trim() !== '') {
      queryParams.append('industry', filters.industry.trim());
    }

    return fetchJson(`/jobs?${queryParams.toString()}`);
  },

  /**
   * Check backend API health status
   */
  async getHealth() {
    return fetchJson('/health');
  },

  /**
   * Trigger job ingestion from external source (Jobicy)
   */
  async ingestJobs(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.count) queryParams.append('count', params.count.toString());
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.geo) queryParams.append('geo', params.geo);
    if (params.industry) queryParams.append('industry', params.industry);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchJson(`/ingest${queryString}`, {
      method: 'POST',
    });
  },
};
