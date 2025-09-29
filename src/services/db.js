const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

/**
 * Fetch the most recent generated titles for a user.
 * Returns up to `limit` non-empty titles, deduplicated case-insensitively while preserving order.
 *
 * @param {number} userId - Local user id
 * @param {number} [limit=20] - Max number of titles to return
 * @returns {Promise<string[]>}
 */
async function getRecentGeneratedTitles(userId, limit = 20) {
  const sql = `
    SELECT generated_title
    FROM processed_activities
    WHERE user_id = $1
      AND generated_title IS NOT NULL
      AND LENGTH(TRIM(generated_title)) > 0
    ORDER BY processed_at DESC
    LIMIT $2
  `;

  const result = await pool.query(sql, [userId, limit]);
  const seen = new Set();
  const titles = [];

  for (const row of result.rows) {
    const title = String(row.generated_title).trim();
    if (!title) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    titles.push(title);
  }

  return titles;
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  getRecentGeneratedTitles,
}; 