ALTER TABLE public.orders ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- Re-grant access just in case, though the previous grants should cover it
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated, anon;