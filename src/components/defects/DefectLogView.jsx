import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  Search, 
  Filter,
  ShieldAlert
} from 'lucide-react';
import { getDefects } from '../../services/storageService';

export const DefectLogView = () => {
  const defects = getDefects();
  const [filter, setFilter] = useState('ALL');

  const filteredDefects = defects.filter(d => {
    if (filter === 'OPEN') return d.status === 'OPEN';
    if (filter === 'RESOLVED') return d.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
              TPM Corrective Actions
            </span>
            <span className="text-xs text-slate-500 font-mono">X → Action → •</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Plant Defect & Non-Conformance Log
          </h2>
          <p className="text-xs text-slate-600">
            Every checkpoint marked <strong>X (Not OK)</strong> automatically converts into a maintenance ticket to prevent defects from being lost.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-center">
          {['ALL', 'OPEN', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f} ({f === 'ALL' ? defects.length : defects.filter(d => d.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {defects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          Zero open defects currently logged. When an operator marks <strong>X (Not OK)</strong> on any checksheet, it will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDefects.map(def => (
            <div
              key={def.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-700">{def.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    def.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {def.severity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2">{def.sheetTitle}</h4>
                <div className="text-xs font-semibold text-rose-700 mt-0.5">
                  Checkpoint: {def.checkpointTitle}
                </div>

                <div className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-lg text-xs text-rose-900 mt-3">
                  <strong>Defect Observation:</strong>
                  <p className="mt-0.5">{def.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Logged by {def.loggedBy}</span>
                <span className="font-semibold text-amber-700">Status: {def.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
