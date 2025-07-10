const express = require('express');
const router = express.Router();

// GET /changelog
router.get('/', (req, res) => {
  const changelogData = [
    {
      title: 'New Feature: Changelog Page',
      summary: 'Added a public changelog page to keep users informed about new features, improvements, and bug fixes.',
      date: '2024-07-10',
      tags: ['New Feature']
    },
    {
      title: 'Improvement: Dashboard & Settings Refactor',
      summary: 'The user dashboard has been refactored to separate AI prompt configuration (now on a dedicated Settings page) from the activity list, simplifying the user experience.',
      date: '2024-07-10',
      tags: ['Improvement']
    },
    {
      title: 'Improvement: Support Page Update',
      summary: 'Updated the support page with clearer information about how user data is used for AI title generation to improve transparency and build trust.',
      date: '2024-07-08',
      tags: ['Improvement']
    },
    {
      title: 'New Feature: On-Demand Title Regeneration',
      summary: 'Users can now regenerate a new title suggestion for any activity directly from their dashboard with a single click.',
      date: '2024-07-05',
      tags: ['New Feature']
    },
    {
      title: 'New Feature: Automated Strava Title Generation',
      summary: 'Launched the core feature allowing users to connect their Strava account and automatically get creative, AI-powered titles for new activities based on a personal prompt.',
      date: '2024-07-05',
      tags: ['New Feature']
    },
    {
      title: 'New Feature: User Support Page',
      summary: 'A dedicated support page was added with FAQs and troubleshooting guides to help users resolve common issues independently.',
      date: '2024-07-07',
      tags: ['New Feature']
    },
    {
      title: 'Improvement: Modern UI Redesign',
      summary: 'The public-facing website has been redesigned with a modern, playful, and visually compelling landing page to better communicate the app\'s value.',
      date: '2024-07-05',
      tags: ['Improvement']
    },
    {
      title: 'Improvement: Rebranded to VibeWriter',
      summary: 'The "Strava Quote Generator" has been rebranded to "VibeWriter," featuring a new name and logo to create a more distinct and memorable brand identity.',
      date: '2024-07-06',
      tags: ['Improvement']
    }
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('changelog', { changelog: changelogData });
});

// Future routes will be added here

module.exports = router; 