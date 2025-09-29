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
      const userPrompt = user.prompt || 'Make my titles sound epic and heroic.';

      // Construct the exact payload for the preview
      const previewPayload = {
        model: process.env.AI_MODEL_NAME || 'openai-o3',
        messages: [
          { 
            role: 'system', 
            content: `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity.

You will receive user instructions and a JSON object with the activity's data. Use both to craft a title. The title should be a single, compelling phrase.

Here is an example of the activity data you will receive:
{
  "type": "Ride",
  "distance_km": 10.5,
  "distance_miles": 6.5,
  "moving_time_minutes": 30,
  "elevation_gain_meters": 150,
  "elevation_gain_feet": 492
}

Generate a title that reflects the user's instructions and the provided data.`
          },
          { 
            role: 'user', 
            content: `User's instruction: "${userPrompt}"\n\nActivity Data:\n${JSON.stringify({
              type: "Ride",
              distance_km: "12.34",
              distance_miles: "7.67",
              moving_time_minutes: 45,
              elevation_gain_meters: 210,
              elevation_gain_feet: 689
            }, null, 2)}` 
          }
        ]
      };

      const fullPromptPreview = JSON.stringify(previewPayload, null, 2);

      res.render('settings', { 
        user, 
        fullPromptPreview,
        currentPage: 'settings'
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