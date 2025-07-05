const axios = require('axios');

const stravaApi = {
  /**
   * Fetches detailed information about a specific activity from the Strava API.
   * @param {string} accessToken - The user's Strava access token.
   * @param {number} activityId - The ID of the Strava activity.
   * @returns {Promise<object>} A promise that resolves to the activity data object.
   */
  getActivityById: async (accessToken, activityId) => {
    let retries = 3;
    let delay = 3000; // Start with a 3-second delay

    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(`https://www.strava.com/api/v3/activities/${activityId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        return response.data; // Success, return the data
      } catch (error) {
        // If it's a 404 error and we have retries left, wait and try again
        if (error.response && error.response.status === 404 && i < retries - 1) {
          console.log(`Activity ${activityId} not found, retrying in ${delay / 1000}s... (Attempt ${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the delay for the next attempt
        } else {
          // For all other errors, or if we're out of retries, throw the error
          console.error(`Error fetching Strava activity ${activityId}:`, error.response ? error.response.data : error.message);
          // TODO: Handle token refresh if error is 401 Unauthorized
          throw error;
        }
      }
    }
    // This line should not be reachable if retries are exhausted, as the error is thrown above.
    // Included for safety to ensure an error is always thrown if the loop completes without success.
    throw new Error(`Failed to fetch activity ${activityId} after ${retries} attempts.`);
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