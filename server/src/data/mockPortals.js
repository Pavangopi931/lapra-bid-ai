// Mock Government Portals & Statutory Databases
// Simulates live API responses from Udyam, GSTN, PAN/IT, MCA21, EPFO, ESIC, Startup India, NSIC, CPPP Debarment, DigiLocker

export const PORTAL_REGISTRY = {
  UDYAM: {
    id: 'udyam',
    name: 'Udyam / MSME Registration Portal',
    ministry: 'Ministry of MSME, Govt. of India',
    status: 'ONLINE',
    latencyMs: 120,
    endpoint: 'https://udyamregistration.gov.in/api/v2/verify',
    records: {
      'UDYAM-MH-01-0045892': {
        urn: 'UDYAM-MH-01-0045892',
        enterpriseName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        classification: 'Small Enterprise',
        majorActivity: 'Services & Software Manufacturing',
        nicCode: '62011 - Writing of computer programs',
        dateOfUdyam: '2020-07-15',
        validTill: 'PERPETUAL',
        panLinked: 'AABCB1234F',
        dic: 'Mumbai City',
        investmentInPlant: '₹ 4.25 Cr',
        turnover: '₹ 22.80 Cr',
        status: 'ACTIVE',
        exemptionEligible: true,
        msmeBenefitEligible: true
      },
      'UDYAM-KA-02-0089123': {
        urn: 'UDYAM-KA-02-0089123',
        enterpriseName: 'GARUDA AEROTECH DYNAMICS LLP',
        classification: 'Micro Enterprise',
        majorActivity: 'Manufacturing & Drone R&D',
        nicCode: '30302 - Manufacture of unmanned aerial vehicles',
        dateOfUdyam: '2022-03-10',
        validTill: 'PERPETUAL',
        panLinked: 'AAEFG9876K',
        dic: 'Bengaluru Urban',
        investmentInPlant: '₹ 85 Lakhs',
        turnover: '₹ 1.45 Cr',
        status: 'ACTIVE',
        exemptionEligible: true,
        msmeBenefitEligible: true
      },
      'UDYAM-DL-05-0012456': {
        urn: 'UDYAM-DL-05-0012456',
        enterpriseName: 'APEX INDUSTRIAL SYSTEMS LTD',
        classification: 'Medium Enterprise',
        majorActivity: 'Manufacturing of Electrical Equipment',
        nicCode: '27101 - Manufacture of electric motors and generators',
        dateOfUdyam: '2021-01-20',
        validTill: 'PERPETUAL',
        panLinked: 'AAACA5555M',
        dic: 'Delhi North',
        investmentInPlant: '₹ 18.50 Cr',
        turnover: '₹ 82.10 Cr',
        status: 'ACTIVE',
        exemptionEligible: false,
        msmeBenefitEligible: false
      }
    }
  },

  GSTN: {
    id: 'gstn',
    name: 'Goods & Services Tax Network (GSTN)',
    ministry: 'Goods and Services Tax Council / CBIC',
    status: 'ONLINE',
    latencyMs: 140,
    endpoint: 'https://services.gst.gov.in/services/api/search/taxpayer',
    records: {
      '27AABCB1234F1Z5': {
        gstin: '27AABCB1234F1Z5',
        legalName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        tradeName: 'BHARAT TECH SOLUTIONS',
        pan: 'AABCB1234F',
        taxpayerType: 'Regular',
        status: 'ACTIVE',
        registrationDate: '2017-07-01',
        stateJurisdiction: 'Ward 24, Zone 3, Maharashtra',
        complianceRating: 10,
        returnsFilingStatus: {
          gstr1: [
            { period: 'Jan-2026', status: 'Filed', filingDate: '2026-02-10' },
            { period: 'Dec-2025', status: 'Filed', filingDate: '2026-01-11' },
            { period: 'Nov-2025', status: 'Filed', filingDate: '2025-12-09' }
          ],
          gstr3b: [
            { period: 'Jan-2026', status: 'Filed', filingDate: '2026-02-18' },
            { period: 'Dec-2025', status: 'Filed', filingDate: '2026-01-19' },
            { period: 'Nov-2025', status: 'Filed', filingDate: '2025-12-18' }
          ]
        },
        eWayBillStatus: 'ENABLED',
        cancelledReason: null
      },
      '29AAEFG9876K1ZQ': {
        gstin: '29AAEFG9876K1ZQ',
        legalName: 'GARUDA AEROTECH DYNAMICS LLP',
        tradeName: 'GARUDA AEROTECH',
        pan: 'AAEFG9876K',
        taxpayerType: 'Regular',
        status: 'ACTIVE',
        registrationDate: '2022-04-01',
        stateJurisdiction: 'Bengaluru East Div 4',
        complianceRating: 10,
        returnsFilingStatus: {
          gstr1: [{ period: 'Jan-2026', status: 'Filed', filingDate: '2026-02-08' }],
          gstr3b: [{ period: 'Jan-2026', status: 'Filed', filingDate: '2026-02-15' }]
        },
        eWayBillStatus: 'ENABLED',
        cancelledReason: null
      },
      '07AAACA5555M1ZP': {
        gstin: '07AAACA5555M1ZP',
        legalName: 'APEX INDUSTRIAL SYSTEMS LTD',
        tradeName: 'APEX INDUSTRIAL',
        pan: 'AAACA5555M',
        taxpayerType: 'Regular',
        status: 'ACTIVE',
        registrationDate: '2018-09-12',
        stateJurisdiction: 'Delhi West Div 2',
        complianceRating: 7,
        returnsFilingStatus: {
          gstr1: [{ period: 'Jan-2026', status: 'Late Filed', filingDate: '2026-02-25' }],
          gstr3b: [{ period: 'Jan-2026', status: 'Late Filed', filingDate: '2026-02-28' }]
        },
        eWayBillStatus: 'ENABLED',
        cancelledReason: null
      },
      '06AAXCQ9999P1ZK': {
        gstin: '06AAXCQ9999P1ZK',
        legalName: 'ORION GLOBAL SUPPLIES PVT LTD',
        tradeName: 'ORION SUPPLIES',
        pan: 'AAXCQ9999P',
        taxpayerType: 'Regular',
        status: 'CANCELLED_SUO_MOTO',
        registrationDate: '2019-02-14',
        cancelledDate: '2025-08-30',
        cancelledReason: 'Fraudulent ITC Claim & Tax Evasion proceedings under Section 29(2)(c)',
        complianceRating: 1,
        returnsFilingStatus: { gstr1: [], gstr3b: [] },
        eWayBillStatus: 'BLOCKED'
      }
    }
  },

  INCOME_TAX: {
    id: 'income_tax',
    name: 'Income Tax e-Filing & PAN Portal',
    ministry: 'Central Board of Direct Taxes (CBDT), Ministry of Finance',
    status: 'ONLINE',
    latencyMs: 190,
    records: {
      'AABCB1234F': {
        pan: 'AABCB1234F',
        name: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        panStatus: 'ACTIVE & VALID',
        aadhaarLinked: 'NOT_APPLICABLE_CORP',
        itrFilings: [
          { ay: '2025-26', form: 'ITR-6', status: 'Verified & Processed', ackNo: '9920192841029', filingDate: '2025-10-15', grossTurnover: '₹ 22,80,45,000' },
          { ay: '2024-25', form: 'ITR-6', status: 'Verified & Processed', ackNo: '8820192841021', filingDate: '2024-10-20', grossTurnover: '₹ 19,40,10,000' },
          { ay: '2023-24', form: 'ITR-6', status: 'Verified & Processed', ackNo: '7720192841011', filingDate: '2023-10-18', grossTurnover: '₹ 15,10,80,000' }
        ],
        taxAudit44AB: 'COMPLIED (Form 3CA/3CD on record)',
        section206AB_206CCA: 'NON_SPECIFIED (Compliant with no higher TDS penalty)'
      },
      'AAEFG9876K': {
        pan: 'AAEFG9876K',
        name: 'GARUDA AEROTECH DYNAMICS LLP',
        panStatus: 'ACTIVE & VALID',
        aadhaarLinked: 'LINKED',
        itrFilings: [
          { ay: '2025-26', form: 'ITR-5', status: 'Verified & Processed', ackNo: '9912384758192', filingDate: '2025-09-30', grossTurnover: '₹ 1,45,00,000' },
          { ay: '2024-25', form: 'ITR-5', status: 'Verified & Processed', ackNo: '8812384758191', filingDate: '2024-09-28', grossTurnover: '₹ 65,00,000' }
        ],
        taxAudit44AB: 'NOT_APPLICABLE_UNDER_THRESHOLD',
        section206AB_206CCA: 'NON_SPECIFIED'
      },
      'AAACA5555M': {
        pan: 'AAACA5555M',
        name: 'APEX INDUSTRIAL SYSTEMS LTD',
        panStatus: 'ACTIVE & VALID',
        aadhaarLinked: 'NOT_APPLICABLE_CORP',
        itrFilings: [
          { ay: '2025-26', form: 'ITR-6', status: 'Verified & Processed', ackNo: '9934827104921', filingDate: '2025-11-10', grossTurnover: '₹ 82,10,00,000' },
          { ay: '2024-25', form: 'ITR-6', status: 'Verified & Processed', ackNo: '8834827104920', filingDate: '2024-11-05', grossTurnover: '₹ 76,50,00,000' }
        ],
        taxAudit44AB: 'COMPLIED',
        section206AB_206CCA: 'NON_SPECIFIED'
      },
      'AAXCQ9999P': {
        pan: 'AAXCQ9999P',
        name: 'ORION GLOBAL SUPPLIES PVT LTD',
        panStatus: 'FLAGGED_UNDER_INVESTIGATION',
        aadhaarLinked: 'DEFECTIVE',
        itrFilings: [
          { ay: '2025-26', form: 'ITR-6', status: 'Defective Notice Issued under 139(9)', ackNo: '9900000000000', filingDate: '2025-12-31', grossTurnover: '₹ 0' }
        ],
        taxAudit44AB: 'NON_COMPLIANT',
        section206AB_206CCA: 'SPECIFIED_PERSON_HIGHER_TDS'
      }
    }
  },

  MCA21: {
    id: 'mca21',
    name: 'Ministry of Corporate Affairs (MCA21)',
    ministry: 'Ministry of Corporate Affairs',
    status: 'ONLINE',
    latencyMs: 210,
    records: {
      'U72200MH2015PTC265431': {
        cin: 'U72200MH2015PTC265431',
        companyName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        rocCode: 'RoC-Mumbai',
        registrationDate: '2015-06-18',
        companyCategory: 'Company limited by shares',
        companySubCategory: 'Non-govt company',
        classOfCompany: 'Private',
        authorizedCapital: '₹ 5,00,00,000',
        paidUpCapital: '₹ 2,50,00,000',
        companyStatus: 'ACTIVE',
        directors: [
          { din: '07123456', name: 'RAJESH SHARMA', status: 'ACTIVE & APPROVED', disqualifiedUnder164: false },
          { din: '07123457', name: 'PRIYA NAIR', status: 'ACTIVE & APPROVED', disqualifiedUnder164: false }
        ],
        chargesOpen: 0
      },
      'AAU-4412': {
        llpin: 'AAU-4412',
        companyName: 'GARUDA AEROTECH DYNAMICS LLP',
        rocCode: 'RoC-Bangalore',
        registrationDate: '2022-02-15',
        companyStatus: 'ACTIVE',
        directors: [
          { din: '09561234', name: 'VIKRAM VARMA', status: 'ACTIVE & APPROVED', disqualifiedUnder164: false }
        ],
        chargesOpen: 0
      },
      'U29100DL2008PLC184321': {
        cin: 'U29100DL2008PLC184321',
        companyName: 'ORION GLOBAL SUPPLIES PVT LTD',
        rocCode: 'RoC-Delhi',
        registrationDate: '2008-04-10',
        companyStatus: 'ACTIVE (UNDER SERIOUS FRAUD INVESTIGATION - SFIO)',
        directors: [
          { din: '01987654', name: 'SANJAY GUPTA', status: 'DISQUALIFIED_DIR', disqualifiedUnder164: true, reason: 'Debarred director DIN under Sec 164(2)' }
        ],
        chargesOpen: 3
      }
    }
  },

  EPFO: {
    id: 'epfo',
    name: 'Employees’ Provident Fund Organisation (EPFO)',
    ministry: 'Ministry of Labour and Employment',
    status: 'ONLINE',
    latencyMs: 160,
    records: {
      'MH/BAN/0045892/000': {
        establishmentCode: 'MH/BAN/0045892/000',
        establishmentName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        status: 'COMPLIANT',
        coveredEmployees: 142,
        lastChallanMonth: 'Jan-2026',
        lastChallanDate: '2026-02-14',
        defaultStatus: 'NO_DEFAULT',
        epfoCertificateValid: true
      },
      'KN/BNG/0089123/000': {
        establishmentCode: 'KN/BNG/0089123/000',
        establishmentName: 'GARUDA AEROTECH DYNAMICS LLP',
        status: 'COMPLIANT',
        coveredEmployees: 18,
        lastChallanMonth: 'Jan-2026',
        lastChallanDate: '2026-02-12',
        defaultStatus: 'NO_DEFAULT',
        epfoCertificateValid: true
      },
      'DL/CPM/0012456/000': {
        establishmentCode: 'DL/CPM/0012456/000',
        establishmentName: 'APEX INDUSTRIAL SYSTEMS LTD',
        status: 'DEFAULT_NOTICED',
        coveredEmployees: 410,
        lastChallanMonth: 'Nov-2025',
        lastChallanDate: '2025-12-28',
        defaultStatus: '2_MONTHS_PENDING_CONTRIBUTION',
        epfoCertificateValid: false
      }
    }
  },

  ESIC: {
    id: 'esic',
    name: 'Employees’ State Insurance Corporation (ESIC)',
    ministry: 'Ministry of Labour and Employment',
    status: 'ONLINE',
    latencyMs: 150,
    records: {
      '31000458920000999': {
        esicCode: '31000458920000999',
        establishmentName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        status: 'COMPLIANT',
        lastFilingPeriod: 'Jan-2026',
        coveredEmployees: 85,
        defaultStatus: 'NIL'
      },
      '53000891230000888': {
        esicCode: '53000891230000888',
        establishmentName: 'GARUDA AEROTECH DYNAMICS LLP',
        status: 'EXEMPT_BELOW_THRESHOLD',
        lastFilingPeriod: 'N/A',
        coveredEmployees: 12,
        defaultStatus: 'NIL'
      },
      '11000124560000777': {
        esicCode: '11000124560000777',
        establishmentName: 'APEX INDUSTRIAL SYSTEMS LTD',
        status: 'COMPLIANT',
        lastFilingPeriod: 'Jan-2026',
        coveredEmployees: 290,
        defaultStatus: 'NIL'
      },
      '12000999990000111': {
        esicCode: '12000999990000111',
        establishmentName: 'ORION GLOBAL SUPPLIES PVT LTD',
        status: 'COMPLIANCE_ALERT',
        lastFilingPeriod: 'Oct-2025',
        coveredEmployees: 175,
        defaultStatus: '3_MONTHS_PENDING_CONTRIBUTION'
      },
      '41000441990000222': {
        esicCode: '41000441990000222',
        establishmentName: 'CYBERSHIELD INFOTECH SOLUTIONS',
        status: 'COMPLIANT',
        lastFilingPeriod: 'Jan-2026',
        coveredEmployees: 42,
        defaultStatus: 'NIL'
      },
      '31000777120000555': {
        esicCode: '31000777120000555',
        establishmentName: 'PACIFIC HARDWARE IMPORTS & DISTRIBUTION',
        status: 'COMPLIANT',
        lastFilingPeriod: 'Jan-2026',
        coveredEmployees: 65,
        defaultStatus: 'NIL'
      }
    }
  },

  STARTUP_INDIA: {
    id: 'startup_india',
    name: 'Startup India Portal (DPIIT)',
    ministry: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    status: 'ONLINE',
    latencyMs: 110,
    records: {
      'DIPP104829': {
        certificateNo: 'DIPP104829',
        entityName: 'GARUDA AEROTECH DYNAMICS LLP',
        recognitionDate: '2022-04-12',
        validity: 'Valid up to 10 years from incorporation (2032)',
        sector: 'Aeronautics / Aerospace / Robotics',
        status: 'RECOGNIZED',
        taxExemption80IAC: 'APPROVED',
        emdExemptionEligible: true,
        priorExperienceExemptionEligible: true,
        priorTurnoverExemptionEligible: true
      }
    }
  },

  NSIC: {
    id: 'nsic',
    name: 'National Small Industries Corporation (NSIC)',
    ministry: 'Ministry of MSME',
    status: 'ONLINE',
    latencyMs: 130,
    records: {
      'NSIC/GP/DEL/2021/00341': {
        certificateNo: 'NSIC/GP/DEL/2021/00341',
        unitName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        scheme: 'Single Point Registration Scheme (SPRS)',
        validTill: '2027-03-31',
        monetaryLimit: '₹ 15.00 Crore',
        storesDescription: 'IT Hardware, Software Services, Networking Infrastructure',
        status: 'ACTIVE_AND_VERIFIED'
      },
      'NSIC/GP/CHE/2023/00119': {
        certificateNo: 'NSIC/GP/CHE/2023/00119',
        unitName: 'CYBERSHIELD INFOTECH SOLUTIONS',
        scheme: 'Single Point Registration Scheme (SPRS)',
        validTill: '2027-11-30',
        monetaryLimit: '₹ 5.00 Crore',
        storesDescription: 'Cybersecurity Software & Information Security Services',
        status: 'ACTIVE_AND_VERIFIED'
      }
    }
  },


  OEM_AUTHORIZATION: {
    id: 'oem_authorization',
    name: 'OEM Manufacturer Authorization Registry (Sandbox)',
    ministry: 'GeM / Authorized Manufacturer Registry',
    status: 'SANDBOX',
    latencyMs: 125,
    records: {
      'MAF-DELL-IN-2026-9921': {
        authorizationCode: 'MAF-DELL-IN-2026-9921',
        bidderName: 'BHARAT TECH SOLUTIONS PRIVATE LIMITED',
        oemName: 'DELL TECHNOLOGIES INDIA PRIVATE LIMITED',
        productScope: 'Enterprise Servers / AI Infrastructure',
        issuedDate: '2026-01-10',
        validTill: '2027-01-09',
        status: 'ACTIVE_AND_VERIFIED'
      },
      'MAF-CISCO-IN-2026-1184': {
        authorizationCode: 'MAF-CISCO-IN-2026-1184',
        bidderName: 'APEX INDUSTRIAL SYSTEMS LTD',
        oemName: 'CISCO SYSTEMS INDIA PRIVATE LIMITED',
        productScope: 'Networking Infrastructure',
        issuedDate: '2026-02-01',
        validTill: '2027-01-31',
        status: 'ACTIVE_AND_VERIFIED'
      },
      'MAF-DIRECT-MANUFACTURER': {
        authorizationCode: 'MAF-DIRECT-MANUFACTURER',
        bidderName: 'GARUDA AEROTECH DYNAMICS LLP',
        oemName: 'GARUDA AEROTECH DYNAMICS LLP',
        productScope: 'Unmanned Aerial Systems',
        issuedDate: '2026-01-01',
        validTill: '2027-12-31',
        status: 'ACTIVE_AND_VERIFIED'
      },
      'MAF-DIRECT-DEVELOPER': {
        authorizationCode: 'MAF-DIRECT-DEVELOPER',
        bidderName: 'CYBERSHIELD INFOTECH SOLUTIONS',
        oemName: 'CYBERSHIELD INFOTECH SOLUTIONS',
        productScope: 'Cybersecurity Software',
        issuedDate: '2026-01-01',
        validTill: '2027-12-31',
        status: 'ACTIVE_AND_VERIFIED'
      },
      'MAF-FORGED-ORION-2026': {
        authorizationCode: 'MAF-FORGED-ORION-2026',
        bidderName: 'ORION GLOBAL SUPPLIES PVT LTD',
        oemName: 'INTEL INDIA PRIVATE LIMITED',
        productScope: 'Computer Hardware',
        issuedDate: '2026-01-01',
        validTill: '2026-12-31',
        status: 'REVOKED_FOR_FORGERY'
      },
      'MAF-TAIWAN-DIST-2026': {
        authorizationCode: 'MAF-TAIWAN-DIST-2026',
        bidderName: 'PACIFIC HARDWARE IMPORTS & DISTRIBUTION',
        oemName: 'PACIFIC COMPUTING MANUFACTURING CO.',
        productScope: 'Imported Hardware Distribution',
        issuedDate: '2026-01-01',
        validTill: '2026-12-31',
        status: 'ACTIVE_DISTRIBUTOR_AUTHORIZATION'
      }
    }
  },

  DEBARMENT_REGISTRY: {
    id: 'debarment_registry',
    name: 'Central Public Procurement Portal (CPPP) & GeM Debarment Watch',
    ministry: 'Department of Expenditure / GeM Incident Management',
    status: 'ONLINE',
    latencyMs: 105,
    records: {
      'AAXCQ9999P': {
        pan: 'AAXCQ9999P',
        entityName: 'ORION GLOBAL SUPPLIES PVT LTD',
        cin: 'U29100DL2008PLC184321',
        isDebarred: true,
        debarmentType: 'CENTRAL_GOVT_BAN',
        orderNumber: 'DoE/OM-Debar-2025/89',
        debarredBy: 'Ministry of Defence / CPSE Standing Committee',
        periodFrom: '2025-06-01',
        periodTo: '2028-05-31',
        reason: 'Submission of forged OEM authorization letters and counterfeit quality test certificates in Tender GeM/2025/B/9182',
        gfrClause: 'Rule 151 of General Financial Rules (GFR) 2017 & Rule 175(1)(i)(h)',
        debarredDirectors: ['SANJAY GUPTA']
      },
      'AABCS7777K': {
        pan: 'AABCS7777K',
        entityName: 'PACIFIC HARDWARE IMPORTS',
        cin: 'U51909MH2012PTC234123',
        isDebarred: false,
        warningNotice: 'Under Watchlist for Rule 144(xi) border country compliance inquiry',
        debarmentType: 'NONE'
      }
    }
  },

  DIGILOCKER: {
    id: 'digilocker',
    name: 'DigiLocker National Document Verifier',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    status: 'ONLINE',
    latencyMs: 115,
    verifyHash: (docHash) => {
      // Known authentic hashes for sample documents
      const knownValid = [
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b'
      ];
      return knownValid.includes(docHash) || docHash.startsWith('sha256_valid_');
    }
  }
};
