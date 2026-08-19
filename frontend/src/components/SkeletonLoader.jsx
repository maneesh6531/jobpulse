import React from 'react';

export const SkeletonLoader = ({ count = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl p-5 border border-slate-200/80 bg-white animate-pulse space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>

          <div className="space-y-1.5">
            <div className="h-5 w-2/3 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-100" />
          </div>

          <div className="flex space-x-2 pt-1">
            <div className="h-6 w-16 rounded-lg bg-slate-100" />
            <div className="h-6 w-20 rounded-lg bg-slate-100" />
            <div className="h-6 w-24 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};
