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
      
      // The raw activity data might be nested if coming from our DB
      const rawActivity = activity.activity_data || activity;

      // --- Placeholder Replacement Logic ---
      const replacements = {
        '{distance_km}': (rawActivity.distance / 1000).toFixed(2),
        '{distance_miles}': (rawActivity.distance * 0.000621371).toFixed(2),
        '{moving_time_minutes}': Math.round(rawActivity.moving_time / 60),
        '{moving_time_hours}': (rawActivity.moving_time / 3600).toFixed(2),
        '{elevation_gain_meters}': Math.round(rawActivity.total_elevation_gain),
        '{elevation_gain_feet}': Math.round(rawActivity.total_elevation_gain * 3.28084),
        '{type}': rawActivity.type,
      };

      let finalUserPrompt = effectivePrompt;
      for (const placeholder in replacements) {
        finalUserPrompt = finalUserPrompt.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
      }
      // --- End Placeholder Replacement ---

      // Construct a detailed prompt for the AI
      const systemPrompt = `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity based on their prompt and the activity data. The title should not be enclosed in quotation marks.`;
      
      const activityData = JSON.stringify({
        type: rawActivity.type,
        distance_meters: rawActivity.distance,
        moving_time_seconds: rawActivity.moving_time,
        elapsed_time_seconds: rawActivity.elapsed_time,
        elevation_gain_meters: rawActivity.total_elevation_gain,
        start_location: rawActivity.start_latlng,
        name: rawActivity.name,
      }, null, 2);

      const finalPrompt = `User's instruction: "${finalUserPrompt}"\n\nActivity Data:\n${activityData}`;

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