# Option 3: Direct SSA SFTP Integration — Implementation Guide

> For DrPaystub / Saurellius — Eusorone Technologies Inc.

## Overview

This guide covers how to register as an **electronic filer** with the Social Security Administration (SSA) and submit W-2s directly via their **SFTP** or **web upload** channels — bypassing the need for users to manually upload EFW2 files through the BSO portal.

---

## 1. Prerequisites

### 1.1 Register with SSA as a Submitter

1. **Create a BSO Account**: https://www.ssa.gov/bso/bsowelcome.htm
2. **Request a FIRE System User ID** (optional, for IRS FIRE — W-2s go to SSA, not IRS)
3. **Register for W-2 Online Filing**: Within BSO, navigate to **"Report Wages to SSA"** → **"Register to Use BSO"**
4. **Get a Submitter Identification Number (SBIN)** — assigned after registration
5. **Pass the Accreditation Test**: SSA requires you to submit a **test file** in EFW2 format before you're approved to file live data

### 1.2 Required Information

| Item | Description |
|------|-------------|
| **Company EIN** | Eusorone Technologies Inc. EIN |
| **Company Name** | As registered with IRS |
| **Responsible Individual** | Name, SSN, title of business owner/officer |
| **Contact Info** | Phone, email for SSA communications |
| **SBIN** | Assigned by SSA after registration |

---

## 2. Filing Methods

### 2.1 BSO Web Upload (Simplest)

- **URL**: https://www.ssa.gov/bso/bsowelcome.htm
- Upload EFW2 `.txt` files through the web interface
- **File size limit**: 2GB per file
- **Status**: Check filing status via BSO → "View File Status"
- **This is what our current Option 1 already supports** — user downloads the EFW2 file and uploads it themselves

### 2.2 SFTP Upload (Automated)

- **Host**: `eftps.ssa.gov` (confirm current host via SSA documentation)
- **Port**: 22
- **Authentication**: SSH key pair (generate and register with SSA)
- **Directory**: Upload to designated folder
- **File naming**: `W2REPORT_<EIN>_<YYYYMMDD>_<SEQ>.txt`

#### SFTP Setup Steps:

```bash
# 1. Generate SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/ssa_sftp_key -C "drpaystub-ssa-efile"

# 2. Register public key with SSA via BSO portal
# Navigate to: BSO → Electronic Wage Reporting → SFTP Setup

# 3. Test connection
sftp -i ~/.ssh/ssa_sftp_key <username>@eftps.ssa.gov
```

### 2.3 SSA's AccuWage Online Tool

Before submitting, validate files using SSA's free tool:
- **URL**: https://www.ssa.gov/employer/accuwage/
- Checks EFW2 format compliance
- Reports errors with line numbers and field positions
- **Recommended**: Run validation before every submission

---

## 3. EFW2 File Format Specification

Our backend already generates valid EFW2 files (see `routes/w2-wizard.js` → `buildEFW2()`).

### Record Types (all 512 bytes fixed-width):

| Record | Purpose | Count |
|--------|---------|-------|
| **RA** | Submitter identification | 1 per file |
| **RE** | Employer identification | 1 per employer |
| **RW** | Employee wage data (W-2 boxes) | 1 per employee |
| **RO** | Employee wage data overflow (Box 12 codes) | 0-1 per employee |
| **RS** | State wage data | 0-N per employee |
| **RT** | Employer totals | 1 per employer |
| **RU** | State totals | 0-N per employer |
| **RF** | Final record | 1 per file |

### Key Specifications:
- **Character encoding**: ASCII only
- **Line terminator**: CR+LF (`\r\n`)
- **Record length**: Exactly 512 bytes per record
- **Money fields**: Cents (no decimal point), right-justified, zero-filled
- **Text fields**: Left-justified, space-filled
- **Tax year**: Must match the year being reported

### Official SSA Specification Document:
- **Title**: "Specifications for Filing Forms W-2 Electronically (EFW2)"
- **Publication**: SSA Publication No. 31-011
- **URL**: https://www.ssa.gov/employer/EFW2&EFW2C.htm
- Updated annually — always use the current tax year version

---

## 4. Implementation Plan for Direct SFTP Filing

### Phase 1: Backend Service (2-3 days)

```
routes/
  w2-wizard.js          ← Already has buildEFW2()
  
services/
  ssa-efile.js           ← NEW: SFTP upload service

models/
  W2EFileSubmission.js   ← NEW: Track submission status
```

#### `services/ssa-efile.js` — Core Service

```javascript
const Client = require("ssh2-sftp-client");

class SSAEFileService {
  constructor() {
    this.sftp = new Client();
    this.config = {
      host: process.env.SSA_SFTP_HOST,        // eftps.ssa.gov
      port: parseInt(process.env.SSA_SFTP_PORT || "22"),
      username: process.env.SSA_SFTP_USERNAME, // Assigned by SSA
      privateKey: fs.readFileSync(process.env.SSA_SFTP_KEY_PATH),
    };
  }

  async submitFile(efw2Content, metadata) {
    const filename = `W2REPORT_${metadata.ein}_${Date.now()}.txt`;
    const remotePath = `/upload/${filename}`;

    try {
      await this.sftp.connect(this.config);
      await this.sftp.put(Buffer.from(efw2Content), remotePath);
      return { success: true, filename, remotePath };
    } finally {
      await this.sftp.end();
    }
  }
}
```

