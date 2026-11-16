import React, { useState, useRef } from 'react';
import { 
  CheckCircle2, 
  Send, 
  X, 
  AlertTriangle, 
  Phone, 
  Mail, 
  PenTool, 
  Lock, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getChecksheets, 
  getCurrentUser, 
  getAllDrafts, 
  submitBatchSheets, 
  saveDraft 
} from '../../services/storageService';

export const BatchSubmitModal = ({ initialSelectedIds = [], onClose, onSuccess }) => {
  const currentUser = getCurrentUser();
  const allSheets = getChecksheets();
  const todayStr = new Date().toISOString().split('T')[0];
  const currentShift = currentUser.shift || 'M';

  // Selected sheets list
  const [selectedIds, setSelectedIds] = useState(
    initialSelectedIds.length > 0 ? initialSelectedIds : allSheets.slice(0, 5).map(s => s.id)
  );

  // Workflow Stage: 1 = Review Selection, 2 = Operator Sign-off & Final Submit
  const [stage, setStage] = useState(1);

  // Form State
  const [supervisorPhone, setSupervisorPhone] = useState("+91 98810 55667");
  const [supervisorEmail, setSupervisorEmail] = useState("supervisor@bajaj.com");
  const [remarks, setRemarks] = useState("All daily maintenance and facility hygiene checkpoints completed per standard SOP.");
  const [signatureName, setSignatureName] = useState(currentUser.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Helper to autofill remaining checkpoints for demo convenience
  const handleQuickFillForDemo = () => {
    selectedIds.forEach(sheetId => {
      const sheet = allSheets.find(s => s.id === sheetId);
      if (!sheet) return;
      const entries = {};
      sheet.checkpoints.forEach((cp, idx) => {
        if (cp.type === 'NUMERIC') {
          entries[cp.id] = { status: 'OK', value: cp.minLimit ? (cp.minLimit + 1.2).toFixed(1) : "3.2" };
        } else {
          // If first sheet, introduce 1 defect on item 6 for realistic testing
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
        remarks: 'Batch pre-filled for demo submission'
      });
    });
    alert(`Successfully verified all checkpoints across ${selectedIds.length} selected sheets!`);
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    if (selectedIds.length === 0) {
      alert("Please select at least 1 sheet to submit.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const submission = submitBatchSheets({
        sheetIds: selectedIds,
        date: todayStr,
        shift: currentShift,
        operator: currentUser,
        supervisorPhone,
        supervisorEmail,
        signatureDataUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCAzMCBRIDUwIDUgOTAgNDAgVCAxODAgMjAiIHN0cm9rZT0iIzAwMzM2NiIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+PC9zdmc+",
        remarks
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setIsSubmitting(false);
      onSuccess(submission);
    }, 600);
  };

  const selectedSheets = allSheets.filter(s => selectedIds.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-fadeIn">
        
        {/* Modal Top Banner */}
        <div className="bg-[#002547] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bajaj-800 rounded-lg border border-bajaj-700">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {stage === 1 ? 'Selective Batch Dispatch' : 'Final Stage: Verification & Sign-Off'}
              </h3>
              <p className="text-xs text-bajaj-200">
                {stage === 1 
                  ? `Choose any subset of sheets (e.g. 5 sheets) to submit` 
                  : `Review and dispatch to Supervisor via WhatsApp & Email`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-bajaj-300 hover:text-white p-1 rounded-lg hover:bg-bajaj-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              stage >= 1 ? 'bg-bajaj-700 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span className={stage === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}>
              Select Sheets ({selectedIds.length})
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-300"></div>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
              stage === 2 ? 'bg-bajaj-700 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span className={stage === 2 ? 'font-bold text-slate-900' : 'text-slate-500'}>
              Sign-Off & Dispatch
            </span>
          </div>
        </div>

        {/* STAGE 1: Selection Screen */}
        {stage === 1 && (
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Select Completed Sheets to Send ({selectedIds.length} Selected)
                </h4>
                <p className="text-xs text-slate-500">
                  You do not need to wait for all sheets. You can send 1, 5, or all anytime.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickFillForDemo}
                className="text-[11px] font-bold text-bajaj-700 hover:text-bajaj-900 bg-bajaj-50 border border-bajaj-200 px-2.5 py-1 rounded hover:bg-bajaj-100 transition-colors"
                title="Populate demo checks for quick testing"
              >
                ⚡ Auto-Verify Demo Checks
              </button>
            </div>

            {/* Checksheets Checklist */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              {allSheets.map(sheet => {
                const isChecked = selectedIds.includes(sheet.id);
                return (
                  <label
                    key={sheet.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-white border-blue-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(sheet.id)}
                        className="w-4 h-4 text-bajaj-600 rounded border-slate-300 focus:ring-bajaj-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{sheet.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {sheet.code} • {sheet.categoryLabel}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {sheet.checkpoints.length} Points
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Stage 1 Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => setStage(2)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-bajaj-700 hover:bg-bajaj-800 disabled:opacity-50 rounded-lg shadow transition-all"
              >
                <span>Proceed to Final Review ({selectedIds.length} Sheets)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: Final Review Stage & Submit Button */}
        {stage === 2 && (
          <div className="p-6 space-y-5">
            
            {/* Summary Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Final Stage Verification</div>
                <div className="mt-0.5 text-blue-800">
                  You are submitting <strong>{selectedIds.length} checksheets</strong> for <strong>{todayStr} (Shift {currentShift})</strong>. Clicking final submit will lock the sheets and dispatch notifications.
                </div>
              </div>
            </div>

            {/* Notification Destinations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Supervisor WhatsApp</span>
                </div>
                <input
                  type="text"
                  value={supervisorPhone}
                  onChange={(e) => setSupervisorPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Sends instant alert & sign-off link</span>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex items-center gap-2 text-blue-700 font-bold mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Audit Email & PDF</span>
                </div>
                <input
                  type="email"
                  value={supervisorEmail}
                  onChange={(e) => setSupervisorEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded p-1.5 font-mono text-xs bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Attaches Bajaj Monthly Compliance Grid</span>
              </div>
            </div>

            {/* Handover Remarks */}
            <div className="text-xs space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Shift Handover Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-bajaj-500 focus:outline-none"
              />
            </div>

            {/* Digital Signature Card */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-bajaj-600" />
                  Operator Digital Verification
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Identity
                </span>
              </div>
              <div className="h-16 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center font-serif italic text-lg text-bajaj-900 select-none shadow-inner">
                {signatureName} (Done By)
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Employee ID: {currentUser.empId}</span>
                <span>Timestamp: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Stage 2 Footbar - The Final Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStage(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
              >
                Back to Selection
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isSubmitting ? 'Dispatching...' : `Final Submit & Dispatch (${selectedIds.length} Sheets)`}
                </span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
