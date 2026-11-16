const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable').default || require('jspdf-autotable');
const fs = require('fs');
const path = require('path');

const doc = new jsPDF('p', 'mm', 'a4');
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();

const primaryNavy = [0, 37, 71];      // #002547
const royalBlue = [11, 79, 138];     // #0B4F8A
const slateDark = [15, 23, 42];      // #0F172A
const textGray = [71, 85, 105];      // #475569
const borderGray = [226, 232, 240];  // #E2E8F0
const emeraldGreen = [5, 150, 105];  // #059669
const crimsonRed = [220, 38, 38];    // #DC2626

function addPageHeader(doc, title, subtitle) {
  doc.setFillColor(...primaryNavy);
  doc.rect(0, 0, pageWidth, 24, 'F');

  // BAJAJ Logo Block
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, 5, 24, 11, 1.5, 1.5, 'F');
  doc.setTextColor(...primaryNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('BAJAJ', 16.5, 13);

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 44, 11);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 215, 240);
  doc.text(subtitle, 44, 16.5);
}

function addPageFooter(doc, pageNum, totalPages) {
  doc.setDrawColor(...borderGray);
  doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.setFont('helvetica', 'normal');
  doc.text('Bajaj Auto Ltd. • Facility TPM & HACCP Digital System • Chakan Plant 2', 14, pageHeight - 7);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
}

// ==========================================
// PAGE 1: COVER & EXECUTIVE OVERVIEW
// ==========================================
doc.setFillColor(...primaryNavy);
doc.rect(0, 0, pageWidth, 50, 'F');

// Bajaj Big Logo Box
doc.setFillColor(255, 255, 255);
doc.roundedRect(14, 12, 34, 16, 2, 2, 'F');
doc.setTextColor(...primaryNavy);
doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text('BAJAJ', 18, 23.5);

doc.setTextColor(255, 255, 255);
doc.setFontSize(15);
doc.setFont('helvetica', 'bold');
doc.text('DIGITAL CHECKSHEETS & AUDIT SYSTEM', 54, 21);

doc.setFontSize(9.5);
doc.setFont('helvetica', 'normal');
doc.setTextColor(190, 215, 240);
doc.text('Total Productive Maintenance (TPM) & Food Safety (HACCP) Operations', 54, 28);
doc.text('Target Facility: Bajaj Auto Ltd. — Chakan Plant 2', 54, 34);

// Live System Access Banner
doc.setFillColor(240, 249, 255);
doc.setDrawColor(186, 230, 253);
doc.roundedRect(14, 56, pageWidth - 28, 18, 2, 2, 'FD');

doc.setTextColor(3, 105, 161);
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.5);
doc.text('LIVE CLOUD APPLICATION URL:', 19, 63);

doc.setTextColor(2, 132, 199);
doc.setFontSize(10);
doc.setFont('helvetica', 'bold');
doc.text('https://bajaj-demo-rouge.vercel.app/', 19, 70);

doc.setTextColor(100, 116, 139);
doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.text('Optimized for Desktop, Laptop, and Shop-Floor Tablets • Instant Zero-Install Access', pageWidth - 19, 67, { align: 'right' });

// Section: Executive Summary
doc.setTextColor(...slateDark);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('1. EXECUTIVE SUMMARY & PURPOSE', 14, 82);

doc.setFontSize(8.5);
doc.setFont('helvetica', 'normal');
doc.setTextColor(...textGray);
const summaryText = 
  "This digital platform transitions Bajaj Chakan Plant 2 from traditional paper binder checksheets to a real-time, audit-ready operational desktop system. It eliminates backdated entries, prevents unaddressed equipment defects, enforces cold-chain temperature thresholds, and automates shift compliance reporting directly to management via WhatsApp and Email with official 1-click PDF audit attachments.";
doc.text(doc.splitTextToSize(summaryText, pageWidth - 28), 14, 88);

