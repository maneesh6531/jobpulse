import React, { useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Terminal, X } from 'lucide-react';
import { apiService } from '../services/api';

export const IngestModal = ({
  isOpen,
  onClose,
  onSuccessRefresh,
}) => {
  const [count, setCount] = useState('10');
  const [geo, setGeo] = useState('');
  const [industry, setIndustry] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  const handleRunIngest = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Validate count input
    const trimmed = String(count).trim();
    if (!trimmed) {
      setValidationError('Count is required. Please enter a positive integer.');
      return;
    }

    const numCount = Number(trimmed);
    if (isNaN(numCount)) {
      setValidationError('Count must be a valid numeric integer.');
      return;
    }

    if (numCount <= 0) {
      setValidationError('Count must be a positive integer greater than 0.');
      return;
    }

    if (!Number.isInteger(numCount)) {
      setValidationError('Count must be a whole integer (no decimal values).');
      return;
    }

    setValidationError('');
    setLoading(true);

    try {
      const response = await apiService.ingestJobs({
        count: numCount,
        geo: geo.trim() || undefined,
        industry: industry.trim() || undefined,
        tag: tag.trim() || undefined,
      });

      setResult(response);
      if (response.status === 'success') {
        onSuccessRefresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ingestion pipeline execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 z-10 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111A35]">
                Trigger Jobicy Ingestion
              </h3>
              <p className="text-xs text-slate-500">
                POST /ingest pipeline trigger
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleRunIngest} className="space-y-4 text-xs">
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="ingest-count-input" className="block text-slate-700 font-semibold">
                Ingestion Count
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Type any integer or pick preset</span>
            </div>
            
            <div className="relative">
              <input
                id="ingest-count-input"
                type="number"
                min="1"
                step="1"
                list="count-presets"
                value={count}
                onChange={(e) => {
                  setCount(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="e.g. 10, 50, 100"
                className={`w-full rounded-xl border ${
                  validationError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-teal-500'
                } bg-white py-2 px-3 text-slate-800 focus:outline-none transition-colors font-mono text-sm`}
              />
              <datalist id="count-presets">
                <option value="5" label="5 Listings" />
                <option value="10" label="10 Listings" />
                <option value="20" label="20 Listings" />
                <option value="50" label="50 Listings" />
              </datalist>
            </div>

            {/* Convenient Preset Badges */}
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="text-[11px] font-semibold text-slate-400 mr-0.5">Presets:</span>
              {[5, 10, 20, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setCount(String(preset));
                    if (validationError) setValidationError('');
                  }}
                  className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold transition-colors ${
                    String(count) === String(preset)
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {validationError && (
              <p className="mt-1.5 text-[11px] font-semibold text-rose-600 flex items-center space-x-1">
                <span>⚠️ {validationError}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Geo</label>
              <input
                type="text"
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                placeholder="e.g. Remote"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. devops"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target Tag</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. python, react"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none"
            />
          </div>

          {loading && (
            <div className="flex items-center space-x-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-teal-700">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <span>Fetching, deduplicating, and persisting to Supabase...</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
              Ingestion failed: {error}
            </div>
          )}

          {result && result.status === 'success' && (
            <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 space-y-3">
              <div className="flex items-center space-x-2 text-teal-800 border-b border-teal-200/60 pb-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span className="font-extrabold tracking-wider text-xs uppercase text-teal-900">
                  INGESTION COMPLETE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-white/90 rounded-xl px-3 py-2 border border-teal-100/80 shadow-2xs">
                  <span className="text-slate-500 font-sans font-semibold">Fetched</span>
                  <span className="font-bold text-[#111A35] text-sm">{result.result?.fetched ?? 0}</span>
                </div>

                <div className="flex justify-between items-center bg-white/90 rounded-xl px-3 py-2 border border-teal-100/80 shadow-2xs">
                  <span className="text-slate-500 font-sans font-semibold">Unique</span>
                  <span className="font-bold text-[#111A35] text-sm">{result.result?.unique ?? 0}</span>
                </div>

                <div className="flex justify-between items-center bg-white/90 rounded-xl px-3 py-2 border border-teal-100/80 shadow-2xs">
                  <span className="text-slate-500 font-sans font-semibold">New Jobs</span>
                  <span className="font-bold text-teal-700 text-sm">{result.result?.inserted ?? 0}</span>
                </div>

                <div className="flex justify-between items-center bg-white/90 rounded-xl px-3 py-2 border border-teal-100/80 shadow-2xs">
                  <span className="text-slate-500 font-sans font-semibold">Duplicates</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {Math.max(0, (result.result?.unique ?? 0) - (result.result?.inserted ?? 0))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 rounded-xl bg-[#111A35] px-5 py-2 font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span>Execute Ingest</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
