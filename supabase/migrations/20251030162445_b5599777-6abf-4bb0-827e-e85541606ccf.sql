-- Allow public read access to stores so the frontend can list stores without auth
-- NOTE: vendors table remains protected (contains PII)

-- Ensure RLS is enabled (already enabled in schema, but harmless if repeated)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create a SELECT policy for everyone
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'stores' AND policyname = 'Stores are viewable by everyone'
  ) THEN
    CREATE POLICY "Stores are viewable by everyone"
    ON public.stores
    FOR SELECT
    USING (true);
  END IF;
END $$;