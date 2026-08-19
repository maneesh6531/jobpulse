import React, { useState } from 'react';
import { Filter, Globe, Layers, MapPin, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';

const COMMON_INDUSTRIES = [
  'Data Engineering',
  'Software Engineering',
  'DevOps',
  'Data Science',
  'Product Management',
  'UI/UX Design',
  'Cybersecurity',
  'Backend Development',
  'Frontend Development',
  'Machine Learning',
];

const COMMON_GEOS = [
  'Remote',
  'USA',
  'Europe',
  'UK',
  'Canada',
  'Germany',
  'APAC',
];

export const FilterBar = ({
  search,
  industry,
  geo,
  pageSize,
  totalResults,
  filteredCount,
  loading,
  onSearchChange,
  onIndustryChange,
  onGeoChange,
  onPageSizeChange,
  onClearFilters,
  onRefresh,
}) => {
  const [customGeoInput, setCustomGeoInput] = useState(geo || '');
  const [showCustomGeo, setShowCustomGeo] = useState(false);

  const handleCustomGeoSubmit = (e) => {
    e.preventDefault();
    if (customGeoInput.trim()) {
      onGeoChange(customGeoInput.trim());
      setShowCustomGeo(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
      
      {/* Top Row: Search Input + Selectors + Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 lg:items-center">
        
        {/* Search Input */}
        <div className="relative sm:col-span-5 lg:col-span-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search job title, company, skills..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Industry Selector */}
        <div className="relative sm:col-span-3 lg:col-span-3">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3 text-slate-400">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <select
              value={industry || ''}
              onChange={(e) => onIndustryChange(e.target.value ? e.target.value : undefined)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-7 text-xs font-medium text-slate-700 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="">All Industries</option>
              {COMMON_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 text-slate-400">
              <SlidersHorizontal className="h-3 w-3" />
            </div>
          </div>
        </div>

        {/* Geo Selector */}
        <div className="relative sm:col-span-4 lg:col-span-3">
          {!showCustomGeo ? (
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3 text-slate-400">
                <Globe className="h-3.5 w-3.5" />
              </div>
              <select
                value={geo || ''}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setShowCustomGeo(true);
                  } else {
                    onGeoChange(e.target.value ? e.target.value : undefined);
                  }
                }}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-7 text-xs font-medium text-slate-700 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                <option value="">All Locations / Geo</option>
                {COMMON_GEOS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="__custom__">+ Custom Location...</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 text-slate-400">
                <MapPin className="h-3 w-3" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomGeoSubmit} className="relative flex items-center">
              <input
                type="text"
                value={customGeoInput}
                onChange={(e) => setCustomGeoInput(e.target.value)}
                placeholder="Enter location"
                className="w-full rounded-xl border border-teal-500 bg-white py-1.5 pl-3 pr-12 text-xs text-slate-800 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-6 text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => setShowCustomGeo(false)}
                className="absolute right-2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Page Size & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between sm:col-span-12 lg:col-span-2 lg:justify-end gap-2">
          
          <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center space-x-1 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
            >
              <span>Apply Filters</span>
            </button>

            <button
              onClick={onClearFilters}
              title="Reset filters"
              className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white p-1.5 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span className="inline text-[11px]">Reset</span>
            </button>
          </div>

        </div>

      </div>

      {/* Scope Summary Line */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px]">Active scope:</span>
          <span className="font-semibold text-slate-700">
            {industry ? industry : 'All industries'} &amp; {geo ? geo : 'locations'}
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredCount}</span> of <span className="font-semibold text-slate-800">{totalResults}</span> indexed jobs
        </div>
      </div>

    </div>
  );
};
