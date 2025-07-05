const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../services/db');

const stravaController = {
  redirectToStrava: (req, res) => {
    const scope = 'read,activity:write';
    const redirectUri = process.env.STRAVA_REDIRECT_URI;
    const clientId = process.env.STRAVA_CLIENT_ID;
    
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    res.redirect(authUrl);
  },

  handleCallback: async (req, res) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).send('Authorization code is missing.');
      }

      const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      });

      const { access_token, refresh_token, expires_at, athlete } = tokenResponse.data;

      // Save user data and tokens to the database
      const userQuery = `
        INSERT INTO users (strava_id, access_token, refresh_token, token_expires_at)
        VALUES ($1, $2, $3, TO_TIMESTAMP($4))
        ON CONFLICT (strava_id) DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          token_expires_at = EXCLUDED.token_expires_at,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id;
      `;
      const values = [athlete.id, access_token, refresh_token, expires_at];
      const { rows } = await db.query(userQuery, values);
      const userId = rows[0].id;
      
      // Set up user session
      req.session.userId = userId;

      console.log('Successfully authenticated and saved user:', userId);
      
      // Redirect to the dashboard
      res.redirect('/dashboard');

    } catch (error) {
      console.error('Error during Strava OAuth callback:', error.response ? error.response.data : error.message);
      res.status(500).send('An error occurred during authentication.');
    }
  },
};

// Redirect user to Strava for authentication
router.get('/strava', stravaController.redirectToStrava);

// Handle callback from Strava
router.get('/strava/callback', stravaController.handleCallback);

// Log user out
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router; 