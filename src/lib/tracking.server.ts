
import { supabase } from "@/integrations/supabase/client";

export async function trackCustomerAndOrder(data: {
  customer: {
    email: string;
    name: string;
    phone?: string;
    document?: string;
    address: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  transactionId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  totalAmount: number;
}) {
  try {
    // 1. Upsert Customer
    const { error: customerError } = await supabase
      .from('customers')
      .upsert({
        email: data.customer.email,
        name: data.customer.name,
        phone: data.customer.phone ?? null,
        document: data.customer.document ?? null,
        zip_code: data.customer.address.zipCode,
        street: data.customer.address.street,
        number: data.customer.address.number,
        complement: data.customer.address.complement ?? null,
        neighborhood: data.customer.address.neighborhood,
        city: data.customer.address.city,
        state: data.customer.address.state,
        updated_at: new Date().toISOString(),
      });

    if (customerError) throw customerError;

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_email: data.customer.email,
        transaction_id: data.transactionId,
        status: 'pending',
        total_amount: data.totalAmount,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create Order Items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        data.items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? null,
        }))
      );

    if (itemsError) throw itemsError;

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error tracking customer/order:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateOrderStatus(transactionId: string, status: 'paid' | 'cancelled') {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('transaction_id', transactionId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
