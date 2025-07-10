const express = require('express');
const router = express.Router();

// GET /changelog
router.get('/', (req, res) => {
  const changelogData = [
    {
      title: 'New Feature: AI-Powered Descriptions',
      summary: 'You can now automatically generate titles and descriptions for your Strava activities using our new AI integration. Simply enable it in your settings!',
      date: '2024-07-28',
      tags: ['New Feature']
    },
    {
      title: 'Improvement: Faster Page Loads',
      summary: 'We have optimized our frontend assets and backend queries to make the dashboard and activity pages load significantly faster.',
      date: '2024-07-25',
      tags: ['Improvement']
    },
    {
      title: 'Bug Fix: Strava Webhook Glitch',
      summary: 'Fixed an issue where some new activities were not being processed correctly by the Strava webhook. All activities should now be captured reliably.',
      date: '2024-07-22',
      tags: ['Bug Fix']
    }
  ];

  res.render('changelog', { changelog: changelogData });
});

// Future routes will be added here

module.exports = router; 