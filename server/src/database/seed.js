import { db } from './database.js';
import { SAMPLE_BIDDERS } from '../data/sampleBidders.js';

export function seedDatabase() {
  const count = db
    .prepare('SELECT COUNT(*) AS count FROM bidders')
    .get();

  if (count.count > 0) {
    console.log(
      `SQLite already contains ${count.count} bidders. Skipping seed.`
    );
    return;
  }

  const insert = db.prepare(`
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

  const now = new Date().toISOString();

  const seedMany = db.transaction((bidders) => {
    for (const bidder of bidders) {
      insert.run(
        bidder.id,
        bidder.tenderId,
        bidder.bidderName,
        JSON.stringify(bidder),
        now,
        now
      );
    }
  });

  seedMany(SAMPLE_BIDDERS);

  console.log(
    `Seeded ${SAMPLE_BIDDERS.length} demo bidders into SQLite.`
  );
}