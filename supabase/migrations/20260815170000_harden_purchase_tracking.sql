ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'pix',
  ADD COLUMN IF NOT EXISTS gateway_fee NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS net_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS gateway_created_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS customer_ip TEXT,
  ADD COLUMN IF NOT EXISTS last_webhook_payload JSONB,
  ADD COLUMN IF NOT EXISTS webhook_received_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS utmify_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS utmify_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS utmify_last_attempt_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS utmify_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS utmify_last_error TEXT,
  ADD COLUMN IF NOT EXISTS utmify_response JSONB;

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  signature_valid BOOLEAN NOT NULL DEFAULT false,
  processing_status TEXT NOT NULL DEFAULT 'received',
  error TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  processed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (provider, event_type, transaction_id)
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.webhook_events FROM anon, authenticated;
GRANT ALL ON public.webhook_events TO service_role;

CREATE OR REPLACE FUNCTION public.save_checkout_order(
  p_customer JSONB,
  p_order JSONB,
  p_items JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
BEGIN
  INSERT INTO public.customers (
    email, name, phone, document, zip_code, street, number, complement,
    neighborhood, city, state, updated_at
  ) VALUES (
    p_customer->>'email',
    p_customer->>'name',
    NULLIF(p_customer->>'phone', ''),
    NULLIF(p_customer->>'document', ''),
    NULLIF(p_customer->>'zip_code', ''),
    NULLIF(p_customer->>'street', ''),
    NULLIF(p_customer->>'number', ''),
    NULLIF(p_customer->>'complement', ''),
    NULLIF(p_customer->>'neighborhood', ''),
    NULLIF(p_customer->>'city', ''),
    NULLIF(p_customer->>'state', ''),
    timezone('utc'::text, now())
  )
  ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    document = EXCLUDED.document,
    zip_code = EXCLUDED.zip_code,
    street = EXCLUDED.street,
    number = EXCLUDED.number,
    complement = EXCLUDED.complement,
    neighborhood = EXCLUDED.neighborhood,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    updated_at = EXCLUDED.updated_at;

  INSERT INTO public.orders (
    customer_email, transaction_id, status, total_amount, metadata,
    payment_method, gateway_fee, net_amount, gateway_created_at, customer_ip
  ) VALUES (
    p_customer->>'email',
    p_order->>'transaction_id',
    'pending',
    (p_order->>'total_amount')::NUMERIC,
    COALESCE(p_order->'tracking_parameters', '{}'::JSONB),
    COALESCE(NULLIF(p_order->>'payment_method', ''), 'pix'),
    NULLIF(p_order->>'gateway_fee', '')::NUMERIC,
    NULLIF(p_order->>'net_amount', '')::NUMERIC,
    NULLIF(p_order->>'gateway_created_at', '')::TIMESTAMP WITH TIME ZONE,
    NULLIF(p_order->>'customer_ip', '')
  )
  ON CONFLICT (transaction_id) DO UPDATE SET
    customer_email = EXCLUDED.customer_email,
    total_amount = EXCLUDED.total_amount,
    metadata = EXCLUDED.metadata,
    payment_method = EXCLUDED.payment_method,
    gateway_fee = COALESCE(EXCLUDED.gateway_fee, public.orders.gateway_fee),
    net_amount = COALESCE(EXCLUDED.net_amount, public.orders.net_amount),
    gateway_created_at = COALESCE(EXCLUDED.gateway_created_at, public.orders.gateway_created_at),
    customer_ip = COALESCE(EXCLUDED.customer_ip, public.orders.customer_ip)
  RETURNING id INTO v_order_id;

  DELETE FROM public.order_items WHERE order_id = v_order_id;

  INSERT INTO public.order_items (
    order_id, product_id, product_name, quantity, price, size
  )
  SELECT
    v_order_id,
    item->>'id',
    item->>'name',
    (item->>'quantity')::INTEGER,
    (item->>'price')::NUMERIC,
    NULLIF(item->>'size', '')
  FROM jsonb_array_elements(p_items) AS item;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.save_checkout_order(JSONB, JSONB, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_checkout_order(JSONB, JSONB, JSONB) TO service_role;

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

  UPDATE public.orders SET
    status = CASE
      WHEN status = 'paid' AND p_status <> 'paid' THEN status
      ELSE p_status
    END,
    gateway_fee = COALESCE(p_fee, gateway_fee),
    net_amount = COALESCE(p_net_amount, net_amount),
    approved_at = CASE
      WHEN p_status = 'paid' THEN COALESCE(approved_at, p_paid_at, timezone('utc'::text, now()))
      ELSE approved_at
    END,
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
    'utmifySent', v_order.utmify_status = 'sent'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.process_vexopay_event(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TIMESTAMP WITH TIME ZONE, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_vexopay_event(TEXT, TEXT, TEXT, NUMERIC, NUMERIC, TIMESTAMP WITH TIME ZONE, JSONB) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_utmify_purchase(p_transaction_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_claimed BOOLEAN;
BEGIN
  UPDATE public.orders SET
    utmify_status = 'processing',
    utmify_attempts = utmify_attempts + 1,
    utmify_last_attempt_at = timezone('utc'::text, now()),
    utmify_last_error = NULL
  WHERE transaction_id = p_transaction_id
    AND status = 'paid'
    AND (
      utmify_status IN ('pending', 'failed')
      OR (
        utmify_status = 'processing'
        AND utmify_last_attempt_at < timezone('utc'::text, now()) - INTERVAL '5 minutes'
      )
    )
  RETURNING true INTO v_claimed;

  RETURN COALESCE(v_claimed, false);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_utmify_purchase(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_utmify_purchase(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.finish_utmify_purchase(
  p_transaction_id TEXT,
  p_success BOOLEAN,
  p_response JSONB,
  p_error TEXT
)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.orders SET
    utmify_status = CASE WHEN p_success THEN 'sent' ELSE 'failed' END,
    utmify_sent_at = CASE WHEN p_success THEN timezone('utc'::text, now()) ELSE utmify_sent_at END,
    utmify_response = p_response,
    utmify_last_error = CASE WHEN p_success THEN NULL ELSE LEFT(p_error, 2000) END
  WHERE transaction_id = p_transaction_id;
$$;

REVOKE ALL ON FUNCTION public.finish_utmify_purchase(TEXT, BOOLEAN, JSONB, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finish_utmify_purchase(TEXT, BOOLEAN, JSONB, TEXT) TO service_role;

CREATE INDEX IF NOT EXISTS orders_utmify_retry_idx
  ON public.orders (utmify_status, status, utmify_last_attempt_at)
  WHERE status = 'paid' AND utmify_status <> 'sent';
