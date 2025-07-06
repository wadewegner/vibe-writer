// This file will contain the API routes for activity-related actions,
// such as regenerating and updating titles.
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const aiGenerator = require('../services/aiGenerator');

// Middleware to ensure the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'User not authenticated' });
};

// Apply authentication middleware to all routes in this file
router.use(isAuthenticated);

/**
 * @route POST /api/activities/:id/regenerate-title
 * @description Regenerates the title for a specific activity.
 * @access Private
 */
router.post('/:id/regenerate-title', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    const activityResult = await db.query(
      'SELECT * FROM processed_activities WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (activityResult.rows.length === 0) {
      return res.status(404).json({ message: 'Activity not found or access denied.' });
    }

    const activity = activityResult.rows[0];

    const userResult = await db.query('SELECT prompt FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      // This case should be rare if the user is authenticated and the activity exists
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = userResult.rows[0];
    
    // The activity data from the DB is already in the format the AI service expects
    const newTitle = await aiGenerator.generateTitle(user.prompt, activity.activity_data);

    res.json({ newTitle });
  } catch (error) {
    console.error('Error fetching activity for regeneration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router; 