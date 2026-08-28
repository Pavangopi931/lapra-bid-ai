import express from 'express';
import cors from 'cors';
import multer from 'multer';

import { config } from './config.js';

import {
  getBidders,
  getBidderById,
  reVerifyBidder,
  recordOfficerDecision,
  getClarificationNotice,
  createAndVerifyBidder,
  getApiConfig,
  updateApiConfig,
  resetBidders
} from './controllers/verifyController.js';

import {
  getPortalsStatus,
  getPortalDetails
} from './controllers/portalController.js';

import { getAuditLogs, verifyAuditChain } from './services/auditService.js';

// SQLite Database
import { createTables } from './database/schema.js';
import { seedDatabase } from './database/seed.js';

const app = express();

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// =======================================================
// MIDDLEWARE
// =======================================================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// =======================================================
// DATABASE INITIALIZATION
// =======================================================

try {
  createTables();
  seedDatabase();

  console.log('=======================================================');
  console.log('  SQLite Database: CONNECTED');
  console.log('  Database Tables: INITIALIZED');
  console.log('=======================================================');
} catch (error) {
  console.error('❌ SQLite Database Initialization Failed:');
  console.error(error);
}

// =======================================================
// HEALTH CHECK
// =======================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'GeM-Verify AI Statutory Verification Engine',
    version: '1.0.0',
    geminiConfigured: config.isGeminiConfigured(),
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// =======================================================
// BIDDER VERIFICATION ROUTES
// =======================================================

app.get('/api/bidders', getBidders);

app.get('/api/bidders/:id', getBidderById);

app.post('/api/bidders/:id/reverify', reVerifyBidder);

app.post('/api/bidders/:id/decision', recordOfficerDecision);

app.get('/api/bidders/:id/clarification', getClarificationNotice);

app.post(
  '/api/bidders/new',
  upload.array('documents', 5),
  createAndVerifyBidder
);

app.post('/api/bidders/reset', resetBidders);

// =======================================================
// GOVERNMENT PORTAL ROUTES
// =======================================================

app.get('/api/portals/status', getPortalsStatus);

app.get('/api/portals/:portalId', getPortalDetails);

// =======================================================
// CRYPTOGRAPHIC AUDIT TRAIL
// =======================================================

app.get('/api/audit-logs/verify', (req, res) => {
  const result = verifyAuditChain();
  res.json({ success: true, ...result });
});

app.get('/api/audit-logs', (req, res) => {
  const { entityId } = req.query;

  const logs = getAuditLogs(entityId);

  res.json({
    success: true,
    totalLogs: logs.length,
    logs
  });
});

// =======================================================
// GEMINI CONFIGURATION ROUTES
// =======================================================

app.get('/api/config/gemini', getApiConfig);

app.post('/api/config/gemini', updateApiConfig);

// =======================================================
// START SERVER
// =======================================================

app.listen(config.port, () => {
  console.log('=======================================================');
  console.log('  GeM-Verify AI Server is running');
  console.log(`  Port: ${config.port}`);
  console.log(
    `  Gemini AI Status: ${
      config.isGeminiConfigured()
        ? 'LIVE API KEY CONFIGURED'
        : 'PLACEHOLDER (Built-in Statutory Engine)'
    }`
  );
  console.log('  Database: SQLite');
  console.log(`  API Endpoint: http://localhost:${config.port}/api/health`);
  console.log('=======================================================');
});