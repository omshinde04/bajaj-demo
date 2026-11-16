import { SEED_PLANT, SEED_USERS, SEED_CHECKSHEETS } from '../data/seedData';

const KEYS = {
  USERS: 'bajaj_users',
  CURRENT_USER: 'bajaj_current_user',
  CHECKSHEETS: 'bajaj_checksheets',
  DRAFTS: 'bajaj_drafts', // { [sheetId_date_shift]: { entries: {}, metadata: {}, updatedAt: ... } }
  SUBMISSIONS: 'bajaj_submissions', // Array of submitted batches/sheets
  NOTIFICATIONS: 'bajaj_notifications', // Array of simulated WhatsApp & Email logs
  DEFECTS: 'bajaj_defects' // Defect action items logged from Not OK (X)
};

// Initializer
export const initStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(KEYS.CHECKSHEETS)) {
    localStorage.setItem(KEYS.CHECKSHEETS, JSON.stringify(SEED_CHECKSHEETS));
  }
  if (!localStorage.getItem(KEYS.DRAFTS)) {
    localStorage.setItem(KEYS.DRAFTS, JSON.stringify({}));
  }
  if (!localStorage.getItem(KEYS.SUBMISSIONS)) {
    // Seed one previous submission for nice history
    const sampleSubmissions = [
      {
        id: "SUB-20261115-01",
        date: "2026-11-15",
        shift: "M",
        operator: {
          name: "Rahul Shinde",
          empId: "BJ-OP-4412",
          email: "operator1@bajaj.com"
        },
        supervisor: {
          name: "Pravin Deshmukh",
          status: "VERIFIED",
          signedAt: "2026-11-15T13:45:00"
        },
        submittedAt: "2026-11-15T11:30:00",
        sheetsCount: 3,
        sheets: [
          { sheetId: "sheet_lpg_01", title: "Single Burner Range (LPG) - Station #1", status: "OK", defects: 0 },
          { sheetId: "sheet_bain_marie_01", title: "Hot Bain Marie 3 Section", status: "OK", defects: 0 },
          { sheetId: "sheet_chiller_01", title: "Cleaning Checklist for Walk In Chiller", status: "OK", defects: 0, tempRecorded: "3.2°C" }
        ],
        status: "APPROVED",
        whatsappStatus: "DELIVERED",
        emailStatus: "SENT"
      }
    ];
    localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(sampleSubmissions));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.DEFECTS)) {
    localStorage.setItem(KEYS.DEFECTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    // Default to Rahul Shinde (Operator) for easy instant demo
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[1]));
  }
};

// Reset demo data back to clean factory state
export const resetDemoData = () => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(KEYS.CHECKSHEETS, JSON.stringify(SEED_CHECKSHEETS));
  localStorage.setItem(KEYS.DRAFTS, JSON.stringify({}));
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.DEFECTS, JSON.stringify([]));
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[1]));
};

// User & Auth APIs
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : SEED_USERS[1];
  } catch {
    return SEED_USERS[1];
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || SEED_USERS;
  } catch {
    return SEED_USERS;
  }
};

export const saveUser = (user) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push({
      ...user,
      id: `usr_${Date.now()}`,
      active: true,
      avatar: user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    });
  }
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  return users;
};

// Checksheet Definitions
export const getChecksheets = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.CHECKSHEETS)) || SEED_CHECKSHEETS;
  } catch {
    return SEED_CHECKSHEETS;
  }
};

export const getChecksheetById = (id) => {
  const list = getChecksheets();
  return list.find(s => s.id === id);
};

// Drafts Management (Crucial for Auto-save & Resume!)
const getDraftKey = (sheetId, date, shift) => `${sheetId}_${date}_${shift}`;

export const getDraft = (sheetId, date, shift) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(KEYS.DRAFTS)) || {};
    return drafts[getDraftKey(sheetId, date, shift)] || null;
  } catch {
    return null;
  }
};

