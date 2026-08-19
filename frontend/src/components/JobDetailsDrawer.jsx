import React, { useEffect } from 'react';
import {
  ArrowUpRight,
  Building,
  Calendar,
  Layers,
  MapPin,
  Radio,
  X,
} from 'lucide-react';

export const JobDetailsDrawer = ({ job, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (job) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [job, onClose]);

  if (!job) return null;

  const formattedDate = (() => {
    if (!job.published_at) return 'Recently';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(job.published_at));
    } catch {
      return job.published_at;
    }
  })();

  const handleApplyClick = () => {
    if (job.job_url) {
      window.open(job.job_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="relative w-screen max-w-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200 bg-white shadow-2xl">
          
          {/* Header Bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md">
            
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                <Radio className="h-3.5 w-3.5 text-teal-600" />
                <span>JobPulse Signal #{job.source_job_id || 'LOCAL'}</span>
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                {job.source}
              </span>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="h-[calc(100vh-140px)] overflow-y-auto p-6 space-y-6">
            
            {/* Title & Company */}
            <div className="space-y-2 border-b border-slate-200/80 pb-5">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                <Building className="h-4 w-4 text-teal-600" />
                <span>{job.company}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111A35]">
                {job.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Published {formattedDate}</span>
                </div>
                {job.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-600" />
                    <span className="font-medium text-slate-700">{job.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Role Signals Grid */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Role Telemetry Signals
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                
                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="text-slate-500 text-[11px]">Seniority Level</div>
                  <div className="mt-0.5 font-bold text-[#111A35]">{job.level || 'Not specified'}</div>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="text-slate-500 text-[11px]">Employment Type</div>
                  <div className="mt-0.5 font-bold text-[#111A35]">
                    {job.job_type?.join(', ') || 'Full-Time'}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="text-slate-500 text-[11px]">Industry Sector</div>
                  <div className="mt-0.5 font-bold text-teal-700 truncate">
                    {job.industry?.join(', ') || 'General'}
                  </div>
                </div>

                <div className="rounded-xl bg-white p-3 border border-slate-200/80">
                  <div className="text-slate-500 text-[11px]">Compensation</div>
                  <div className="mt-0.5 font-bold text-emerald-700">
                    {job.salary_min || job.salary_max ? (
                      `${job.salary_currency || '$'}${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}`
                    ) : (
                      'Undisclosed'
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Role Description */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111A35] flex items-center space-x-2">
                <Layers className="h-4 w-4 text-teal-600" />
                <span>Job Description &amp; Scope</span>
              </h3>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 text-sm text-slate-700 leading-relaxed space-y-3 font-normal prose max-w-none">
                {job.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: job.description }}
                    className="space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#111A35] [&_a]:text-teal-600 [&_a]:underline"
                  />
                ) : (
                  <p>{job.excerpt || 'No detailed description available.'}</p>
                )}
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="text-xs text-slate-500 hidden sm:block">
              Canonical Link: <span className="font-medium text-slate-700 truncate max-w-[200px] inline-block align-bottom">{job.source}</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>

              <button
                onClick={handleApplyClick}
                className="w-1/2 sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-[#111A35] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                <span>View Original Job</span>
                <ArrowUpRight className="h-4 w-4 text-teal-400 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
