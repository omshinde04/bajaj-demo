import React from 'react';
import { 
  ClipboardCheck, 
  Send, 
  FileText, 
  AlertTriangle, 
  Users, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getCurrentUser, getDefects } from '../../services/storageService';

export const Navbar = ({ currentView, setCurrentView }) => {
  const currentUser = getCurrentUser();
  const defects = getDefects();
  const openDefects = defects.filter(d => d.status === 'OPEN').length;

  const navItems = [
    {
      id: 'duty',
      label: 'My Checksheets',
      icon: ClipboardCheck,
      badge: null
    },
    {
      id: 'batch_submit',
      label: 'Selective Dispatch (Send 5+)',
      icon: Send,
      highlight: true
    },
    {
      id: 'submissions',
      label: 'Submitted Audits',
      icon: FileText,
      badge: null
    },
    {
      id: 'defects',
      label: 'Defect Log',
      icon: AlertTriangle,
      badge: openDefects > 0 ? openDefects : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'notifications',
      label: 'WhatsApp & Email Logs',
      icon: MessageSquare,
      badge: null
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

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-bajaj-50 text-[#002547] border-b-2 border-bajaj-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#002547]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="hidden lg:inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded">
                    Batch
                  </span>
                )}
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

