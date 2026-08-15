ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent NUMERIC(10, 2) DEFAULT 0;
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
