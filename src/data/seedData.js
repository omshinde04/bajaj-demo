export const SEED_PLANT = {
  id: "PLANT-CHAKAN-02",
  code: "BAJAJ CHAKAN 2",
  name: "Bajaj Auto Ltd. - Chakan Plant 2 (Food & Facility Operations)",
  division: "Total Productive Maintenance & Food Safety",
  unitManager: "Pravin Deshmukh",
  complianceLead: "Sanjay Joshi"
};

export const SEED_USERS = [
  {
    id: "usr_admin",
    name: "Sunil Kulkarni",
    email: "admin@bajaj.com",
    role: "Admin",
    roleBadge: "Plant Admin",
    empId: "BJ-ADM-104",
    phone: "+91 98220 11223",
    department: "Plant Management & Operations",
    avatar: "SK",
    active: true
  },
  {
    id: "usr_operator_1",
    name: "Rahul Shinde",
    email: "operator1@bajaj.com",
    role: "Operator",
    roleBadge: "Shift Technician",
    empId: "BJ-OP-4412",
    phone: "+91 98501 33445",
    shift: "M", // Morning
    department: "Kitchen & Facility Operations",
    avatar: "RS",
    assignedSheets: [
      "sheet_lpg_01",
      "sheet_bain_marie_01",
      "sheet_chiller_01",
      "sheet_garbage_01",
      "sheet_lpg_02",
      "sheet_freezer_01"
    ],
    active: true
  },
  {
    id: "usr_operator_2",
    name: "Amit Verma",
    email: "operator2@bajaj.com",
    role: "Operator",
    roleBadge: "Maintenance Tech",
    empId: "BJ-OP-4415",
    phone: "+91 97632 88990",
    shift: "M",
    department: "Preventive Maintenance (TPM)",
    avatar: "AV",
    assignedSheets: [
      "sheet_lpg_01",
      "sheet_bain_marie_01",
      "sheet_blower_01",
      "sheet_dishwasher_01"
    ],
    active: true
  },
  {
    id: "usr_supervisor",
    name: "Pravin Deshmukh",
    email: "supervisor@bajaj.com",
    role: "Supervisor",
    roleBadge: "Unit Manager / Compliance",
    empId: "BJ-SUP-082",
    phone: "+91 98810 55667",
    department: "Quality & Safety Compliance",
    avatar: "PD",
    active: true
  }
];

