CREATE OR REPLACE FUNCTION public.lookup_order_tracking(p_tracking_code TEXT)
RETURNS TABLE (
  tracking_code TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  checked_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    orders.tracking_code,
    orders.purchased_at,
    now() AS checked_at
  FROM public.orders
  WHERE orders.tracking_code = upper(trim(p_tracking_code))
    AND upper(trim(p_tracking_code)) ~ '^EVR-[0-9]{6}-[A-F0-9]{10}$'
    AND orders.status = 'paid'
    AND orders.purchased_at IS NOT NULL
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.recover_order_tracking_by_cpf(p_cpf TEXT)
RETURNS TABLE (
  tracking_code TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  checked_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cpf TEXT := regexp_replace(COALESCE(p_cpf, ''), '[^0-9]', '', 'g');
BEGIN
  IF length(v_cpf) <> 11 OR v_cpf ~ '^([0-9])\1{10}$' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    orders.tracking_code,
    orders.purchased_at,
    now() AS checked_at
  FROM public.orders
  WHERE orders.status = 'paid'
    AND orders.tracking_code IS NOT NULL
    AND orders.purchased_at IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.customers
      WHERE customers.email = orders.customer_email
        AND customers.document_normalized = v_cpf
    )
  ORDER BY orders.purchased_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.lookup_order_tracking(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.recover_order_tracking_by_cpf(TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.lookup_order_tracking(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recover_order_tracking_by_cpf(TEXT) TO anon, authenticated;
