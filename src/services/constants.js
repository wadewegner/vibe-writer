/**
 * Strava Activity Types Constants
 * 
 * Defines all supported Strava activity types, organized into common and expanded categories.
 * Used for settings UI and default configurations.
 */

const STRAVA_ACTIVITY_TYPES = {
  // Common activity types - always visible in settings UI
  common: [
    'Run',
    'Trail Run',
    'Virtual Run',
    'Walk',
    'Hike',
    'Ride',
    'Mountain Bike Ride',
    'Gravel Ride',
    'E-Bike Ride',
    'Virtual Ride',
    'Swim',
    'Workout',
    'Weight Training',
    'Crossfit',
    'HIIT',
    'Yoga',
    'Pilates'
  ],
  
  // Expanded activity types - shown when user clicks "Show more"
  expanded: [
    'Alpine Ski',
    'Backcountry Ski',
    'Nordic Ski',
    'Snowboard',
    'Snowshoe',
    'Canoe',
    'Kayak',
    'Kitesurf',
    'Rowing',
    'Stand Up Paddling',
    'Surf',
    'Windsurf',
    'Ice Skate',
    'Inline Skate',
    'Roller Ski',
    'Handcycle',
    'E-Mountain Bike Ride',
    'Velomobile',
    'Wheelchair',
    'Rock Climb',
    'Skateboard',
    'Golf',
    'Soccer',
    'Tennis',
    'Badminton',
    'Pickleball',
    'Table Tennis',
    'Squash',
    'Racquetball',
    'Elliptical',
    'Stair Stepper'
  ]
};

/**
 * Get all activity types (common + expanded)
 * @returns {string[]} Combined array of all activity types
 */
function getAllActivityTypes() {
  return [...STRAVA_ACTIVITY_TYPES.common, ...STRAVA_ACTIVITY_TYPES.expanded];
}

/**
 * Get default activity types for new users
 * Returns only Run and Ride variants (per PRD FR-6)
 * @returns {string[]} Array of default activity types for new users
 */
function getDefaultActivityTypesForNewUsers() {
  return [
    'Run',
    'Trail Run',
    'Virtual Run',
    'Ride',
    'Mountain Bike Ride',
    'Gravel Ride',
    'E-Bike Ride',
    'Virtual Ride'
  ];
}

module.exports = {
  STRAVA_ACTIVITY_TYPES,
  getAllActivityTypes,
  getDefaultActivityTypesForNewUsers
};

