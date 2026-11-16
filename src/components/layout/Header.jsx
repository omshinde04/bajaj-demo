import React from 'react';
import { 
  Building2, 
  Clock, 
  RotateCcw, 
  Bell, 
  User, 
  ShieldCheck, 
  Smartphone,
  ChevronDown
} from 'lucide-react';
import { getCurrentUser, setCurrentUser, getUsers, resetDemoData, getNotifications } from '../../services/storageService';

export const Header = ({ currentView, setCurrentView, onDataChange }) => {
  const currentUser = getCurrentUser();
  const allUsers = getUsers();
  const notifications = getNotifications();
  const unreadCount = notifications.length;

  // Auto-detect current shift
  const hour = new Date().getHours();
  let shiftLabel = "Morning (M: 06:00 - 14:00)";
  let shiftCode = "M";
  if (hour >= 14 && hour < 22) {
    shiftLabel = "Afternoon (A: 14:00 - 22:00)";
    shiftCode = "A";
  } else if (hour >= 22 || hour < 6) {
    shiftLabel = "Night (N: 22:00 - 06:00)";
    shiftCode = "N";
  }

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

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
    <header className="sticky top-0 z-40 bg-[#002547] text-white border-b border-bajaj-700 shadow-md">
      {/* Top Corporate Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Facility Identity */}
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-md px-2.5 py-1 flex items-center justify-center shadow-sm">
              <span className="text-[#002547] font-black tracking-widest text-lg">BAJAJ</span>
            </div>
            <div className="hidden sm:block border-l border-bajaj-600 pl-3">
              <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <span>Facility & TPM Digital Checksheets</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-400/30">
                  LIVE CHAKAN 2
                </span>
              </h1>
              <p className="text-xs text-bajaj-200">Total Productive Maintenance & HACCP System</p>
            </div>
          </div>

          {/* Plant & Shift Real-Time Telemetry */}
          <div className="hidden md:flex items-center gap-2 bg-bajaj-900/60 border border-bajaj-600/50 rounded-lg px-3 py-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-bajaj-100">
              <Building2 className="w-3.5 h-3.5 text-bajaj-300" />
              <span className="font-medium">Chakan Plant 2</span>
            </div>
            <span className="text-bajaj-500">•</span>
            <div className="flex items-center gap-1.5 text-bajaj-100 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{todayStr}</span>
              <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                Shift {shiftCode}
              </span>
            </div>
          </div>

          {/* User Controls & Demo Switcher */}
          <div className="flex items-center gap-3">
            
            {/* WhatsApp / Email Dispatch Center Pill */}
            <button 
              onClick={() => setCurrentView('notifications')}
              className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'notifications' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'bg-bajaj-800/80 hover:bg-bajaj-700 text-bajaj-100 border border-bajaj-600'
              }`}
              title="View Simulated WhatsApp & Email Dispatches"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Dispatch Logs</span>
              {unreadCount > 0 && (
                <span className="bg-emerald-500 text-slate-900 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Role Switcher for seamless live demo */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-bajaj-800 hover:bg-bajaj-700 border border-bajaj-600 rounded-lg px-3 py-1.5 cursor-pointer transition-colors">
                <div className="w-6 h-6 rounded-full bg-bajaj-600 text-white flex items-center justify-center font-bold text-xs border border-bajaj-400">
                  {currentUser.avatar || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-bajaj-200">{currentUser.roleBadge || currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-bajaj-300" />
              </div>

              {/* Role Dropdown */}
              <div className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 hidden group-hover:block z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo: Switch Role</div>
                  <div className="text-xs text-slate-600 font-medium">Test system from different perspectives:</div>
                </div>
                {allUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleSwitchUser(user.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      user.id === currentUser.id ? 'bg-blue-50 text-bajaj-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-[10px] text-slate-500">{user.role} • {user.department}</div>
                    </div>
                    {user.id === currentUser.id && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 1-Click Demo Reset */}
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg text-bajaj-300 hover:text-white hover:bg-bajaj-800 transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
