import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Send, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Flame, 
  UtensilsCrossed, 
  Snowflake, 
  Trash2,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { 
  getChecksheets, 
  getCurrentUser, 
  getSheetProgress, 
  getDraft, 
  getDefects 
} from '../../services/storageService';

export const DutyDashboard = ({ onOpenSheet, onOpenBatchSubmit }) => {
  const currentUser = getCurrentUser();
  const allSheets = getChecksheets();
  const defects = getDefects();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentShift = currentUser.shift || 'M';

  // State for selected sheets in batch
  const [selectedSheetIds, setSelectedSheetIds] = useState([]);

  // Calculate progress for each sheet
  const sheetStats = allSheets.map(sheet => {
    const progress = getSheetProgress(sheet.id, todayStr, currentShift);
    return {
      sheet,
      progress
    };
  });

  const readyCount = sheetStats.filter(s => s.progress.status === 'READY_TO_SUBMIT').length;
  const inProgressCount = sheetStats.filter(s => s.progress.status === 'IN_PROGRESS').length;
  const totalCount = sheetStats.length;

  const toggleSelectSheet = (id) => {
    setSelectedSheetIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllReady = () => {
    const readyIds = sheetStats.filter(s => s.progress.status === 'READY_TO_SUBMIT' || s.progress.completed > 0).map(s => s.sheet.id);
    setSelectedSheetIds(readyIds);
  };

  // Icon mapping
  const getSheetIcon = (category, title) => {
    if (title.toLowerCase().includes('burner') || title.toLowerCase().includes('lpg')) {
      return <Flame className="w-5 h-5 text-amber-500" />;
    }
    if (title.toLowerCase().includes('bain marie')) {
      return <UtensilsCrossed className="w-5 h-5 text-indigo-500" />;
    }
    if (title.toLowerCase().includes('chiller') || title.toLowerCase().includes('freezer')) {
      return <Snowflake className="w-5 h-5 text-sky-500" />;
    }
    return <Trash2 className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Welcome & Shift Overview Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-bajaj-700 bg-bajaj-50 px-2.5 py-1 rounded-full border border-bajaj-200 uppercase tracking-wider">
              Plant Duty Roster
            </span>
            <span className="text-xs text-slate-500 font-mono">Shift {currentShift} Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Hello, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            You are assigned to <strong className="text-slate-800">Bajaj Chakan Plant 2</strong>. Fill out your assigned TPM equipment PM and facility hygiene checksheets below. Work is <strong className="text-emerald-700">automatically saved as draft</strong> continuously.
          </p>
        </div>

        {/* Quick Batch CTA Card */}
        <div className="bg-gradient-to-br from-[#002547] to-[#0B4F8A] text-white p-4 rounded-xl shrink-0 shadow-sm border border-bajaj-800 min-w-[280px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bajaj-200 uppercase tracking-wider font-semibold">Selective Dispatch</span>
            <span className="bg-emerald-400 text-slate-900 font-bold px-2 py-0.5 rounded text-[11px]">
              Ready
            </span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {selectedSheetIds.length > 0 ? `${selectedSheetIds.length} Selected` : `${readyCount} Ready to Send`}
          </div>
          <p className="text-[11px] text-bajaj-200 mt-1">
            Send completed sheets (e.g. 5 sheets) directly to Supervisor on WhatsApp & Email.
          </p>
          <button
            onClick={() => onOpenBatchSubmit(selectedSheetIds.length > 0 ? selectedSheetIds : sheetStats.slice(0, 5).map(s => s.sheet.id))}
            className="w-full mt-3 bg-white text-[#002547] hover:bg-bajaj-50 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-blue-700" />
            <span>Open Batch Dispatch Screen</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Checksheets</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Assigned for today</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Ready to Submit</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{readyCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1">100% checks completed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Draft / In Progress</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Safely saved in local storage</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Open Defects (X)</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">{defects.length}</div>
          <div className="text-[11px] text-rose-600 mt-1">Requires maintenance action</div>
        </div>
      </div>

      {/* Multi-Select Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedSheetIds.length === totalCount && totalCount > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedSheetIds(allSheets.map(s => s.id));
              } else {
                setSelectedSheetIds([]);
              }
            }}
            className="w-4 h-4 text-bajaj-600 rounded border-slate-300 focus:ring-bajaj-500 cursor-pointer"
          />
          <label htmlFor="selectAll" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Select All for Batch Dispatch ({selectedSheetIds.length} of {totalCount} chosen)
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAllReady}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Select Completed Only
          </button>
          {selectedSheetIds.length > 0 && (
            <button
              onClick={() => onOpenBatchSubmit(selectedSheetIds)}
              className="text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Selected ({selectedSheetIds.length} Sheets)</span>
            </button>
          )}
        </div>
      </div>

      {/* Checksheets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sheetStats.map(({ sheet, progress }) => {
          const isSelected = selectedSheetIds.includes(sheet.id);
          const isReady = progress.status === 'READY_TO_SUBMIT';
          const isInProgress = progress.status === 'IN_PROGRESS';

          return (
            <div
              key={sheet.id}
              className={`bg-white rounded-xl border transition-all duration-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-100' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header row with checkbox & badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectSheet(sheet.id)}
                      className="w-4 h-4 text-bajaj-600 rounded border-slate-300 focus:ring-bajaj-500 cursor-pointer mt-0.5"
                    />
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {getSheetIcon(sheet.category, sheet.title)}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isReady ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Ready to Submit
                    </span>
                  ) : isInProgress ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3" /> Draft ({progress.completed}/{progress.total})
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      Not Started (0/{progress.total})
                    </span>
                  )}
                </div>

                {/* Title & Info */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    {sheet.code} • {sheet.documentNo}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                    {sheet.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {sheet.location}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Shift Completion</span>
                    <span className="font-mono font-bold text-slate-800">
                      {progress.completed} / {progress.total} items
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isReady ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    ></div>
                  </div>

                  {progress.defectsCount > 0 && (
                    <div className="mt-2 text-[11px] text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 text-rose-500" />
                      <span>{progress.defectsCount} defect(s) flagged on this sheet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenSheet(sheet.id)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-bajaj-800 bg-bajaj-50 hover:bg-bajaj-100 border border-bajaj-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <span>{progress.completed > 0 ? 'Resume Draft' : 'Start Check'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
