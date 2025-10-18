const express = require('express');
const router = express.Router();
const db = require('../services/db');
const { isAdmin } = require('../middleware/adminAuth');

// Apply admin middleware to all routes in this router
router.use(isAdmin);

/**
 * Admin Dashboard Controller
 * Fetches system metrics and user list for the admin portal
 */
const getAdminDashboard = async (req, res) => {
  try {
    // Execute all queries in parallel for better performance
    const [
      totalUsersResult,
      dailyTitlesResult,
      totalTitlesResult,
      dailyNewUsersResult,
      usersListResult
    ] = await Promise.all([
      // Query 1: Total users count
      db.query('SELECT COUNT(*) as total_users FROM users'),
      
      // Query 2: Daily titles generated (today only)
      db.query(
        'SELECT COUNT(*) as daily_titles FROM processed_activities WHERE DATE(processed_at) = CURRENT_DATE'
      ),
      
      // Query 3: Total titles generated (all time)
      db.query('SELECT COUNT(*) as total_titles FROM processed_activities'),
      
      // Query 4: Daily new users (today only)
      db.query(
        'SELECT COUNT(*) as daily_new_users FROM users WHERE DATE(created_at) = CURRENT_DATE'
      ),
      
      // Query 5: User list with activity statistics
      db.query(`
        SELECT 
          u.id,
          u.strava_id,
          u.created_at,
          u.updated_at,
          u.prompt,
          u.is_imperial,
          u.activity_types,
          u.is_admin,
          COUNT(pa.id) as activity_count,
          MAX(pa.processed_at) as last_activity_date
        FROM users u
        LEFT JOIN processed_activities pa ON u.id = pa.user_id
        GROUP BY u.id
        ORDER BY activity_count DESC
      `)
    ]);

    // Extract metric counts from results
    const totalUsers = parseInt(totalUsersResult.rows[0].total_users);
    const dailyTitles = parseInt(dailyTitlesResult.rows[0].daily_titles);
    const totalTitles = parseInt(totalTitlesResult.rows[0].total_titles);
    const dailyNewUsers = parseInt(dailyNewUsersResult.rows[0].daily_new_users);

    // Process user list data for display
    const users = usersListResult.rows.map(user => {
      // Truncate prompt to 50 characters if longer
      let promptDisplay = user.prompt;
      if (!promptDisplay || promptDisplay.trim() === '') {
        promptDisplay = 'Default';
      } else if (promptDisplay.length > 50) {
        promptDisplay = promptDisplay.substring(0, 50) + '...';
      }

      // Format dates
      const createdAtFormatted = user.created_at ? 
        new Date(user.created_at).toLocaleDateString() : 'N/A';
      const updatedAtFormatted = user.updated_at ? 
        new Date(user.updated_at).toLocaleDateString() : 'N/A';
      const lastActivityDateFormatted = user.last_activity_date ? 
        new Date(user.last_activity_date).toLocaleDateString() : 'None';

      // Convert is_imperial boolean to display string
      const unitPreference = user.is_imperial ? 'Imperial' : 'Metric';

      // Handle activity_types JSONB field
      let activityTypesDisplay = 'N/A';
      if (user.activity_types && Array.isArray(user.activity_types)) {
        activityTypesDisplay = `${user.activity_types.length} types`;
      }

      // Convert is_admin boolean to display string
      const adminStatus = user.is_admin ? 'Yes' : 'No';

      return {
        id: user.id,
        strava_id: user.strava_id,
        created_at_formatted: createdAtFormatted,
        updated_at_formatted: updatedAtFormatted,
        prompt_display: promptDisplay,
        unit_preference: unitPreference,
        activity_types_display: activityTypesDisplay,
        activity_count: user.activity_count || 0,
        last_activity_date_formatted: lastActivityDateFormatted,
        admin_status: adminStatus
      };
    });

    // Render the admin view with all data
    res.render('admin', {
      totalUsers,
      dailyTitles,
      totalTitles,
      dailyNewUsers,
      users,
      currentPage: 'admin',
      user: req.session.userId ? await getUserData(req.session.userId) : null
    });

  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).send('Error loading admin dashboard');
  }
};

/**
 * Helper function to get user data for navigation
 */
async function getUserData(userId) {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

// Register the route
router.get('/', getAdminDashboard);

module.exports = router;

