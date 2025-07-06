// This file will contain the API routes for activity-related actions,
// such as regenerating and updating titles.
const express = require('express');
const router = express.Router();
const db = require('../services/db');
const aiGenerator = require('../services/aiGenerator');
const stravaApi = require('../services/stravaApi');

// Middleware to ensure the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
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
    
    // Pass the entire activity record to the generator
    const newTitle = await aiGenerator.generateTitle(user.prompt, activity);

    res.json({ newTitle });
  } catch (error) {
    console.error('Error fetching activity for regeneration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * @route PUT /api/activities/:id/title
 * @description Updates the title for a specific activity.
 * @access Private
 */
router.put('/:id/title', async (req, res) => {
  try {
    const { id } = req.params;
    const { newTitle } = req.body;
    const userId = req.session.userId;

    if (!newTitle || typeof newTitle !== 'string') {
      return res.status(400).json({ message: 'A valid new title must be provided.' });
    }

    // 1. Fetch the user's access token and the activity's Strava ID
    const userQuery = db.query('SELECT access_token FROM users WHERE id = $1', [userId]);
    const activityQuery = db.query(
      'SELECT activity_id FROM processed_activities WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    const [userResult, activityResult] = await Promise.all([userQuery, activityQuery]);

    if (userResult.rows.length === 0 || activityResult.rows.length === 0) {
      return res.status(404).json({ message: 'User or activity not found.' });
    }

    const accessToken = userResult.rows[0].access_token;
    const stravaActivityId = activityResult.rows[0].activity_id;

    // 2. Call the Strava API to update the title
    await stravaApi.updateActivity(accessToken, stravaActivityId, newTitle);

    // 3. Update the title in the local database
    await db.query(
      'UPDATE processed_activities SET generated_title = $1 WHERE id = $2 AND user_id = $3',
      [newTitle, id, userId]
    );

    res.json({ message: 'Title updated successfully.' });
  } catch (error) {
    console.error('Error updating title:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router; 