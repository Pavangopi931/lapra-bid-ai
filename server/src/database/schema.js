import { db } from './database.js';

export function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bidders (
      id TEXT PRIMARY KEY,
      tender_id TEXT NOT NULL,
      bidder_name TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_bidders_tender_id
    ON bidders(tender_id);

    CREATE INDEX IF NOT EXISTS idx_bidders_bidder_name
    ON bidders(bidder_name);

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

    CREATE INDEX IF NOT EXISTS idx_audit_entity_id
    ON audit_logs(entity_id);

    CREATE INDEX IF NOT EXISTS idx_audit_timestamp
    ON audit_logs(timestamp);
  `);

  console.log('SQLite database schema initialized.');
}