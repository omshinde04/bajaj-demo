import React from 'react';
import { 
  Phone, 
  Mail, 
  CheckCheck, 
  FileText, 
  Download, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';
import { getNotifications } from '../../services/storageService';

export const NotificationModal = () => {
  const notifications = getNotifications();
  const waNotifs = notifications.filter(n => n.type === 'WHATSAPP');
  const emailNotifs = notifications.filter(n => n.type === 'EMAIL');
  const latestEmail = emailNotifs[0];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Automated WhatsApp & Email Dispatch Terminal
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time webhook logs triggered automatically upon final sheet submission.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WhatsApp Gateway Active</span>
          </span>
          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200 font-bold">
            <span>SMTP Active</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-x divide-slate-200 overflow-hidden">
        
        {/* Left Column: WhatsApp Smartphone View */}
        <div className="flex flex-col bg-[#EFEAE2] overflow-hidden">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold text-xs">
                B
              </div>
              <div>
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>Bajaj Shift Bot (Verified)</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </div>
                <div className="text-[10px] text-emerald-100">Automated Inspection Feed</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-200 font-mono">Chakan 2</span>
          </div>

          {/* WhatsApp Message Bubble Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {waNotifs.length === 0 ? (
              <div className="bg-white/90 p-4 rounded-xl text-center text-xs text-slate-500 shadow-2xs mt-12">
                No WhatsApp alerts triggered yet. Click <strong>"Batch Dispatch"</strong> to submit 5 sheets and watch the live alert appear here!
              </div>
            ) : (
              waNotifs.map(notif => (
                <div key={notif.id} className="flex flex-col items-end">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-3 max-w-sm text-xs text-slate-900 shadow-xs border border-[#cfe9b9] space-y-1.5 whitespace-pre-line leading-relaxed font-sans">
                    {notif.content}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-0.5">
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 mr-1 font-mono">
                    Delivered to: {notif.recipient} ({notif.recipientName})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Email Client View */}
        <div className="flex flex-col bg-white overflow-hidden">
          {/* Email Header */}
          <div className="bg-slate-100 border-b border-slate-200 p-3 text-xs space-y-1 shrink-0">
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
              <span>Auditor Email Inbox</span>
              <span className="font-mono">SendGrid / SMTP</span>
            </div>
            {latestEmail && (
              <div className="text-xs space-y-0.5">
                <div><span className="text-slate-400">To:</span> <strong className="text-slate-800">{latestEmail.recipient}</strong></div>
                <div><span className="text-slate-400">Subject:</span> <strong className="text-slate-900">{latestEmail.title}</strong></div>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
            {emailNotifs.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No email reports dispatched yet. Submitting a batch will auto-generate the official email with attached PDF.
              </div>
            ) : (
              <div>
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#002547] text-white font-black px-2 py-0.5 rounded text-xs">BAJAJ</span>
                    <span className="font-bold text-slate-900">Shift Compliance Package</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Verified Sign-Off</span>
                </div>

                <p className="mt-3">
                  Dear <strong>Pravin Deshmukh (Unit Compliance Lead)</strong>,
                </p>
                <p className="mt-1">
                  The shift inspection checklist has been successfully finalized by the operator. All checkpoints and numeric readings have been verified against the standard TPM and HACCP specifications.
                </p>

                {/* PDF Attachment Box */}
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between max-w-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{latestEmail.pdfAttachmentName}</div>
                      <div className="text-[10px] text-slate-400">Official Monthly Matrix Grid • 142 KB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Simulating PDF download of the physical Bajaj grid layout!")}
                    className="flex items-center gap-1 text-blue-700 font-bold text-xs bg-white border border-slate-200 px-2 py-1 rounded shadow-2xs hover:bg-slate-50"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