#### `models/W2EFileSubmission.js` — Track Submissions

```javascript
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  w2RecordId: { type: mongoose.Schema.Types.ObjectId, ref: "w2record" },
  status: {
    type: String,
    enum: ["pending", "submitted", "accepted", "rejected", "error"],
    default: "pending",
  },
  sbin: String,                    // Submitter ID
  filename: String,                // Remote filename
  submittedAt: Date,
  ssaResponse: String,             // Response from SSA
  errorDetails: String,
  taxYear: String,
  employerEIN: String,
  employeeSSN: String,             // Masked in responses
}, { timestamps: true });

module.exports = mongoose.model("W2EFileSubmission", schema);
```

### Phase 2: API Endpoint

```javascript
// POST /api/w2-wizard/efile-submit/:id
router.post("/efile-submit/:id", async (req, res) => {
  // 1. Auth check
  // 2. Load W2Record with formData
  // 3. Generate EFW2 content via buildEFW2()
  // 4. Validate with AccuWage rules (local validation)
  // 5. Upload via SSAEFileService
  // 6. Create W2EFileSubmission record
  // 7. Return submission ID + status
});

// GET /api/w2-wizard/efile-status/:submissionId
router.get("/efile-status/:submissionId", async (req, res) => {
  // Check submission status (SSA processing can take 1-2 business days)
});
```

### Phase 3: Frontend UI

Add to the MyW2s dashboard card:
- **"E-File to SSA"** button (replaces/upgrades the current "E-File" download button)
- Status badge: Pending → Submitted → Accepted / Rejected
- Error details if rejected

---

## 5. SSA Registration Process (Step-by-Step)

### Step 1: Create BSO Account (Day 1)
1. Go to https://www.ssa.gov/bso/bsowelcome.htm
2. Click **"Register"**
3. Complete identity verification (requires company EIN + responsible individual SSN)
4. You'll receive an **activation code** via mail (5-7 business days) OR use the online ID.me verification (instant)

### Step 2: Register as Electronic Filer (Day 1-2)
1. Log into BSO
2. Navigate to **"Report Wages to Social Security"**
3. Select **"Register to File Electronically"**
4. Provide company information and contact details
5. SSA assigns a **Submitter Identification Number (SBIN)**

### Step 3: Submit Test File (Day 3-5)
1. SSA provides access to a **test environment**
2. Generate a test EFW2 file using dummy data
3. Upload via BSO web interface or SFTP (if SFTP access requested)
4. SSA validates the file format
5. If errors → fix and resubmit
6. If clean → SSA **approves** you for live filing

### Step 4: Go Live (Day 5-7)
1. SSA confirms accreditation
2. Switch from test to production SFTP endpoint
3. Begin submitting live W-2 data

**Total timeline: 1-2 weeks** (mostly waiting for SSA approval)

---

## 6. Compliance & Legal Requirements

### As a Third-Party Submitter:
- You are filing **on behalf of employers** — you need their explicit authorization
- Add a **consent checkbox** in the W2 Wizard: _"I authorize DrPaystub/Saurellius to electronically file this W-2 with the Social Security Administration on my behalf."_
- Maintain records for **4 years** per IRS/SSA requirements

### Data Security:
- SSNs and EINs must be encrypted at rest (MongoDB field-level encryption or application-level)
- SFTP private key must be stored securely (Azure Key Vault recommended)
- Log all submissions but **never log SSNs** in plaintext

### Error Handling:
- SSA rejects files for: invalid SSNs, duplicate submissions, format errors, wrong tax year
- Implement retry logic with exponential backoff
- Notify users via email if their W-2 is rejected

### Filing Deadlines:
- **January 31** — Deadline to file W-2s with SSA for the previous tax year
- **Extensions**: Can request a 30-day extension using Form 8809
- Late filing penalties: $50-$280 per form depending on how late

---

## 7. Environment Variables Required

```env
# SSA SFTP Configuration
SSA_SFTP_HOST=eftps.ssa.gov
SSA_SFTP_PORT=22
SSA_SFTP_USERNAME=<assigned-by-ssa>
SSA_SFTP_KEY_PATH=/path/to/ssa_sftp_private_key
SSA_SBIN=<submitter-id-number>

# Feature flag
SSA_DIRECT_EFILE_ENABLED=false  # Enable after accreditation
```

---

## 8. Revenue Opportunity

| Tier | Feature | Price |
|------|---------|-------|
| **Free** | Download EFW2 file (current Option 1) | Included with $20 W-2 |
| **Premium** | One-click SSA e-file (Option 3) | +$5-10 per W-2 |
| **Bulk** | Batch e-file for employers (10+ W-2s) | $3-5 per W-2 |

This creates a recurring revenue stream during Q1 (Jan-Mar) each year when W-2 filing season peaks.

---

## Summary

| Step | Action | Timeline |
|------|--------|----------|
| 1 | Register BSO account | Day 1 |
| 2 | Get SBIN | Day 1-2 |
| 3 | Build SFTP service | Day 2-4 |
| 4 | Submit test file | Day 5 |
| 5 | Get accredited | Day 5-10 |
| 6 | Deploy to production | Day 10-14 |
| 7 | Add premium pricing | Day 14 |

**Start here**: https://www.ssa.gov/bso/bsowelcome.htm
