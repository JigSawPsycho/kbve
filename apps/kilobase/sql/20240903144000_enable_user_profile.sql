BEGIN;
-- [START] - User Profile
-- Extensions Check
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Create a table for public.user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username TEXT UNIQUE,
    avatar_url TEXT,

    -- Constraints for username
    CONSTRAINT username_length CHECK (char_length(username) >= 5 AND char_length(username) <= 24),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$'),
    CONSTRAINT avatar_url_length CHECK (char_length(avatar_url) <= 128),
    CONSTRAINT avatar_url_format CHECK (avatar_url ~ '^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$')
);

ALTER TABLE public.user_profiles
    ENABLE ROW LEVEL SECURITY;

-- Policy Management

DROP POLICY IF EXISTS "Public user_profiles are viewable by everyone." ON public.user_profiles;
CREATE POLICY "Public user_profiles are viewable by everyone." ON public.user_profiles
    FOR SELECT USING (true);


DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profiles;
CREATE POLICY "Users can insert their own profile." ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON public.user_profiles;
CREATE POLICY "Users can update own profile." ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS handle_user_profiles_update ON public.user_profiles;

-- Create the hander user profile update trigger again
CREATE TRIGGER handle_user_profiles_update
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);

-- Function to handle new user creation and validation
CREATE FUNCTION public.handle_new_user_profile()
    RETURNS TRIGGER AS $$
    BEGIN
        -- Validate the username
        IF new.raw_user_meta_data->>'username' IS NULL OR 
           char_length(new.raw_user_meta_data->>'username') < 5 OR 
           char_length(new.raw_user_meta_data->>'username') > 24 OR 
           NOT (new.raw_user_meta_data->>'username' ~ '^[a-zA-Z0-9_-]+$') THEN
            RAISE EXCEPTION 'invalid_username';
        END IF;

        -- Validate the avatar_url (if applicable)
        IF new.raw_user_meta_data->>'avatar_url' IS NOT NULL AND
           (char_length(new.raw_user_meta_data->>'avatar_url') > 128 OR
            NOT (new.raw_user_meta_data->>'avatar_url' ~ '^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$')) THEN
            RAISE EXCEPTION 'invalid_avatar';
        END IF;

        -- Validate unique username
        IF EXISTS (SELECT 1 FROM public.user_profiles WHERE username = new.raw_user_meta_data->>'username') THEN
            RAISE EXCEPTION 'username_taken';
        END IF;

        -- Insert into user_profiles table
        BEGIN
            INSERT INTO public.user_profiles (id, username, avatar_url)
            VALUES (
                new.id,
                new.raw_user_meta_data->>'username',
                COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://kbve.com/asset/guest.png')
            );
        EXCEPTION WHEN unique_violation THEN
            RAISE EXCEPTION 'username_taken';
        END;

        RETURN new;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();

-- [END of Profile]
COMMIT;