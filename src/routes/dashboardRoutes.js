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

const dashboardController = {
  getDashboard: async (req, res) => {
    try {
      const userId = req.session.userId;

      // Fetch user and activities data
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

      res.render('dashboard', {
        activities: activitiesResult.rows,
        user: userResult.rows[0], // Pass user to the view
        currentPage: 'dashboard' // Add current page identifier
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).send('An error occurred while fetching dashboard data.');
    }
  },
};

router.get('/', dashboardController.getDashboard);

module.exports = router; 