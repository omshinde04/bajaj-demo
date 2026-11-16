import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  AlertTriangle, 
  Camera, 
  Save, 
  ArrowLeft, 
  Calendar,
  Info,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getDraft, saveDraft, getCurrentUser } from '../../services/storageService';

export const CLITRSheet = ({ sheet, onBack, onProceedToBatch }) => {
  const currentUser = getCurrentUser();
  const today = new Date();
  const currentDateStr = today.toISOString().split('T')[0];
  const currentDayNum = today.getDate();

  // Shift & Date state
  const [selectedDate, setSelectedDate] = useState(currentDateStr);
  const [selectedShift, setSelectedShift] = useState(currentUser.shift || 'M');
  const [entries, setEntries] = useState({});
  const [generalRemarks, setGeneralRemarks] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Load existing draft if present
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

  // Debounced Auto-Save trigger
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

  const handleStatusChange = (checkpointId, newStatus) => {
    const prev = entries[checkpointId] || {};
    const updated = {
      ...entries,
      [checkpointId]: {
        ...prev,
        status: prev.status === newStatus ? null : newStatus, // toggle or set
        defectDesc: prev.defectDesc || ''
      }
    };
    setEntries(updated);
    triggerAutoSave(updated);
  };

  const handleDefectDescChange = (checkpointId, desc) => {
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

  const handleRemarksChange = (e) => {
    const val = e.target.value;
    setGeneralRemarks(val);
    triggerAutoSave(entries, val);
  };

  // Completion calculation
  const total = sheet.checkpoints.length;
  const filledCount = sheet.checkpoints.filter(cp => entries[cp.id]?.status).length;
  const defectsCount = sheet.checkpoints.filter(cp => entries[cp.id]?.status === 'NOT_OK').length;
  const percent = Math.round((filledCount / total) * 100);

  // Legend badges for CLITR
  const getTypeColor = (type) => {
    switch (type) {
      case 'C': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'L': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'I': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'T': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'R': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Back to my checksheets"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-bajaj-100 text-bajaj-800 px-2 py-0.5 rounded border border-bajaj-300">
                {sheet.code}
              </span>
              <span className="text-xs text-slate-500 font-mono">Doc: {sheet.documentNo}</span>
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
              {isAutoSaving ? 'Saving draft...' : lastSavedTime ? `Draft auto-saved at ${lastSavedTime}` : 'Ready (Auto-saves on tick)'}
            </span>
          </div>
        </div>
      </div>

      {/* CLITR TPM Header Banner (Matches Bajaj Paper Sheet Format) */}
      <div className="bg-gradient-to-r from-[#002547] to-[#0B4F8A] text-white p-5 rounded-xl shadow-sm border border-bajaj-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-bajaj-200 text-[11px] uppercase tracking-wider font-semibold">Equipment Name</div>
            <div className="text-base font-bold text-white mt-0.5">{sheet.equipmentName}</div>
            <div className="text-bajaj-200 mt-1">Responsibility: {sheet.responsibility}</div>
          </div>

          <div className="bg-bajaj-900/60 p-3 rounded-lg border border-bajaj-700/60">
            <div className="text-bajaj-200 text-[11px] uppercase font-semibold mb-1">CLITR Framework Notation</div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">✓ = OK</span>
              <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-500/30">X = Not OK</span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-500/30">• = Repaired</span>
            </div>
            <div className="mt-1 text-[10px] text-bajaj-300">
              C: Cleaning | L: Lubrication | I: Inspection | T: Tightness | R: Repair
            </div>
          </div>

          <div className="bg-bajaj-900/60 p-3 rounded-lg border border-bajaj-700/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-bajaj-200 text-[11px] uppercase font-semibold">Shift Inspection Progress</span>
              <span className="font-mono font-bold text-white text-sm">{filledCount} / {total}</span>
            </div>
            <div className="w-full bg-bajaj-950 rounded-full h-2 overflow-hidden my-2 border border-bajaj-700">
              <div 
                className={`h-full transition-all duration-300 ${percent === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-bajaj-300">{percent}% Checked</span>
              {defectsCount > 0 ? (
                <span className="text-rose-300 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-rose-400" /> {defectsCount} Defect{defectsCount > 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-emerald-300">Zero Defects</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Shift Selectors */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-bajaj-600" />
            Inspection Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs focus:ring-2 focus:ring-bajaj-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-bajaj-600" />
            Duty Shift:
          </span>
          {['M', 'A', 'E', 'N'].map(shift => (
            <button
              key={shift}
              onClick={() => setSelectedShift(shift)}
              className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                selectedShift === shift
                  ? 'bg-bajaj-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {shift}
            </button>
          ))}
        </div>
      </div>

      {/* 12 Checkpoint Cards (CLITR Layout) */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Standard Inspection Conditions (12 Points)
        </div>

        {sheet.checkpoints.map((cp) => {
          const currentStatus = entries[cp.id]?.status;
          const defectDesc = entries[cp.id]?.defectDesc || '';
          const isNotOk = currentStatus === 'NOT_OK';

          return (
            <div 
              key={cp.id}
              className={`bg-white rounded-xl border transition-all p-4 ${
                isNotOk 
                  ? 'border-rose-300 bg-rose-50/20 shadow-xs' 
                  : currentStatus === 'OK'
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Checkpoint Details */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {cp.seq}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getTypeColor(cp.type)}`}>
                        {cp.type} - {sheet.legend?.[cp.type] || cp.type}
                      </span>
                      {cp.critical && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                          Safety Critical
                        </span>
                      )}
                      <h4 className="text-sm font-semibold text-slate-900">{cp.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{cp.standardCondition}</p>
                  </div>
                </div>

                {/* 3-State Toggle Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* OK (✓) */}
                  <button
                    onClick={() => handleStatusChange(cp.id, 'OK')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'OK'
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ OK</span>
                  </button>

                  {/* NOT OK (X) */}
                  <button
                    onClick={() => handleStatusChange(cp.id, 'NOT_OK')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'NOT_OK'
                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>X Not OK</span>
                  </button>

                  {/* REPAIRED (•) */}
                  <button
                    onClick={() => handleStatusChange(cp.id, 'REPAIRED')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentStatus === 'REPAIRED'
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>• Repaired</span>
                  </button>
                </div>
              </div>

              {/* Expandable Defect Form if Marked NOT OK (X) */}
              {isNotOk && (
                <div className="mt-3 pt-3 border-t border-rose-200/80 bg-rose-50/40 p-3 rounded-lg animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-semibold text-rose-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Defect Non-Conformance Report (Will trigger Maintenance Priority Alert):
                    </span>
                    <span className="text-[10px] text-rose-500">Auto-saved</span>
                  </div>
                  <textarea
                    value={defectDesc}
                    onChange={(e) => handleDefectDescChange(cp.id, e.target.value)}
                    placeholder="Describe observed defect (e.g. Gas hose clamp loose, flame yellow, burner holes blocked)..."
                    rows={2}
                    className="w-full border border-rose-300 rounded-md p-2 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  />
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500">
                    <button 
                      type="button" 
                      onClick={() => alert("Photo capture simulated! Image attached to defect record.")}
                      className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      <span>Attach Photo Proof (Simulated)</span>
                    </button>
                    <span className="text-rose-600 font-medium">Logged to Plant Defect Tracker</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General Remarks / Done By info */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Shift Remarks / Observations
        </label>
        <textarea
          value={generalRemarks}
          onChange={handleRemarksChange}
          placeholder="Enter shift handover notes, maintenance observations, or spare part requests..."
          rows={2}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-bajaj-500 focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            <span className="font-semibold text-slate-700">Inspector / Done By:</span> {currentUser.name} ({currentUser.empId})
          </div>
          <div className="text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All progress saved to local device draft
          </div>
        </div>
      </div>

      {/* Action Footbar - Stage 1 to Stage 2 transition */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          <div className="font-semibold text-slate-800">
            {filledCount === total ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready for final submission!
              </span>
            ) : (
              <span>Draft Status: {filledCount} of {total} items checked ({percent}%)</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Work is safely auto-saved. You can leave anytime or proceed to batch dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Save & Exit to List
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
