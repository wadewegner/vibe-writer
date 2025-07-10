const axios = require('axios');
const logger = require('./logger');

const aiGenerator = {
  /**
   * Generates a new activity title by calling an OpenAI-compatible API.
   * @param {string} userPrompt - The user's custom prompt for title generation.
   * @param {object} activity - The detailed Strava activity object.
   * @returns {Promise<string>} A promise that resolves to the newly generated title.
   */
  generateTitle: async (userPrompt, activity) => {
    try {
      // Use a default prompt if the user has not provided one.
      const effectiveUserPrompt = userPrompt || 'Make it sound epic and fun!';
      
      const rawActivity = activity.activity_data || activity;

      const activityData = {
        type: rawActivity.type,
        distance_km: (rawActivity.distance / 1000).toFixed(2),
        distance_miles: (rawActivity.distance * 0.000621371).toFixed(2),
        moving_time_minutes: Math.round(rawActivity.moving_time / 60),
        elevation_gain_meters: Math.round(rawActivity.total_elevation_gain),
        elevation_gain_feet: Math.round(rawActivity.total_elevation_gain * 3.28084),
      };

      const systemPrompt = `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity.

You will receive user instructions and a JSON object with the activity's data. Use both to craft a title. The title should be a single, compelling phrase and must not be enclosed in quotation marks.

Here is an example of the activity data you will receive:
{
  "type": "Ride",
  "distance_km": 10.5,
  "distance_miles": 6.5,
  "moving_time_minutes": 30,
  "elevation_gain_meters": 150,
  "elevation_gain_feet": 492
}

Generate a title that reflects the user's instructions and the provided data.`;
      
      const finalPrompt = `User's instruction: "${effectiveUserPrompt}"\n\nActivity Data:\n${JSON.stringify(activityData, null, 2)}`;

      const requestPayload = {
        model: process.env.AI_MODEL_NAME || 'openai-o3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt }
        ]
      };

      // Use JSON.stringify to ensure the full payload is logged without truncation.
      logger.info('Sending request to AI service.', { endpoint: 'https://inference.do-ai.run/v1/chat/completions', payload: JSON.stringify(requestPayload, null, 2) });

      const response = await axios.post('https://inference.do-ai.run/v1/chat/completions', requestPayload, {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      logger.info('Received response from AI service.', { responseData: response.data });
      
      const title = response.data.choices[0].message.content.trim();
      return title;

    } catch (error) {
      console.error('Error generating title from AI service:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

module.exports = aiGenerator; 