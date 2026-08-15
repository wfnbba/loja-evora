export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          city: string | null
          complement: string | null
          created_at: string
          document: string | null
          document_normalized: string | null
          email: string
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          state: string | null
          street: string | null
          total_spent: number | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          created_at?: string
          document?: string | null
          document_normalized?: string | null
          email: string
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          total_spent?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          created_at?: string
          document?: string | null
          document_normalized?: string | null
          email?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          total_spent?: number | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          size: string | null
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
          size?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
          size?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          approved_at: string | null
          created_at: string
          customer_email: string
          customer_ip: string | null
          gateway_created_at: string | null
          gateway_fee: number | null
          id: string
          last_webhook_payload: Json | null
          metadata: Json | null
          net_amount: number | null
          payment_method: string
          purchased_at: string | null
          status: string
          tracking_code: string | null
          total_amount: number
          transaction_id: string | null
          utmify_attempts: number
          utmify_last_attempt_at: string | null
          utmify_last_error: string | null
          utmify_response: Json | null
          utmify_sent_at: string | null
          utmify_status: string
          webhook_received_at: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          customer_email: string
          customer_ip?: string | null
          gateway_created_at?: string | null
          gateway_fee?: number | null
          id?: string
          last_webhook_payload?: Json | null
          metadata?: Json | null
          net_amount?: number | null
          payment_method?: string
          purchased_at?: string | null
          status?: string
          tracking_code?: string | null
          total_amount: number
          transaction_id?: string | null
          utmify_attempts?: number
          utmify_last_attempt_at?: string | null
          utmify_last_error?: string | null
          utmify_response?: Json | null
          utmify_sent_at?: string | null
          utmify_status?: string
          webhook_received_at?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          customer_email?: string
          customer_ip?: string | null
          gateway_created_at?: string | null
          gateway_fee?: number | null
          id?: string
          last_webhook_payload?: Json | null
          metadata?: Json | null
          net_amount?: number | null
          payment_method?: string
          purchased_at?: string | null
          status?: string
          tracking_code?: string | null
          total_amount?: number
          transaction_id?: string | null
          utmify_attempts?: number
          utmify_last_attempt_at?: string | null
          utmify_last_error?: string | null
          utmify_response?: Json | null
          utmify_sent_at?: string | null
          utmify_status?: string
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_email_fkey"
            columns: ["customer_email"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["email"]
          },
        ]
      }
      webhook_events: {
        Row: {
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          processing_status: string
          provider: string
          received_at: string
          signature_valid: boolean
          transaction_id: string
        }
        Insert: {
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          processing_status?: string
          provider: string
          received_at?: string
          signature_valid?: boolean
          transaction_id: string
        }
        Update: {
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          processing_status?: string
          provider?: string
          received_at?: string
          signature_valid?: boolean
          transaction_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_utmify_purchase: {
        Args: { p_transaction_id: string }
        Returns: boolean
      }
      finish_utmify_purchase: {
        Args: {
          p_error: string | null
          p_response: Json
          p_success: boolean
          p_transaction_id: string
        }
        Returns: undefined
      }
      process_vexopay_event: {
        Args: {
          p_event_type: string
          p_fee: number | null
          p_net_amount: number | null
          p_paid_at: string | null
          p_payload: Json
          p_status: string
          p_transaction_id: string
        }
        Returns: Json
      }
      generate_order_tracking_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      lookup_order_tracking: {
        Args: { p_tracking_code: string }
        Returns: {
          checked_at: string
          purchased_at: string
          tracking_code: string
        }[]
      }
      recover_order_tracking_by_cpf: {
        Args: { p_cpf: string }
        Returns: {
          checked_at: string
          purchased_at: string
          tracking_code: string
        }[]
      }
      save_checkout_order: {
        Args: { p_customer: Json; p_items: Json; p_order: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
