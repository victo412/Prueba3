/*
  # Add onboarding data column to users table

  1. Changes
    - Add onboarding_data column to users table as jsonb
    - This will store all the configuration data from the onboarding process

  2. Security
    - Column is nullable to support existing users
    - RLS policies already cover this column through existing user policies
*/

-- Add onboarding_data column to store user configuration
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_data jsonb;

-- Add a comment to document the column structure
COMMENT ON COLUMN users.onboarding_data IS 'Stores user onboarding configuration including schedule preferences, goals, habits, and productivity style';