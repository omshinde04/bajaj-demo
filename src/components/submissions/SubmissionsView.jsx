import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Clock, 
  User, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { getSubmissions, getChecksheets } from '../../services/storageService';

export const SubmissionsView = ({ onOpenGridModal }) => {
  const submissions = getSubmissions();
  const [selectedSub, setSelectedSub] = useState(submissions[0] || null);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Submitted Shift Audits Archive ({submissions.length} Total)
          </h3>
          <p className="text-[11px] text-slate-500">
            Immutable inspection records submitted by operators and dispatched to supervisors.
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          No audits submitted yet. Use "Batch Dispatch" to submit your first 5 sheets!
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden divide-x divide-slate-200">
          
          {/* Left Master List */}
          <div className="w-80 overflow-y-auto divide-y divide-slate-100 shrink-0">
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className={`p-3.5 text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{sub.id}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      sub.totalDefects > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {sub.totalDefects > 0 ? `${sub.totalDefects} Defects` : 'All OK'}
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500 space-y-0.5">
                    <div>{sub.date} • Shift {sub.shift}</div>
                    <div>By: {sub.operator.name} ({sub.sheetsCount} sheets)</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          {selectedSub && (
            <div className="flex-1 overflow-y-auto p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                {/* Batch Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900">{selectedSub.id}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        LOCKED & DELIVERED
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Submitted on {new Date(selectedSub.submittedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> WhatsApp Sent
                    </span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Email Sent
                    </span>
                  </div>
                </div>

                {/* Attached Checksheets List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Attached Checksheets in this Batch ({selectedSub.sheets.length})
                  </div>
                  <div className="space-y-1.5">
                    {selectedSub.sheets.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{s.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {s.code} • Status: {s.status} {s.tempRecorded ? `(Temp: ${s.tempRecorded})` : ''}
                          </div>
                        </div>

                        <button
                          onClick={() => onOpenGridModal(s)}
                          className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1 rounded text-xs font-bold transition-colors shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Bajaj 31-Day Grid</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign-off Custody */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs shrink-0">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Done By</div>
                  <div className="font-bold text-slate-900">{selectedSub.operator.name} ({selectedSub.operator.empId})</div>
                  <div className="text-emerald-700 font-serif italic text-xs mt-0.5">✓ Digitally Signed</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Reviewing Manager</div>
                  <div className="font-bold text-slate-900">Pravin Deshmukh (Unit Compliance)</div>
                  <div className="text-blue-700 font-serif italic text-xs mt-0.5">✓ Dispatched via WhatsApp/Email</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
