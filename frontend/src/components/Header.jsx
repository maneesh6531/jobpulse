import React from 'react';
import { Briefcase, Database, Layers, Radio, Users } from 'lucide-react';

export const Header = ({
  totalJobs,
  filteredJobsCount,
  isFiltered,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute left-10 top-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Hero Editorial Headline & Quick Metric Chips */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[#111A35] sm:text-5xl lg:text-6xl leading-[1.1]">
              Opportunities <br />
              that <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">move careers.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed font-normal">
              Real-time. Normalized. Reliable. Fresh job listings from multiple sources, engineered into one intelligent feed.
            </p>

            {/* Quick Metric Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              <div className="flex items-center space-x-2 rounded-2xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111A35] font-mono leading-none">
                    {totalJobs}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">Indexed Jobs</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-2xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111A35] font-mono leading-none">
                    {filteredJobsCount}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">Active Results</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 rounded-2xl bg-white px-3.5 py-2 border border-slate-200/80 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111A35] font-mono leading-none">
                    1
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight">Data Sources</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Decorative Data Flow Graphic */}
          <div className="hidden lg:block lg:col-span-5 relative">
            <div className="relative h-64 w-full flex items-center justify-center">
              
              {/* SVG Flow Line */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" fill="none">
                <path
                  d="M10,120 Q 100,20 200,100 T 390,60"
                  stroke="url(#flowGradient)"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                  className="animate-[dash_20s_linear_infinite]"
                />
                <path
                  d="M10,120 Q 100,20 200,100 T 390,60"
                  stroke="url(#glowGradient)"
                  strokeWidth="6"
                  strokeOpacity="0.3"
                />
                <defs>
                  <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#19c7b5" />
                    <stop offset="50%" stopColor="#4dd9e8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#19c7b5" />
                    <stop offset="100%" stopColor="#4dd9e8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Data Nodes */}
              <div className="absolute left-10 top-12 flex items-center space-x-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-md border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                <span>Live Ingestion</span>
              </div>

              <div className="absolute right-12 top-24 flex items-center space-x-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-md border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span>Normalized Data</span>
              </div>

              <div className="absolute left-1/2 bottom-8 flex items-center space-x-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-md border border-slate-100">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Opportunities</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
