const express = require('express');
const router = express.Router();

// GET /changelog
router.get('/', (req, res) => {
  res.render('changelog');
});

// Future routes will be added here

module.exports = router; 