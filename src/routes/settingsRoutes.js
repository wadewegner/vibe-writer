const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Middleware to ensure the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

router.use(isAuthenticated);

const settingsController = {
  getSettings: async (req, res) => {
    try {
      const userId = req.session.userId;
      const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

      if (userResult.rows.length === 0) {
        return req.session.destroy(() => res.redirect('/'));
      }

      const user = userResult.rows[0];

      // This is the default system prompt from the PRD.
      const systemPrompt = `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity.

You will receive user instructions and a JSON object with the activity's data. Use both to craft a title. The title should be a single, compelling phrase and must not be enclosed in quotation marks.

Here is the structure of the activity data you will receive:
{
  "type": "Ride", // Type of activity (e.g., Run, Ride, Swim)
  "distance_km": 10.5, // Distance in kilometers
  "distance_miles": 6.5, // Distance in miles
  "moving_time_minutes": 30, // Moving time in minutes
  "elevation_gain_meters": 150, // Elevation gain in meters
  "elevation_gain_feet": 492 // Elevation gain in feet
}

Generate a title that reflects the user's instructions and the provided data.`;

      const userPrompt = user.prompt || 'Make my titles sound epic and heroic.';
      const fullPromptPreview = `SYSTEM PROMPT:\n------------\n${systemPrompt}\n\nUSER INSTRUCTIONS:\n------------------\n${userPrompt}`;

      res.render('settings', { 
        user, 
        fullPromptPreview,
        currentPage: 'settings' // Add current page identifier
      });

    } catch (error) {
      console.error('Error fetching settings data:', error);
      res.status(500).send('An error occurred while fetching settings data.');
    }
  },

  updatePrompt: async (req, res) => {
    try {
      const { prompt } = req.body;
      const userId = req.session.userId;

      await db.query('UPDATE users SET prompt = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [prompt, userId]);
      
      console.log(`Updated prompt for user ${userId}`);
      res.redirect('/settings'); // Redirect back to settings page
    } catch (error) {
      console.error('Error updating prompt:', error);
      res.status(500).send('An error occurred while updating your prompt.');
    }
  }
};

router.get('/', settingsController.getSettings);
router.post('/prompt', settingsController.updatePrompt);

module.exports = router; 