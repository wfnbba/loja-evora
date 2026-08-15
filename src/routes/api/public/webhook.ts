import { createFileRoute } from '@tanstack/react-router';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { supabaseAdmin as supabase } from '@/integrations/supabase/client.server';
import { sendUtmifySale } from '@/lib/utmify.functions';


export const Route = createFileRoute('/api/public/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get('x-vexopay-signature');
        const secret = process.env['VEXOPAY_WEBHOOK_SECRET'];

        if (!secret) {
          console.error('VEXOPAY_WEBHOOK_SECRET not configured');
          return new Response('Config error', { status: 500 });
        }

        const body = await request.text();

        // Verify signature if provided
        if (signature) {
          // VexoPay signature format: t=<timestamp>,v1=<hash>
          const parts = signature.split(',');
          const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
          const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];

          if (timestamp && hash) {
            const signedPayload = `${timestamp}.${body}`;
            const expectedHash = createHmac('sha256', secret)
              .update(signedPayload)
              .digest('hex');

            try {
              if (!timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash))) {
                return new Response('Invalid signature', { status: 401 });
              }
            } catch (e) {
              return new Response('Signature mismatch', { status: 401 });
            }

            // Check if request is older than 5 minutes
            const now = Math.floor(Date.now() / 1000);
            if (Math.abs(now - parseInt(timestamp)) > 300) {
              return new Response('Request expired', { status: 401 });
            }
          }
        }

        const payload = JSON.parse(body);
        
        if (payload.event === 'payment.completed' || payload.event === 'payment.paid') {
          const transactionId = payload.data.transactionId;
          const status = payload.data.status === 'paid' ? 'paid' : 'waiting_payment';
          
          console.log(`Payment status update for transaction ${transactionId}: ${status}`);
          
          // 1. Update database status and total_spent
          const { updateOrderStatus } = await import('@/lib/tracking.server');
          await updateOrderStatus(transactionId, status === 'paid' ? 'paid' : 'waiting_payment' as any);

          // Get order for UTMify notification
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, order_items(*), customers(*)')
            .eq('transaction_id', transactionId)
            .single();

          if (order && !orderError) {
            // 2. Notify UTMify if paid
            if (status === 'paid') {
              const customer = order.customers;
              const items = order.order_items || [];
              
              // We need UTMs. In a real scenario, we'd store them in the database during order creation.
              // For now, we'll try to recover what we can or use defaults.
              // Ideally, trackCustomerAndOrder should have saved the tracking parameters.
              
              const utmifyPayload = {
                orderId: order.id.toString(),
                status: 'paid',
                paymentMethod: 'pix',
                createdAt: new Date(order.created_at).toISOString().replace('T', ' ').split('.')[0],
                approvedDate: new Date().toISOString().replace('T', ' ').split('.')[0],
                customer: {
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone,
                  document: customer.document,
                  country: 'BR'
                },
                products: items.map((item: any) => ({
                  id: item.product_id,
                  name: item.product_name,
                  quantity: item.quantity,
                  priceInCents: Math.round(item.price * 100)
                })),
                trackingParameters: {
                  utm_source: (order as any).metadata?.utm_source || null,
                  utm_medium: (order as any).metadata?.utm_medium || null,
                  utm_campaign: (order as any).metadata?.utm_campaign || null,
                  utm_content: (order as any).metadata?.utm_content || null,
                  utm_term: (order as any).metadata?.utm_term || null,
                  src: (order as any).metadata?.src || null,
                  sck: (order as any).metadata?.sck || null
                },

                commission: {
                  totalPriceInCents: Math.round(order.total_amount * 100),
                  gatewayFeeInCents: Math.round(order.total_amount * 0.03 * 100), // Estimate
                  userCommissionInCents: Math.round(order.total_amount * 0.97 * 100)
                }
              };

              try {
                // Call server function directly since we are on the server
                await sendUtmifySale({ data: utmifyPayload });
              } catch (utmError) {
                console.error("Failed to notify UTMify:", utmError);
              }
            }
          }
        }


        return new Response('ok', { status: 200 });
      }
    }
  }
});
