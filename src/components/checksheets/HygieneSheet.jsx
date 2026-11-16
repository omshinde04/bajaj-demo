import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Thermometer, 
  AlertTriangle, 
  ArrowLeft, 
  Calendar,
  Clock,
  Send,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getDraft, saveDraft, getCurrentUser } from '../../services/storageService';

export const HygieneSheet = ({ sheet, onBack, onProceedToBatch }) => {
  const currentUser = getCurrentUser();
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedShift, setSelectedShift] = useState(currentUser.shift || 'M');
  const [entries, setEntries] = useState({});
  const [generalRemarks, setGeneralRemarks] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  useEffect(() => {
    const existingDraft = getDraft(sheet.id, selectedDate, selectedShift);
    if (existingDraft) {
      setEntries(existingDraft.entries || {});
      setGeneralRemarks(existingDraft.metadata?.remarks || '');
      setLastSavedTime(existingDraft.metadata?.savedAt || null);
    } else {
      setEntries({});
      setGeneralRemarks('');
      setLastSavedTime(null);
    }
  }, [sheet.id, selectedDate, selectedShift]);

  const triggerAutoSave = (updatedEntries, remarks) => {
    setIsAutoSaving(true);
    setTimeout(() => {
      saveDraft(sheet.id, selectedDate, selectedShift, updatedEntries, {
        operatorName: currentUser.name,
        operatorEmpId: currentUser.empId,
        remarks: remarks !== undefined ? remarks : generalRemarks
      });
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsAutoSaving(false);
    }, 200);
  };

  const handleBooleanToggle = (checkpointId) => {
    const prev = entries[checkpointId] || {};
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        status: prev.status === 'OK' ? null : 'OK'
      }
    };
    setEntries(updated);
    triggerAutoSave(updated);
  };

  const handleNumericChange = (checkpointId, value) => {
    const prev = entries[checkpointId] || {};
    const num = parseFloat(value);
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        value: value,
        status: !isNaN(num) ? 'OK' : null
      }
    };
    setEntries(updated);
    triggerAutoSave(updated);
  };

  const total = sheet.checkpoints.length;
  const filledCount = sheet.checkpoints.filter(cp => {
    const entry = entries[cp.id];
    if (cp.type === 'NUMERIC') {
      return entry?.value !== undefined && entry?.value !== '';
    }
    return entry?.status !== undefined && entry?.status !== null;
  }).length;
  const percent = Math.round((filledCount / total) * 100);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 1. Header Row */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Back to list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-200">
                {sheet.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">Site: BAJAJ CHAKAN 2</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{sheet.location}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {sheet.title}
            </h3>
          </div>
        </div>

        {/* Date, Shift, & Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-mono font-medium text-slate-700 bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-mono font-bold">
            {['M', 'A', 'E', 'N'].map(shift => (
              <button
                key={shift}
                onClick={() => setSelectedShift(shift)}
                className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                  selectedShift === shift
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {shift}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs">
            <span className="text-slate-500 font-medium">Progress:</span>
            <span className="font-mono font-bold text-slate-900">{filledCount}/{total}</span>
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full ${percent === 100 ? 'bg-emerald-500' : 'bg-emerald-400'}`} 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory SOP Notification Bar */}
      {sheet.sopNote && (
        <div className="px-5 py-2 bg-amber-50/70 border-b border-amber-200/80 flex items-center gap-2 text-xs text-amber-900 shrink-0">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold text-[11px] uppercase tracking-wide text-amber-800">Mandatory SOP:</span>
          <span className="truncate text-[11px]">{sheet.sopNote}</span>
        </div>
      )}

      {/* 2. Compact Inspection Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
            <tr>
              <th className="py-2 px-3 w-10 text-center">#</th>
              <th className="py-2 px-3">Sanitation & Cold Chain Checkpoint</th>
              <th className="py-2 px-3 w-56 text-center">Action / Telemetry Reading</th>
              <th className="py-2 px-3 w-64">Shift Observation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sheet.checkpoints.map(cp => {
              const entry = entries[cp.id] || {};
              const isNumeric = cp.type === 'NUMERIC';

              if (isNumeric) {
                const numVal = parseFloat(entry.value);
                const isOutOfSpec = !isNaN(numVal) && (numVal > cp.maxLimit || numVal < cp.minLimit);
                const isDone = entry.value !== undefined && entry.value !== '';

                return (
                  <tr 
                    key={cp.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isOutOfSpec ? 'bg-rose-50/40' : isDone ? 'bg-emerald-50/15' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">{cp.seq}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{cp.title}</span>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                          Target: {cp.minLimit}°C to {cp.maxLimit}°C
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{cp.description}</div>
                    </td>

                    {/* Numeric Input */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={entry.value || ''}
                            onChange={(e) => handleNumericChange(cp.id, e.target.value)}
                            placeholder="e.g. 3.2"
                            className={`w-24 text-right font-mono text-xs font-bold px-2.5 py-1 border rounded-lg focus:outline-none focus:ring-1 ${
                              isOutOfSpec 
                                ? 'border-rose-400 bg-rose-50 text-rose-800' 
                                : 'border-slate-300 bg-white text-slate-900 focus:ring-emerald-500'
                            }`}
                          />
                          <span className="absolute right-1.5 top-1 text-[10px] font-bold text-slate-400">°C</span>
                        </div>
                        {isOutOfSpec && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                            Out of Spec!
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 px-3 text-[11px] text-slate-500 font-mono">
                      {isOutOfSpec ? '⚠️ Exceeds safe limit' : isDone ? 'Within safe limits' : 'Enter digital temperature'}
                    </td>
                  </tr>
                );
              }

              // Boolean checkpoints
              const isChecked = entry.status === 'OK';

              return (
                <tr 
                  key={cp.id}
                  className={`transition-colors hover:bg-slate-50/80 ${isChecked ? 'bg-emerald-50/15' : ''}`}
                >
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">{cp.seq}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{cp.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{cp.description}</div>
                  </td>

                  {/* Toggle button */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleBooleanToggle(cp.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isChecked 
                          ? 'bg-emerald-600 text-white shadow-2xs' 
                          : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isChecked ? '✓ Cleaned & Done' : 'Mark Done'}</span>
                    </button>
                  </td>

                  <td className="py-2 px-3 text-[11px] text-slate-400 font-mono">
                    {isChecked ? 'Verified per sanitation protocol' : 'Pending shift action'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Fixed Desktop Bottom Bar */}
      <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{lastSavedTime ? `Draft auto-saved at ${lastSavedTime}` : 'All inputs auto-saved'}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            Inspector: <strong>{currentUser.name}</strong> ({currentUser.empId})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 font-semibold transition-colors"
          >
            Back to List
          </button>

          <button
            onClick={() => onProceedToBatch(sheet.id)}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-blue-200" />
            <span>Proceed to Dispatch (Send 5+)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
