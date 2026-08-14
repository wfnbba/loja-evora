DROP POLICY IF EXISTS "Enable all for all customers" ON public.customers;
DROP POLICY IF EXISTS "Enable all for all orders" ON public.orders;
DROP POLICY IF EXISTS "Enable all for all items" ON public.order_items;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.customers FROM anon, authenticated;
REVOKE ALL ON public.orders FROM anon, authenticated;
REVOKE ALL ON public.order_items FROM anon, authenticated;

GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;