// Comparison Table: Physical Paper vs Digital System
autoTable(doc, {
  startY: 104,
  head: [['OPERATIONAL DIMENSION', 'PHYSICAL PAPER METHOD', 'BAJAJ DIGITAL PORTAL SOLUTION']],
  body: [
    [
      'Data Integrity & Auto-Save',
      'Vulnerable to ink smudges, torn sheets, and lost data midway through shift.',
      'Continuous silent auto-save to local storage. Work is never lost; resume anytime.'
    ],
    [
      'Defect Management (X)',
      'Defects marked "X" on paper often get buried in filing binders without action.',
      'Marking "X" immediately creates an active ticket in the Plant Defect Log in real-time.'
    ],
    [
      'Shift Reporting & Dispatch',
      'Requires waiting for physical binder collection at end of month.',
      'Selective Batch Dispatch: Send completed sheets (e.g. 5 sheets) anytime to WhatsApp & Email.'
    ],
    [
      'Critical Telemetry (HACCP)',
      'Temperature drift in chillers goes unnoticed until spoilage occurs.',
      'Instant out-of-spec visual warnings if chiller temperature exceeds safe 4.0°C limits.'
    ],
    [
      'ISO / TPM Audit Readiness',
      'Hours spent digging through physical paper binders before an audit.',
      '1-Click PDF generation and exact 31-day paper matrix grid replica.'
    ]
  ],
  theme: 'grid',
  headStyles: { fillColor: primaryNavy, textColor: 255, fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: slateDark },
  columnStyles: {
    0: { cellWidth: 42, fontStyle: 'bold' },
    1: { cellWidth: 68 },
    2: { cellWidth: 'auto', fontStyle: 'bold', textColor: [15, 23, 42] }
  },
  margin: { left: 14, right: 14 }
});

addPageFooter(doc, 1, 3);

// ==========================================
// PAGE 2: USER ROLES & CORE WORKFLOWS
// ==========================================
doc.addPage();
addPageHeader(doc, 'USER ROLES & OPERATIONAL WORKFLOWS', 'Step-by-step guidance for plant personnel');

// Section 2: User Roles
doc.setTextColor(...slateDark);
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.text('2. USER ROLES & ACCESS CONTROL', 14, 32);

autoTable(doc, {
  startY: 36,
  head: [['ROLE', 'SAMPLE USER', 'RESPONSIBILITY & ACCESS LEVEL']],
  body: [
    [
      'Plant Operator / Tech',
      'Rahul Shinde\n(BJ-OP-4412)',
      'Inspects assigned daily equipment PM (CLITR) and shift hygiene checksheets. Auto-saves drafts, flags defects with notes, and selectively submits completed batches.'
    ],
    [
      'Preventive Tech',
      'Amit Verma\n(BJ-OP-4415)',
      'Performs specialized electrical and mechanical safety checks on Hot Bain Marie, exhaust blowers, and dishwashing lines.'
    ],
    [
      'Unit Compliance Manager',
      'Pravin Deshmukh\n(BJ-SUP-082)',
      'Receives automated WhatsApp & Email summaries. Reviews submitted audits, executes supervisory countersigns, and prints monthly ISO grids.'
    ],
    [
      'Plant Administrator',
      'Sunil Kulkarni\n(BJ-ADM-104)',
      'Provisions staff logins, assigns shift duty schedules (M, A, E, N), and allocates specific equipment checksheets across plant zones.'
    ]
  ],
  theme: 'striped',
  headStyles: { fillColor: royalBlue, textColor: 255, fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: slateDark },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold' },
    1: { cellWidth: 32, fontStyle: 'bold' },
    2: { cellWidth: 'auto' }
  },
  margin: { left: 14, right: 14 }
});

// Section 3: The 4 Core Checksheets
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...slateDark);
doc.text('3. DIGITIZED PLANT CHECKSHEETS (FROM PHYSICAL SCANS)', 14, 94);

