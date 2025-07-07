const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./services/db');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const activityRoutes = require('./routes/activityRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body-parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session setup
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: 'sessions' 
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/');
};

// Mount routers
app.use('/auth', authRoutes);
app.use('/dashboard', isAuthenticated, dashboardRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/activities', activityRoutes);
app.use('/support', supportRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

app.listen(port, () => {
  console.log(`Web service listening at http://localhost:${port}`);
}); 