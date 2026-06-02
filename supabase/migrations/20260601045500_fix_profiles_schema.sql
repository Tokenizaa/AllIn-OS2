-- Fix profiles table schema to match auth code expectations
-- Add missing columns and rename avatar_url to avatar

-- Rename avatar_url to avatar for consistency with code
ALTER TABLE public.profiles RENAME COLUMN avatar_url TO avatar;

-- Add missing columns that auth code expects
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sponsor_id UUID;

-- Add index for sponsor_id for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_sponsor_id ON public.profiles(sponsor_id);

-- Add index for referral_code for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
