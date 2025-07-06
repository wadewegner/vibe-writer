const axios = require('axios');
const db = require('./db');
const logger = require('./logger');

const STRAVA_API_URL = 'https://www.strava.com/api/v3';
const TOKEN_URL = 'https://www.strava.com/oauth/token';

const stravaApi = {

  refreshAccessToken: async (userId) => {
    logger.info(`Attempting to refresh access token for user ${userId}`);
    try {
      const { rows } = await db.query('SELECT refresh_token FROM users WHERE id = $1', [userId]);
      if (rows.length === 0) {
        throw new Error(`User with id ${userId} not found`);
      }
      const refreshToken = rows[0].refresh_token;

      const response = await axios.post(TOKEN_URL, {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token, expires_at } = response.data;
      const expiresAtDate = new Date(expires_at * 1000);

      await db.query(
        'UPDATE users SET access_token = $1, refresh_token = $2, token_expires_at = $3 WHERE id = $4',
        [access_token, refresh_token, expiresAtDate, userId]
      );
      
      logger.info(`Successfully refreshed access token for user ${userId}`);
      return access_token;
    } catch (error) {
      logger.error(`Error refreshing access token for user ${userId}: ${error.message}`);
      throw error;
    }
  },

  /**
   * A wrapper for making Strava API requests that handles token refreshes.
   * @param {function} apiCall - The function that makes the actual API call.
   */
  makeRequest: async function(apiCall, userId) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logger.warn(`Received 401 Unauthorized for user ${userId}. Refreshing token.`);
        const { access_token } = await this.refreshAccessToken(userId);
        // Retry the request with the new token
        logger.info(`Retrying API request for user ${userId} with new token.`);
        return await apiCall(access_token);
      }
      // For other errors, just re-throw
      throw error;
    }
  },

  /**
   * Fetches detailed information about a specific activity from the Strava API.
   * @param {string} accessToken - The user's Strava access token.
   * @param {number} activityId - The ID of the Strava activity.
   * @returns {Promise<object>} A promise that resolves to the activity data object.
   */
  getActivityById: async function(accessToken, activityId, userId) {
    const apiCall = async (token = accessToken) => {
      let retries = 3;
      let delay = 3000; // Start with a 3-second delay

      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(`${STRAVA_API_URL}/activities/${activityId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          return response.data; // Success
        } catch (error) {
          if (error.response && error.response.status === 404 && i < retries - 1) {
            logger.warn(`Activity ${activityId} not found, retrying in ${delay / 1000}s... (Attempt ${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Double the delay for the next attempt
          } else {
            logger.error(`Error fetching Strava activity ${activityId}:`, error.response ? error.response.data : error.message);
            throw error;
          }
        }
      }
      throw new Error(`Failed to fetch activity ${activityId} after ${retries} attempts.`);
    };

    return this.makeRequest(apiCall, userId);
  },

  /**
   * Updates an activity on Strava with a new title.
   * @param {string} accessToken - The user's Strava access token.
   * @param {number} activityId - The ID of the Strava activity to update.
   * @param {string} newTitle - The new title for the activity.
   */
  updateActivity: async function(accessToken, activityId, newTitle, userId) {
    const apiCall = async (token = accessToken) => {
      try {
        await axios.put(`${STRAVA_API_URL}/activities/${activityId}`, 
          { name: newTitle },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        logger.info(`Successfully updated title for activity ${activityId}`);
      } catch (error) {
        logger.error(`Error updating Strava activity ${activityId}:`, error.response ? error.response.data : error.message);
        throw error;
      }
    };
    return this.makeRequest(apiCall, userId);
  }
};

module.exports = stravaApi; 