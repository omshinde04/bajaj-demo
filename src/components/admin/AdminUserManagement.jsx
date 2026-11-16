import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Check, 
  Mail, 
  Phone, 
  Clock, 
  KeyRound,
  CheckCircle2,
  X
} from 'lucide-react';
import { getUsers, saveUser, getChecksheets } from '../../services/storageService';

export const AdminUserManagement = ({ onUsersUpdated }) => {
  const users = getUsers();
  const allSheets = getChecksheets();

  const [showAddModal, setShowAddModal] = useState(false);
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
    setShowAddModal(false);
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
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Staff Credentials & Access Provisioning ({users.length} Users)
          </h3>
          <p className="text-[11px] text-slate-500">
            Admins create staff logins, allocate duty shifts, and assign equipment checksheets.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#001D38] hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Provision New Account</span>
        </button>
      </div>

      {/* Users Desktop Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
            <tr>
              <th className="py-2.5 px-3">Staff Name & Profile</th>
              <th className="py-2.5 px-3 w-32 font-mono">Employee ID</th>
              <th className="py-2.5 px-3 w-32">Role</th>
              <th className="py-2.5 px-3 w-28">Shift Duty</th>
              <th className="py-2.5 px-3">Assigned Checksheets</th>
              <th className="py-2.5 px-3 w-28 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
                      {u.avatar || u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3 font-mono font-bold text-slate-700">{u.empId}</td>

                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'Supervisor' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                  Shift {u.shift || 'General'}
                </td>

                <td className="py-3 px-3 text-slate-600 text-[11px]">
                  {u.assignedSheets ? `${u.assignedSheets.length} Checksheets Allocated` : 'All Plant Access'}
                </td>

                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Provisioning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-5 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <KeyRound className="w-4 h-4 text-blue-700" />
                <span>Provision New Staff Account</span>
              </div>
              <button onClick={() => setShowAddModal(false)} type="button" className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikas More"
                  className="w-full border border-slate-300 rounded p-1.5"
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
                  className="w-full border border-slate-300 rounded p-1.5 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. vikas@bajaj.com"
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5 bg-white"
                >
                  <option value="Operator">Operator / Technician</option>
                  <option value="Supervisor">Supervisor / Unit Manager</option>
                  <option value="Admin">Plant Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-xs"
              >
                Save & Provision
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
