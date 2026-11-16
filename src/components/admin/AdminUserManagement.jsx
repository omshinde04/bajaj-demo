import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Check, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { getUsers, saveUser, getChecksheets } from '../../services/storageService';

export const AdminUserManagement = ({ onUsersUpdated }) => {
  const users = getUsers();
  const allSheets = getChecksheets();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operator',
    empId: '',
    phone: '',
    shift: 'M',
    department: 'Kitchen & Facility Operations',
    assignedSheets: ['sheet_lpg_01', 'sheet_bain_marie_01']
  });

  const handleToggleSheet = (sheetId) => {
    setFormData(prev => {
      const exists = prev.assignedSheets.includes(sheetId);
      return {
        ...prev,
        assignedSheets: exists 
          ? prev.assignedSheets.filter(s => s !== sheetId)
          : [...prev.assignedSheets, sheetId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.empId) {
      alert("Please fill in Name, Email, and Employee ID.");
      return;
    }

    saveUser(formData);
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      role: 'Operator',
      empId: '',
      phone: '',
      shift: 'M',
      department: 'Kitchen & Facility Operations',
      assignedSheets: ['sheet_lpg_01', 'sheet_bain_marie_01']
    });
    onUsersUpdated();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-bajaj-700 bg-bajaj-50 px-2.5 py-1 rounded-full border border-bajaj-200 uppercase tracking-wider">
              Administration Center
            </span>
            <span className="text-xs text-slate-500 font-mono">Access Provisioning</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Plant Staff & User Credentials Management
          </h2>
          <p className="text-xs text-slate-600">
            Admins create user accounts, assign shift duty schedules, and allocate specific equipment checksheets.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-[#002547] hover:bg-bajaj-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-xs self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          <span>{showAddForm ? 'Close Form' : 'Add New User'}</span>
        </button>
      </div>

      {/* Add User Modal / Inline Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-bajaj-300 p-6 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            <KeyRound className="w-4 h-4 text-bajaj-600" />
            <span>Provision New Staff Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikas More"
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Employee ID</label>
              <input
                type="text"
                required
                value={formData.empId}
                onChange={e => setFormData({ ...formData, empId: e.target.value })}
                placeholder="e.g. BJ-OP-5520"
                className="w-full border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email (Login ID)</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. vikas@bajaj.com"
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white"
              >
                <option value="Operator">Operator / Technician</option>
                <option value="Supervisor">Supervisor / Unit Manager</option>
                <option value="Admin">Plant Administrator</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Shift</label>
              <select
                value={formData.shift}
                onChange={e => setFormData({ ...formData, shift: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 bg-white"
              >
                <option value="M">M - Morning Shift</option>
                <option value="A">A - Afternoon Shift</option>
                <option value="E">E - Evening Shift</option>
                <option value="N">N - Night Shift</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp Mobile</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98XXX XXXXX"
                className="w-full border border-slate-300 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Assigned Checksheets Checklist */}
          <div className="pt-2">
            <label className="font-bold text-slate-700 block mb-2 text-xs">
              Assign Equipment & Facility Checksheets
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {allSheets.map(sheet => {
                const isAssigned = formData.assignedSheets.includes(sheet.id);
                return (
                  <button
                    type="button"
                    key={sheet.id}
                    onClick={() => handleToggleSheet(sheet.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isAssigned 
                        ? 'bg-blue-50/80 border-blue-400 text-bajaj-900 font-semibold' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="truncate">{sheet.title}</span>
                    {isAssigned && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-bajaj-700 hover:bg-bajaj-800 rounded-lg shadow-sm"
            >
              Save & Provision Account
            </button>
          </div>
        </form>
      )}

      {/* User Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map(u => (
          <div key={u.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bajaj-100 text-bajaj-800 font-bold flex items-center justify-center border border-bajaj-300">
                    {u.avatar || u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{u.name}</h4>
                    <span className="text-[11px] font-mono text-slate-500">{u.empId}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  u.role === 'Admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : u.role === 'Supervisor'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {u.role}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shift: <strong>{u.shift || 'General'}</strong> • {u.department}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                {u.assignedSheets ? `${u.assignedSheets.length} Checksheets Assigned` : 'All Plant Access'}
              </span>
              <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
