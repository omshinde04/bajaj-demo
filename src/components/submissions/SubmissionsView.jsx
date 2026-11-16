import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { getSubmissions, getChecksheets } from '../../services/storageService';

export const SubmissionsView = ({ onOpenGridModal }) => {
  const submissions = getSubmissions();
  const allSheets = getChecksheets();
  const [selectedSub, setSelectedSub] = useState(submissions[0] || null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-bajaj-700 bg-bajaj-50 px-2.5 py-1 rounded-full border border-bajaj-200 uppercase tracking-wider">
              Compliance Archive
            </span>
            <span className="text-xs text-slate-500 font-mono">Audit Ready</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Submitted Shift Audits & Reports
          </h2>
          <p className="text-xs text-slate-600">
            Immutable log of all shift inspections submitted by operators, signed off by supervisors, and delivered via WhatsApp/Email.
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No audits submitted yet. Fill checksheets and use "Selective Dispatch" to submit your first batch!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submissions List */}
          <div className="space-y-3 lg:col-span-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Historical Batches ({submissions.length})
            </div>
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900 text-sm">{sub.id}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      sub.totalDefects > 0 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sub.totalDefects > 0 ? `${sub.totalDefects} Defects` : 'All OK'}
                    </span>
                  </div>

                  <div className="mt-2 text-slate-600 space-y-0.5">
                    <div><strong>Date:</strong> {sub.date} (Shift {sub.shift})</div>
                    <div><strong>Operator:</strong> {sub.operator.name}</div>
                    <div><strong>Sheets Included:</strong> {sub.sheetsCount} sheets</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-blue-600 font-semibold">View Detail →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Details & Sheet Breakdown */}
          {selectedSub && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-lg text-slate-900">{selectedSub.id}</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      SUBMITTED & LOCKED
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Submitted on {new Date(selectedSub.submittedAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp Sent
                  </span>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Email Sent
                  </span>
                </div>
              </div>

              {/* Breakdown Grid of Sheets in this Batch */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Attached Checksheets in this Batch ({selectedSub.sheets.length})
                </h4>
                <div className="space-y-2">
                  {selectedSub.sheets.map((sheetItem, i) => (
                    <div 
                      key={i}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{sheetItem.title}</div>
                        <div className="text-slate-500 text-[11px] font-mono mt-0.5">
                          {sheetItem.code} • Status: {sheetItem.status} {sheetItem.tempRecorded ? `(Temp: ${sheetItem.tempRecorded})` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenGridModal(sheetItem)}
                          className="flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-bold transition-colors shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Official Bajaj Grid</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures & Chain of Custody */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Done By (Operator)</div>
                  <div className="font-bold text-slate-900 mt-1">{selectedSub.operator.name}</div>
                  <div className="text-slate-500 text-[11px]">ID: {selectedSub.operator.empId} • {selectedSub.operator.department}</div>
                  <div className="mt-2 font-serif italic text-sm text-bajaj-800 border-t border-slate-200 pt-1">
                    ✓ Digitally Signed on Handover
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Reviewed By (Supervisor)</div>
                  <div className="font-bold text-slate-900 mt-1">Pravin Deshmukh</div>
                  <div className="text-slate-500 text-[11px]">Unit Manager / Compliance Lead</div>
                  <div className="mt-2 text-[11px] text-emerald-700 font-semibold border-t border-slate-200 pt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Dispatched for Final Verification
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
