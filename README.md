# Bajaj Digital Checksheets Portal

> **Enterprise TPM & HACCP Digital Inspection System** tailored for **Bajaj Auto Ltd. (Chakan Plant 2)**.

Digitizes physical daily maintenance (CLITR) and shift-based facility sanitation checksheets into an offline-first, touch-friendly, corporate web portal with automated WhatsApp and Email dispatch.

---

## 🚀 Key Highlights & Solved Problems

1. **Role-Based Provisioning (Admin, Operator, Supervisor)**:
   - Admin creates staff logins, sets duty shifts (M / A / E / N), and assigns equipment sheets.
   - Quick Demo Switcher in the top bar allows seamless 1-click toggling between roles during presentations.

2. **Continuous Auto-Save & Draft Resume**:
   - Zero data loss: every checkmark, defect note, and temperature reading is automatically saved to LocalStorage.
   - If an operator leaves midway or battery dies, reopening shows draft completion status (`6/12 items checked`) with 1-click resume.

3. **Selective Batch Dispatch (Send 5+ Sheets)**:
   - Operators don't need to wait for all sheets to be finished.
   - They can select any subset (e.g. 5 completed sheets) and click **"Proceed with Selected (5 Sheets)"**.

4. **Staged Submission Flow**:
   - The **Final Submit button only appears in Stage 2 (Sign-Off & Verification)** to prevent premature locking.
   - Locks submitted sheets to prevent post-handover tampering.

5. **Simulated WhatsApp & Email Dispatches**:
   - **WhatsApp Alert**: Sends formatted business WhatsApp alert with shift summary, defect counts, and 1-click audit link to Supervisor (+91 98810 55667).
   - **Email Audit Report**: Renders official HTML email with printable PDF summary.

6. **Exact Bajaj Physical Monthly Grid Replica**:
   - Click **"View Official Bajaj Grid"** on any audit to view the exact 31-day paper matrix format with Days 1–31, CLITR notations (`✓`, `X`, `•`), and digital signature blocks matching plant binders.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite (Standard JavaScript)
- **Styling**: Tailwind CSS (Bajaj Corporate Blue & White theme `#002547`)
- **Icons**: Lucide React
- **Persistence**: 100% self-contained LocalStorage engine (Zero backend failure risk during client demos)
- **Interactivity**: canvas-confetti, canvas digital signature

---

## 📦 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📋 Included Checksheets (from Physical Scans)

1. **Single Burner Range (LPG)** — TPM Daily CLITR (12 points)
2. **Hot Bain Marie 3 Section (Electric)** — TPM Daily CLITR (12 points)
3. **Walk In Cold Storage Chiller #1** — HACCP Shift-Wise (M/A/E/N) with numerical Temperature (°C) logging & FIFO check
4. **Garbage Store Sanitation Station** — HACCP Shift-Wise (M/A/E/N) waste clearance
5. **Single Burner Range (LPG) - Unit 2** (Additional equipment for multi-sheet batch demo)
6. **Commercial Deep Freezer (-18°C)** (Additional equipment for multi-sheet batch demo)
