const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const db = require('./services/db');

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

// Mount routers
app.use('/auth', authRoutes);

// Middleware to protect routes
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/');
};

app.get('/', (req, res) => {
  res.render('login');
});

// Placeholder for the dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send('<h1>Dashboard</h1><p>Welcome! You are logged in.</p>');
});

app.listen(port, () => {
  console.log(`Web service listening at http://localhost:${port}`);
}); 