export const saveDraft = (sheetId, date, shift, entries, metadata = {}) => {
  const drafts = JSON.parse(localStorage.getItem(KEYS.DRAFTS)) || {};
  const key = getDraftKey(sheetId, date, shift);
  
  drafts[key] = {
    sheetId,
    date,
    shift,
    entries, // { [checkpointId]: { status: 'OK'|'NOT_OK'|'REPAIRED', value: any, remarks: '', defectDesc: '' } }
    metadata: {
      ...metadata,
      savedAt: new Date().toISOString()
    }
  };
  
  localStorage.setItem(KEYS.DRAFTS, JSON.stringify(drafts));
  return drafts[key];
};

export const getAllDrafts = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.DRAFTS)) || {};
  } catch {
    return {};
  }
};

// Progress Calculator for a sheet
export const getSheetProgress = (sheetId, date, shift) => {
  const sheet = getChecksheetById(sheetId);
  if (!sheet) return { completed: 0, total: 0, percent: 0, status: 'NOT_STARTED', defectsCount: 0 };
  
  const draft = getDraft(sheetId, date, shift);
  const total = sheet.checkpoints.length;
  
  if (!draft || !draft.entries) {
    return { completed: 0, total, percent: 0, status: 'NOT_STARTED', defectsCount: 0 };
  }
  
  let completed = 0;
  let defectsCount = 0;
  
  sheet.checkpoints.forEach(cp => {
    const entry = draft.entries[cp.id];
    if (entry) {
      if (entry.status === 'OK' || entry.status === 'REPAIRED') {
        completed++;
      } else if (entry.status === 'NOT_OK') {
        completed++;
        defectsCount++;
      } else if (entry.value !== undefined && entry.value !== '') {
        completed++;
      }
    }
  });

  const percent = Math.round((completed / total) * 100);
  let status = 'IN_PROGRESS';
  if (completed === 0) status = 'NOT_STARTED';
  else if (completed === total) status = 'READY_TO_SUBMIT';

  return { completed, total, percent, status, defectsCount };
};

// Batch Submission
export const submitBatchSheets = ({ sheetIds, date, shift, operator, supervisorPhone, supervisorEmail, signatureDataUrl, remarks }) => {
  const drafts = getAllDrafts();
  const allSheets = getChecksheets();
  
  const submissionId = `SUB-${Date.now().toString().slice(-6)}`;
  const submittedSheetsData = [];
  let totalDefects = 0;

  sheetIds.forEach(id => {
    const sheet = allSheets.find(s => s.id === id);
    const draft = drafts[getDraftKey(id, date, shift)] || { entries: {} };
    
    // Count defects
    let sheetDefects = 0;
    let tempRecorded = null;
    
    sheet.checkpoints.forEach(cp => {
      const entry = draft.entries[cp.id];
      if (entry?.status === 'NOT_OK') {
        sheetDefects++;
        totalDefects++;
        // Log to defects table
        logDefect({
          sheetId: id,
          sheetTitle: sheet.title,
          checkpointTitle: cp.title,
          description: entry.defectDesc || 'Reported non-conformance during shift check',
          severity: cp.critical ? 'CRITICAL' : 'MEDIUM',
          loggedBy: operator.name,
          date,
          shift
        });
      }
      if (cp.type === 'NUMERIC' && entry?.value) {
        tempRecorded = `${entry.value}${cp.unit || ''}`;
      }
    });

    submittedSheetsData.push({
      sheetId: id,
      title: sheet.title,
      code: sheet.code,
      documentNo: sheet.documentNo,
      category: sheet.category,
      entries: draft.entries,
      defects: sheetDefects,
      tempRecorded,
      status: sheetDefects > 0 ? 'DEFECTS_REPORTED' : 'ALL_OK'
    });
  });

  const submission = {
    id: submissionId,
    date,
    shift,
    operator: {
      id: operator.id,
      name: operator.name,
      empId: operator.empId,
      department: operator.department,
      phone: operator.phone
    },
    supervisor: {
      phone: supervisorPhone || "+91 98810 55667",
      email: supervisorEmail || "supervisor@bajaj.com",
      status: "PENDING_VERIFICATION"
    },
    sheetsCount: sheetIds.length,
    sheets: submittedSheetsData,
    totalDefects,
    submittedAt: new Date().toISOString(),
    signatureDataUrl,
    remarks: remarks || "Shift checks verified and submitted by operator.",
    status: "SUBMITTED",
    whatsappStatus: "DELIVERED",
    emailStatus: "SENT"
  };

  // Save to submissions
  const existingSubmissions = getSubmissions();
  existingSubmissions.unshift(submission);
  localStorage.setItem(KEYS.SUBMISSIONS, JSON.stringify(existingSubmissions));

  // Trigger Notifications (WhatsApp & Email Logs)
  triggerNotifications(submission);

  return submission;
};

