
-- Public read policy for the public-images bucket (bucket itself remains "private" at the API level,
-- but objects inside it become publicly readable so getPublicUrl() works).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public read for public-images'
  ) THEN
    CREATE POLICY "Public read for public-images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'public-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Authenticated upload to public-images'
  ) THEN
    CREATE POLICY "Authenticated upload to public-images"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'public-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Authenticated update public-images'
  ) THEN
    CREATE POLICY "Authenticated update public-images"
      ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'public-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Authenticated delete public-images'
  ) THEN
    CREATE POLICY "Authenticated delete public-images"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'public-images');
  END IF;
END $$;

-- Site settings (single-row key/value style, simple flat row)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  contact_email TEXT,
  contact_phone TEXT,
  emergency_phone TEXT,
  address TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (singleton, contact_email, contact_phone, emergency_phone, address)
VALUES (true, 'info@khcww.or.ke', '+254 700 000 000', '+254 711 000 000', 'Kerugoya, Kirinyaga County, Kenya')
ON CONFLICT (singleton) DO NOTHING;
