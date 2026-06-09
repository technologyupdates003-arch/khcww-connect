
-- Add image_url to teams
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS image_url text;

-- Storage policies: public read, authenticated write for public-images bucket
CREATE POLICY "Public read public-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated upload public-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated update public-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated delete public-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-images');