export const SEED_CHECKSHEETS = [
  {
    id: "sheet_lpg_01",
    code: "EQ-LPG-01",
    documentNo: "BJ/KTC/CLITR/01",
    title: "Single Burner Range (LPG) - Station #1",
    equipmentName: "Single Burner Range (LPG)",
    category: "EQUIPMENT_PM",
    categoryLabel: "Equipment PM (CLITR)",
    location: "Main Production Kitchen - Range Station 1",
    frequency: "DAILY",
    frequencyLabel: "Daily Maintenance",
    framework: "CLITR",
    responsibility: "Kitchen Maintenance / Tech",
    legend: {
      C: "Cleaning",
      L: "Lubrication",
      I: "Inspection",
      T: "Tightness",
      R: "Repair"
    },
    notationRules: {
      ok: "✓ (OK)",
      notOk: "X (Not OK / Defect)",
      repaired: "• (OK After Repair)"
    },
    checkpoints: [
      {
        id: "lpg_cp_1",
        seq: 1,
        type: "C",
        title: "Range top, drip tray & body",
        standardCondition: "Clean, no food residue or oil & dirt",
        critical: false
      },
      {
        id: "lpg_cp_2",
        seq: 2,
        type: "C",
        title: "Burner head & parts",
        standardCondition: "Clean, parts not clogged",
        critical: false
      },
      {
        id: "lpg_cp_3",
        seq: 3,
        type: "I",
        title: "Burner flame",
        standardCondition: "Blue, steady, uniform; no yellow / long flame",
        critical: true
      },
      {
        id: "lpg_cp_4",
        seq: 4,
        type: "I",
        title: "Control knob",
        standardCondition: "Turns smoothly, clicks off fully, not loose",
        critical: false
      },
      {
        id: "lpg_cp_5",
        seq: 5,
        type: "I",
        title: "Ignition / spark",
        standardCondition: "Lights in 1-2 attempts",
        critical: false
      },
      {
        id: "lpg_cp_6",
        seq: 6,
        type: "I",
        title: "Gas hose & clamps",
        standardCondition: "No cracks / aging, clamps tight, hose within expiry",
        critical: true
      },
      {
        id: "lpg_cp_7",
        seq: 7,
        type: "I",
        title: "Regulator & cylinder / line valve",
        standardCondition: "Fitted tight, no hissing, valve closed after use",
        critical: true
      },
      {
        id: "lpg_cp_8",
        seq: 8,
        type: "I",
        title: "LPG leak check at joints",
        standardCondition: "No bubbles with soap solution; no gas smell",
        critical: true
      },
      {
        id: "lpg_cp_9",
        seq: 9,
        type: "I",
        title: "Pan support / grate",
        standardCondition: "Stable, not bent or loose",
        critical: false
      },
      {
        id: "lpg_cp_10",
        seq: 10,
        type: "C",
        title: "Exhaust hood & grease filter",
        standardCondition: "Clean, no oil accumulation (filter washed weekly)",
        critical: false
      },
      {
        id: "lpg_cp_11",
        seq: 11,
        type: "I",
        title: "Surroundings & fire safety",
        standardCondition: "No combustibles nearby; fire extinguisher accessible & in date",
        critical: true
      },
      {
        id: "lpg_cp_12",
        seq: 12,
        type: "T",
        title: "Stand / legs",
        standardCondition: "Level, fasteners tight",
        critical: false
      }
    ]
  },
  {
    id: "sheet_bain_marie_01",
    code: "EQ-BM-01",
    documentNo: "BJ/KTC/CLITR/04",
    title: "Hot Bain Marie 3 Section (Electric) - Line 1",
    equipmentName: "Hot Bain Marie (3 Section Electric)",
    category: "EQUIPMENT_PM",
    categoryLabel: "Equipment PM (CLITR)",
    location: "Main Food Serving Line A",
    frequency: "DAILY",
    frequencyLabel: "Daily Maintenance",
    framework: "CLITR",
    responsibility: "Kitchen Electrician / Tech",
    checkpoints: [
      {
        id: "bm_cp_1",
        seq: 1,
        type: "C",
        title: "Pan interior & lid",
        standardCondition: "Clean, no limescale, food debris or marks",
        critical: false
      },
      {
        id: "bm_cp_2",
        seq: 2,
        type: "L",
        title: "Tilting mechanism / handle & gear box",
        standardCondition: "Smooth operation, lubricated, no jerk",
        critical: false
      },
      {
        id: "bm_cp_3",
        seq: 3,
        type: "I",
        title: "Heating element",
        standardCondition: "No damage, heating evenly",
        critical: true
      },
      {
        id: "bm_cp_4",
        seq: 4,
        type: "I",
        title: "Temperature controller / thermostat",
        standardCondition: "Working, display / knob normal",
        critical: true
      },
      {
        id: "bm_cp_5",
        seq: 5,
        type: "C",
        title: "Control panel & indicator lamps",
        standardCondition: "Clean, indicator lamps glowing, no alarms",
        critical: false
      },
      {
        id: "bm_cp_6",
        seq: 6,
        type: "I",
        title: "Isolator / MCB / switch",
        standardCondition: "Working, no sparking or overheating",
        critical: true
      },
      {
        id: "bm_cp_7",
        seq: 7,
        type: "T",
        title: "Terminal connections",
        standardCondition: "Tight, no loose connections / heat marked wires",
        critical: true
      },
      {
        id: "bm_cp_8",
        seq: 8,
        type: "I",
        title: "Power cable & gland",
        standardCondition: "No damage, gland sealed",
        critical: true
      },
      {
        id: "bm_cp_9",
        seq: 9,
        type: "I",
        title: "Earthing",
        standardCondition: "Earth wire connected & continuous",
        critical: true
      },
      {
        id: "bm_cp_10",
        seq: 10,
        type: "I",
        title: "ELCB / RCCB test (weekly)",
        standardCondition: "Trips on test button",
        critical: true
      },
      {
        id: "bm_cp_11",
        seq: 11,
        type: "I",
        title: "Water / steam ingress to panel",
        standardCondition: "Panel dry, door seal tight",
        critical: true
      },
      {
        id: "bm_cp_12",
        seq: 12,
        type: "C",
        title: "Body, stand & fasteners",
        standardCondition: "Clean, bolts tight",
        critical: false
      }
    ]
  },
  {
    id: "sheet_chiller_01",
    code: "FAC-CHILL-01",
    documentNo: "BJ/HYG/CHK/07",
    title: "Cleaning Checklist for Walk In Chiller",
    equipmentName: "Walk In Cold Storage Chiller #1",
    category: "FACILITY_HYGIENE",
    categoryLabel: "Sanitation & Cold Chain (HACCP)",
    location: "Raw Material Storage - Chakan 2",
    frequency: "SHIFT_4X",
    frequencyLabel: "Shift-Wise (M / A / E / N)",
    responsibility: "Housekeeping & Store Incharge",
    sopNote: "Note: Also check for the date tagging on the packets and the FIFO system during the regular cleaning sessions.",
    checkpoints: [
      {
        id: "ch_cp_1",
        seq: 1,
        title: "Door & Handles Cleaned",
        type: "BOOLEAN",
        description: "Sanitized and wiped free of dirt/grease"
      },
      {
        id: "ch_cp_2",
        seq: 2,
        title: "Gaskets Cleaned",
        type: "BOOLEAN",
        description: "Rubber door seal intact and free of mold/buildup"
      },
      {
        id: "ch_cp_3",
        seq: 3,
        title: "Racks Cleaned",
        type: "BOOLEAN",
        description: "Stainless steel shelving washed & sanitized"
      },
      {
        id: "ch_cp_4",
        seq: 4,
        title: "Walls, ceiling, floor cleaned",
        type: "BOOLEAN",
        description: "Scrubbed with food-grade disinfectant"
      },
      {
        id: "ch_cp_5",
        seq: 5,
        title: "CHILLER defrosted",
        type: "BOOLEAN",
        description: "No excessive frost buildup on cooling coils"
      },
      {
        id: "ch_cp_6",
        seq: 6,
        title: "Temp (°C) Recorded",
        type: "NUMERIC",
        unit: "°C",
        minLimit: 1.0,
        maxLimit: 4.0,
        warningThreshold: 4.5,
        description: "Critical Control Point (Safe operating zone: 1.0°C to 4.0°C)"
      },
      {
        id: "ch_cp_7",
        seq: 7,
        title: "FIFO & Date Tagging Checked",
        type: "BOOLEAN",
        description: "All ingredient crates tagged with date & oldest used first"
      }
    ]
  },
  {
    id: "sheet_garbage_01",
    code: "FAC-GARB-01",
    documentNo: "BJ/HYG/CHK/12",
    title: "Cleaning Checksheet for Garbage Store",
    equipmentName: "Plant Waste & Organic Garbage Station",
    category: "FACILITY_HYGIENE",
    categoryLabel: "Sanitation & Waste Control",
    location: "Facility Waste Yard - Bay 3",
    frequency: "SHIFT_4X",
    frequencyLabel: "Shift-Wise (M / A / E / N)",
    responsibility: "Waste Management / Housekeeping",
    sopNote: "Pest control barrier active, odor suppression spray applied, bins color-coded.",
    checkpoints: [
      {
        id: "gb_cp_1",
        seq: 1,
        title: "Floors and Walls are clean",
        type: "BOOLEAN",
        description: "Washed with jet spray, no waste residue"
      },
      {
        id: "gb_cp_2",
        seq: 2,
        title: "Temperature is recorded",
        type: "NUMERIC",
        unit: "°C",
        minLimit: 15.0,
        maxLimit: 25.0,
        description: "Climate-controlled waste sorting zone"
      },
      {
        id: "gb_cp_3",
        seq: 3,
        title: "All the area is sanitized",
        type: "BOOLEAN",
        description: "Chemical spraying & pest prevention done"
      },
      {
        id: "gb_cp_4",
        seq: 4,
        title: "Doors and Door Handle Clean",
        type: "BOOLEAN",
        description: "Disinfected and dirt-free"
      },
      {
        id: "gb_cp_5",
        seq: 5,
        title: "Doors and Door Handle Sanitize",
        type: "BOOLEAN",
        description: "Sanitizer contact time maintained"
      },
      {
        id: "gb_cp_6",
        seq: 6,
        title: "Garbage cleared in time",
        type: "BOOLEAN",
        description: "Cleared before shift handover, zero overflowing bins"
      }
    ]
  },
  // Additional sheets to give users full 5+ sheet selection in demo:
  {
    id: "sheet_lpg_02",
    code: "EQ-LPG-02",
    documentNo: "BJ/KTC/CLITR/02",
    title: "Single Burner Range (LPG) - Station #2",
    equipmentName: "Single Burner Range (LPG) Unit 2",
    category: "EQUIPMENT_PM",
    categoryLabel: "Equipment PM (CLITR)",
    location: "Main Production Kitchen - Range Station 2",
    frequency: "DAILY",
    frequencyLabel: "Daily Maintenance",
    framework: "CLITR",
    responsibility: "Kitchen Maintenance / Tech",
    checkpoints: [
      {
        id: "lpg2_cp_1",
        seq: 1,
        type: "C",
        title: "Range top, drip tray & body",
        standardCondition: "Clean, no food residue or oil & dirt",
        critical: false
      },
      {
        id: "lpg2_cp_2",
        seq: 2,
        type: "C",
        title: "Burner head & parts",
        standardCondition: "Clean, parts not clogged",
        critical: false
      },
      {
        id: "lpg2_cp_3",
        seq: 3,
        type: "I",
        title: "Burner flame",
        standardCondition: "Blue, steady, uniform; no yellow / long flame",
        critical: true
      },
      {
        id: "lpg2_cp_4",
        seq: 4,
        type: "I",
        title: "Control knob & safety cut-off",
        standardCondition: "Turns smoothly, clicks off fully",
        critical: false
      },
      {
        id: "lpg2_cp_5",
        seq: 5,
        type: "I",
        title: "LPG leak check at joints",
        standardCondition: "No bubbles with soap solution; no gas smell",
        critical: true
      }
    ]
  },
  {
    id: "sheet_freezer_01",
    code: "FAC-FRZ-01",
    documentNo: "BJ/HYG/CHK/09",
    title: "Deep Freezer (-18°C Meat & Dairy Storage)",
    equipmentName: "Commercial Deep Freezer 500L",
    category: "FACILITY_HYGIENE",
    categoryLabel: "Sanitation & Cold Chain (HACCP)",
    location: "Cold Room Section B",
    frequency: "SHIFT_4X",
    frequencyLabel: "Shift-Wise (M / A / E / N)",
    responsibility: "Cold Storage Supervisor",
    sopNote: "Critical storage limits: -18°C to -22°C. Record defrost cycles.",
    checkpoints: [
      {
        id: "frz_cp_1",
        seq: 1,
        title: "Freezer Body & Handle Cleaned",
        type: "BOOLEAN",
        description: "No grease, frost or food debris"
      },
      {
        id: "frz_cp_2",
        seq: 2,
        title: "Door Magnetic Gasket Seal Intact",
        type: "BOOLEAN",
        description: "Zero air leakage"
      },
      {
        id: "frz_cp_3",
        seq: 3,
        title: "Freezer Internal Temp (°C)",
        type: "NUMERIC",
        unit: "°C",
        minLimit: -22.0,
        maxLimit: -17.0,
        warningThreshold: -15.0,
        description: "Safe frozen range (-18°C target)"
      },
      {
        id: "frz_cp_4",
        seq: 4,
        title: "Stock Segregation & Date Labeling",
        type: "BOOLEAN",
        description: "Meat / Dairy separated, expiration labels intact"
      }
    ]
  }
];
