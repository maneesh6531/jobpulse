import React from 'react';
import { ArrowUpRight, Briefcase, Calendar, ChevronRight, Globe, Layers, MapPin, Radio, Tag } from 'lucide-react';

export const JobCard = ({ job, onSelectJob }) => {
  const formattedDate = React.useMemo(() => {
    if (!job?.published_at) return 'Recently';
    try {
      const date = new Date(job.published_at);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return job.published_at;
    }
  }, [job?.published_at]);

  const primaryIndustry = job?.industry?.[0] || 'General';

  // Determine visual category style (accent border & avatar background)
  const categoryStyle = React.useMemo(() => {
    const ind = primaryIndustry.toLowerCase();
    if (ind.includes('data')) {
      return {
        borderClass: 'border-accent-teal',
        iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
        badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      };
    }
    if (ind.includes('devops') || ind.includes('infrastructure') || ind.includes('cloud')) {
      return {
        borderClass: 'border-accent-purple',
        iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    }
    if (ind.includes('business') || ind.includes('management') || ind.includes('sales')) {
      return {
        borderClass: 'border-accent-amber',
        iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    }
    return {
      borderClass: 'border-accent-cyan',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    };
  }, [primaryIndustry]);

  const handleExternalClick = (e) => {
    e.stopPropagation();
    if (job?.job_url) {
      window.open(job.job_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={() => onSelectJob(job)}
      className={`light-card-interactive group relative rounded-2xl p-5 sm:p-6 cursor-pointer bg-white ${categoryStyle.borderClass}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        
        {/* Left Side: Avatar Icon + Main Content */}
        <div className="flex items-start space-x-4">
          
          {/* Category Avatar Box */}
          <div className={`hidden xs:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border ${categoryStyle.iconBg} shadow-sm`}>
            <Briefcase className="h-6 w-6" />
          </div>

          {/* Job Details Content */}
          <div className="space-y-2">
            
            {/* Source Tag & Date */}
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-600 uppercase text-[10px]">
                {job?.source || 'JOBICY'} #{job?.source_job_id || '999'}
              </span>

              <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
            </div>

            {/* Title & Company */}
            <div>
              <h3 className="text-xl font-extrabold text-[#111A35] group-hover:text-teal-600 transition-colors line-clamp-1 tracking-tight">
                {job?.title}
              </h3>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                {job?.company}
              </div>
            </div>

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              
              {job?.location && (
                <span className="inline-flex items-center space-x-1 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-600 font-medium">
                  <MapPin className="h-3 w-3 text-teal-600" />
                  <span>{job.location}</span>
                </span>
              )}

              {job?.level && (
                <span className="inline-flex items-center space-x-1 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-600 font-medium">
                  <Briefcase className="h-3 w-3 text-slate-400" />
                  <span>{job.level}</span>
                </span>
              )}

              {job?.job_type?.[0] && (
                <span className="inline-flex items-center space-x-1 rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-600 font-medium">
                  <span>{job.job_type[0]}</span>
                </span>
              )}

              {/* Industry Tag */}
              <span className={`inline-flex items-center space-x-1 rounded-lg border px-2.5 py-1 font-semibold text-[11px] ${categoryStyle.badgeBg}`}>
                <span>{primaryIndustry}</span>
              </span>

            </div>

            {/* Excerpt */}
            {job?.excerpt && (
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">
                {job.excerpt}
              </p>
            )}

          </div>

        </div>

        {/* Right Side: Action CTAs */}
        <div className="flex items-center justify-end space-x-2 md:flex-col md:space-x-0 md:space-y-2 md:items-end flex-shrink-0 pt-2 md:pt-0">
          
          <button
            onClick={() => onSelectJob(job)}
            className="rounded-xl border border-slate-200/90 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            Details
          </button>

          <button
            onClick={handleExternalClick}
            className="flex items-center space-x-1.5 rounded-xl bg-[#111A35] px-4.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-600 transition-colors"
          >
            <span>Apply Now</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-teal-400 stroke-[2.5]" />
          </button>

        </div>

      </div>
    </div>
  );
};
