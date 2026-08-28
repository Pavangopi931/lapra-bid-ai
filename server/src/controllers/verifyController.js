import { SAMPLE_BIDDERS } from '../data/sampleBidders.js';

import { queryStatutoryData } from './portalController.js';

import {
  analyzeBidComplianceWithGemini,
  generateClarificationDraft
} from '../services/geminiService.js';

import {
  recordAuditLog,
  getAuditLogs
} from '../services/auditService.js';

import { config } from '../config.js';
import { processUploadedDocument } from '../services/documentService.js';

// ============================================================
// SQLITE DATABASE
// ============================================================

import { db } from '../database/database.js';

// ============================================================
// DATABASE HELPERS
// ============================================================

function rowToBidder(row) {
  if (!row) {
    return null;
  }

  try {
    return JSON.parse(row.data);
  } catch (error) {
    console.error(
      `❌ Failed to parse bidder data for ${row.id}:`,
      error
    );

    return null;
  }
}

// ------------------------------------------------------------
// GET ALL BIDDERS FROM SQLITE
// ------------------------------------------------------------

function getAllBiddersFromDatabase() {
  const rows = db
    .prepare(`
      SELECT *
      FROM bidders
      ORDER BY rowid DESC
    `)
    .all();

  return rows
    .map(rowToBidder)
    .filter(Boolean);
}

// ------------------------------------------------------------
// GET ONE BIDDER FROM SQLITE
// ------------------------------------------------------------

function getBidderFromDatabase(id) {
  const row = db
    .prepare(`
      SELECT *
      FROM bidders
      WHERE id = ?
    `)
    .get(id);

  return rowToBidder(row);
}

// ------------------------------------------------------------
// SAVE / UPDATE BIDDER IN SQLITE
// ------------------------------------------------------------

function saveBidderToDatabase(bidder) {
  const now = new Date().toISOString();

  const existing = db
    .prepare(`
      SELECT id
      FROM bidders
      WHERE id = ?
    `)
    .get(bidder.id);

  if (existing) {
    db.prepare(`
      UPDATE bidders
      SET
        tender_id = ?,
        bidder_name = ?,
        data = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      bidder.tenderId,
      bidder.bidderName,
      JSON.stringify(bidder),
      now,
      bidder.id
    );

    console.log(
      `💾 SQLite bidder updated: ${bidder.id}`
    );
  } else {
    db.prepare(`
      INSERT INTO bidders (
        id,
        tender_id,
        bidder_name,
        data,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      bidder.id,
      bidder.tenderId,
      bidder.bidderName,
      JSON.stringify(bidder),
      now,
      now
    );

    console.log(
      `💾 SQLite bidder inserted: ${bidder.id}`
    );
  }

  return bidder;
}

// ------------------------------------------------------------
// GENERATE NEXT BID ID
// ------------------------------------------------------------

function getNextBidderId() {
  const bidders = getAllBiddersFromDatabase();

  let highestNumber = 0;

  for (const bidder of bidders) {
    const match = String(
      bidder.id || ''
    ).match(/BID-2026-(\d+)/);

    if (match) {
      highestNumber = Math.max(
        highestNumber,
        parseInt(match[1], 10)
      );
    }
  }

  return `BID-2026-${String(
    highestNumber + 1
  ).padStart(3, '0')}`;
}

// ============================================================
// GET ALL BIDDERS
// ============================================================

export function getBidders(req, res) {
  try {
    console.log(
      '[API] GET /api/bidders'
    );

    const {
      tenderId,
      riskLevel,
      status
    } = req.query;

    let allBidders =
      getAllBiddersFromDatabase();

    // --------------------------------------------------------
    // TENDER FILTER
    // --------------------------------------------------------

    if (tenderId) {
      allBidders =
        allBidders.filter(
          bidder =>
            bidder.tenderId === tenderId
        );
    }

    // --------------------------------------------------------
    // RISK FILTER
    // --------------------------------------------------------

    let filtered = [
      ...allBidders
    ];

    if (
      riskLevel &&
      riskLevel !== 'ALL'
    ) {
      filtered =
        filtered.filter(
          bidder =>
            bidder.verificationSummary
              ?.riskLevel === riskLevel
        );
    }

    // --------------------------------------------------------
    // OFFICER STATUS FILTER
    // --------------------------------------------------------

    if (
      status &&
      status !== 'ALL'
    ) {
      filtered =
        filtered.filter(
          bidder =>
            bidder.verificationSummary
              ?.officerDecision
              ?.status === status
        );
    }

    // --------------------------------------------------------
    // DASHBOARD COUNTS
    // --------------------------------------------------------

    const qualifiedBids =
      allBidders.filter(
        bidder =>
          bidder.verificationSummary
            ?.officerDecision
            ?.status === 'QUALIFIED'
      ).length;

    const pendingBids =
      allBidders.filter(
        bidder => {
          const status =
            bidder.verificationSummary
              ?.officerDecision
              ?.status;

          return (
            !status ||
            status ===
              'PENDING_OFFICER_REVIEW'
          );
        }
      ).length;

    const disqualifiedBids =
      allBidders.filter(
        bidder =>
          bidder.verificationSummary
            ?.officerDecision
            ?.status === 'DISQUALIFIED'
      ).length;

    const clarificationsSought =
      allBidders.filter(
        bidder =>
          bidder.verificationSummary
            ?.officerDecision
            ?.status ===
          'CLARIFICATION_REQUESTED'
      ).length;

    res.json({
      success: true,

      total: filtered.length,

      tenderDetails: {
        tenderId:
          'GEM/2026/B/882194',

        title:
          'Procurement of Enterprise Cloud Infrastructure, AI Server Racks & Cyber Security Suite',

        buyerOrg:
          'Ministry of Electronics & IT / National Informatics Centre',

        estimatedValue:
          '₹ 14.50 Crore',

        bidOpeningDate:
          '2026-08-30',

        technicalEvaluationDeadline:
          '2026-08-31',

        totalBidsReceived:
          allBidders.length,

        qualifiedBids,

        pendingBids,

        disqualifiedBids,

        clarificationsSought
      },

      bidders: filtered
    });

  } catch (error) {
    console.error(
      '❌ Failed to get bidders:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to load bidders from database.',
      error: error.message
    });
  }
}

