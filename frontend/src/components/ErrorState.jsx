import React from 'react';
import { AlertTriangle, RefreshCw, SlidersHorizontal } from 'lucide-react';

export const ErrorState = ({
  errorMessage,
  onRetry,
  onClearFilters,
}) => {
  return (
    <div className="mx-auto my-8 max-w-md rounded-2xl p-8 text-center border border-rose-200 bg-white shadow-sm">
      
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111A35]">
        Unable to load job feed
      </h3>

      <p className="mt-2 text-xs text-slate-600">
        {errorMessage || "JobPulse couldn't reach the backend API server."}
      </p>

      <p className="mt-1 text-[11px] text-slate-400">
        Verify that your FastAPI backend is running locally at <code className="text-teal-700 font-semibold">http://127.0.0.1:8000</code>.
      </p>

      <div className="mt-5 flex items-center justify-center space-x-2">
        <button
          onClick={onRetry}
          className="flex items-center space-x-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>

        <button
          onClick={onClearFilters}
          className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Clear Filters</span>
        </button>
      </div>

    </div>
  );
};
