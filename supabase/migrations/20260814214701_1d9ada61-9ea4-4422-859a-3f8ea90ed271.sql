CREATE TABLE public.customers (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    document TEXT,
    zip_code TEXT,
    street TEXT,
    number TEXT,
    complement TEXT,
    neighborhood TEXT,
    city TEXT,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT REFERENCES public.customers(email) ON DELETE CASCADE NOT NULL,
    transaction_id TEXT UNIQUE, -- VexoPay ID
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, cancelled
    total_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    size TEXT
);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated, service_role, anon;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated, service_role, anon;
GRANT SELECT, INSERT ON public.order_items TO authenticated, service_role, anon;

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable all for all customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
