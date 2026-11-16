import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  Filter
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
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Plant Defect & Non-Conformance Log ({defects.length})
          </h3>
          <p className="text-[11px] text-slate-500">
            Automated ticket queue generated when operators mark checkpoints as "X Not OK".
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-xs font-bold">
          {['ALL', 'OPEN', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-xs transition-all ${
                filter === f
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f} ({f === 'ALL' ? defects.length : defects.filter(d => d.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Defects Table */}
      <div className="flex-1 overflow-y-auto">
        {defects.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Zero active defects. Marking any checkpoint as "X Not OK" creates a maintenance ticket here.
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
              <tr>
                <th className="py-2.5 px-3 w-28 font-mono">Defect ID</th>
                <th className="py-2.5 px-3">Equipment Checksheet</th>
                <th className="py-2.5 px-3">Failed Checkpoint</th>
                <th className="py-2.5 px-3 w-28 text-center">Severity</th>
                <th className="py-2.5 px-3">Defect Observation</th>
                <th className="py-2.5 px-3 w-32">Reported By</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefects.map(def => (
                <tr key={def.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{def.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{def.sheetTitle}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{def.checkpointTitle}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      def.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {def.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs">
                    {def.description}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {def.loggedBy}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {def.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
