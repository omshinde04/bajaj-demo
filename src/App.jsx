import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { DutyDashboard } from './components/dashboard/DutyDashboard';
import { CLITRSheet } from './components/checksheets/CLITRSheet';
import { HygieneSheet } from './components/checksheets/HygieneSheet';
import { BatchSubmitModal } from './components/submission/BatchSubmitModal';
import { NotificationModal } from './components/notifications/NotificationModal';
import { SubmissionsView } from './components/submissions/SubmissionsView';
import { BajajGridPrintView } from './components/submissions/BajajGridPrintView';
import { DefectLogView } from './components/defects/DefectLogView';
import { AdminUserManagement } from './components/admin/AdminUserManagement';
import { initStorage, getChecksheetById } from './services/storageService';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [currentView, setCurrentView] = useState('duty');
  const [activeSheetId, setActiveSheetId] = useState(null);
  
  // Modals state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchInitialSelection, setBatchInitialSelection] = useState([]);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [selectedGridSheet, setSelectedGridSheet] = useState(null);

  // Trigger re-renders across views on storage change
  const [dataVersion, setDataVersion] = useState(0);
  const triggerDataChange = () => setDataVersion(v => v + 1);

  useEffect(() => {
    initStorage();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm font-mono">
        Initializing Bajaj Plant System...
      </div>
    );
  }

  // Open specific sheet editor
  const handleOpenSheet = (sheetId) => {
    setActiveSheetId(sheetId);
    const sheet = getChecksheetById(sheetId);
    if (sheet.category === 'EQUIPMENT_PM') {
      setCurrentView('sheet_clitr');
    } else {
      setCurrentView('sheet_hygiene');
    }
  };

  // Open batch modal with selected sheets
  const handleOpenBatchSubmit = (selectedIds = []) => {
    setBatchInitialSelection(selectedIds);
    setIsBatchModalOpen(true);
  };

  const handleBatchSuccess = (submission) => {
    setIsBatchModalOpen(false);
    triggerDataChange();
    // Redirect to notifications view to show the WhatsApp message immediately
    setCurrentView('notifications');
  };

  const handleOpenGridModal = (sheetItem) => {
    setSelectedGridSheet(sheetItem);
    setIsGridModalOpen(true);
  };

  const activeSheet = activeSheetId ? getChecksheetById(activeSheetId) : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-bajaj-700 selection:text-white">
      
      {/* Top Corporate Header */}
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onDataChange={triggerDataChange}
      />

      {/* Main Navigation Tabs */}
      <Navbar 
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'batch_submit') {
            handleOpenBatchSubmit();
          } else {
            setCurrentView(view);
          }
        }}
      />

      {/* Main View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* View 1: Duty Dashboard */}
        {currentView === 'duty' && (
          <DutyDashboard 
            key={dataVersion}
            onOpenSheet={handleOpenSheet}
            onOpenBatchSubmit={handleOpenBatchSubmit}
          />
        )}

        {/* View 2: CLITR Sheet Editor (LPG Burner & Bain Marie) */}
        {currentView === 'sheet_clitr' && activeSheet && (
          <CLITRSheet 
            key={`${activeSheet.id}_${dataVersion}`}
            sheet={activeSheet}
            onBack={() => setCurrentView('duty')}
            onProceedToBatch={(id) => handleOpenBatchSubmit([id])}
          />
        )}

        {/* View 3: Facility Hygiene Sheet Editor (Chiller & Garbage Store) */}
        {currentView === 'sheet_hygiene' && activeSheet && (
          <HygieneSheet 
            key={`${activeSheet.id}_${dataVersion}`}
            sheet={activeSheet}
            onBack={() => setCurrentView('duty')}
            onProceedToBatch={(id) => handleOpenBatchSubmit([id])}
          />
        )}

        {/* View 4: Submissions & Audit Archive */}
        {currentView === 'submissions' && (
          <SubmissionsView 
            key={dataVersion}
            onOpenGridModal={handleOpenGridModal}
          />
        )}

        {/* View 5: WhatsApp & Email Logs */}
        {currentView === 'notifications' && (
          <NotificationModal 
            key={dataVersion}
            onClose={() => setCurrentView('duty')}
          />
        )}

        {/* View 6: Defect Log */}
        {currentView === 'defects' && (
          <DefectLogView 
            key={dataVersion}
          />
        )}

        {/* View 7: Admin Panel */}
        {currentView === 'admin' && (
          <AdminUserManagement 
            key={dataVersion}
            onUsersUpdated={triggerDataChange}
          />
        )}

      </main>

      {/* Batch Submission Modal (Send 5+ sheets) */}
      {isBatchModalOpen && (
        <BatchSubmitModal 
          initialSelectedIds={batchInitialSelection}
          onClose={() => setIsBatchModalOpen(false)}
          onSuccess={handleBatchSuccess}
        />
      )}

      {/* Official Bajaj Monthly Grid Preview (Exact Replica of Physical Sheet) */}
      {isGridModalOpen && selectedGridSheet && (
        <BajajGridPrintView 
          sheetItem={selectedGridSheet}
          onClose={() => setIsGridModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Bajaj Auto Ltd. • Plant Facility & TPM Inspection System</span>
          <span className="font-mono text-[11px] text-slate-400">Offline-First Local Storage Engine • Demo Mode</span>
        </div>
      </footer>

    </div>
  );
}
