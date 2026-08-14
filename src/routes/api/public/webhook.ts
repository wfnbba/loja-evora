import { createFileRoute } from '@tanstack/react-router';
import { createHmac, timingSafeEqual } from 'crypto';

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
        
        if (payload.event === 'payment.completed' && payload.data.status === 'paid') {
          console.log(`Payment confirmed for transaction ${payload.data.transactionId}`);
          // Here we would typically update a database or trigger fulfillment
          // Since we are using local state/Zustand, the client will also poll or be notified via WebSockets if available
        }

        return new Response('ok', { status: 200 });
      }
    }
  }
});
