import crypto from 'crypto';
import { db } from '../database/database.js';

function ensureAuditTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      log_id TEXT NOT NULL UNIQUE,
      timestamp TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      entity_name TEXT NOT NULL,
      officer_id TEXT NOT NULL,
      details TEXT NOT NULL,
      prev_hash TEXT NOT NULL,
      hash TEXT NOT NULL UNIQUE
    );
    CREATE INDEX IF NOT EXISTS idx_audit_entity_id ON audit_logs(entity_id);
    CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
  `);
}

ensureAuditTable();

export function recordAuditLog({ action, entityId, entityName, officerId, details, previousHash = null }) {
  const timestamp = new Date().toISOString();
  const logId = `AUDIT-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const lastEntry = db.prepare('SELECT hash FROM audit_logs ORDER BY seq DESC LIMIT 1').get();
  const prevHash = previousHash || lastEntry?.hash || 'GENESIS_AUDIT_BLOCK_GEM_2026';
  const normalizedOfficer = officerId || 'OFFICER-GEM-BUYER-042';
  const safeDetails = details || {};

  const contentToHash = JSON.stringify({
    logId,
    timestamp,
    action,
    entityId,
    entityName,
    officerId: normalizedOfficer,
    details: safeDetails,
    prevHash
  });

  const hash = crypto.createHash('sha256').update(contentToHash).digest('hex');

  const entry = {
    logId,
    timestamp,
    action,
    entityId,
    entityName,
    officerId: normalizedOfficer,
    details: safeDetails,
    prevHash,
    hash
  };

  db.prepare(`
    INSERT INTO audit_logs (
      log_id, timestamp, action, entity_id, entity_name,
      officer_id, details, prev_hash, hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    logId,
    timestamp,
    action,
    entityId,
    entityName,
    normalizedOfficer,
    JSON.stringify(safeDetails),
    prevHash,
    hash
  );

  return entry;
}

export function getAuditLogs(entityId = null) {
  const rows = entityId
    ? db.prepare('SELECT * FROM audit_logs WHERE entity_id = ? ORDER BY seq DESC').all(entityId)
    : db.prepare('SELECT * FROM audit_logs ORDER BY seq DESC').all();

  return rows.map(row => ({
    logId: row.log_id,
    timestamp: row.timestamp,
    action: row.action,
    entityId: row.entity_id,
    entityName: row.entity_name,
    officerId: row.officer_id,
    details: JSON.parse(row.details || '{}'),
    prevHash: row.prev_hash,
    hash: row.hash
  }));
}

export function verifyAuditChain() {
  const rows = db.prepare('SELECT * FROM audit_logs ORDER BY seq ASC').all();
  let previousHash = 'GENESIS_AUDIT_BLOCK_GEM_2026';

  for (const row of rows) {
    const details = JSON.parse(row.details || '{}');
    const contentToHash = JSON.stringify({
      logId: row.log_id,
      timestamp: row.timestamp,
      action: row.action,
      entityId: row.entity_id,
      entityName: row.entity_name,
      officerId: row.officer_id,
      details,
      prevHash: row.prev_hash
    });
    const expected = crypto.createHash('sha256').update(contentToHash).digest('hex');
    if (row.prev_hash !== previousHash || row.hash !== expected) {
      return { valid: false, brokenAt: row.log_id };
    }
    previousHash = row.hash;
  }

  return { valid: true, entries: rows.length };
}

// Seed one system event only when the persistent audit ledger is empty.
if (db.prepare('SELECT COUNT(*) AS count FROM audit_logs').get().count === 0) {
  recordAuditLog({
    action: 'SYSTEM_INITIALIZATION',
    entityId: 'GEM-SYSTEM',
    entityName: 'GeM-Verify AI Engine',
    officerId: 'SYSTEM_ADMIN',
    details: {
      message: 'GeM statutory verification engine initialized with sandbox government connectors.',
      status: 'OPERATIONAL'
    }
  });
}
