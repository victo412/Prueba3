/*
  # Fix Onboarding System

  1. Changes
    - Ensure has_onboarded column exists and has proper default
    - Update trigger functions to set has_onboarded to false for new users
    - Add index for better performance
    - Sync existing users to have has_onboarded = false if null

  2. Security
    - Maintain existing RLS policies
    - Ensure triggers work correctly
*/

-- Ensure the has_onboarded column exists with proper default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'has_onboarded'
  ) THEN
    ALTER TABLE users ADD COLUMN has_onboarded boolean NOT NULL DEFAULT false;
  ELSE
    -- Update existing column to ensure it has the right default
    ALTER TABLE users ALTER COLUMN has_onboarded SET DEFAULT false;
    ALTER TABLE users ALTER COLUMN has_onboarded SET NOT NULL;
  END IF;
END $$;

-- Update any existing users that might have null values
UPDATE users SET has_onboarded = false WHERE has_onboarded IS NULL;

-- Update the trigger function to ensure has_onboarded is set correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name text;
BEGIN
  -- Extract name from metadata or use email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert into public.users table with has_onboarded = false
  INSERT INTO public.users (id, name, email, password_hash, has_onboarded, created_at)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    '', -- Empty since Supabase handles auth
    false, -- Explicitly set to false for new users
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    has_onboarded = COALESCE(users.has_onboarded, false); -- Keep existing value or set to false

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Update the user update function as well
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_name text;
BEGIN
  -- Extract name from metadata or use email prefix
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Update the public.users table
  UPDATE public.users
  SET 
    name = user_name,
    email = NEW.email
  WHERE id = NEW.id;

  -- If user doesn't exist in public.users, create them
  IF NOT FOUND THEN
    INSERT INTO public.users (id, name, email, password_hash, has_onboarded, created_at)
    VALUES (
      NEW.id,
      user_name,
      NEW.email,
      '',
      false, -- New users haven't completed onboarding
      COALESCE(NEW.created_at, NOW())
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_user_update: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Add an index for better performance on onboarding queries
CREATE INDEX IF NOT EXISTS idx_users_has_onboarded ON users(has_onboarded);

-- Add a comment to document the column
COMMENT ON COLUMN users.has_onboarded IS 'Indicates whether the user has completed the initial onboarding process';