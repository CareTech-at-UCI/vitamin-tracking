ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS current_step TEXT,
    ADD COLUMN IF NOT EXISTS is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.users.current_step IS 'Current onboarding step key for resume behavior.';
COMMENT ON COLUMN public.users.is_completed IS 'Whether user has completed onboarding.';
COMMENT ON COLUMN public.users.onboarding_completed_at IS 'Timestamp when onboarding was completed.';
