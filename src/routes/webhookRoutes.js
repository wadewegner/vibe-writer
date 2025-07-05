const express = require('express');
const router = express.Router();
const db = require('../services/db');
const stravaApi = require('../services/stravaApi');
const aiGenerator = require('../services/aiGenerator');
const logger = require('../services/logger');

const webhookController = {
  // Strava Webhook Subscription Validation
  validateSubscription: (req, res) => {
    const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

    // Verify the webhook's subscription request
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      logger.info('Webhook subscription validated.');
      res.status(200).json({ 'hub.challenge': challenge });
    } else {
      logger.error('Failed to verify webhook subscription token.');
      res.sendStatus(403);
    }
  },

  // Strava Webhook Event Receiver
  handleEvent: async (req, res) => {
    logger.info('Received webhook event:', JSON.stringify(req.body, null, 2));

    // Acknowledge the event immediately
    res.status(200).send('EVENT_RECEIVED');

    const { object_type, aspect_type, object_id, owner_id } = req.body;

    let context = { object_id, owner_id };

    if (object_type === 'activity' && aspect_type === 'create') {
      try {
        // 1. Find the user in our database via their Strava ID (owner_id)
        const userResult = await db.query('SELECT * FROM users WHERE strava_id = $1', [owner_id]);
        
        if (userResult.rows.length === 0) {
          logger.info(`Received event for an unknown user with Strava ID: ${owner_id}. Skipping.`, context);
          return;
        }
        const user = userResult.rows[0];
        const userId = user.id;
        context.userId = userId;

        // 2. Check if this activity has already been processed for this user
        const activityResult = await db.query(
          'SELECT id FROM processed_activities WHERE user_id = $1 AND activity_id = $2',
          [userId, object_id]
        );

        if (activityResult.rows.length > 0) {
          logger.info(`Activity ${object_id} for user ${userId} has already been processed. Skipping.`, context);
          return;
        }

        logger.info(`Processing new activity ${object_id} for user ${userId}.`, context);

        // Fetch activity details from Strava
        const activityDetails = await stravaApi.getActivityById(user.access_token, object_id);

        // Generate a new title using the AI service
        const generatedTitle = await aiGenerator.generateTitle(user.prompt, activityDetails);
        logger.info(`Generated title for activity ${object_id}: "${generatedTitle}"`, context);

        // 6. Update the activity on Strava with the new title
        await stravaApi.updateActivity(user.access_token, object_id, generatedTitle);

        // 7. Log a record in processed_activities to prevent duplicates
        const logQuery = `
          INSERT INTO processed_activities (user_id, activity_id, original_title, generated_title)
          VALUES ($1, $2, $3, $4)
        `;
        const logValues = [userId, object_id, activityDetails.name, generatedTitle];
        await db.query(logQuery, logValues);

        logger.info(`Successfully processed activity ${object_id} for user ${userId}.`, context);

      } catch (error) {
        logger.error('Error processing webhook event', { ...context, error: error.message, stack: error.stack });
      }
    }
  }
};

// Endpoint for Strava to validate the webhook subscription
router.get('/', webhookController.validateSubscription);

// Endpoint for Strava to send new activity events
router.post('/', webhookController.handleEvent);

module.exports = router; 