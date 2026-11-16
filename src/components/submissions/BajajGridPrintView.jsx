import React from 'react';
import { X, Printer, Download, Check, ShieldCheck } from 'lucide-react';
import { getChecksheetById } from '../../services/storageService';

export const BajajGridPrintView = ({ sheetItem, onClose }) => {
  const fullSheet = getChecksheetById(sheetItem?.sheetId) || {};
  const checkpoints = fullSheet.checkpoints || [];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Top Control Bar */}
        <div className="bg-[#002547] text-white p-4 flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#002547] font-black px-2 py-0.5 rounded text-sm tracking-wider">
              BAJAJ
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Official Monthly Compliance Grid — {fullSheet.title || sheetItem.title}
              </h3>
              <p className="text-[11px] text-bajaj-200">
                Exact physical checksheet format matching plant binder records (Chakan 2)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-bajaj-300 hover:text-white rounded-lg hover:bg-bajaj-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Grid Container */}
        <div className="p-6 overflow-x-auto flex-1 bg-white font-sans text-slate-900">
          
          {/* Header Metadata Grid */}
          <div className="border border-slate-800 text-[11px]">
            
            {/* Row 1: Document Details */}
            <div className="grid grid-cols-12 border-b border-slate-800 divide-x divide-slate-800 font-semibold bg-slate-50">
              <div className="col-span-3 p-1.5">Document NO: {fullSheet.documentNo || 'BJ/TPM/01'}</div>
              <div className="col-span-3 p-1.5">Checking Frequency: Daily</div>
              <div className="col-span-4 p-1.5">Notation: OK = ✓ ; Not OK = X ; OK After Repair = •</div>
              <div className="col-span-2 p-1.5 text-center font-bold text-blue-900">Month: NOV - 26</div>
            </div>

            {/* Row 2: Equipment & Responsibilities */}
            <div className="grid grid-cols-12 border-b border-slate-800 divide-x divide-slate-800">
              <div className="col-span-3 p-1.5 font-bold">Equipment: {fullSheet.equipmentName}</div>
              <div className="col-span-3 p-1.5">Responsibility: {fullSheet.responsibility || 'Plant Tech'}</div>
              <div className="col-span-6 p-1.5 text-[10px] text-slate-700">
                Framework: C: Cleaning | L: Lubrication | I: Inspection | T: Tightness | R: Repair
              </div>
            </div>

            {/* Main Table Matrix (31 Days) */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[10px] text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800 divide-x divide-slate-800 text-center font-bold">
                    <th className="p-1 w-8">Sl. No</th>
                    <th className="p-1 w-10">Type</th>
                    <th className="p-1 min-w-[200px] text-left">Standard Condition</th>
                    {days.map(d => (
                      <th key={d} className={`p-0.5 w-6 ${d === 16 ? 'bg-amber-100 text-amber-900 font-black' : ''}`}>
                        {d}
                      </th>
                    ))}
                    <th className="p-1 min-w-[100px]">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {checkpoints.map((cp, idx) => (
                    <tr key={cp.id} className="divide-x divide-slate-700 hover:bg-slate-50">
                      <td className="p-1 text-center font-bold">{cp.seq || idx + 1}</td>
                      <td className="p-1 text-center font-mono font-bold text-slate-800">{cp.type || 'I'}</td>
                      <td className="p-1">
                        <div className="font-semibold text-slate-900">{cp.title}</div>
                        <div className="text-[9px] text-slate-500">{cp.standardCondition || cp.description}</div>
                      </td>
                      {days.map(d => {
                        // Render simulated checks for days 1 to 16
                        const isToday = d === 16;
                        let mark = '';
                        let colorClass = 'text-emerald-700 font-bold';

                        if (d <= 15) {
                          // Past days filled
                          if (cp.seq === 6 && d === 6) {
                            mark = 'X';
                            colorClass = 'text-rose-600 font-bold';
                          } else if (cp.seq === 6 && d === 7) {
                            mark = '•';
                            colorClass = 'text-blue-700 font-bold';
                          } else {
                            mark = '✓';
                          }
                        } else if (isToday) {
                          // Today's entry
                          mark = '✓';
                          colorClass = 'text-emerald-700 font-black';
                        }

                        return (
                          <td 
                            key={d} 
                            className={`p-0.5 text-center font-mono ${colorClass} ${
                              isToday ? 'bg-amber-50' : ''
                            }`}
                          >
                            {mark}
                          </td>
                        );
                      })}
                      <td className="p-1 text-[9px] text-slate-500">
                        {cp.seq === 6 ? 'Hose checked on D6' : 'Normal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Audit Signatures (Replicating Paper Sheet) */}
            <div className="border-t border-slate-800 divide-y divide-slate-800 text-[10px]">
              <div className="grid grid-cols-12 divide-x divide-slate-800 p-1.5 font-semibold bg-slate-50">
                <div className="col-span-6 flex items-center justify-between px-2">
                  <span>Done By (Technician / Operator): <strong>Rahul Shinde (BJ-OP-4412)</strong></span>
                  <span className="font-serif italic text-blue-900">Signed Digitally ✓</span>
                </div>
                <div className="col-span-6 flex items-center justify-between px-2">
                  <span>Checked By (Unit Manager): <strong>Pravin Deshmukh (BJ-SUP-082)</strong></span>
                  <span className="font-serif italic text-emerald-900">Verified & Approved ✓</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4 text-[10px] text-slate-500 text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital Certificate Hash: 8b4c-9f01-bajaj-chakan2-verified-tpm</span>
          </div>

        </div>

      </div>
    </div>
  );
};
