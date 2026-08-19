import React from 'react';
import { Activity, ArrowUpRight, Database, Filter, Layers, MapPin, Radio, RefreshCw } from 'lucide-react';

export const Sidebar = ({
  totalJobs,
  filteredJobsCount,
  selectedIndustry,
  selectedGeo,
  onSelectIndustry,
  onSelectGeo,
  onClearFilters,
  onOpenIngestModal,
}) => {
  return (
    <aside className="space-y-5">
      
      {/* Pipeline Telemetry Card */}
      <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 sm:p-5 shadow-2xs space-y-3.5">
        
        {/* Widget Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2 text-slate-700">
            <Activity className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Pipeline Telemetry
            </span>
          </div>
          <span className="inline-flex items-center space-x-1 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200/70">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span>SYNC ACTIVE</span>
          </span>
        </div>

        {/* Telemetry Items List */}
        <div className="space-y-3 text-xs">
          
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100/60 text-teal-700">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <span>Total Indexed Jobs</span>
            </div>
            <span className="font-mono font-bold text-[#111A35] text-sm">{totalJobs}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100/60 text-purple-700">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <span>Active View Results</span>
            </div>
            <span className="font-mono font-bold text-[#111A35] text-sm">{filteredJobsCount}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100/60 text-amber-700">
                <Radio className="h-3.5 w-3.5" />
              </div>
              <span>Data Source</span>
            </div>
            <span className="font-mono font-semibold text-slate-800">Jobicy API</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-100/60 text-cyan-700">
                <Database className="h-3.5 w-3.5" />
              </div>
              <span>Database</span>
            </div>
            <span className="font-mono font-semibold text-slate-800">Supabase PostgreSQL</span>
          </div>

        </div>

        {/* Footer Link */}
        <button
          onClick={onOpenIngestModal}
          className="flex w-full items-center justify-center space-x-1.5 rounded-xl bg-teal-50 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition border border-teal-100"
        >
          <span>View Pipeline Health</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>

      </div>

      {/* Quick Filters Panel */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
        
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 text-[#111A35]">
          <Filter className="h-4 w-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Quick Filters
          </span>
        </div>

        {/* Top Industries */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Top Industries
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => onSelectIndustry('Data Engineering')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedIndustry === 'Data Engineering'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100'
              }`}
            >
              <span>Data Engineering</span>
              <span className="rounded-full bg-white/60 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>

            <button
              onClick={() => onSelectIndustry('Business Development')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedIndustry === 'Business Development'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100'
              }`}
            >
              <span>Business Development</span>
              <span className="rounded-full bg-white/60 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>

            <button
              onClick={() => onSelectIndustry('DevOps')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedIndustry === 'DevOps'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100'
              }`}
            >
              <span>DevOps &amp; Infrastructure</span>
              <span className="rounded-full bg-white/60 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>
          </div>
        </div>

        {/* Top Locations */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Top Locations
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => onSelectGeo('Remote')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedGeo === 'Remote'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Remote</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>

            <button
              onClick={() => onSelectGeo('USA')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedGeo === 'USA'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>LATAM, Canada, USA</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>

            <button
              onClick={() => onSelectGeo('Anywhere')}
              className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-medium transition ${
                selectedGeo === 'Anywhere'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Anywhere</span>
              <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold">1</span>
            </button>
          </div>
        </div>

        {/* Clear All Filters Button */}
        <button
          onClick={onClearFilters}
          className="flex w-full items-center justify-center space-x-1.5 rounded-xl bg-teal-50 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition border border-teal-100"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Clear All Filters</span>
        </button>

      </div>

    </aside>
  );
};
