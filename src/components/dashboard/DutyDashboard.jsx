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
  Zap
} from 'lucide-react';
import { 
  getChecksheets, 
  getCurrentUser, 
  getSheetProgress, 
  getDefects,
  saveDraft
} from '../../services/storageService';

export const DutyDashboard = ({ onOpenSheet, onOpenBatchSubmit }) => {
  const currentUser = getCurrentUser();
  const allSheets = getChecksheets();
  const defects = getDefects();

  const todayStr = new Date().toISOString().split('T')[0];
  const currentShift = currentUser.shift || 'M';

  // Selected sheets for batch dispatch
  const [selectedSheetIds, setSelectedSheetIds] = useState(allSheets.slice(0, 5).map(s => s.id));

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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSheetIds(allSheets.map(s => s.id));
    } else {
      setSelectedSheetIds([]);
    }
  };

  // 1-Click quick fill 5 sheets for instant presentation
  const handleQuickDemoFill = () => {
    selectedSheetIds.forEach(sheetId => {
      const sheet = allSheets.find(s => s.id === sheetId);
      if (!sheet) return;
      const entries = {};
      sheet.checkpoints.forEach((cp, idx) => {
        if (cp.type === 'NUMERIC') {
          entries[cp.id] = { status: 'OK', value: cp.minLimit ? (cp.minLimit + 1.2).toFixed(1) : "3.2" };
        } else {
          if (sheet.code === 'EQ-LPG-01' && idx === 5) {
            entries[cp.id] = { status: 'NOT_OK', defectDesc: 'Gas hose clamp showing surface aging / slight play' };
          } else {
            entries[cp.id] = { status: 'OK' };
          }
        }
      });
      saveDraft(sheetId, todayStr, currentShift, entries, {
        operatorName: currentUser.name,
        operatorEmpId: currentUser.empId,
        remarks: 'Verified per shift schedule'
      });
    });
    window.location.reload();
  };

  const getSheetIcon = (category, title) => {
    if (title.toLowerCase().includes('burner') || title.toLowerCase().includes('lpg')) {
      return <Flame className="w-4 h-4 text-amber-500" />;
    }
    if (title.toLowerCase().includes('bain marie')) {
      return <UtensilsCrossed className="w-4 h-4 text-indigo-500" />;
    }
    if (title.toLowerCase().includes('chiller') || title.toLowerCase().includes('freezer')) {
      return <Snowflake className="w-4 h-4 text-sky-500" />;
    }
    return <Trash2 className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* 1. Top Compact KPIs Bar (Single Thin Row) */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Assigned Today:</span>
            <strong className="ml-1.5 font-mono text-slate-900 text-sm">{totalCount}</strong>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div>
            <span className="text-emerald-700 font-medium">Ready to Submit:</span>
            <strong className="ml-1.5 font-mono text-emerald-700 text-sm">{readyCount}</strong>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div>
            <span className="text-amber-700 font-medium">Saved Drafts:</span>
            <strong className="ml-1.5 font-mono text-amber-700 text-sm">{inProgressCount}</strong>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div>
            <span className="text-rose-700 font-medium">Open Defects:</span>
            <strong className="ml-1.5 font-mono text-rose-700 text-sm">{defects.length}</strong>
          </div>
        </div>

        {/* Quick Demo Helper Button */}
        <button
          type="button"
          onClick={handleQuickDemoFill}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
          title="Instant mock data for demo"
        >
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>⚡ Auto-Verify 5 Sheets for Demo</span>
        </button>
      </div>

      {/* 2. Desktop Checksheets Data Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedSheetIds.length === totalCount && totalCount > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 w-28 font-mono">Code / Doc</th>
              <th className="py-2.5 px-3">Equipment / Checksheet Name</th>
              <th className="py-2.5 px-3 w-40">Category</th>
              <th className="py-2.5 px-3 w-44">Shift Progress</th>
              <th className="py-2.5 px-3 w-32 text-center">Status</th>
              <th className="py-2.5 px-3 w-28 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sheetStats.map(({ sheet, progress }) => {
              const isSelected = selectedSheetIds.includes(sheet.id);
              const isReady = progress.status === 'READY_TO_SUBMIT';
              const isInProgress = progress.status === 'IN_PROGRESS';

              return (
                <tr
                  key={sheet.id}
                  className={`transition-colors hover:bg-slate-50/90 ${
                    isSelected ? 'bg-blue-50/25' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectSheet(sheet.id)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* Code */}
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-800">{sheet.code}</div>
                    <div className="font-mono text-[10px] text-slate-400">{sheet.documentNo}</div>
                  </td>

                  {/* Title & Location */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-slate-100 border border-slate-200 shrink-0">
                        {getSheetIcon(sheet.category, sheet.title)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{sheet.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{sheet.location}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {sheet.categoryLabel}
                    </span>
                  </td>

                  {/* Progress Bar & Count */}
                  <td className="py-3 px-3">
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="font-mono font-bold text-slate-800">
                        {progress.completed} / {progress.total}
                      </span>
                      <span className="text-slate-400">{progress.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isReady ? 'bg-emerald-500' : isInProgress ? 'bg-amber-500' : 'bg-slate-300'
                        }`}
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                    {progress.defectsCount > 0 && (
                      <span className="text-[10px] font-bold text-rose-600 mt-1 inline-block">
                        ⚠️ {progress.defectsCount} Defect flagged
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {isReady ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" /> Draft
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Not Started
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenSheet(sheet.id)}
                      className="inline-flex items-center gap-1 py-1 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors shadow-2xs"
                    >
                      <span>{progress.completed > 0 ? 'Resume' : 'Inspect'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Fixed Desktop Bottom Action Bar */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">
            {selectedSheetIds.length} of {totalCount} sheets selected
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500">
            You can selectively dispatch completed sheets (e.g. send 5 sheets) anytime.
          </span>
        </div>

        <button
          disabled={selectedSheetIds.length === 0}
          onClick={() => onOpenBatchSubmit(selectedSheetIds)}
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg shadow-sm transition-all"
        >
          <Send className="w-3.5 h-3.5 text-blue-200" />
          <span>Dispatch Selected ({selectedSheetIds.length} Sheets) to WhatsApp & Email</span>
        </button>
      </div>

    </div>
  );
};
