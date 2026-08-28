import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

/**
 * Initialize Gemini client if API key is present
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || config.geminiApiKey;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE' || apiKey.trim() === '') {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI:', err);
    return null;
  }
}

/**
 * AI Bidder Compliance Analyzer using Gemini or Heuristic Fallback
 */
export async function analyzeBidComplianceWithGemini({ bidder, portalChecks, tenderCriteria }) {
  const client = getGeminiClient();

  if (!client) {
    console.log('[AI Engine] Using Built-in Statutory Compliance Engine (Gemini API key is placeholder).');
    return runHeuristicComplianceAnalysis(bidder, portalChecks, tenderCriteria);
  }

  try {
    const modelName = config.geminiModel || 'gemini-2.0-flash';
    const model = client.getGenerativeModel({ model: modelName });

    const prompt = `
You are the Chief AI Verification Engine for the Government e-Marketplace (GeM), India.
Your mission is to perform automated statutory, regulatory, and eligibility verification of bidders participating in public procurement tenders.

Evaluate the following bidder data, portal verification results, and tender criteria strictly under Indian Public Procurement Laws:
- General Financial Rules (GFR) 2017 (Rule 144(xi), Rule 151, Rule 153, Rule 175)
- Public Procurement (Preference to Make in India) Order 2017 (DPIIT)
- Public Procurement Policy for Micro and Small Enterprises (MSEs) Order 2012
- Department of Expenditure Startup Exemption OM F.20/2/2014-PPD(Pt.)
- GSTN, Income Tax Act 1961 (Sec 44AB, 206AB), EPFO & ESIC labor mandates.

=== TENDER CRITERIA ===
${JSON.stringify(tenderCriteria || {}, null, 2)}

=== BIDDER PROFILE & SUBMITTED DATA ===
Name: ${bidder.bidderName}
PAN: ${bidder.pan}
GSTIN: ${bidder.gstin}
Udyam Reg: ${bidder.udyamRegNo || 'None'}
CIN/LLPIN: ${bidder.cin || 'N/A'}
EPFO: ${bidder.epfoCode || 'N/A'}
ESIC: ${bidder.esicCode || 'N/A'}
Claimed Category: ${bidder.claimedCategory}
Declared Local Content %: ${bidder.localContentPercentage}%
Claimed Turnover: ${bidder.claimedTurnover}
Submitted Docs: ${JSON.stringify(bidder.submittedDocuments || [], null, 2)}

=== GOVERNMENT PORTALS / SANDBOX CROSS-VERIFICATION RESULTS ===
${JSON.stringify(portalChecks || {}, null, 2)}

=== EXTRACTED DOCUMENT EVIDENCE ===
${JSON.stringify(bidder.documentEvidence || bidder.submittedDocuments || [], null, 2)}

Analyze all data points for:
1. PAN / GSTIN / Udyam / MCA entity name and status mismatches.
2. Suo moto cancellation or return filing defaults on GSTN.
3. Blacklisting/Debarment records in CPPP or GeM Vigilance registry.
4. Make in India (Class-I / Class-II vs Non-Local Supplier threshold compliance).
5. MSME & Startup EMD / Prior Turnover & Experience waiver legitimacy.
6. Labor compliance defaults (EPFO / ESIC).
7. DigiLocker hash authenticity or document forgery indicators.

Return ONLY a valid JSON object matching this exact schema:
{
  "complianceScore": <integer 0-100>,
  "riskLevel": "<LOW_RISK | MEDIUM_RISK | HIGH_RISK>",
  "verdict": "<RECOMMENDED_FOR_QUALIFICATION | SEEK_CLARIFICATION | RECOMMENDED_FOR_DISQUALIFICATION>",
  "aiSummary": "<concise 2-3 sentence executive assessment for the Procurement Officer>",
  "criticalFlags": ["<list of any critical violations, debarments, or fraudulent submissions>"],
  "minorDiscrepancies": ["<list of non-fatal gaps or missing optional forms>"],
  "pendingClarifications": ["<specific representations to seek via GeM representation window>"],
  "statutoryBreakdown": {
    "statutoryAndTax": { "score": <0-100>, "status": "COMPLIANT|WARNING|CRITICAL", "details": "<text>" },
    "msmeStartupBenefits": { "score": <0-100>, "status": "COMPLIANT|WARNING|NOT_APPLICABLE", "details": "<text>" },
    "makeInIndia": { "score": <0-100>, "status": "COMPLIANT|NON_COMPLIANT", "details": "<text>" },
    "financialViability": { "score": <0-100>, "status": "COMPLIANT|WARNING", "details": "<text>" },
    "debarmentVigilance": { "score": <0-100>, "status": "CLEAR|DEBARRED", "details": "<text>" },
    "laborCompliance": { "score": <0-100>, "status": "COMPLIANT|DEFAULT_NOTICED", "details": "<text>" },
    "digiLockerIntegrity": { "score": <0-100>, "status": "AUTHENTIC|TAMPERED|NOT_VERIFIED", "details": "<text>" },
    "oemAuthorization": { "score": <0-100>, "status": "COMPLIANT|WARNING|INVALID|NOT_APPLICABLE", "details": "<text>" }
  },
  "citedClauses": ["<e.g. GFR 2017 Rule 151, MII Order 2017 Sec 3(a)>"],
  "isPoweredByLiveGemini": true
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean JSON formatting if code fences exist
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      parsed.isPoweredByLiveGemini = true;
      return parsed;
    }
    return runHeuristicComplianceAnalysis(bidder, portalChecks, tenderCriteria);
  } catch (err) {
    console.error('[Gemini API Error] Falling back to Heuristic Verification Engine:', err.message);
    const fallback = runHeuristicComplianceAnalysis(bidder, portalChecks, tenderCriteria);
    fallback.geminiError = err.message;
    return fallback;
  }
}

/**
 * Intelligent Heuristic Compliance Engine
 * Runs deterministic rule-based checks matching GeM procurement guidelines
 */
export function runHeuristicComplianceAnalysis(bidder, portalChecks, tenderCriteria) {
  const criticalFlags = [];
  const minorDiscrepancies = [];
  const pendingClarifications = [];
  const citedClauses = [];
  const evidence = [];
  let score = 100;

  const breakdown = {
    statutoryAndTax: { score: 100, status: 'COMPLIANT', details: 'PAN and GST status checked against the available statutory records.' },
    msmeStartupBenefits: { score: 100, status: 'COMPLIANT', details: 'MSME / Startup eligibility checked against available registration records.' },
    makeInIndia: { score: 100, status: 'COMPLIANT', details: 'Declared local content compared with the tender threshold.' },
    financialViability: { score: 100, status: 'COMPLIANT', details: 'Turnover and experience compared with tender thresholds and applicable exemptions.' },
    debarmentVigilance: { score: 100, status: 'CLEAR', details: 'No active debarment record found in the sandbox registry.' },
    laborCompliance: { score: 100, status: 'COMPLIANT', details: 'EPFO and ESIC records checked where identifiers were supplied.' },
    digiLockerIntegrity: { score: 100, status: 'AUTHENTIC', details: 'Document hash verification checked where a registered hash is available.' },
    oemAuthorization: { score: 100, status: 'COMPLIANT', details: 'OEM authorization code checked against the authorization registry.' }
  };

  const normalize = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const sameEntity = (a, b) => {
    if (!a || !b) return true;
    const x = normalize(a).replace(/PRIVATE|LIMITED|LTD|PVT|LLP|INCORPORATED/g, '');
    const y = normalize(b).replace(/PRIVATE|LIMITED|LTD|PVT|LLP|INCORPORATED/g, '');
    return x === y || x.includes(y) || y.includes(x);
  };

  const parseCrore = value => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return value;
    const raw = String(value).replace(/,/g, '').replace(/₹/g, '').trim();
    const match = raw.match(/([\d.]+)/);
    if (!match) return null;
    const amount = Number(match[1]);
    if (/lakh/i.test(raw)) return amount / 100;
    if (/crore|cr/i.test(raw)) return amount;
    return amount / 1e7;
  };

  const minTurnover = parseCrore(tenderCriteria?.minTurnoverRequired);
  const claimedTurnover = parseCrore(bidder.claimedTurnover);
  const minExperience = Number(tenderCriteria?.minExperienceRequired || 0);
  const claimedExperience = Number(bidder.claimedExperienceYears || 0);

  // 1. Identity consistency across PAN, GST, Udyam and MCA.
  const identityPairs = [
    ['GSTN', portalChecks.gstn?.legalName],
    ['Udyam', portalChecks.udyam?.enterpriseName],
    ['MCA21', portalChecks.mca21?.companyName],
    ['Income Tax', portalChecks.incomeTax?.name]
  ];
  const identityMismatches = identityPairs.filter(([, name]) => name && !sameEntity(bidder.bidderName, name));
  if (identityMismatches.length) {
    score -= Math.min(25, identityMismatches.length * 10);
    breakdown.statutoryAndTax.score = 55;
    breakdown.statutoryAndTax.status = 'CRITICAL';
    breakdown.statutoryAndTax.details = `Entity-name mismatch found in: ${identityMismatches.map(([source]) => source).join(', ')}.`;
    criticalFlags.push(`Entity identity mismatch detected against ${identityMismatches.map(([source]) => source).join(', ')}.`);
    pendingClarifications.push('Provide documentary evidence explaining the legal-entity name mismatch across statutory registrations.');
    evidence.push({ type: 'IDENTITY_MISMATCH', sources: identityMismatches.map(([source, name]) => ({ source, value: name })) });
  }

  // 2. PAN / GST status and filing compliance.
  if (portalChecks.incomeTax?.panStatus && portalChecks.incomeTax.panStatus !== 'ACTIVE & VALID') {
    score -= 25;
    breakdown.statutoryAndTax.score = Math.min(breakdown.statutoryAndTax.score, 30);
    breakdown.statutoryAndTax.status = 'CRITICAL';
    criticalFlags.push(`PAN status is ${portalChecks.incomeTax.panStatus}.`);
  }
  if (portalChecks.gstn?.status === 'CANCELLED_SUO_MOTO' || portalChecks.gstn?.status === 'SUSPENDED') {
    score -= 40;
    breakdown.statutoryAndTax.score = Math.min(breakdown.statutoryAndTax.score, 10);
    breakdown.statutoryAndTax.status = 'CRITICAL';
    breakdown.statutoryAndTax.details = `GSTIN is ${portalChecks.gstn.status}: ${portalChecks.gstn.cancelledReason || 'registration inactive'}.`;
    criticalFlags.push(`GST Registration Inactive/Cancelled: ${portalChecks.gstn.cancelledReason || 'Suo Moto Cancellation'}`);
    citedClauses.push('GeM tender statutory tax-compliance requirement');
  } else if (portalChecks.gstn?.complianceRating && portalChecks.gstn.complianceRating < 8) {
    score -= 10;
    breakdown.statutoryAndTax.score = Math.min(breakdown.statutoryAndTax.score, 75);
    breakdown.statutoryAndTax.status = 'WARNING';
    minorDiscrepancies.push('GSTN filing history shows intermittent delays in GSTR-1/GSTR-3B.');
    pendingClarifications.push('Submit latest GST return filing acknowledgements and explain delayed periods.');
  }

  // 3. MCA director status.
  const disqualifiedDirector = portalChecks.mca21?.directors?.find(d => d.disqualifiedUnder164);
  if (disqualifiedDirector) {
    score -= 30;
    breakdown.statutoryAndTax.score = Math.min(breakdown.statutoryAndTax.score, 20);
    breakdown.statutoryAndTax.status = 'CRITICAL';
    criticalFlags.push(`MCA21 director disqualification: ${disqualifiedDirector.name} (${disqualifiedDirector.din}).`);
    citedClauses.push('Companies Act 2013 Section 164(2)');
  }

  // 4. Debarment.
  if (portalChecks.debarment?.isDebarred) {
    score = Math.min(score, 15);
    breakdown.debarmentVigilance = { score: 0, status: 'DEBARRED', details: `Entity is DEBARRED: ${portalChecks.debarment.reason || 'Central Government ban'}.` };
    criticalFlags.push(`BLACKLISTED / DEBARRED: Order ${portalChecks.debarment.orderNumber || 'Active Order'} on the procurement debarment registry.`);
    citedClauses.push('GFR 2017 Rule 151 (Debarment from Bidding)');
  }

  // 5. Make in India.
  const minMII = Number(tenderCriteria?.localContentMin ?? 50);
  const bidderMII = Number(bidder.localContentPercentage || 0);
  if (bidderMII < minMII) {
    score -= 35;
    breakdown.makeInIndia = { score: 20, status: 'NON_COMPLIANT', details: `Declared local content (${bidderMII}%) is below the tender threshold of ${minMII}%.` };
    criticalFlags.push(`MII Violation: Declared local content is ${bidderMII}%, below the mandatory tender threshold of ${minMII}%.`);
    citedClauses.push('Public Procurement (Preference to Make in India) Order 2017');
  }

  // 6. Labor compliance: both EPFO and ESIC.
  const laborDefaults = [];
  if (portalChecks.epfo?.status === 'DEFAULT_NOTICED') laborDefaults.push(`EPFO: ${portalChecks.epfo.defaultStatus || 'default noticed'}`);
  if (portalChecks.esic?.defaultStatus && portalChecks.esic.defaultStatus !== 'NIL') laborDefaults.push(`ESIC: ${portalChecks.esic.defaultStatus}`);
  if (laborDefaults.length) {
    score -= 20;
    breakdown.laborCompliance = { score: 50, status: 'DEFAULT_NOTICED', details: laborDefaults.join('; ') };
    criticalFlags.push(...laborDefaults);
    pendingClarifications.push('Submit latest EPFO/ESIC payment confirmation and filing acknowledgements.');
  } else if (portalChecks.esic?.status === 'EXEMPT_BELOW_THRESHOLD') {
    breakdown.laborCompliance.details = 'ESIC record indicates exemption below the applicable employee threshold in the sandbox data; EPFO/ESIC identifiers were checked.';
  }

  // 7. NSIC / Startup / Udyam benefit validation.
  const startupValid = Boolean(bidder.startupDpiitNo && portalChecks.startup?.status === 'RECOGNIZED');
  const msmeValid = Boolean(portalChecks.udyam?.status === 'ACTIVE' && portalChecks.udyam?.msmeBenefitEligible !== false);
  const nsicValid = Boolean(portalChecks.nsic?.status === 'ACTIVE_AND_VERIFIED');
  if (bidder.startupDpiitNo && !startupValid) {
    score -= 15;
    breakdown.msmeStartupBenefits = { score: 50, status: 'WARNING', details: 'Claimed DPIIT startup recognition could not be verified.' };
    pendingClarifications.push('Upload/produce the valid DPIIT Startup Recognition certificate for verification.');
  } else if (startupValid) {
    breakdown.msmeStartupBenefits.details = `DPIIT recognition ${portalChecks.startup.certificateNo} verified; eligible exemptions are considered in the financial rule checks.`;
    citedClauses.push('Department of Expenditure Startup Exemption OM F.20/2/2014-PPD(Pt.)');
  } else if (!msmeValid && !nsicValid) {
    breakdown.msmeStartupBenefits = { score: 70, status: 'WARNING', details: 'No verified MSME/NSIC benefit record was found.' };
  }

  // 8. Financial thresholds with Startup exemption.
  const turnoverExempt = startupValid && portalChecks.startup?.priorTurnoverExemptionEligible;
  const experienceExempt = startupValid && portalChecks.startup?.priorExperienceExemptionEligible;
  const turnoverFail = minTurnover !== null && claimedTurnover !== null && claimedTurnover < minTurnover && !turnoverExempt;
  const experienceFail = minExperience > 0 && claimedExperience < minExperience && !experienceExempt;
  if (turnoverFail || experienceFail) {
    score -= 25;
    breakdown.financialViability = {
      score: 35,
      status: 'WARNING',
      details: [turnoverFail ? `Turnover ₹${claimedTurnover} Cr is below ₹${minTurnover} Cr required.` : null, experienceFail ? `Experience ${claimedExperience} years is below ${minExperience} years required.` : null].filter(Boolean).join(' ')
    };
    criticalFlags.push(...[
      turnoverFail ? `Financial threshold failure: claimed turnover ₹${claimedTurnover} Cr < required ₹${minTurnover} Cr.` : null,
      experienceFail ? `Experience threshold failure: claimed ${claimedExperience} years < required ${minExperience} years.` : null
    ].filter(Boolean));
  } else if (turnoverExempt || experienceExempt) {
    breakdown.financialViability.details = 'Startup exemption verified; prior turnover/experience requirements are treated as exempt for this prototype rule set.';
  } else if (minTurnover !== null && claimedTurnover === null) {
    score -= 10;
    breakdown.financialViability = { score: 60, status: 'WARNING', details: 'Turnover could not be reliably parsed from the submitted profile.' };
    pendingClarifications.push('Provide a CA-certified turnover statement for the tender-required period.');
  }

  // 9. OEM authorization.
  if (bidder.oemAuthorizationCode) {
    const oem = portalChecks.oemAuthorization;
    if (!oem || oem.status === 'NOT_FOUND' || oem.status === 'REVOKED_FOR_FORGERY') {
      score -= 30;
      breakdown.oemAuthorization = { score: 10, status: 'INVALID', details: 'OEM authorization could not be validated or is revoked.' };
      criticalFlags.push(`OEM authorization invalid/unverified: ${bidder.oemAuthorizationCode}.`);
      pendingClarifications.push('Provide a valid OEM Manufacturer Authorization Form (MAF) with verifiable authorization code and validity period.');
    } else {
      const bidderMatches = sameEntity(bidder.bidderName, oem.bidderName);
      if (!bidderMatches) {
        score -= 20;
        breakdown.oemAuthorization = { score: 30, status: 'WARNING', details: `OEM record is associated with ${oem.bidderName}, not the submitted bidder.` };
        criticalFlags.push('OEM authorization bidder/entity mismatch detected.');
      } else {
        breakdown.oemAuthorization = { score: 100, status: 'COMPLIANT', details: `${oem.status}; scope: ${oem.productScope || 'not specified'}; valid till ${oem.validTill || 'not specified'}.` };
      }
    }
  } else {
    breakdown.oemAuthorization = { score: 70, status: 'WARNING', details: 'No OEM authorization code was supplied for verification.' };
    pendingClarifications.push('Provide OEM authorization details if the tender requires manufacturer authorization.');
  }

  // 10. DigiLocker / document integrity.
  const docs = bidder.submittedDocuments || [];
  const tamperedDoc = docs.find(d => d.verifiedStatus?.includes('REJECTED') || d.hashValid === false && d.hashVerificationStatus !== 'NOT_VERIFIED');
  const verifiedDoc = docs.find(d => d.hashVerificationStatus === 'VERIFIED' || d.verifiedStatus === 'VERIFIED');
  const unverifiedDocs = docs.filter(d => d.hashVerificationStatus === 'NOT_VERIFIED' || d.verifiedStatus === 'EXTRACTION_REQUIRED');
  if (tamperedDoc || portalChecks.digiLocker?.status === 'TAMPERED') {
    score -= 30;
    breakdown.digiLockerIntegrity = { score: 10, status: 'TAMPERED', details: 'A submitted document is marked as tampered/rejected or its registered hash does not match.' };
    criticalFlags.push('Tampered/invalid document integrity evidence detected in submitted bid packet.');
    citedClauses.push('GeM document authenticity requirement');
  } else if (portalChecks.digiLocker?.status === 'AUTHENTIC' || verifiedDoc) {
    breakdown.digiLockerIntegrity = { score: 100, status: 'AUTHENTIC', details: 'At least one document hash was successfully verified against the configured verification registry.' };
  } else if (unverifiedDocs.length) {
    breakdown.digiLockerIntegrity = { score: 70, status: 'NOT_VERIFIED', details: `${unverifiedDocs.length} uploaded document(s) have a calculated SHA-256 hash but no matching registered hash in the sandbox verifier.` };
    minorDiscrepancies.push('Some uploaded document hashes are calculated but not registered in the sandbox DigiLocker verifier.');
  }

  // Missing evidence is a clarification, not an automatic rejection.
  const hasDocuments = docs.some(d => d.name && d.name !== 'No_document_uploaded');
  if (!hasDocuments) {
    score -= 10;
    breakdown.digiLockerIntegrity.score = Math.min(breakdown.digiLockerIntegrity.score, 50);
    breakdown.digiLockerIntegrity.status = 'NOT_VERIFIED';
    pendingClarifications.push('Upload the required statutory bid documents before final qualification.');
  }

  score = Math.max(5, Math.min(100, Math.round(score)));

  let riskLevel = 'LOW_RISK';
  let verdict = 'RECOMMENDED_FOR_QUALIFICATION';
  if (score < 65 || criticalFlags.some(f => /BLACKLISTED|DEBARRED|Cancelled|MII Violation|tampered|invalid|disqualified/i.test(f))) {
    riskLevel = 'HIGH_RISK';
    verdict = 'RECOMMENDED_FOR_DISQUALIFICATION';
  } else if (score < 85 || pendingClarifications.length > 0 || minorDiscrepancies.length > 0) {
    riskLevel = 'MEDIUM_RISK';
    verdict = 'SEEK_CLARIFICATION';
  }

  const aiSummary = riskLevel === 'HIGH_RISK'
    ? `Critical statutory or eligibility issues were detected. The system recommends officer review for rejection, with ${criticalFlags.length} material flag(s).`
    : riskLevel === 'MEDIUM_RISK'
      ? `Primary eligibility checks are not fully clean. ${pendingClarifications.length + minorDiscrepancies.length} clarification or warning item(s) should be reviewed before a final decision.`
      : 'The available statutory, eligibility, document-integrity and tender-threshold checks passed with no material exceptions in the configured verification sources.';

  return {
    complianceScore: score,
    riskLevel,
    verdict,
    aiSummary,
    criticalFlags,
    minorDiscrepancies,
    pendingClarifications,
    statutoryBreakdown: breakdown,
    citedClauses,
    evidence,
    isPoweredByLiveGemini: false
  };
}

/**
 * Generate GeM Formal Clarification Notice Draft
 */
export async function generateClarificationDraft({ bidder, tenderId, pendingClarifications, criticalFlags }) {
  const client = getGeminiClient();
  const noticeRef = `GeM/REP/${tenderId.replace(/\//g, '-')}/${bidder.id}`;
  const deadline = new Date(Date.now() + 48 * 3600 * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: config.geminiModel || 'gemini-2.0-flash' });
      const prompt = `
Generate a formal Government e-Marketplace (GeM) Bid Representation & Clarification Notice from the Procurement Officer to Bidder: "${bidder.bidderName}".
Tender Reference: ${tenderId}
Notice Ref: ${noticeRef}
Clarification Deadline: ${deadline}
Identified Issues & Clarification Points:
${JSON.stringify({ pendingClarifications, criticalFlags }, null, 2)}

Format as an official Indian Public Procurement formal notice with Subject, Reference, Table of Clarification Points, GeM Representation Window upload instructions, and signature block for "Competent Procurement Authority".
`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.warn('Clarification Gemini generation failed, using standard template');
    }
  }

  // Standard Formal Government Notice Template
  return `
GOVERNMENT OF INDIA / CENTRAL PUBLIC SECTOR ENTERPRISE
PROCUREMENT & CONTRACT MANAGEMENT DIVISION
Government e-Marketplace (GeM) Verification Cell

Notice Ref No: ${noticeRef}
Date: ${new Date().toLocaleDateString('en-IN')}

To:
Authorized Signatory,
${bidder.bidderName}
(PAN: ${bidder.pan} | GSTIN: ${bidder.gstin})

SUBJECT: TECHNICAL EVALUATION - REQUEST FOR CLARIFICATION / REPRESENTATION UNDER GeM TENDER NO: ${tenderId}

Dear Sir/Madam,

During the automated statutory and technical compliance verification of bids submitted against GeM Tender No: ${tenderId}, the Competent Evaluation Committee has observed certain discrepancies / requirement of documentary evidence:

1. OBSERVATIONS & CLARIFICATIONS SOUGHT:
${pendingClarifications.map((item, idx) => `   (${idx + 1}) ${item}`).join('\n')}
${criticalFlags.length > 0 ? `\n2. NOTICED SYSTEM FLAGS:\n${criticalFlags.map((item, idx) => `   [Alert ${idx + 1}] ${item}`).join('\n')}` : ''}

2. STATUTORY TIME LIMIT:
As per GeM General Terms and Conditions (GTC) Clause 4(iv), you are hereby requested to submit your point-wise clarification and upload authenticated supporting documents exclusively through the GeM Representation Window.

DEADLINE FOR RESPONSE: ${deadline} (IST).

Please note that failure to submit the required clarifications within the stipulated time frame shall result in the evaluation of your bid based on currently available documents, which may lead to technical disqualification.

By Order of Competent Authority,
Procurement Officer / Buyer Division
Government e-Marketplace (GeM)
`;
}
