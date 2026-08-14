# Plano: Rastreamento de Clientes e Pedidos no Banco de Dados

Implementar um sistema de rastreamento persistente usando Lovable Cloud para registrar clientes e suas atividades (geração de PIX, tentativas de compra e conclusões). O e-mail será usado como identificador único para consolidar o histórico de cada cliente.

## Alterações Físicas

### Banco de Dados (Lovable Cloud)

- Criar tabela `customers` para armazenar dados básicos do cliente indexados pelo e-mail.
- Criar tabela `orders` para registrar cada transação/tentativa, vinculada ao e-mail do cliente.
- Criar tabela `order_items` para listar os produtos de cada pedido.

### Backend (Server Functions)

- **`src/lib/tracking.server.ts`**: Novos helpers para interagir com o banco de dados (Supabase Admin para garantir registro mesmo sem sessão).
- **`src/lib/vexopay.functions.ts`**: Atualizar `createPixPayment` para registrar o início da transação e o cliente no banco de dados.
- **`src/components/cart/checkout-overlay.tsx`**: Atualizar o callback de status pago para marcar o pedido como `paid` no banco de dados.

## Detalhes Técnicos

### Esquema SQL
```sql
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
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated, service_role;
GRANT SELECT, INSERT ON public.order_items TO authenticated, service_role;

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies (Allow service_role full access, others restricted if needed)
CREATE POLICY "Enable insert for all" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all" ON public.order_items FOR INSERT WITH CHECK (true);
```

### Lógica de Integração
1. Ao clicar em "Gerar PIX":
   - Upsert no `customers` usando o e-mail.
   - Insert no `orders` com status `pending`.
   - Insert no `order_items`.
2. Ao detectar pagamento no pooling do `checkout-overlay.tsx`:
   - Update no `orders` para status `paid`.

O rastreamento será completo, permitindo ver exatamente o que cada e-mail tentou comprar ou comprou efetivamente.