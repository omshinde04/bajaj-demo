import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
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
      <div className="h-screen w-screen bg-[#001D38] flex items-center justify-center text-white text-xs font-mono">
        Initializing Bajaj Plant Desktop System...
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
    // Directly navigate to WhatsApp/Email terminal
    setCurrentView('notifications');
  };

  const handleOpenGridModal = (sheetItem) => {
    setSelectedGridSheet(sheetItem);
    setIsGridModalOpen(true);
  };

  const activeSheet = activeSheetId ? getChecksheetById(activeSheetId) : null;

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      
      {/* 1. Left Fixed Enterprise Desktop Sidebar */}
      <Sidebar 
        key={`sidebar_${dataVersion}`}
        currentView={currentView}
        setCurrentView={(view) => {
          triggerDataChange();
          if (view === 'batch_submit') {
            handleOpenBatchSubmit();
          } else {
            setCurrentView(view);
          }
        }}
        onDataChange={triggerDataChange}
      />

      {/* 2. Main Desktop Workstation Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Desktop Titlebar */}
        <TopBar 
          currentView={currentView}
          activeSheetTitle={activeSheet?.title}
          onOpenBatchSubmit={() => handleOpenBatchSubmit()}
          onOpenNotifications={() => setCurrentView('notifications')}
        />

        {/* Viewport Workstation (Fixed height, no outer page scroll!) */}
        <main className="flex-1 p-3 overflow-hidden min-h-0 bg-slate-100">
          
          {/* Duty Dashboard */}
          {currentView === 'duty' && (
            <DutyDashboard 
              key={dataVersion}
              onOpenSheet={handleOpenSheet}
              onOpenBatchSubmit={handleOpenBatchSubmit}
            />
          )}

          {/* CLITR Sheet Table (LPG Burner & Bain Marie) */}
          {currentView === 'sheet_clitr' && activeSheet && (
            <CLITRSheet 
              key={`${activeSheet.id}_${dataVersion}`}
              sheet={activeSheet}
              onBack={() => {
                triggerDataChange();
                setCurrentView('duty');
              }}
              onProceedToBatch={(id) => handleOpenBatchSubmit([id])}
            />
          )}

          {/* Hygiene Sheet Table (Chiller & Garbage Store) */}
          {currentView === 'sheet_hygiene' && activeSheet && (
            <HygieneSheet 
              key={`${activeSheet.id}_${dataVersion}`}
              sheet={activeSheet}
              onBack={() => {
                triggerDataChange();
                setCurrentView('duty');
              }}
              onProceedToBatch={(id) => handleOpenBatchSubmit([id])}
            />
          )}

          {/* Submissions & Audit Archive */}
          {currentView === 'submissions' && (
            <SubmissionsView 
              key={dataVersion}
              onOpenGridModal={handleOpenGridModal}
            />
          )}

          {/* WhatsApp & Email 2-Column Terminal */}
          {currentView === 'notifications' && (
            <NotificationModal 
              key={dataVersion}
            />
          )}

          {/* Defect Log */}
          {currentView === 'defects' && (
            <DefectLogView 
              key={dataVersion}
            />
          )}

          {/* Admin Panel */}
          {currentView === 'admin' && (
            <AdminUserManagement 
              key={dataVersion}
              onUsersUpdated={triggerDataChange}
            />
          )}

        </main>
      </div>

      {/* Selective Batch Dispatch Modal (Send 5+ Sheets) */}
      {isBatchModalOpen && (
        <BatchSubmitModal 
          initialSelectedIds={batchInitialSelection}
          onClose={() => setIsBatchModalOpen(false)}
          onSuccess={handleBatchSuccess}
        />
      )}

      {/* Official Bajaj 31-Day Physical Grid Modal */}
      {isGridModalOpen && selectedGridSheet && (
        <BajajGridPrintView 
          sheetItem={selectedGridSheet}
          onClose={() => setIsGridModalOpen(false)}
        />
      )}

    </div>
  );
}
