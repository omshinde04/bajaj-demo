import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Thermometer, 
  AlertTriangle, 
  ArrowLeft, 
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { getDraft, saveDraft, getCurrentUser } from '../../services/storageService';

export const HygieneSheet = ({ sheet, onBack, onProceedToBatch }) => {
  const currentUser = getCurrentUser();
  const today = new Date();
  const currentDateStr = today.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(currentDateStr);
  const [selectedShift, setSelectedShift] = useState(currentUser.shift || 'M');
  const [entries, setEntries] = useState({});
  const [generalRemarks, setGeneralRemarks] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Load existing draft
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
    }, 250);
  };

  const handleBooleanToggle = (checkpointId) => {
    const prev = entries[checkpointId] || {};
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        status: prev.status === 'OK' ? 'NOT_OK' : 'OK'
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

  const handleRemarksChange = (e) => {
    const val = e.target.value;
    setGeneralRemarks(val);
    triggerAutoSave(entries, val);
  };

  // Completion calculation
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
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Back to checksheets"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                {sheet.code}
              </span>
              <span className="text-xs text-slate-500 font-mono">Site: BAJAJ CHAKAN 2</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{sheet.title}</h2>
            <p className="text-xs text-slate-500">{sheet.location}</p>
          </div>
        </div>

        {/* Live Auto-Save Pill */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <span className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
            <span className="text-slate-600 font-medium">
              {isAutoSaving ? 'Saving draft...' : lastSavedTime ? `Draft auto-saved at ${lastSavedTime}` : 'Auto-saves on input'}
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory SOP Compliance Box (From Physical Bajaj Checksheet) */}
      {sheet.sopNote && (
        <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl flex items-start gap-3 text-xs text-amber-900 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800">Mandatory Plant SOP:</span>
            <p className="mt-0.5 leading-relaxed">{sheet.sopNote}</p>
          </div>
        </div>
      )}

      {/* Date & Shift Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Inspection Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* 4 Shift Buttons (M, A, E, N) */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            Shift:
          </span>
          {[
            { id: 'M', label: 'M (Morning)' },
            { id: 'A', label: 'A (Afternoon)' },
            { id: 'E', label: 'E (Evening)' },
            { id: 'N', label: 'N (Night)' }
          ].map(shift => (
            <button
              key={shift.id}
              onClick={() => setSelectedShift(shift.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                selectedShift === shift.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {shift.id}
            </button>
          ))}
        </div>
      </div>

      {/* Checkpoints List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">
            Shift Hygiene & Sanitation Checkpoints
          </span>
          <span className="font-medium text-slate-600">
            Completed: <strong className="text-slate-900">{filledCount}</strong> / {total}
          </span>
        </div>

        {sheet.checkpoints.map((cp) => {
          const entry = entries[cp.id] || {};
          const isNumeric = cp.type === 'NUMERIC';

          if (isNumeric) {
            const numVal = parseFloat(entry.value);
            const isOutOfSpec = !isNaN(numVal) && (numVal > cp.maxLimit || numVal < cp.minLimit);

            return (
              <div 
                key={cp.id}
                className={`bg-white rounded-xl border p-4 transition-all shadow-xs ${
                  isOutOfSpec 
                    ? 'border-rose-300 bg-rose-50/30' 
                    : entry.value 
                    ? 'border-emerald-200 bg-emerald-50/10' 
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200">
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Critical Telemetry
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{cp.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{cp.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono mt-1">
                        Standard Limit: <strong className="text-slate-700">{cp.minLimit}°C to {cp.maxLimit}°C</strong>
                      </div>
                    </div>
                  </div>

                  {/* Temperature Input Box */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={entry.value || ''}
                        onChange={(e) => handleNumericChange(cp.id, e.target.value)}
                        placeholder="e.g. 3.2"
                        className={`w-28 text-right font-mono text-base font-bold px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 ${
                          isOutOfSpec 
                            ? 'border-rose-400 bg-rose-50 text-rose-700 focus:ring-rose-400' 
                            : 'border-slate-300 bg-white text-slate-900 focus:ring-emerald-500'
                        }`}
                      />
                      <span className="absolute right-2 top-2 text-xs font-bold text-slate-400">°C</span>
                    </div>
                    {isOutOfSpec && (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-100 px-2 py-1 rounded">
                        <AlertTriangle className="w-3.5 h-3.5" /> High
                      </span>
                    )}
                  </div>
                </div>

                {isOutOfSpec && (
                  <div className="mt-3 p-2 bg-rose-100/70 border border-rose-300 rounded text-xs text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      <strong>Warning:</strong> Temperature {numVal}°C exceeds safe limit of {cp.maxLimit}°C. Check compressor and door seals immediately.
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Boolean Checkpoints
          const isDone = entry.status === 'OK';
          const isFailed = entry.status === 'NOT_OK';

          return (
            <div 
              key={cp.id}
              className={`bg-white rounded-xl border p-4 transition-all shadow-xs ${
                isDone 
                  ? 'border-emerald-300 bg-emerald-50/20' 
                  : isFailed
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {cp.seq}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{cp.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{cp.description}</p>
                  </div>
                </div>

                {/* Yes / Done Toggle Button */}
                <button
                  onClick={() => handleBooleanToggle(cp.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isDone ? 'Cleaned & Checked' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Remarks & Sign-off Info */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Specific Observations / Comments
        </label>
        <textarea
          value={generalRemarks}
          onChange={handleRemarksChange}
          placeholder="Note any pest sightings, smell, defrost timing, or stock rotation remarks..."
          rows={2}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-800">Monitored & Logged By:</span> {currentUser.name} ({currentUser.empId})
          </div>
          <div>
            <span className="font-semibold text-slate-800">Reviewing Manager:</span> Pravin Deshmukh (Unit Compliance)
          </div>
        </div>
      </div>

      {/* Footbar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            {filledCount === total ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All checks completed!
              </span>
            ) : (
              <span>Draft Status: {filledCount} of {total} checks recorded</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Auto-saved to local draft. Ready for shift submission.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Save & Exit
          </button>
          <button
            onClick={() => onProceedToBatch(sheet.id)}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-bajaj-700 hover:bg-bajaj-800 rounded-lg shadow transition-all hover:shadow-md"
          >
            <span>Proceed to Dispatch (Send 5+)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
