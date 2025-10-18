const db = require('../services/db');

/**
 * Middleware to verify that the current user is an administrator.
 * Checks both authentication (session exists) and admin status (is_admin = true).
 * Redirects non-admin users to the dashboard.
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
const isAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.session.userId) {
      return res.redirect('/');
    }

    // Query the database to check admin status
    const result = await db.query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.session.userId]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      console.error('User not found in database:', req.session.userId);
      return res.redirect('/dashboard');
    }

    // Check if user is an admin
    if (result.rows[0].is_admin === true) {
      return next();
    }

    // User is authenticated but not an admin
    console.log('Non-admin user attempted to access admin area:', req.session.userId);
    return res.status(403).redirect('/dashboard');

  } catch (error) {
    console.error('Error checking admin status:', error);
    return res.redirect('/dashboard');
  }
};

module.exports = { isAdmin };

