import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  AlertTriangle, 
  ArrowLeft, 
  Calendar,
  Clock,
  Send,
  Save,
  Camera
} from 'lucide-react';
import { getDraft, saveDraft, getCurrentUser } from '../../services/storageService';

export const CLITRSheet = ({ sheet, onBack, onProceedToBatch }) => {
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

  const handleStatusChange = (checkpointId, newStatus) => {
    const prev = entries[checkpointId] || {};
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        status: prev.status === newStatus ? null : newStatus,
        defectDesc: prev.defectDesc || ''
      }
    };
    setEntries(updated);
    triggerAutoSave(updated);
  };

  const handleDefectChange = (checkpointId, desc) => {
    const prev = entries[checkpointId] || {};
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        status: 'NOT_OK',
        defectDesc: desc
      }
    };
    setEntries(updated);
    triggerAutoSave(updated);
  };

  const total = sheet.checkpoints.length;
  const filledCount = sheet.checkpoints.filter(cp => entries[cp.id]?.status).length;
  const defectsCount = sheet.checkpoints.filter(cp => entries[cp.id]?.status === 'NOT_OK').length;
  const percent = Math.round((filledCount / total) * 100);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'C': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'L': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'I': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'T': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'R': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* 1. Compact Desktop Header (Single Row) */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Back to workstation list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200">
                {sheet.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">Doc: {sheet.documentNo}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">{sheet.location}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {sheet.title}
            </h3>
          </div>
        </div>

        {/* Date, Shift, and Progress telemetry in header */}
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
                    ? 'bg-blue-700 text-white shadow-2xs'
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
                className={`h-full ${percent === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Compact Desktop Inspection Table (Scrollable within container) */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
            <tr>
              <th className="py-2 px-3 w-10 text-center">#</th>
              <th className="py-2 px-2 w-16 text-center">Type</th>
              <th className="py-2 px-3">Standard Condition & Checkpoint</th>
              <th className="py-2 px-3 w-56 text-center">Verification Action</th>
              <th className="py-2 px-3 w-72">Defect Observation / Handover Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sheet.checkpoints.map(cp => {
              const currentStatus = entries[cp.id]?.status;
              const defectDesc = entries[cp.id]?.defectDesc || '';
              const isNotOk = currentStatus === 'NOT_OK';
              const isOk = currentStatus === 'OK';
              const isRepaired = currentStatus === 'REPAIRED';

              return (
                <tr 
                  key={cp.id}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    isNotOk 
                      ? 'bg-rose-50/40' 
                      : isOk 
                      ? 'bg-emerald-50/15' 
                      : ''
                  }`}
                >
                  {/* Sequence */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-500">
                    {cp.seq}
                  </td>

                  {/* CLITR Type */}
                  <td className="py-2.5 px-2 text-center">
                    <span className={`inline-block font-mono font-bold text-[10px] px-1.5 py-0.5 rounded border ${getTypeStyle(cp.type)}`}>
                      {cp.type}
                    </span>
                  </td>

                  {/* Standard Condition */}
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 leading-tight">
                      {cp.title}
                      {cp.critical && (
                        <span className="ml-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 font-semibold px-1 rounded">
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {cp.standardCondition}
                    </div>
                  </td>

                  {/* 3-State Toggle Action */}
                  <td className="py-2.5 px-3 text-center">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-2xs">
                      {/* OK */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(cp.id, 'OK')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                          isOk 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ OK</span>
                      </button>

                      {/* NOT OK */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(cp.id, 'NOT_OK')}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                          isNotOk 
                            ? 'bg-rose-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>X Not OK</span>
                      </button>

                      {/* REPAIRED */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(cp.id, 'REPAIRED')}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                          isRepaired 
                            ? 'bg-blue-600 text-white shadow-xs' 
                            : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
                        }`}
                      >
                        <Wrench className="w-3 h-3" />
                        <span>• Repaired</span>
                      </button>
                    </div>
                  </td>

                  {/* Inline Defect / Remarks Column */}
                  <td className="py-2 px-3">
                    {isNotOk ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={defectDesc}
                          onChange={(e) => handleDefectChange(cp.id, e.target.value)}
                          placeholder="Describe defect..."
                          className="flex-1 border border-rose-300 rounded px-2 py-1 text-xs text-rose-900 bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => alert("Photo capture simulated")}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 bg-white border border-slate-200"
                          title="Simulate Photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {isOk ? 'Normal condition' : isRepaired ? 'Repaired & verified' : 'Pending check'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Fixed Desktop Bottom Bar (Always in view, no scrolling needed!) */}
      <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{lastSavedTime ? `Draft auto-saved at ${lastSavedTime}` : 'All changes auto-save instantly'}</span>
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