autoTable(doc, {
  startY: 98,
  head: [['CHECKSHEET NAME', 'FRAMEWORK', 'FREQUENCY', 'KEY PARAMETERS & STANDARDS']],
  body: [
    [
      'Single Burner Range (LPG)',
      'TPM (CLITR)',
      'Daily (M/A/E/N)',
      '12 points: Range top, Burner flame (blue steady), Gas hose & clamps, Regulator tight, LPG soap leak test, Fire extinguisher in date.'
    ],
    [
      'Hot Bain Marie (3 Section Electric)',
      'TPM (CLITR)',
      'Daily (M/A/E/N)',
      '12 points: Pan interior clean, Tilting gear box lubricated, Heating element even, Isolator/MCB no sparking, Earthing wire, Panel dry.'
    ],
    [
      'Walk-In Chiller Storage',
      'HACCP Food Safety',
      'Shift-Wise (4x)',
      'Door & handles sanitized, Gaskets mold-free, Chiller defrosted, Critical Temp (°C) [Target: 1.0°C - 4.0°C], FIFO & Date tagging.'
    ],
    [
      'Garbage Store Station',
      'Sanitation & Waste',
      'Shift-Wise (4x)',
      'Floors & walls jet-washed, Waste sorting temperature, Disinfection spray active, Timely waste clearance to prevent odors/pests.'
    ]
  ],
  theme: 'grid',
  headStyles: { fillColor: primaryNavy, textColor: 255, fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: slateDark },
  columnStyles: {
    0: { cellWidth: 50, fontStyle: 'bold' },
    1: { cellWidth: 28, fontStyle: 'bold' },
    2: { cellWidth: 26 },
    3: { cellWidth: 'auto' }
  },
  margin: { left: 14, right: 14 }
});

// Section 4: Auto-Save & Selective Batch Dispatch
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...slateDark);
doc.text('4. AUTO-SAVE DRAFTS & SELECTIVE BATCH DISPATCH', 14, 160);

doc.setFontSize(8);
doc.setFont('helvetica', 'normal');
doc.setTextColor(...textGray);

const p2Desc = 
  "• Continuous Auto-Save: Every checkmark (OK/Not OK) and temperature entry is silently saved to local memory within 200 milliseconds. If the operator steps away for lunch or battery dies, reopening shows 'Draft (6/12 items filled)' with 1-click resume.\n" +
  "• Selective Dispatch (Send 5+ Sheets): Technicians never have to wait for all plant sheets to finish. Completed sheets can be selected via checkboxes and dispatched together in one batch.\n" +
  "• Staged Submission: The final submit button only appears in Stage 2 (Sign-off & Verification) alongside the digital signature pad, preventing premature sheet locking.";

doc.text(doc.splitTextToSize(p2Desc, pageWidth - 28), 14, 166);

addPageFooter(doc, 2, 3);

// ==========================================
// PAGE 3: DEMO WALKTHROUGH & NOTIFICATIONS
// ==========================================
doc.addPage();
addPageHeader(doc, 'SYSTEM DEMO WALKTHROUGH & DISPATCH ENGINE', 'How to test and present to Bajaj stakeholders');

doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...slateDark);
doc.text('5. 5-MINUTE LIVE DEMONSTRATION SCRIPT', 14, 32);

autoTable(doc, {
  startY: 36,
  head: [['STEP', 'ACTION TO PERFORM', 'KEY BENEFIT TO HIGHLIGHT']],
  body: [
    [
      'Step 1',
      'Open https://bajaj-demo-rouge.vercel.app/ in browser.',
      'Show the clean desktop fixed-viewport layout: zero outer page scrolling, pinned left sidebar, and real-time plant telemetry.'
    ],
    [
      'Step 2',
      'Click "Inspect" on Single Burner Range (LPG). Check 3 items as "✓ OK".',
      'Point out the live bottom indicator: "✓ Draft auto-saved at HH:MM:SS". Explain that work is never lost even if browser is closed.'
    ],
    [
      'Step 3',
      'Mark checkpoint 6 (Gas hose & clamps) as "X Not OK". Type a defect note.',
      'Row highlights in red. Return to workstation $\rightarrow$ notice "Defect Log (X) [1]" in sidebar immediately updates with the ticket.'
    ],
    [
      'Step 4',
      'Open Walk-In Chiller. In Temp (°C) box, type "5.2".',
      'Demonstrate immediate visual warning: "Out of Spec! (Target: 1.0°C - 4.0°C)". Change to "3.2" to show return to normal.'
    ],
    [
      'Step 5',
      'Click "⚡ Auto-Verify 5 Sheets for Demo". Click "Dispatch Selected (5 Sheets)".',
      'Shows how 5 completed sheets can be submitted together without waiting for uninspected sheets. Final submit fires celebration confetti!'
    ],
    [
      'Step 6',
      'View WhatsApp & Email Logs screen.',
      'Show the authentic Bajaj Shift Bot WhatsApp message delivered to supervisor (+91 98810 55667) and the formal audit email.'
    ],
    [
      'Step 7',
      'Click "Download PDF" or "View Bajaj 31-Day Grid".',
      'Demonstrates 1-click real PDF download and the exact 31-day paper matrix format that ISO auditors require.'
    ]
  ],
  theme: 'striped',
  headStyles: { fillColor: primaryNavy, textColor: 255, fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.5, cellPadding: 2, textColor: slateDark },
  columnStyles: {
    0: { cellWidth: 16, fontStyle: 'bold' },
    1: { cellWidth: 70, fontStyle: 'bold' },
    2: { cellWidth: 'auto' }
  },
  margin: { left: 14, right: 14 }
});

