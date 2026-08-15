ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS tracking_code TEXT;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS document_normalized TEXT
  GENERATED ALWAYS AS (regexp_replace(COALESCE(document, ''), '[^0-9]', '', 'g')) STORED;

CREATE UNIQUE INDEX IF NOT EXISTS orders_tracking_code_unique_idx
  ON public.orders (tracking_code)
  WHERE tracking_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS customers_document_normalized_idx
  ON public.customers (document_normalized)
  WHERE document_normalized <> '';

CREATE OR REPLACE FUNCTION public.generate_order_tracking_code()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
BEGIN
  LOOP
    v_code := 'EVR-' || to_char(timezone('utc'::text, now()), 'YYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 10));

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.orders WHERE tracking_code = v_code
    );
  END LOOP;

  RETURN v_code;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_order_tracking_code() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_order_tracking_code() TO service_role;

-- Garante rastreio também para compras que já haviam sido confirmadas.
UPDATE public.orders
SET
  purchased_at = COALESCE(purchased_at, approved_at, webhook_received_at, created_at),
  tracking_code = COALESCE(tracking_code, public.generate_order_tracking_code())
WHERE status = 'paid'
  AND (purchased_at IS NULL OR tracking_code IS NULL);

CREATE OR REPLACE FUNCTION public.process_vexopay_event(
  p_event_type TEXT,
  p_transaction_id TEXT,
  p_status TEXT,
  p_fee NUMERIC,
  p_net_amount NUMERIC,
  p_paid_at TIMESTAMP WITH TIME ZONE,
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_first_paid BOOLEAN := false;
  v_purchase_time TIMESTAMP WITH TIME ZONE;
  v_tracking_code TEXT;
BEGIN
  INSERT INTO public.webhook_events (
    provider, event_type, transaction_id, payload, signature_valid, processing_status
  ) VALUES (
    'vexopay', p_event_type, p_transaction_id, p_payload, true, 'processing'
  )
  ON CONFLICT (provider, event_type, transaction_id) DO UPDATE SET
    payload = EXCLUDED.payload,
    signature_valid = true,
    processing_status = 'processing',
    error = NULL,
    received_at = timezone('utc'::text, now());

  SELECT * INTO v_order
  FROM public.orders
  WHERE transaction_id = p_transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    UPDATE public.webhook_events SET
      processing_status = 'failed',
      error = 'Order not found',
      processed_at = timezone('utc'::text, now())
    WHERE provider = 'vexopay'
      AND event_type = p_event_type
      AND transaction_id = p_transaction_id;

    RETURN jsonb_build_object('found', false, 'firstPaid', false);
  END IF;

  v_first_paid := p_status = 'paid' AND v_order.status <> 'paid';
  v_purchase_time := COALESCE(v_order.purchased_at, p_paid_at, timezone('utc'::text, now()));
  v_tracking_code := CASE
    WHEN p_status = 'paid' THEN COALESCE(v_order.tracking_code, public.generate_order_tracking_code())
    ELSE v_order.tracking_code
  END;

  UPDATE public.orders SET
    status = CASE
      WHEN status = 'paid' AND p_status <> 'paid' THEN status
      ELSE p_status
    END,
    gateway_fee = COALESCE(p_fee, gateway_fee),
    net_amount = COALESCE(p_net_amount, net_amount),
    approved_at = CASE
      WHEN p_status = 'paid' THEN COALESCE(approved_at, p_paid_at, v_purchase_time)
      ELSE approved_at
    END,
    purchased_at = CASE
      WHEN p_status = 'paid' THEN v_purchase_time
      ELSE purchased_at
    END,
    tracking_code = v_tracking_code,
    last_webhook_payload = p_payload,
    webhook_received_at = timezone('utc'::text, now())
  WHERE id = v_order.id;

  IF v_first_paid THEN
    UPDATE public.customers
    SET total_spent = COALESCE(total_spent, 0) + v_order.total_amount,
        updated_at = timezone('utc'::text, now())
    WHERE email = v_order.customer_email;
  END IF;

  UPDATE public.webhook_events SET
    processing_status = 'processed',
    error = NULL,
    processed_at = timezone('utc'::text, now())
  WHERE provider = 'vexopay'
    AND event_type = p_event_type
    AND transaction_id = p_transaction_id;

  RETURN jsonb_build_object(
    'found', true,
    'firstPaid', v_first_paid,
    'utmifySent', v_order.utmify_status = 'sent',
    'trackingCode', v_tracking_code,
    'purchasedAt', CASE WHEN p_status = 'paid' THEN v_purchase_time ELSE v_order.purchased_at END
  );
END;
$$;

REVOKE ALL ON FUNCTION public.process_vexopay_event(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TIMESTAMP WITH TIME ZONE, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_vexopay_event(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TIMESTAMP WITH TIME ZONE, JSONB) TO service_role;
