import React, { useState } from 'react';
import { EmptyState } from './components/EmptyState.jsx';
import { ErrorState } from './components/ErrorState.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { Header } from './components/Header.jsx';
import { IngestModal } from './components/IngestModal.jsx';
import { JobCard } from './components/JobCard.jsx';
import { JobDetailsDrawer } from './components/JobDetailsDrawer.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Pagination } from './components/Pagination.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { SkeletonLoader } from './components/SkeletonLoader.jsx';
import { useHealth } from './hooks/useHealth.js';
import { useJobs } from './hooks/useJobs.js';

export function App() {
  const { isOnline, checking: checkingHealth, refetchHealth } = useHealth();
  const {
    jobs,
    total,
    filteredCount,
    page,
    pageSize,
    geo,
    industry,
    search,
    loading,
    error,
    setPage,
    setPageSize,
    setGeo,
    setIndustry,
    setSearch,
    clearFilters,
    refresh,
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState(null);
  const [isIngestOpen, setIsIngestOpen] = useState(false);

  const hasActiveFilters = Boolean(search || industry || geo);

  return (
    <div className="min-h-screen bg-[#FAFCFB] text-slate-800 bg-light-grid bg-hero-glow bg-hero-glow-cyan font-sans flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      <div>
        {/* Clean White Navigation Header */}
        <Navbar
          isOnline={isOnline}
          checkingHealth={checkingHealth}
          onRefreshHealth={refetchHealth}
          onRefreshJobs={refresh}
          onOpenIngestModal={() => setIsIngestOpen(true)}
        />

        {/* Bright Hero Section */}
        <Header
          totalJobs={total}
          filteredJobsCount={filteredCount}
          isFiltered={hasActiveFilters}
        />

        {/* Main 2-Column Dashboard Layout */}
        <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* Main Job Discovery Feed (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Command / Filter Bar */}
              <FilterBar
                search={search}
                industry={industry}
                geo={geo}
                pageSize={pageSize}
                totalResults={total}
                filteredCount={filteredCount}
                loading={loading}
                onSearchChange={setSearch}
                onIndustryChange={setIndustry}
                onGeoChange={setGeo}
                onPageSizeChange={setPageSize}
                onClearFilters={clearFilters}
                onRefresh={refresh}
              />

              {/* Feed Content */}
              {loading ? (
                <SkeletonLoader count={4} />
              ) : error ? (
                <ErrorState
                  errorMessage={error}
                  onRetry={refresh}
                  onClearFilters={clearFilters}
                />
              ) : jobs.length === 0 ? (
                <EmptyState onClearFilters={clearFilters} />
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={`${job.source}-${job.source_job_id}-${job.published_at}`}
                      job={job}
                      onSelectJob={(j) => setSelectedJob(j)}
                    />
                  ))}

                  <Pagination
                    currentPage={page}
                    pageSize={pageSize}
                    totalItems={total}
                    onPageChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}

            </div>

            {/* Sidebar Telemetry & Quick Filters (4 Cols) */}
            <div className="lg:col-span-4">
              <Sidebar
                totalJobs={total}
                filteredJobsCount={filteredCount}
                selectedIndustry={industry}
                selectedGeo={geo}
                onSelectIndustry={setIndustry}
                onSelectGeo={setGeo}
                onClearFilters={clearFilters}
                onOpenIngestModal={() => setIsIngestOpen(true)}
              />
            </div>

          </div>

        </main>
      </div>

      {/* Slide-over Job Details Drawer */}
      <JobDetailsDrawer
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Admin / Dev Ingestion Trigger Modal */}
      <IngestModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onSuccessRefresh={() => {
          refresh();
        }}
      />

      {/* Light Premium Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#111A35]">JobPulse</span>
            <span>— Ingestion &amp; Telemetry Discovery Platform</span>
          </div>
          
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Supabase DB connected</span>
            <span>•</span>
            <span>Jobicy Ingestion Pipeline</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
