import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  CheckCheck, 
  FileText, 
  Download, 
  Phone, 
  Clock, 
  Sparkles, 
  Send,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { getNotifications, getSubmissions } from '../../services/storageService';

export const NotificationModal = ({ onClose }) => {
  const notifications = getNotifications();
  const submissions = getSubmissions();
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'email'

  const waNotifs = notifications.filter(n => n.type === 'WHATSAPP');
  const emailNotifs = notifications.filter(n => n.type === 'EMAIL');

  const latestWa = waNotifs[0];
  const latestEmail = emailNotifs[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Automated Dispatch Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-Time Webhooks</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Instant WhatsApp & Email Dispatches
          </h2>
          <p className="text-xs text-slate-600">
            Every time an operator finishes and clicks Final Submit, these automated payloads are generated and sent to the Supervisor and Plant Quality Team.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp Simulation ({waNotifs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'email'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & PDF ({emailNotifs.length})</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP PREVIEW */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-xl mx-auto">
          {/* Phone Shell Header */}
          <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white text-[#075E54] flex items-center justify-center font-bold text-sm">
                B
              </div>
              <div>
                <div className="font-bold text-sm flex items-center gap-1">
                  <span>Bajaj TPM & HACCP Bot</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="text-[11px] text-emerald-100">Official Business Account</div>
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-200">
              Chakan Plant 2
            </div>
          </div>

          {/* WhatsApp Chat Area */}
          <div className="p-4 bg-[#EFEAE2] min-h-[380px] space-y-3 font-sans">
            <div className="text-center">
              <span className="bg-white/80 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded shadow-2xs">
                TODAY • ENCRYPTED END-TO-END
              </span>
            </div>

            {waNotifs.length === 0 ? (
              <div className="bg-white p-4 rounded-xl text-center text-xs text-slate-500 shadow-2xs mt-8">
                No submissions sent yet. Go to <strong>"Selective Dispatch"</strong> and click Submit on 5 sheets to see the live WhatsApp message arrive here!
              </div>
            ) : (
              waNotifs.map(notif => (
                <div key={notif.id} className="flex flex-col items-end">
                  <div className="bg-[#DCF8C6] rounded-xl rounded-tr-none p-3.5 max-w-sm text-xs text-slate-900 shadow-xs border border-[#cfe9b9] space-y-2 whitespace-pre-line leading-relaxed">
                    {notif.content}
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-1">
                      <span>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mr-1">
                    Delivered to: {notif.recipient} ({notif.recipientName})
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Powered by Twilio WhatsApp / Meta Cloud API (Ready for production webhook integration)
          </div>
        </div>
      )}

      {/* EMAIL PREVIEW */}
      {activeTab === 'email' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Email Client Header */}
          <div className="bg-slate-100 border-b border-slate-200 p-4 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">INBOX PREVIEW</span>
              <span className="text-[11px] text-slate-500 font-mono">SMTP / SendGrid Gateway</span>
            </div>
            {latestEmail && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-14">From:</span>
                  <span className="font-semibold text-slate-800">operations@bajaj-facility.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-14">To:</span>
                  <span className="font-semibold text-slate-800">{latestEmail.recipient}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-14">Subject:</span>
                  <span className="font-bold text-slate-900">{latestEmail.title}</span>
                </div>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="p-6 space-y-5">
            {emailNotifs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No email reports generated yet. Submit a batch from the dashboard to preview the email summary and PDF attachment!
              </div>
            ) : (
              <div>
                {/* Official Corporate Email Header */}
                <div className="border-b border-bajaj-200 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#002547] text-white font-black px-2.5 py-1 rounded text-sm tracking-wider">
                      BAJAJ
                    </div>
                    <span className="font-bold text-sm text-slate-800">Quality Compliance & Plant Facility Operations</span>
                  </div>
                  <span className="text-xs text-slate-500">Chakan Plant 2</span>
                </div>

                <div className="py-4 space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>Dear <strong>Pravin Deshmukh (Unit Compliance Manager)</strong>,</p>
                  <p>
                    Please find attached the signed shift compliance and maintenance audit package. The operator has performed all scheduled inspections and logged physical readings per the Bajaj standard operating manual.
                  </p>

                  {/* Attachment Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between max-w-md">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-6 h-6 text-rose-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">
                          {latestEmail.pdfAttachmentName || 'Bajaj_Compliance_Audit.pdf'}
                        </div>
                        <div className="text-[10px] text-slate-500">Official Monthly Grid Format • 142 KB</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Simulating PDF download of the physical Bajaj grid layout!")}
                      className="flex items-center gap-1 text-bajaj-700 hover:text-bajaj-900 font-bold text-xs bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs hover:bg-slate-50 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
