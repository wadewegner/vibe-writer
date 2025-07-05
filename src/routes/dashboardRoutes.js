const express = require('express');
const router = express.Router();
const db = require('../services/db');

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const userId = req.session.userId;

      // Fetch user and activities data in parallel
      const userQuery = db.query('SELECT * FROM users WHERE id = $1', [userId]);
      const activitiesQuery = db.query(
        'SELECT * FROM processed_activities WHERE user_id = $1 ORDER BY processed_at DESC LIMIT 20',
        [userId]
      );

      const [userResult, activitiesResult] = await Promise.all([userQuery, activitiesQuery]);

      if (userResult.rows.length === 0) {
        // This would be an unusual state, maybe session exists but user was deleted.
        return req.session.destroy(() => res.redirect('/'));
      }

      const user = userResult.rows[0];
      const activities = activitiesResult.rows;

      res.render('dashboard', { user, activities });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('An error occurred while fetching dashboard data.');
    }
  },

  updatePrompt: async (req, res) => {
    try {
      const { prompt } = req.body;
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).send('You must be logged in to update your prompt.');
      }

      await db.query('UPDATE users SET prompt = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [prompt, userId]);
      
      console.log(`Updated prompt for user ${userId}`);
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error updating prompt:', error);
      res.status(500).send('An error occurred while updating your prompt.');
    }
  }
};

router.get('/', dashboardController.getDashboard);
router.post('/prompt', dashboardController.updatePrompt);

module.exports = router; 