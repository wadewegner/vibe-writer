const axios = require('axios');
const logger = require('./logger');

const aiGenerator = {
  /**
   * Generates a new activity title by calling an OpenAI-compatible API.
   * @param {string} userPrompt - The user's custom prompt for title generation.
   * @param {object} activity - The detailed Strava activity object.
   * @param {string[]} [recentTitles] - Optional list of the user's recent generated titles
   *  used to reduce repetition. Not yet used in prompt composition at this stage.
   * @param {boolean} [isImperial=true] - Whether to use imperial units (true) or metric (false).
   * @returns {Promise<string>} A promise that resolves to the newly generated title.
   */
  generateTitle: async (userPrompt, activity, recentTitles = [], isImperial = true) => {
    try {
      // Use a default prompt if the user has not provided one.
      const effectiveUserPrompt = userPrompt || 'Make it sound epic and fun!';
      
      const rawActivity = activity.activity_data || activity;

      // Build activityData based on unit preference
      const activityData = {
        type: rawActivity.type,
        moving_time_minutes: Math.round(rawActivity.moving_time / 60)
      };

      // Add distance and elevation based on unit preference
      if (isImperial) {
        activityData.distance_miles = (rawActivity.distance * 0.000621371).toFixed(2);
        activityData.elevation_gain_feet = Math.round(rawActivity.total_elevation_gain * 3.28084);
      } else {
        activityData.distance_km = (rawActivity.distance / 1000).toFixed(2);
        activityData.elevation_gain_meters = Math.round(rawActivity.total_elevation_gain);
      }

      // Build dynamic example based on unit preference
      const exampleData = isImperial ? {
        type: "Ride",
        distance_miles: 6.5,
        moving_time_minutes: 30,
        elevation_gain_feet: 492
      } : {
        type: "Ride",
        distance_km: 10.5,
        moving_time_minutes: 30,
        elevation_gain_meters: 150
      };

      const systemPrompt = `You are a creative assistant for the fitness app Strava. Your task is to generate a short, engaging title for a user's activity.

You will receive user instructions and a JSON object with the activity's data. Use both to craft a title. The title should be a single, compelling phrase and must not be enclosed in quotation marks (unless the user explicitly requests them). Do not include distance, time, or elevation data unless expressly requested by the user.

Here is an example of the activity data you will receive:
${JSON.stringify(exampleData, null, 2)}

Generate a title that reflects the user's instructions and the provided data.`;
      
      const cleanedRecentTitles = Array.isArray(recentTitles)
        ? recentTitles
            .filter(Boolean)
            .map(t => t.toString().trim())
            .filter(t => t.length > 0)
            .slice(0, 20)
        : [];

      const recentTitlesSection = cleanedRecentTitles.length > 0
        ? `\n\nRecent Titles (avoid generating anything similar to these):\n${cleanedRecentTitles.map(t => `- ${t}`).join('\n')}`
        : '';

      const constraintsSection = `\n\nConstraints:\n- Do NOT produce a title that is the same as or clearly resembles any recent title above.\n- Vary word choice, style, and structure. Use a fresh angle.\n- Output a single concise title without quotation marks (unless the user explicitly requests them).`;

      const finalPrompt = `User's instruction: "${effectiveUserPrompt}"\n\nActivity Data:\n${JSON.stringify(activityData, null, 2)}${recentTitlesSection}${constraintsSection}`;

      const requestPayload = {
        model: process.env.AI_MODEL_NAME || 'openai-o3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: finalPrompt }
        ]
      };

      // Observability: log model and count of recent titles only (do not log full prompt)
      logger.info('Sending request to AI service.', {
        endpoint: 'https://inference.do-ai.run/v1/chat/completions',
        model: requestPayload.model,
        recentTitlesCount: cleanedRecentTitles.length
      });

      const response = await axios.post('https://inference.do-ai.run/v1/chat/completions', requestPayload, {
        headers: {
          'Authorization': `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      const title = response.data.choices[0].message.content.trim();
      logger.info('Received response from AI service.', { titlePreview: title.slice(0, 60), titleLength: title.length });
      return title;

    } catch (error) {
      console.error('Error generating title from AI service:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

module.exports = aiGenerator; 