export const getSubmissions = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SUBMISSIONS)) || [];
  } catch {
    return [];
  }
};

// Defect Management
export const logDefect = (defect) => {
  const defects = getDefects();
  defects.unshift({
    id: `DEF-${Date.now().toString().slice(-5)}`,
    ...defect,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(KEYS.DEFECTS, JSON.stringify(defects));
};

export const getDefects = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.DEFECTS)) || [];
  } catch {
    return [];
  }
};

// Notification Dispatch Engine (Simulated WhatsApp & Email)
export const getNotifications = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
  } catch {
    return [];
  }
};

const triggerNotifications = (submission) => {
  const notifications = getNotifications();
  const timeStr = new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. WhatsApp Payload to Supervisor
  const waMessage = submission.totalDefects > 0
    ? `⚠️ *URGENT - BAJAJ CHAKAN 2*\nDefects logged during shift check by *${submission.operator.name}* (${submission.shift} Shift).\n\n📄 *Sheets Submitted:* ${submission.sheetsCount}\n🚨 *Defects Found:* ${submission.totalDefects}\n\n*Summary:*\n${submission.sheets.map(s => `• ${s.title}: ${s.status}`).join('\n')}\n\n👉 *Review & Sign:* https://bajaj-portal.internal/audit/${submission.id}`
    : `✅ *BAJAJ CHAKAN 2 - Shift Checksheet Submitted*\nOperator: *${submission.operator.name}* (ID: ${submission.operator.empId})\nShift: *${submission.shift}* | Time: *${timeStr}*\n\n📄 *Sheets Completed (${submission.sheetsCount}):*\n${submission.sheets.map(s => `✓ ${s.title} ${s.tempRecorded ? `(Temp: ${s.tempRecorded})` : ''}`).join('\n')}\n\n👉 *One-Click Sign-off:* https://bajaj-portal.internal/audit/${submission.id}`;

  const waNotification = {
    id: `NOTIF-WA-${Date.now()}`,
    type: 'WHATSAPP',
    recipient: submission.supervisor.phone,
    recipientName: "Unit Manager (Pravin Deshmukh)",
    title: submission.totalDefects > 0 ? "⚠️ Critical Defect WhatsApp Alert" : "📋 Shift Checksheet WhatsApp Alert",
    content: waMessage,
    status: 'DELIVERED',
    timestamp: new Date().toISOString(),
    submissionId: submission.id
  };

  // 2. Email PDF Dispatch Payload
  const emailNotification = {
    id: `NOTIF-EM-${Date.now() + 1}`,
    type: 'EMAIL',
    recipient: submission.supervisor.email,
    recipientName: "Pravin Deshmukh (Compliance Head)",
    title: `[BAJAJ CHAKAN] Shift Compliance Checksheet Batch #${submission.id} - ${submission.sheetsCount} Sheets`,
    content: `Shift compliance checks for ${submission.date} (Shift: ${submission.shift}) have been completed and digitally signed by operator ${submission.operator.name}. All ${submission.sheetsCount} attached checksheets are ready for review.`,
    status: 'SENT',
    timestamp: new Date().toISOString(),
    submissionId: submission.id,
    pdfAttachmentName: `Bajaj_Checksheets_${submission.date}_Shift_${submission.shift}.pdf`
  };

  notifications.unshift(waNotification, emailNotification);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};
