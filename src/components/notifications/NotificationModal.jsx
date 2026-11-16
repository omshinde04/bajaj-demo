import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  CheckCheck, 
  FileText, 
  Download, 
  ShieldCheck, 
  Clock,
  Sparkles,
  ExternalLink,
  Settings,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getNotifications, getSubmissions } from '../../services/storageService';
import { downloadSubmissionPdf } from '../../services/pdfService';
import { 
  getWhatsAppConfig, 
  saveWhatsAppConfig, 
  sendViaDirectWhatsApp, 
  sendViaCallMeBot 
} from '../../services/whatsappService';

export const NotificationModal = () => {
  const notifications = getNotifications();
  const waNotifs = notifications.filter(n => n.type === 'WHATSAPP');
  const emailNotifs = notifications.filter(n => n.type === 'EMAIL');
  const latestEmail = emailNotifs[0];

  // WhatsApp Gateway Settings State
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [waConfig, setWaConfig] = useState(getWhatsAppConfig());
  const [testStatus, setTestStatus] = useState(null);
  const [userPhone, setUserPhone] = useState(waConfig.phone || '+91');

  const handleSaveConfig = () => {
    saveWhatsAppConfig({
      ...waConfig,
      phone: userPhone
    });
    alert("WhatsApp settings saved successfully!");
    setShowApiSettings(false);
  };

  const handleSendDirect = (content, targetPhone) => {
    const phoneToUse = targetPhone || userPhone;
    if (!phoneToUse || phoneToUse === '+91') {
      const input = prompt("Enter your real WhatsApp mobile number with country code (e.g. +91 98765 43210):", "+91 ");
      if (input) {
        setUserPhone(input);
        sendViaDirectWhatsApp(input, content);
      }
    } else {
      sendViaDirectWhatsApp(phoneToUse, content);
    }
  };

  const handleTestCallMeBot = async (content) => {
    if (!waConfig.apiKey) {
      alert("Please enter your free CallMeBot API key first!");
      return;
    }
    setTestStatus('Sending via CallMeBot API...');
    const res = await sendViaCallMeBot(userPhone, content, waConfig.apiKey);
    if (res.success) {
      setTestStatus('✅ Real WhatsApp message dispatched to ' + userPhone);
      setTimeout(() => setTestStatus(null), 4000);
    } else {
      setTestStatus('⚠️ Fallback opened in WhatsApp Web');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            Automated WhatsApp & Email Dispatch Terminal
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time webhook logs triggered automatically upon final sheet submission.
          </p>
        </div>

        {/* Live Free WhatsApp Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowApiSettings(!showApiSettings)}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold transition-colors shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Free WhatsApp API Setup</span>
          </button>

          {waNotifs[0] && (
            <button
              onClick={() => handleSendDirect(waNotifs[0].content, userPhone)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1 rounded-lg text-xs font-bold transition-colors shadow-2xs"
              title="Send to your real WhatsApp"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-200" />
              <span>📱 Send to Real WhatsApp</span>
            </button>
          )}
        </div>
      </div>

      {/* Free WhatsApp API Setup Drawer / Card */}
      {showApiSettings && (
        <div className="bg-emerald-50/90 border-b border-emerald-200 p-4 shrink-0 text-xs animate-fadeIn space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Free WhatsApp Integration (2 Options for Demo)</span>
            </div>
            <button onClick={() => setShowApiSettings(false)} className="text-xs text-emerald-700 hover:text-emerald-950 font-bold">
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: 1-Click WhatsApp Direct (No Setup) */}
            <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 rounded">Option 1</span>
                <span>Direct WhatsApp (100% Free • Zero Setup)</span>
              </span>
              <p className="text-[11px] text-slate-600">
                Instantly opens WhatsApp Web or WhatsApp Desktop with the pre-formatted Bajaj report ready to send in 1 click!
              </p>
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Your mobile with +91..."
                  className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSendDirect(waNotifs[0]?.content || "Test Bajaj Shift Checksheet", userPhone)}
                  className="bg-emerald-600 text-white font-bold px-3 py-1 rounded hover:bg-emerald-700 text-xs"
                >
                  Test Open
                </button>
              </div>
            </div>

            {/* Option 2: CallMeBot Free API (Zero Signup Bot) */}
            <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-1.5 rounded">Option 2</span>
                <span>CallMeBot Free API (Automated Background Send)</span>
              </span>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                1. Send: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-800 font-bold">I allow callmebot to send me messages</code> to <a href="https://wa.me/34644442416?text=I+allow+callmebot+to+send+me+messages" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">+34 644 44 24 16</a>.<br/>
                2. CallMeBot replies with your free API key in 5 seconds. Paste it below:
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={waConfig.apiKey}
                  onChange={(e) => setWaConfig({ ...waConfig, apiKey: e.target.value })}
                  placeholder="Paste CallMeBot API Key..."
                  className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleTestCallMeBot(waNotifs[0]?.content || "Test Bajaj Checksheet via API")}
                  className="bg-blue-600 text-white font-bold px-3 py-1 rounded hover:bg-blue-700 text-xs"
                >
                  Send via API
                </button>
              </div>
            </div>
          </div>

          {testStatus && (
            <div className="font-bold text-emerald-800 bg-white p-2 rounded border border-emerald-300 text-center text-xs">
              {testStatus}
            </div>
          )}
        </div>
      )}

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

                  {/* 1-Click Send Button on each bubble */}
                  <div className="flex items-center gap-2 mt-1 mr-1">
                    <span className="text-[9px] text-slate-500 font-mono">
                      Recipient: {notif.recipient}
                    </span>
                    <button
                      onClick={() => handleSendDirect(notif.content, notif.recipient)}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1 transition-colors"
                      title="Send this message to your real WhatsApp"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                      <span>Send to My WhatsApp</span>
                    </button>
                  </div>
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
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between max-w-md">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-rose-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{latestEmail.pdfAttachmentName || 'Bajaj_Checksheets_Audit_Report.pdf'}</div>
                      <div className="text-[10px] text-slate-400">Official Monthly Matrix Grid • 142 KB</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const subs = getSubmissions();
                        const sub = subs[0] || {
                          id: 'SUB-202611-01',
                          date: new Date().toISOString().split('T')[0],
                          shift: 'M',
                          operator: { name: 'Rahul Shinde', empId: 'BJ-OP-4412' }
                        };
                        downloadSubmissionPdf(sub);
                      }}
                      className="flex items-center gap-1 text-white font-bold text-xs bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded shadow-2xs transition-colors"
                      title="Download real PDF file to your computer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={() => {
                        const subs = getSubmissions();
                        const sub = subs[0] || { id: 'SUB-202611-01', date: new Date().toISOString().split('T')[0], shift: 'M' };
                        downloadSubmissionPdf(sub);
                        handleSendDirect(waNotifs[0]?.content || "Bajaj Shift Checksheet PDF Attached", userPhone);
                      }}
                      className="flex items-center gap-1 text-emerald-800 font-bold text-xs bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1.5 rounded transition-colors"
                      title="Download PDF & Open WhatsApp to attach"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Attach to WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
