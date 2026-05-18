CREATE OR REPLACE FUNCTION public.handle_new_google_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, first_name, last_name, updated_at)
    VALUES (
        new.id, 
        COALESCE(split_part(new.raw_user_meta_data->>'full_name', ' ', 1), ''), 
        COALESCE(split_part(new.raw_user_meta_data->>'full_name', ' ', 2), ''),
        now()
    )
    -- new: insert new user if they don't exist, update existing users with new information
    ON CONFLICT (id) DO UPDATE 
    SET 
        -- this refreshes the timestamp every time they sign in
        updated_at = now(),
        -- safety check: update name if it changed on Google's side
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name;
        
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;