// ============================================================
// GET SINGLE BIDDER
// ============================================================

export function getBidderById(req, res) {
  try {
    const { id } = req.params;

    console.log(
      `[API] GET /api/bidders/${id}`
    );

    const bidder =
      getBidderFromDatabase(id);

    if (!bidder) {
      return res.status(404).json({
        success: false,
        message:
          'Bidder not found'
      });
    }

    const portalData =
      queryStatutoryData(
        bidder.pan,
        bidder.gstin,
        bidder.udyamRegNo,
        bidder.cin,
        bidder.epfoCode,
        bidder.esicCode,
        bidder.startupDpiitNo,
        bidder.nsicCertNo,
        bidder.oemAuthorizationCode,
        bidder.digiLockerHash
      );

    res.json({
      success: true,

      bidder,

      portalData,

      auditHistory:
        getAuditLogs(bidder.id)
    });

  } catch (error) {
    console.error(
      '❌ Failed to get bidder:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// ============================================================
// RE-VERIFY BIDDER
// ============================================================

export async function reVerifyBidder(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    console.log(
      `\n🔄 Starting re-verification: ${id}`
    );

    const bidder =
      getBidderFromDatabase(id);

    if (!bidder) {
      return res.status(404).json({
        success: false,
        message:
          'Bidder not found'
      });
    }

    console.log(
      '1️⃣ Querying statutory data...'
    );

    const portalChecks =
      queryStatutoryData(
        bidder.pan,
        bidder.gstin,
        bidder.udyamRegNo,
        bidder.cin,
        bidder.epfoCode,
        bidder.esicCode,
        bidder.startupDpiitNo,
        bidder.nsicCertNo,
        bidder.oemAuthorizationCode,
        bidder.digiLockerHash
      );

    console.log(
      '2️⃣ Statutory data received.'
    );

    console.log(
      '3️⃣ Running AI compliance engine...'
    );

    const analysis =
      await analyzeBidComplianceWithGemini({
        bidder,

        portalChecks,

        tenderCriteria:
          bidder.tenderCriteria
      });

    console.log(
      '4️⃣ AI analysis completed.'
    );

    bidder.verificationSummary = {
      ...bidder.verificationSummary,

      complianceScore:
        analysis.complianceScore,

      riskLevel:
        analysis.riskLevel,

      verdict:
        analysis.verdict,

      aiSummary:
        analysis.aiSummary,

      criticalFlags:
        analysis.criticalFlags || [],

      pendingClarifications:
        analysis.pendingClarifications || [],

      statutoryBreakdown:
        analysis.statutoryBreakdown,

      citedClauses:
        analysis.citedClauses || [],

      lastVerifiedAt:
        new Date().toISOString(),

      isPoweredByLiveGemini:
        analysis.isPoweredByLiveGemini
    };

    console.log(
      '5️⃣ Saving verification result to SQLite...'
    );

    saveBidderToDatabase(
      bidder
    );

    recordAuditLog({
      action:
        'AI_REVERIFICATION_EXECUTED',

      entityId:
        bidder.id,

      entityName:
        bidder.bidderName,

      officerId:
        req.body?.officerId ||
        'OFFICER-GEM-BUYER-042',

      details: {
        score:
          analysis.complianceScore,

        riskLevel:
          analysis.riskLevel,

        verdict:
          analysis.verdict,

        poweredByGemini:
          analysis.isPoweredByLiveGemini
      }
    });

    console.log(
      `✅ Re-verification completed: ${id}`
    );

    res.json({
      success: true,

      message:
        'Bidder re-verification completed successfully.',

      bidder,

      analysis
    });

  } catch (error) {
    console.error(
      '\n❌ FAILED RE-VERIFICATION:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        'Re-verification failed.'
    });
  }
}

// ============================================================
// OFFICER FINAL DECISION
// ============================================================

export function recordOfficerDecision(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const {
      decisionStatus,
      remarks,
      officerId
    } = req.body;

    const bidder =
      getBidderFromDatabase(id);

    if (!bidder) {
      return res.status(404).json({
        success: false,
        message:
          'Bidder not found'
      });
    }

    const finalOfficerId =
      officerId ||
      'OFFICER-GEM-BUYER-042';

    bidder.verificationSummary =
      bidder.verificationSummary ||
      {};

    bidder.verificationSummary
      .officerDecision = {
        status:
          decisionStatus,

        decisionDate:
          new Date().toISOString(),

        officerRemarks:
          remarks ||
          'Evaluation recorded by Procurement Officer.',

        officerId:
          finalOfficerId
      };

    // --------------------------------------------------------
    // SAVE DECISION TO SQLITE
    // --------------------------------------------------------

    saveBidderToDatabase(
      bidder
    );

    const auditEntry =
      recordAuditLog({
        action:
          `OFFICER_DECISION_${decisionStatus}`,

        entityId:
          bidder.id,

        entityName:
          bidder.bidderName,

        officerId:
          finalOfficerId,

        details: {
          decisionStatus,

          remarks,

          finalScore:
            bidder
              .verificationSummary
              ?.complianceScore,

          riskLevel:
            bidder
              .verificationSummary
              ?.riskLevel
        }
      });

    res.json({
      success: true,

      message:
        `Decision successfully recorded: ${decisionStatus}`,

      bidder,

      auditEntry
    });

  } catch (error) {
    console.error(
      '❌ Failed to record officer decision:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// ============================================================
// GENERATE CLARIFICATION / REPRESENTATION NOTICE
// ============================================================

export async function getClarificationNotice(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const bidder =
      getBidderFromDatabase(id);

    if (!bidder) {
      return res.status(404).json({
        success: false,
        message:
          'Bidder not found'
      });
    }

    const noticeDraft =
      await generateClarificationDraft({
        bidder,

        tenderId:
          bidder.tenderId,

        pendingClarifications:
          bidder
            .verificationSummary
            ?.pendingClarifications ||
          [
            'Provide latest statutory compliance documents.'
          ],

        criticalFlags:
          bidder
            .verificationSummary
            ?.criticalFlags ||
          []
      });

    res.json({
      success: true,

      bidderId:
        bidder.id,

      bidderName:
        bidder.bidderName,

      noticeDraft
    });

  } catch (error) {
    console.error(
      '❌ Failed to generate clarification notice:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// ============================================================
// CREATE + VERIFY NEW BIDDER
// ============================================================

export async function createAndVerifyBidder(
  req,
  res
) {
  try {

    console.log(
      '\n======================================================='
    );

    console.log(
      '🚀 NEW BIDDER SUBMISSION RECEIVED'
    );

    console.log(
      '======================================================='
    );

    // --------------------------------------------------------
    // READ FORM DATA
    // --------------------------------------------------------

    const {
      bidderName,
      pan,
      gstin,
      cin,
      udyamRegNo,
      epfoCode,
      esicCode,
      claimedCategory,
      localContentPercentage,
      oemAuthorizationCode,
      startupDpiitNo,
      nsicCertNo,
      claimedTurnover,
      claimedExperienceYears
    } = req.body;

    console.log(
      '📋 Bidder:',
      bidderName
    );

    console.log(
      '📋 PAN:',
      pan
    );

    console.log(
      '📋 GSTIN:',
      gstin
    );

    // --------------------------------------------------------
    // GENERATE ID FROM SQLITE
    // --------------------------------------------------------

    const newId =
      getNextBidderId();

    console.log(
      `🆔 Generated bidder ID: ${newId}`
    );

    // --------------------------------------------------------
    // HANDLE + ANALYZE UPLOADED DOCUMENTS
    // --------------------------------------------------------

    const uploadedDocs = [];
    for (const file of (req.files || [])) {
      uploadedDocs.push(await processUploadedDocument(file));
    }

    // A real upload should never be silently marked as verified.
    // If no document was supplied, keep an explicit placeholder for the demo workflow.
    if (uploadedDocs.length === 0) {
      uploadedDocs.push({
        id: `doc-custom-${Date.now()}-0`,
        name: 'No_document_uploaded',
        type: 'GENERAL',
        size: '0 MB',
        sha256: null,
        hashValid: null,
        hashVerificationStatus: 'NOT_VERIFIED',
        verifiedStatus: 'MISSING'
      });
    }

    console.log(`📄 Documents received: ${uploadedDocs.length}`);

    // --------------------------------------------------------
    // CREATE BIDDER OBJECT
    // --------------------------------------------------------

    const newBidder = {

      id:
        newId,

      tenderId:
        'GEM/2026/B/882194',

      bidderName:
        bidderName ||
        'New Entrant Enterprise',

      legalType:
        cin?.startsWith('U')
          ? 'Private Limited Company'
          : 'LLP / Partnership',

      pan:
        (
          pan ||
          'AAXYZ9999K'
        ).toUpperCase(),

      gstin:
        (
          gstin ||
          '27AAXYZ9999K1Z2'
        ).toUpperCase(),

      cin:
        cin ||
        'U72900MH2022PTC384912',

      udyamRegNo:
        udyamRegNo ||
        'UDYAM-MH-01-0099881',

      epfoCode:
        epfoCode ||
        'MH/BAN/0099881/000',

      esicCode:
        esicCode ||
        '31000998810000111',

      claimedCategory:
        claimedCategory ||
        'MSE (Small Enterprise) & Class-I Local Supplier',

      localContentPercentage:
        Number.isFinite(
          parseFloat(
            localContentPercentage
          )
        )
          ? parseFloat(
              localContentPercentage
            )
          : 75,

      oemAuthorizationCode:
        oemAuthorizationCode ||
        'MAF-AUTH-2026-OEM',

      startupDpiitNo:
        startupDpiitNo ||
        null,

      nsicCertNo:
        nsicCertNo ||
        null,

      digiLockerHash:
        uploadedDocs.find(d => d.sha256)?.sha256 || null,

      claimedTurnover:
        claimedTurnover ||
        '₹ 15.00 Cr',

      claimedExperienceYears:
        Number.isFinite(
          parseInt(
            claimedExperienceYears,
            10
          )
        )
          ? parseInt(
              claimedExperienceYears,
              10
            )
          : 5,

      submittedDocuments:
        uploadedDocs,

      documentEvidence: uploadedDocs.map(doc => ({
        documentId: doc.id,
        name: doc.name,
        type: doc.type,
        sha256: doc.sha256,
        extractionMethod: doc.extractionMethod,
        extractedFields: doc.extractedFields || {},
        extractedText: doc.extractedText || ''
      })),

      tenderCriteria: {

        minTurnoverRequired:
          '₹ 10.00 Cr',

        minExperienceRequired:
          5,

        emdRequired:
          '₹ 5,00,000',

        localContentMin:
          50
      },

      verificationSummary: {

        complianceScore:
          0,

        riskLevel:
          'PENDING',

        verdict:
          'PENDING_VERIFICATION',

        aiSummary:
          'Processing automated multi-portal verification...',

        criticalFlags:
          [],

        pendingClarifications:
          [],

        officerDecision: {

          status:
            'PENDING_OFFICER_REVIEW',

          decisionDate:
            null,

          officerRemarks:
            null,

          officerId:
            null
        }
      }
    };

    // ========================================================
    // IMPORTANT:
    // SAVE THE BIDDER BEFORE AI VERIFICATION
    // ========================================================

    console.log(
      '💾 Saving initial bidder to SQLite...'
    );

    saveBidderToDatabase(
      newBidder
    );

    console.log(
      `✅ Initial bidder saved: ${newBidder.id}`
    );

    // ========================================================
    // GOVERNMENT PORTAL VERIFICATION
    // ========================================================

    console.log(
      '1️⃣ Querying statutory databases...'
    );

    const portalChecks =
      queryStatutoryData(
        newBidder.pan,
        newBidder.gstin,
        newBidder.udyamRegNo,
        newBidder.cin,
        newBidder.epfoCode,
        newBidder.esicCode,
        newBidder.startupDpiitNo,
        newBidder.nsicCertNo,
        newBidder.oemAuthorizationCode,
        newBidder.digiLockerHash
      );

    console.log(
      '2️⃣ Statutory database check completed.'
    );

    // ========================================================
    // AI / HEURISTIC VERIFICATION
    // ========================================================

    console.log(
      '3️⃣ Starting AI compliance analysis...'
    );

    const analysis =
      await analyzeBidComplianceWithGemini({
        bidder:
          newBidder,

        portalChecks,

        tenderCriteria:
          newBidder.tenderCriteria
      });

    console.log(
      '4️⃣ AI compliance analysis completed.'
    );

    // ========================================================
    // APPLY AI RESULT
    // ========================================================

    newBidder.verificationSummary = {

      ...newBidder.verificationSummary,

      complianceScore:
        analysis.complianceScore,

      riskLevel:
        analysis.riskLevel,

      verdict:
        analysis.verdict,

      aiSummary:
        analysis.aiSummary,

      criticalFlags:
        analysis.criticalFlags || [],

      pendingClarifications:
        analysis.pendingClarifications || [],

      statutoryBreakdown:
        analysis.statutoryBreakdown,

      citedClauses:
        analysis.citedClauses || [],

      lastVerifiedAt:
        new Date().toISOString(),

      isPoweredByLiveGemini:
        analysis.isPoweredByLiveGemini
    };

    // ========================================================
    // SAVE FINAL VERIFICATION RESULT
    // ========================================================

    console.log(
      '5️⃣ Saving final verification result to SQLite...'
    );

    saveBidderToDatabase(
      newBidder
    );

    console.log(
      `✅ Final bidder data saved: ${newBidder.id}`
    );

    // ========================================================
    // AUDIT LOG
    // ========================================================

    recordAuditLog({

      action:
        'NEW_BIDDER_SUBMISSION_AND_VERIFICATION',

      entityId:
        newBidder.id,

      entityName:
        newBidder.bidderName,

      officerId:
        'SYSTEM_PORTAL',

      details: {

        pan:
          newBidder.pan,

        gstin:
          newBidder.gstin,

        score:
          analysis.complianceScore,

        riskLevel:
          analysis.riskLevel,

        verdict:
          analysis.verdict
      }
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    console.log(
      `\n🎉 NEW BIDDER PROCESS COMPLETED: ${newBidder.id}`
    );

    console.log(
      '=======================================================\n'
    );

    return res.status(201).json({

      success:
        true,

      message:
        'New Bidder successfully registered and verified.',

      bidder:
        newBidder,

      analysis
    });

  } catch (error) {

    console.error(
      '\n❌ CREATE + VERIFY BIDDER FAILED:'
    );

    console.error(
      error
    );

    console.error(
      '=======================================================\n'
    );

    res.status(500).json({

      success:
        false,

      message:
        error.message ||
        'Failed to create and verify bidder.'
    });
  }
}

// ============================================================
// GEMINI API CONFIGURATION
// ============================================================

export function getApiConfig(
  req,
  res
) {
  try {

    const isConfigured =
      config.isGeminiConfigured();

    const rawKey =
      process.env.GEMINI_API_KEY ||
      config.geminiApiKey;

    const maskedKey =
      isConfigured && rawKey
        ? `${rawKey.substring(
            0,
            6
          )}...${rawKey.substring(
            rawKey.length - 4
          )}`
        : 'Not Configured (Using Built-in Statutory Compliance Engine)';

    res.json({

      success:
        true,

      isGeminiConfigured:
        isConfigured,

      maskedKey,

      model:
        config.geminiModel
    });

  } catch (error) {

    res.status(500).json({

      success:
        false,

      message:
        error.message
    });
  }
}

// ============================================================
// UPDATE GEMINI API CONFIGURATION
// ============================================================

export function updateApiConfig(
  req,
  res
) {
  try {

    const {
      apiKey,
      model
    } = req.body;

    if (
      !apiKey ||
      apiKey.trim() === ''
    ) {
      return res.status(400).json({

        success:
          false,

        message:
          'API key cannot be empty'
      });
    }

    config.updateApiKey(
      apiKey
    );

    if (model) {
      config.geminiModel =
        model;
    }

    recordAuditLog({

      action:
        'GEMINI_API_KEY_UPDATED',

      entityId:
        'SYSTEM_CONFIG',

      entityName:
        'Gemini AI Model Connector',

      officerId:
        'SYSTEM_ADMIN',

      details: {

        model:
          config.geminiModel,

        status:
          'KEY_CONFIGURED'
      }
    });

    res.json({

      success:
        true,

      message:
        'Gemini API Key updated successfully! Live Gemini AI is now active.',

      isGeminiConfigured:
        true,

      maskedKey:
        `${apiKey.substring(
          0,
          6
        )}...${apiKey.substring(
          apiKey.length - 4
        )}`
    });

  } catch (error) {

    console.error(
      '❌ Failed to update Gemini configuration:',
      error
    );

    res.status(500).json({

      success:
        false,

      message:
        error.message
    });
  }
}

// ============================================================
// RESET BIDDERS TO DEMO DATA
// ============================================================

export function resetBidders(
  req,
  res
) {
  try {

    console.log(
      '🔄 Resetting bidder database...'
    );

    // --------------------------------------------------------
    // DELETE CURRENT DATA
    // --------------------------------------------------------

    db.prepare(`
      DELETE FROM bidders
    `).run();

    // --------------------------------------------------------
    // INSERT SAMPLE DATA
    // --------------------------------------------------------

    const insert =
      db.prepare(`
        INSERT INTO bidders (
          id,
          tender_id,
          bidder_name,
          data,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

    const now =
      new Date().toISOString();

    const insertMany =
      db.transaction(
        bidders => {

          for (
            const bidder of bidders
          ) {

            insert.run(

              bidder.id,

              bidder.tenderId,

              bidder.bidderName,

              JSON.stringify(
                bidder
              ),

              now,

              now
            );
          }
        }
      );

    insertMany(
      JSON.parse(
        JSON.stringify(
          SAMPLE_BIDDERS
        )
      )
    );

    const total =
      db
        .prepare(
          `
          SELECT COUNT(*) AS count
          FROM bidders
          `
        )
        .get()
        .count;

    recordAuditLog({

      action:
        'DATA_RESET_TO_DEMO_BENCHMARK',

      entityId:
        'ALL_BIDDERS',

      entityName:
        'GeM Tender GEM/2026/B/882194',

      officerId:
        'SYSTEM_ADMIN',

      details: {

        totalBidders:
          total
      }
    });

    console.log(
      `✅ Database reset complete. ${total} bidders restored.`
    );

    res.json({

      success:
        true,

      message:
        'Demo dataset successfully restored.',

      total
    });

  } catch (error) {

    console.error(
      '❌ Failed to reset bidders:',
      error
    );

    res.status(500).json({

      success:
        false,

      message:
        error.message
    });
  }
}