// Section 6: Automated Dispatch & Real PDF Engine
doc.setFontSize(11);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...slateDark);
doc.text('6. MULTI-CHANNEL DISPATCH & PDF EXPORT SPECIFICATION', 14, 114);

autoTable(doc, {
  startY: 118,
  head: [['DISPATCH CHANNEL', 'TRIGGER & DESTINATION', 'PAYLOAD CONTENT & COMPLIANCE']],
  body: [
    [
      'WhatsApp Bot\n(Verified)',
      'Triggered upon Final Batch Submission.\nRecipient: +91 98810 55667\n(Unit Manager)',
      'Includes operator name, shift, timestamp, list of completed sheets, open defect alerts, and a direct 1-click mobile audit review link.'
    ],
    [
      'Auditor Email\n(SendGrid / SMTP)',
      'Triggered upon Final Batch Submission.\nRecipient: supervisor@bajaj.com',
      'Formal compliance package email with attached printable PDF report (142 KB) matching Bajaj official layout standards.'
    ],
    [
      '1-Click PDF Generator\n(jsPDF Engine)',
      'Available on any audit record or email attachment.',
      'Generates client-side PDF with company header, tabular checkpoint scores, Done By signature, and ISO compliance certificate hash.'
    ],
    [
      'Official 31-Day Grid\n(Physical Replica)',
      'Available via "View Bajaj 31-Day Grid" button.',
      'Displays the exact physical checksheet binder format with Days 1–31 columns, CLITR notations (✓, X, •), and sign-off blocks.'
    ]
  ],
  theme: 'grid',
  headStyles: { fillColor: royalBlue, textColor: 255, fontSize: 8, fontStyle: 'bold' },
  bodyStyles: { fontSize: 7.5, cellPadding: 2.5, textColor: slateDark },
  columnStyles: {
    0: { cellWidth: 38, fontStyle: 'bold' },
    1: { cellWidth: 52 },
    2: { cellWidth: 'auto' }
  },
  margin: { left: 14, right: 14 }
});

// Sign-off signature footer block
doc.setDrawColor(...borderGray);
doc.line(14, 182, pageWidth - 14, 182);

doc.setFontSize(8);
doc.setTextColor(...slateDark);
doc.setFont('helvetica', 'bold');
doc.text('DOCUMENT APPROVAL & RELEASE', 14, 188);

doc.setFontSize(7.5);
doc.setFont('helvetica', 'normal');
doc.setTextColor(...textGray);
doc.text('Prepared by: Lead Software Engineering Team • Bajaj Facilities Digitization Project', 14, 193);
doc.text('Production Deployment: https://bajaj-demo-rouge.vercel.app/ • Release Version: 1.2.0-PROD', 14, 198);

addPageFooter(doc, 3, 3);

// Write to PDF file
const outputPath = path.join(__dirname, '../Bajaj_Digital_Checksheets_Executive_Guide.pdf');
const pdfBytes = doc.output('arraybuffer');
fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

console.log('PDF generated successfully at:', outputPath);
