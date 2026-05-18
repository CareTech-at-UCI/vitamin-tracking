CREATE OR REPLACE FUNCTION public.handle_new_google_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, first_name, last_name)
    VALUES (
        new.id, -- lets supabase auth generate and handle uuid
        -- try to get first and last name from Google metadata, default to empty string if not found
        COALESCE(split_part(new.raw_user_meta_data->>'full_name', ' ', 1), ''), 
        COALESCE(split_part(new.raw_user_meta_data->>'full_name', ' ', 2), '')
    )
    ON CONFLICT (id) DO NOTHING; -- ensures existing users just log in
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- apply the trigger
-- runs when a new user is created in auth.users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_google_user();