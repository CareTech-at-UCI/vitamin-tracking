-- private bucket for photos of scanned meals; objects live at {user_id}/{meal_id}/{uuid}.{ext}
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('scan-images', 'scan-images', FALSE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- users may read only their own images; writes go through the backend (service role)
CREATE POLICY "Users can read their own scan images"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'scan-images'
        AND (storage.foldername(name))[1] = (SELECT auth.uid())::TEXT
    );


CREATE TABLE public.meal_scans (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meal_id INTEGER NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
    image_path TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX meal_scans_meal_id_idx ON public.meal_scans (meal_id);
CREATE INDEX meal_scans_user_id_idx ON public.meal_scans (user_id);

ALTER TABLE public.meal_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own meal scans"
    ON public.meal_scans
    FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id);
