const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { STRAVA_ACTIVITY_TYPES, getAllActivityTypes } = require('../services/constants');

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
      
      // Get user preferences with fallback defaults
      const isImperial = user.is_imperial !== null ? user.is_imperial : true;
      const activityTypes = user.activity_types || getAllActivityTypes();

      // Build dynamic example and activity data based on unit preference
      let exampleData, previewActivityData;
      
      if (isImperial) {
        exampleData = {
          type: "Ride",
          distance_miles: 6.5,
          moving_time_minutes: 30,
          elevation_gain_feet: 492
        };
        previewActivityData = {
          type: "Ride",
          distance_miles: "7.67",
          moving_time_minutes: 45,
          elevation_gain_feet: 689
        };
      } else {
        exampleData = {
          type: "Ride",
          distance_km: 10.5,
          moving_time_minutes: 30,
          elevation_gain_meters: 150
        };
        previewActivityData = {
          type: "Ride",
          distance_km: "12.34",
          moving_time_minutes: 45,
          elevation_gain_meters: 210
        };
      }

      // Construct the exact payload for the preview
      const previewPayload = {
        model: process.env.AI_MODEL_NAME || 'openai-o3',
        messages: [
          { 
            role: 'system', 
            content: `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity.

You will receive user instructions and a JSON object with the activity's data. Use both to craft a title. The title should be a single, compelling phrase and must not be enclosed in quotation marks.

Here is an example of the activity data you will receive:
${JSON.stringify(exampleData, null, 2)}

Generate a title that reflects the user's instructions and the provided data.`
          },
          { 
            role: 'user', 
            content: `User's instruction: "${userPrompt}"\n\nActivity Data:\n${JSON.stringify(previewActivityData, null, 2)}` 
          }
        ]
      };

      const fullPromptPreview = JSON.stringify(previewPayload, null, 2);

      res.render('settings', { 
        user, 
        fullPromptPreview,
        currentPage: 'settings',
        activityTypes: STRAVA_ACTIVITY_TYPES,
        userActivityTypes: activityTypes
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
  },

  updatePreferences: async (req, res) => {
    try {
      const userId = req.session.userId;
      let { is_imperial, activity_types } = req.body;

      // Validate and convert is_imperial to boolean
      if (typeof is_imperial === 'string') {
        is_imperial = is_imperial === 'true';
      }
      if (typeof is_imperial !== 'boolean') {
        is_imperial = true; // Default to imperial if invalid
      }

      // Validate activity_types is an array
      if (!Array.isArray(activity_types)) {
        // If it's a single value (from a single checkbox), convert to array
        if (activity_types) {
          activity_types = [activity_types];
        } else {
          activity_types = []; // Allow empty array per PRD FR-9
        }
      }

      // Update user preferences in database
      await db.query(
        'UPDATE users SET is_imperial = $1, activity_types = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [is_imperial, JSON.stringify(activity_types), userId]
      );
      
      console.log(`Updated preferences for user ${userId}: is_imperial=${is_imperial}, activity_types count=${activity_types.length}`);
      res.redirect('/settings'); // Redirect back to settings page
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).send('An error occurred while updating your preferences.');
    }
  }
};

router.get('/', settingsController.getSettings);
router.post('/prompt', settingsController.updatePrompt);
router.post('/preferences', settingsController.updatePreferences);

module.exports = router; 