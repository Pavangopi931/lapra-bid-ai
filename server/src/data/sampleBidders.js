// Sample Pre-configured Bidders for GeM Tender GEM/2026/B/882194
// "Procurement of Enterprise Cloud Infrastructure, AI Server Racks & Cyber Security Suite for Central Ministry"

export const SAMPLE_BIDDERS = [
  {
    id: 'BID-2026-001',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'Bharat Tech Solutions Pvt Ltd',
    legalType: 'Private Limited Company',
    pan: 'AABCB1234F',
    gstin: '27AABCB1234F1Z5',
    cin: 'U72200MH2015PTC265431',
    udyamRegNo: 'UDYAM-MH-01-0045892',
    epfoCode: 'MH/BAN/0045892/000',
    esicCode: '31000458920000999',
    claimedCategory: 'MSE (Small Enterprise) & Class-I Local Supplier',
    localContentPercentage: 78.5,
    oemAuthorizationCode: 'MAF-DELL-IN-2026-9921',
    startupDpiitNo: null,
    nsicCertNo: 'NSIC/GP/DEL/2021/00341',
    digiLockerHash: 'sha256_valid_bharat_tech_full_dossier',
    claimedTurnover: '₹ 22.80 Cr',
    claimedExperienceYears: 8,
    submittedDocuments: [
      { id: 'doc-01', name: 'Udyam_Registration_Certificate.pdf', type: 'MSME', size: '1.4 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-02', name: 'GST_3B_GSTR1_Filings_FY25-26.pdf', type: 'GST', size: '2.8 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-03', name: 'ITR_V_Last_3_Years_Form_3CA_3CD.pdf', type: 'ITR', size: '4.1 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-04', name: 'CA_Certified_Make_In_India_Declaration.pdf', type: 'MII', size: '980 KB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-05', name: 'OEM_Manufacturer_Auth_Letter.pdf', type: 'OEM_MAF', size: '1.1 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-06', name: 'EPFO_ESIC_Compliant_Challans.pdf', type: 'LABOR', size: '1.6 MB', hashValid: true, verifiedStatus: 'VERIFIED' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000 (Exempt under MSME)',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 98,
      riskLevel: 'LOW_RISK',
      verdict: 'RECOMMENDED_FOR_QUALIFICATION',
      aiSummary: 'All 8 statutory pillars verified with 100% data integrity across Udyam, GSTN, MCA21, EPFO, and CBDT. Valid Class-I Local Supplier (78.5% Indian Value Addition). Qualified for MSME purchase preference & EMD exemption under GFR 153.',
      criticalFlags: [],
      pendingClarifications: [],
      officerDecision: {
        status: 'QUALIFIED',
        decisionDate: '2026-08-28',
        officerRemarks: 'Fully compliant with tender terms & statutory mandates. MSME benefits granted.'
      }
    }
  },

  {
    id: 'BID-2026-002',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'Garuda AeroTech Dynamics LLP',
    legalType: 'Limited Liability Partnership',
    pan: 'AAEFG9876K',
    gstin: '29AAEFG9876K1ZQ',
    cin: 'AAU-4412',
    udyamRegNo: 'UDYAM-KA-02-0089123',
    epfoCode: 'KN/BNG/0089123/000',
    esicCode: '53000891230000888',
    claimedCategory: 'DPIIT Recognized Startup & Micro Enterprise',
    localContentPercentage: 84.0,
    oemAuthorizationCode: 'MAF-DIRECT-MANUFACTURER',
    startupDpiitNo: 'DIPP104829',
    nsicCertNo: null,
    digiLockerHash: 'sha256_valid_garuda_aerotech_dossier',
    claimedTurnover: '₹ 1.45 Cr',
    claimedExperienceYears: 3,
    submittedDocuments: [
      { id: 'doc-11', name: 'DPIIT_Startup_Recognition_Cert.pdf', type: 'STARTUP', size: '1.2 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-12', name: 'Udyam_Micro_Certificate.pdf', type: 'MSME', size: '890 KB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-13', name: 'GSTN_Tax_Returns_2025-26.pdf', type: 'GST', size: '2.1 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-14', name: 'Make_In_India_Self_Declaration.pdf', type: 'MII', size: '650 KB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-15', name: 'Startup_EMD_Prior_Turnover_Exemption_Form.pdf', type: 'EXEMPTION', size: '1.0 MB', hashValid: true, verifiedStatus: 'VERIFIED' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000 (Exemption Claimed under Startup Policy)',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 94,
      riskLevel: 'LOW_RISK',
      verdict: 'RECOMMENDED_FOR_QUALIFICATION',
      aiSummary: 'Valid DPIIT-recognized startup (DIPP104829) in high-tech aerospace/AI sector. Lawfully entitled to waiver of Prior Turnover and Prior Experience under DoE OM F.20/2/2014-PPD(Pt.) and GeM GTC Clause 4.m. EMD exempt.',
      criticalFlags: [],
      pendingClarifications: ['Startup Exemption confirmation note logged in tender proceedings.'],
      officerDecision: {
        status: 'PENDING_OFFICER_REVIEW',
        decisionDate: null,
        officerRemarks: null
      }
    }
  },

  {
    id: 'BID-2026-003',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'Apex Industrial Systems Ltd',
    legalType: 'Public Limited Company',
    pan: 'AAACA5555M',
    gstin: '07AAACA5555M1ZP',
    cin: 'L27100DL1998PLC091244',
    udyamRegNo: 'UDYAM-DL-05-0012456',
    epfoCode: 'DL/CPM/0012456/000',
    esicCode: '11000124560000777',
    claimedCategory: 'Medium Enterprise / Non-MSME Preference',
    localContentPercentage: 54.2,
    oemAuthorizationCode: 'MAF-CISCO-IN-2026-1184',
    startupDpiitNo: null,
    nsicCertNo: null,
    digiLockerHash: 'sha256_valid_apex_industrial_pack',
    claimedTurnover: '₹ 82.10 Cr',
    claimedExperienceYears: 14,
    submittedDocuments: [
      { id: 'doc-21', name: 'Audited_Balance_Sheets_Last_3_Years.pdf', type: 'FINANCIAL', size: '6.4 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-22', name: 'GSTN_Filing_History.pdf', type: 'GST', size: '1.9 MB', hashValid: true, verifiedStatus: 'VERIFIED_WITH_FLAG' },
      { id: 'doc-23', name: 'EPFO_Challan_Records.pdf', type: 'LABOR', size: '2.3 MB', hashValid: false, verifiedStatus: 'DISCREPANCY_FLAGGED' },
      { id: 'doc-24', name: 'MAF_Cisco_Hardware_Authorized.pdf', type: 'OEM_MAF', size: '1.5 MB', hashValid: true, verifiedStatus: 'VERIFIED' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000 (BG Submitted)',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 72,
      riskLevel: 'MEDIUM_RISK',
      verdict: 'SEEK_CLARIFICATION',
      aiSummary: 'Financial thresholds and technical capabilities comfortably met. However, EPFO portal indicates a 2-month pending contribution default (DL/CPM/0012456/000) and GST return filing has occasional 15-day delays. Clarification recommended via GeM Representation window.',
      criticalFlags: [
        'EPFO portal flag: 2 Months pending employer contribution reported by Shram Suvidha/EPFO API.',
        'Medium enterprise category does not qualify for MSE reservation or EMD exemption.'
      ],
      pendingClarifications: [
        'Submit latest EPFO payment confirmation challan with ECR acknowledgement within 48 hours.'
      ],
      officerDecision: {
        status: 'CLARIFICATION_REQUESTED',
        decisionDate: '2026-08-28',
        officerRemarks: 'Representation issued on GeM portal to furnish EPFO clearance before price bid opening.'
      }
    }
  },

  {
    id: 'BID-2026-004',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'Orion Global Supplies Pvt Ltd',
    legalType: 'Private Limited Company',
    pan: 'AAXCQ9999P',
    gstin: '06AAXCQ9999P1ZK',
    cin: 'U29100DL2008PLC184321',
    udyamRegNo: 'UDYAM-HR-03-9999999',
    epfoCode: 'HR/GUR/0099999/000',
    esicCode: '12000999990000111',
    claimedCategory: 'Class-I Local Supplier (Claimed)',
    localContentPercentage: 65.0,
    oemAuthorizationCode: 'MAF-FORGED-ORION-2026',
    startupDpiitNo: null,
    nsicCertNo: null,
    digiLockerHash: 'sha256_corrupt_mismatch_hash_39102',
    claimedTurnover: '₹ 45.00 Cr',
    claimedExperienceYears: 10,
    submittedDocuments: [
      { id: 'doc-31', name: 'Udyam_Forged_Certificate.pdf', type: 'MSME', size: '920 KB', hashValid: false, verifiedStatus: 'REJECTED_FAKE' },
      { id: 'doc-32', name: 'GST_Certificate_Cancelled.pdf', type: 'GST', size: '1.2 MB', hashValid: false, verifiedStatus: 'REJECTED_CANCELLED' },
      { id: 'doc-33', name: 'ITR_Acknowledgement.pdf', type: 'ITR', size: '1.4 MB', hashValid: false, verifiedStatus: 'REJECTED_DEFECTIVE' },
      { id: 'doc-34', name: 'OEM_Authorization_Intel.pdf', type: 'OEM_MAF', size: '890 KB', hashValid: false, verifiedStatus: 'REJECTED_FORGERY' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 12,
      riskLevel: 'HIGH_RISK',
      verdict: 'RECOMMENDED_FOR_DISQUALIFICATION',
      aiSummary: 'CRITICAL ALERT: Bidder is DEBARRED under Central Government Ban (DoE Order DoE/OM-Debar-2025/89) active till 2028 for forged certificates. GSTIN cancelled suo moto for fraudulent ITC claims. Director Sanjay Gupta disqualified under MCA Sec 164(2).',
      criticalFlags: [
        'BLACKLISTED / DEBARRED: Order DoE/OM-Debar-2025/89 active in Central Public Procurement Portal.',
        'GSTIN 06AAXCQ9999P1ZK is CANCELLED_SUO_MOTO by Tax Authorities.',
        'Director DIN 01987654 debarred under Section 164(2) of Companies Act 2013.',
        'DigiLocker document hash tampering detected on OEM authorization letter.'
      ],
      pendingClarifications: [],
      officerDecision: {
        status: 'DISQUALIFIED',
        decisionDate: '2026-08-28',
        officerRemarks: 'Summary rejection under Rule 151 GFR 2017. Debarred entity. Incident report logged to GeM Vigilance.'
      }
    }
  },

  {
    id: 'BID-2026-005',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'Pacific Hardware Imports & Distribution',
    legalType: 'Private Limited Company',
    pan: 'AABCS7777K',
    gstin: '27AABCS7777K1Z8',
    cin: 'U51909MH2012PTC234123',
    udyamRegNo: 'UDYAM-MH-01-0077712',
    epfoCode: 'MH/BAN/0077712/000',
    esicCode: '31000777120000555',
    claimedCategory: 'Non-Local Supplier / Class-II',
    localContentPercentage: 18.2,
    oemAuthorizationCode: 'MAF-TAIWAN-DIST-2026',
    startupDpiitNo: null,
    nsicCertNo: null,
    digiLockerHash: 'sha256_valid_pacific_pack',
    claimedTurnover: '₹ 38.40 Cr',
    claimedExperienceYears: 9,
    submittedDocuments: [
      { id: 'doc-41', name: 'Udyam_Trader_Certificate.pdf', type: 'MSME', size: '1.1 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-42', name: 'GST_Filings_FY26.pdf', type: 'GST', size: '2.5 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-43', name: 'Import_Customs_Bill_of_Entry.pdf', type: 'CUSTOMS', size: '3.4 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-44', name: 'Make_In_India_Declaration_18pct.pdf', type: 'MII', size: '890 KB', hashValid: true, verifiedStatus: 'NON_COMPLIANT_MII' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 48,
      riskLevel: 'HIGH_RISK',
      verdict: 'RECOMMENDED_FOR_DISQUALIFICATION',
      aiSummary: 'Bidder declared only 18.2% Local Content (Non-Local Supplier). This tender GEM/2026/B/882194 has a mandatory Class-I/Class-II Local Content minimum of 50% under Public Procurement (Preference to Make in India) Order 2017. Ineligible to participate under Rule 153(iii).',
      criticalFlags: [
        'MII Violation: Declared local content is 18.2%, below mandatory tender threshold of 50.0%.',
        'Udyam classification is Retail/Wholesale Trader (NIC 46511) - Ineligible for MSME manufacturing benefits under OM 16/5/2021.'
      ],
      pendingClarifications: [],
      officerDecision: {
        status: 'PENDING_OFFICER_REVIEW',
        decisionDate: null,
        officerRemarks: null
      }
    }
  },

  {
    id: 'BID-2026-006',
    tenderId: 'GEM/2026/B/882194',
    bidderName: 'CyberShield Infotech Solutions',
    legalType: 'Partnership Firm',
    pan: 'AABFC8822N',
    gstin: '33AABFC8822N1Z4',
    cin: 'N/A (Firm)',
    udyamRegNo: 'UDYAM-TN-02-0044199',
    epfoCode: 'TN/MAS/0044199/000',
    esicCode: '41000441990000222',
    claimedCategory: 'MSE (Micro Enterprise) & Class-I Local Supplier',
    localContentPercentage: 92.4,
    oemAuthorizationCode: 'MAF-DIRECT-DEVELOPER',
    startupDpiitNo: null,
    nsicCertNo: 'NSIC/GP/CHE/2023/00119',
    digiLockerHash: 'sha256_valid_cybershield_dossier',
    claimedTurnover: '₹ 4.10 Cr',
    claimedExperienceYears: 6,
    submittedDocuments: [
      { id: 'doc-51', name: 'Udyam_Micro_Software_Mfg.pdf', type: 'MSME', size: '1.3 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-52', name: 'GSTN_Monthly_GSTR3B_FY26.pdf', type: 'GST', size: '2.0 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-53', name: 'ITR_Form5_3Yrs_With_Computation.pdf', type: 'ITR', size: '3.8 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-54', name: 'Make_In_India_Statutory_CA_Audit.pdf', type: 'MII', size: '1.1 MB', hashValid: true, verifiedStatus: 'VERIFIED' },
      { id: 'doc-55', name: 'NSIC_Single_Point_Registration.pdf', type: 'NSIC', size: '1.4 MB', hashValid: true, verifiedStatus: 'VERIFIED' }
    ],
    tenderCriteria: {
      minTurnoverRequired: '₹ 10.00 Cr',
      minExperienceRequired: 5,
      emdRequired: '₹ 5,00,000 (Exempt under NSIC/MSME)',
      localContentMin: 50
    },
    verificationSummary: {
      complianceScore: 96,
      riskLevel: 'LOW_RISK',
      verdict: 'RECOMMENDED_FOR_QUALIFICATION',
      aiSummary: 'Full statutory compliance verified. NSIC Single Point Registration active with ₹5.00 Cr monetary limit. 92.4% indigenous local content certified by statutory auditor. Exemption from EMD and tender fee granted as per MSME Act 2006.',
      criticalFlags: [],
      pendingClarifications: [],
      officerDecision: {
        status: 'PENDING_OFFICER_REVIEW',
        decisionDate: null,
        officerRemarks: null
      }
    }
  }
];
