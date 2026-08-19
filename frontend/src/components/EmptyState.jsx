import React from 'react';
import { SearchX, SlidersHorizontal } from 'lucide-react';

export const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="mx-auto my-8 max-w-md rounded-2xl p-8 text-center border border-slate-200 bg-white shadow-sm">
      
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100">
        <SearchX className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#111A35]">
        No matching job signals found
      </h3>

      <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
        JobPulse couldn't find any listings matching your current search parameters or active filters.
      </p>

      <div className="mt-5 flex items-center justify-center">
        <button
          onClick={onClearFilters}
          className="flex items-center space-x-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

    </div>
  );
};
