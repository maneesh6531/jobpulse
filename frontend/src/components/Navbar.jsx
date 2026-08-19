import React from 'react';
import { RefreshCw, Terminal, Activity, Zap } from 'lucide-react';

export const Navbar = ({
  isOnline,
  checkingHealth,
  onRefreshHealth,
  onRefreshJobs,
  onOpenIngestModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Main Nav Links */}
        <div className="flex items-center space-x-8">
          
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/30">
              <Activity className="h-5 w-5 stroke-[2.5]" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="pulse-ring-anim absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold tracking-tight text-[#111A35]">
                JobPulse
              </span>
            </div>
          </div>

          {/* Navigation items */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <span className="relative py-1 text-[#111A35] font-semibold">
              Jobs
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-teal-500 rounded-full" />
            </span>
          </nav>

        </div>

        {/* Action Controls & Health Status */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          
          {/* API Health Status Badge */}
          <button
            onClick={onRefreshHealth}
            title="Click to check API status"
            className="flex items-center space-x-1.5 sm:space-x-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 sm:px-3 py-1 text-xs font-medium transition hover:bg-slate-100"
          >
            <span className="relative flex h-2 w-2">
              {isOnline ? (
                <>
                  <span className="pulse-ring-anim absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
                </>
              ) : isOnline === false ? (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
              ) : (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </span>

            <span className="hidden sm:inline text-slate-700">
              {checkingHealth ? (
                'Checking API...'
              ) : isOnline ? (
                <span className="text-emerald-700 font-semibold">API Online</span>
              ) : isOnline === false ? (
                <span className="text-rose-600 font-semibold">API Offline</span>
              ) : (
                'Connecting...'
              )}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefreshJobs}
            title="Refresh job feed"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 sm:p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Primary CTA: Ingest Now */}
          <button
            onClick={onOpenIngestModal}
            className="flex items-center space-x-1.5 sm:space-x-2 rounded-xl bg-[#111A35] px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95 whitespace-nowrap"
          >
            <Zap className="h-3.5 w-3.5 text-teal-400 fill-teal-400 flex-shrink-0" />
            <span>Ingest Now</span>
          </button>

        </div>

      </div>
    </header>
  );
};
