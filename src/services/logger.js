const db = require('./db');

const logger = {
  /**
   * Logs a message to the console and saves it to the database.
   * @param {string} level - The log level (e.g., 'error', 'info').
   * @param {string} message - The log message.
   * @param {object} context - Additional context to store as a JSON object.
   */
  log: async (level, message, context = {}) => {
    try {
      // Always log to console for immediate visibility
      console.log(`[${level.toUpperCase()}]`, message, context);

      const query = `
        INSERT INTO logs (level, message, context)
        VALUES ($1, $2, $3)
      `;
      const values = [level, message, context];
      await db.query(query, values);
    } catch (dbError) {
      // If the logger itself fails, log to console to avoid a loop
      console.error('CRITICAL: Failed to write log to database.', {
        originalLevel: level,
        originalMessage: message,
        originalContext: context,
        loggerDbError: dbError.message,
      });
    }
  },

  error: (message, context) => {
    return logger.log('error', message, context);
  },

  info: (message, context) => {
    return logger.log('info', message, context);
  }
};

module.exports = logger; 