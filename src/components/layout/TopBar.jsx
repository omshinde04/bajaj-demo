import React from 'react';
import { Building2, Clock, Send, Smartphone } from 'lucide-react';
import { getCurrentUser } from '../../services/storageService';

export const TopBar = ({ currentView, activeSheetTitle, onOpenBatchSubmit, onOpenNotifications }) => {
  const currentUser = getCurrentUser();

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'sheet_clitr':
      case 'sheet_hygiene':
        return `Workstation / ${activeSheetTitle || 'Checksheet Inspection'}`;
      case 'batch_submit':
        return 'Selective Batch Dispatch';
      case 'submissions':
        return 'Audit Archive & Official Compliance';
      case 'defects':
        return 'Defect & Non-Conformance Tracker';
      case 'notifications':
        return 'Automated Dispatch Logs (WhatsApp & Email)';
      case 'admin':
        return 'Plant Administration & Access Control';
      default:
        return 'Plant Checksheets Workstation';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none">
      
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="text-slate-400 font-normal">Bajaj Chakan 2 /</span>
          <span className="text-blue-900 font-semibold">{getBreadcrumb()}</span>
        </h2>
      </div>

      {/* Right Telemetry & Quick Dispatch CTA */}
      <div className="flex items-center gap-4">
        
        {/* Plant Duty Info */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{todayStr}</span>
          <span className="text-slate-300">•</span>
          <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded text-[10px]">
            Shift {currentUser.shift || 'M'}
          </span>
        </div>

        {/* Quick Batch CTA */}
        <button
          onClick={onOpenBatchSubmit}
          className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <Send className="w-3.5 h-3.5 text-blue-200" />
          <span>Batch Dispatch (Send 5+)</span>
        </button>

      </div>

    </header>
  );
};

