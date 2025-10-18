-- Migration: Add is_admin column to users table
-- Date: 2025-10-18
-- Purpose: Enable admin role functionality for administrative portal access

ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

