import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';

// Parse current URL query parameters into initial filter state
function getInitialFilters() {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page') || '1', 10);
  const page_size = parseInt(params.get('page_size') || '20', 10);
  const geo = params.get('geo') || undefined;
  const industry = params.get('industry') || undefined;
  const search = params.get('search') || undefined;

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    page_size: isNaN(page_size) || page_size < 1 ? 20 : page_size,
    geo,
    industry,
    search,
  };
}

export function useJobs() {
  const [filters, setFiltersState] = useState(getInitialFilters);
  const [rawJobs, setRawJobs] = useState([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state to URL search parameters
  const updateUrlParams = useCallback((newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.page_size !== 20) params.set('page_size', newFilters.page_size.toString());
    if (newFilters.geo) params.set('geo', newFilters.geo);
    if (newFilters.industry) params.set('industry', newFilters.industry);
    if (newFilters.search) params.set('search', newFilters.search);

    const newQuery = params.toString();
    const newRelativePathQuery = window.location.pathname + (newQuery ? `?${newQuery}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, []);

  const setFilters = useCallback((updater) => {
    setFiltersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      updateUrlParams(next);
      return next;
    });
  }, [updateUrlParams]);

  // Fetch jobs from backend when backend query parameters change
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getJobs({
        page: filters.page,
        page_size: filters.page_size,
        geo: filters.geo,
        industry: filters.industry,
      });

      if (response.status === 'success' && response.result) {
        setRawJobs(response.result.jobs || []);
        setServerTotal(response.result.total || 0);
      } else {
        throw new Error(response.detail || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to connect to JobPulse API');
      setRawJobs([]);
      setServerTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.page_size, filters.geo, filters.industry]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Client-side search filtering on the currently fetched dataset
  const filteredJobs = useMemo(() => {
    if (!filters.search || !filters.search.trim()) {
      return rawJobs;
    }
    const q = filters.search.toLowerCase().trim();
    return rawJobs.filter((job) => {
      const titleMatch = job.title?.toLowerCase().includes(q);
      const companyMatch = job.company?.toLowerCase().includes(q);
      const locationMatch = job.location?.toLowerCase().includes(q);
      const levelMatch = job.level?.toLowerCase().includes(q);
      const excerptMatch = job.excerpt?.toLowerCase().includes(q);
      const industryMatch = job.industry?.some((i) => i.toLowerCase().includes(q));
      const typeMatch = job.job_type?.some((t) => t.toLowerCase().includes(q));

      return (
        titleMatch ||
        companyMatch ||
        locationMatch ||
        levelMatch ||
        excerptMatch ||
        industryMatch ||
        typeMatch
      );
    });
  }, [rawJobs, filters.search]);

  // Convenience setters
  const setPage = (page) => setFilters({ page });
  const setPageSize = (page_size) => setFilters({ page: 1, page_size });
  const setGeo = (geo) => setFilters({ page: 1, geo });
  const setIndustry = (industry) => setFilters({ page: 1, industry });
  const setSearch = (search) => setFilters({ search });

  const clearFilters = () => {
    const defaultFilters = { page: 1, page_size: 20 };
    setFiltersState(defaultFilters);
    updateUrlParams(defaultFilters);
  };

  return {
    jobs: filteredJobs,
    allFetchedJobs: rawJobs,
    total: serverTotal,
    filteredCount: filteredJobs.length,
    page: filters.page,
    pageSize: filters.page_size,
    geo: filters.geo,
    industry: filters.industry,
    search: filters.search,
    loading,
    error,
    filters,
    setPage,
    setPageSize,
    setGeo,
    setIndustry,
    setSearch,
    clearFilters,
    refresh: fetchJobs,
  };
}
