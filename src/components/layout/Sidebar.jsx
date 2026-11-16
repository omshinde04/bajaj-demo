import React from 'react';
import { 
  ClipboardCheck, 
  Send, 
  FileText, 
  AlertTriangle, 
  Smartphone, 
  Users, 
  RotateCcw,
  Building2,
  Clock,
  ShieldCheck,
  ChevronDown,
  FileDown
} from 'lucide-react';
import { getCurrentUser, setCurrentUser, getUsers, resetDemoData, getDefects, getChecksheets, getSheetProgress } from '../../services/storageService';

export const Sidebar = ({ currentView, setCurrentView, onDataChange }) => {
  const currentUser = getCurrentUser();
  const allUsers = getUsers();
  const defects = getDefects();
  const allSheets = getChecksheets();
  const openDefects = defects.filter(d => d.status === 'OPEN').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const readyCount = allSheets.filter(s => getSheetProgress(s.id, todayStr, currentUser.shift || 'M').status === 'READY_TO_SUBMIT').length;

  const navItems = [
    {
      id: 'duty',
      label: 'Checksheets Workstation',
      icon: ClipboardCheck,
      badge: null
    },
    {
      id: 'batch_submit',
      label: 'Batch Dispatch (Send 5+)',
      icon: Send,
      badge: readyCount > 0 ? `${readyCount} Ready` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'submissions',
      label: 'Submitted Audits',
      icon: FileText,
      badge: null
    },
    {
      id: 'defects',
      label: 'Defect Log (X)',
      icon: AlertTriangle,
      badge: openDefects > 0 ? openDefects : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'notifications',
      label: 'WhatsApp & Email Logs',
      icon: Smartphone,
      badge: 'Live'
    }
  ];

  if (currentUser.role === 'Admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin & Users',
      icon: Users,
      badge: 'Admin'
    });
  }

  const handleSwitchUser = (userId) => {
    const selected = allUsers.find(u => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
      onDataChange();
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all demo data back to factory state?")) {
      resetDemoData();
      onDataChange();
      window.location.reload();
    }
  };

  return (
    <aside className="w-64 bg-[#001D38] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 select-none">
      
      {/* Top Branding */}
      <div>
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#001D38] font-black tracking-widest text-base px-2.5 py-0.5 rounded shadow-sm">
              BAJAJ
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-tight leading-tight">
                Plant TPM & Hygiene
              </div>
              <div className="text-[10px] text-bajaj-300 font-mono">
                Chakan Plant 2
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors"
            title="Reset Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Plant Status Pill */}
        <div className="px-4 py-2.5 bg-[#00172e] border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online • Shift {currentUser.shift || 'M'}</span>
          </span>
          <span className="text-[10px] bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded font-mono border border-blue-700/50">
            DEMO MODE
          </span>
        </div>

        {/* Main Navigation Menu */}
        <nav className="p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Executive Guide PDF Button */}
        <div className="px-3 pt-1">
          <a
            href="/Bajaj_Digital_Checksheets_Executive_Guide.pdf"
            download="Bajaj_Digital_Checksheets_Executive_Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-2xs"
            title="Download full executive guide for Bajaj management"
          >
            <div className="flex items-center gap-2">
              <FileDown className="w-3.5 h-3.5" />
              <span>Executive Guide PDF</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-black">
              PDF
            </span>
          </a>
        </div>
      </div>

      {/* Bottom User Profile & Switcher */}
      <div className="p-3 border-t border-slate-800 bg-[#00172e]">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
          Active Account
        </div>

        <div className="relative group">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.avatar || 'U'}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                  {currentUser.roleBadge || currentUser.role}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Quick Demo Switcher Popup */}
          <div className="absolute bottom-full left-0 mb-1 w-60 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 py-1 hidden group-hover:block z-50 animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
              Demo: Switch Persona
            </div>
            {allUsers.map(u => (
              <button
                key={u.id}
                onClick={() => handleSwitchUser(u.id)}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                  u.id === currentUser.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                }`}
              >
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-[10px] text-slate-500">{u.role} • {u.department}</div>
                </div>
                {u.id === currentUser.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

    </aside>
  );
};

