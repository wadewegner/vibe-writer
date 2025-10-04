-- Migration: Add unit preference and activity type preferences to users table
-- Created: 2025-10-04
-- Purpose: Allow users to select imperial/metric units and which activity types to generate titles for

-- Add is_imperial column (defaults to true for backward compatibility)
ALTER TABLE users 
ADD COLUMN is_imperial BOOLEAN NOT NULL DEFAULT true;

-- Add activity_types column (defaults to all activity types for backward compatibility)
-- This ensures existing users continue to get titles for all their activities
ALTER TABLE users 
ADD COLUMN activity_types JSONB NOT NULL DEFAULT '[
  "Run", "Trail Run", "Virtual Run", "Walk", "Hike",
  "Ride", "Mountain Bike Ride", "Gravel Ride", "E-Bike Ride", "Virtual Ride",
  "Swim", "Workout", "Weight Training", "Crossfit", "HIIT", "Yoga", "Pilates",
  "Alpine Ski", "Backcountry Ski", "Nordic Ski", "Snowboard", "Snowshoe",
  "Canoe", "Kayak", "Kitesurf", "Rowing", "Stand Up Paddling", "Surf", "Windsurf",
  "Ice Skate", "Inline Skate", "Roller Ski",
  "Handcycle", "E-Mountain Bike Ride", "Velomobile", "Wheelchair",
  "Rock Climb", "Skateboard",
  "Golf", "Soccer", "Tennis", "Badminton", "Pickleball", "Table Tennis", "Squash", "Racquetball",
  "Elliptical", "Stair Stepper"
]'::jsonb;

-- Add comments to document the columns
COMMENT ON COLUMN users.is_imperial IS 'User preference for units: true=imperial (miles/feet), false=metric (km/meters)';
COMMENT ON COLUMN users.activity_types IS 'Array of Strava activity types for which to generate AI titles';

-- Verify the migration
-- Run these queries after migration to confirm success:
-- SELECT id, strava_id, is_imperial, jsonb_array_length(activity_types) as num_activity_types FROM users;
-- SELECT DISTINCT jsonb_array_elements_text(activity_types) as activity_type FROM users ORDER BY activity_type;

/*
ROLLBACK PROCEDURE:
If you need to rollback this migration, run the following SQL:

ALTER TABLE users DROP COLUMN IF EXISTS is_imperial;
ALTER TABLE users DROP COLUMN IF EXISTS activity_types;

WARNING: This will permanently delete these columns and their data!
Make sure you have a backup before rolling back.
*/

