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
      const effectivePrompt = userPrompt || 'Make it sound epic and fun!';
      
      // Construct a detailed prompt for the AI
      const systemPrompt = `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity based on their prompt and the activity data. The title should not be enclosed in quotation marks.`;
      
      const activityData = JSON.stringify({
        type: activity.type,
        distance_meters: activity.distance,
        moving_time_seconds: activity.moving_time,
        elapsed_time_seconds: activity.elapsed_time,
        elevation_gain_meters: activity.total_elevation_gain,
        start_location: activity.start_latlng,
        name: activity.name,
      }, null, 2);

      const finalPrompt = `User's instruction: "${effectivePrompt}"\n\nActivity Data:\n${activityData}`;

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