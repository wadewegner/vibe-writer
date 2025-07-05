const axios = require('axios');

const stravaApi = {
  /**
   * Fetches detailed information about a specific activity from the Strava API.
   * @param {string} accessToken - The user's Strava access token.
   * @param {number} activityId - The ID of the Strava activity.
   * @returns {Promise<object>} A promise that resolves to the activity data object.
   */
  getActivityById: async (accessToken, activityId) => {
    try {
      const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching Strava activity ${activityId}:`, error.response ? error.response.data : error.message);
      // TODO: Handle token refresh if error is 401 Unauthorized
      throw error;
    }
  },

  /**
   * Updates an activity on Strava with a new title.
   * @param {string} accessToken - The user's Strava access token.
   * @param {number} activityId - The ID of the Strava activity to update.
   * @param {string} newTitle - The new title for the activity.
   */
  updateActivity: async (accessToken, activityId, newTitle) => {
    try {
      await axios.put(`https://www.strava.com/api/v3/activities/${activityId}`, 
        { name: newTitle },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log(`Successfully updated title for activity ${activityId}`);
    } catch (error) {
      console.error(`Error updating Strava activity ${activityId}:`, error.response ? error.response.data : error.message);
      // TODO: Handle token refresh if error is 401 Unauthorized
      throw error;
    }
  }
};

module.exports = stravaApi; 