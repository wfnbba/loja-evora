import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";

export const trackLead = createServerFn({ method: "POST" })
  .validator((data) => z.object({
    email: z.string().email(),
    name: z.string().optional(),
    phone: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    try {
      const { error } = await supabase
        .from('customers')
        .upsert({
          email: data.email,
          name: data.name || 'Lead',
          phone: data.phone ?? null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email',
          ignoreDuplicates: false
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error tracking lead:', error);
      return { success: false };
    }
  });
