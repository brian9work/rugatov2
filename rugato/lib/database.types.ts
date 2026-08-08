export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: number
          business_name: string | null
          business_address: string | null
          business_phone: string | null
          payments: string[]
          bell_enabled: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          business_name?: string | null
          business_address?: string | null
          business_phone?: string | null
          payments?: string[]
          bell_enabled?: boolean
          updated_at?: string
        }
        Update: {
          id?: number
          business_name?: string | null
          business_address?: string | null
          business_phone?: string | null
          payments?: string[]
          bell_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          has_options: boolean
          id: number
          is_active: boolean
          is_freeform: boolean
          name: string
          pricing_mode: Database["public"]["Enums"]["pricing_mode"]
          short_name: string | null
          sort_order: number
          station_id: number | null
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          has_options?: boolean
          id?: never
          is_active?: boolean
          is_freeform?: boolean
          name: string
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          short_name?: string | null
          sort_order?: number
          station_id?: number | null
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          has_options?: boolean
          id?: never
          is_active?: boolean
          is_freeform?: boolean
          name?: string
          pricing_mode?: Database["public"]["Enums"]["pricing_mode"]
          short_name?: string | null
          sort_order?: number
          station_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: { id: number; is_active: boolean; name: string; sort_order: number }
        Insert: { id?: never; is_active?: boolean; name: string; sort_order?: number }
        Update: { id?: never; is_active?: boolean; name?: string; sort_order?: number }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category_id: number
          created_at: string
          id: number
          reason: string | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          amount: number
          category_id: number
          created_at?: string
          id?: never
          reason?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Update: {
          amount?: number
          category_id?: number
          created_at?: string
          id?: never
          reason?: string | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      extras: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string
          price: number
          product_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          name: string
          price?: number
          product_id: number
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          name?: string
          price?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "extras_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string
          product_id: number
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          name: string
          product_id: number
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          name?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      option_groups: {
        Row: {
          id: number
          max_choices: number
          min_choices: number
          name: string
          product_id: number
          sort_order: number
        }
        Insert: {
          id?: never
          max_choices?: number
          min_choices?: number
          name: string
          product_id: number
          sort_order?: number
        }
        Update: {
          id?: never
          max_choices?: number
          min_choices?: number
          name?: string
          product_id?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      option_items: {
        Row: {
          extra_price: number
          group_id: number
          id: number
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          extra_price?: number
          group_id: number
          id?: never
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          extra_price?: number
          group_id?: number
          id?: never
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "option_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "option_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      order_audit: {
        Row: {
          action: string
          created_at: string
          detail: Json
          id: number
          order_id: number
          user_id: number | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: Json
          id?: never
          order_id: number
          user_id?: number | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: Json
          id?: never
          order_id?: number
          user_id?: number | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_audit_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_extras: {
        Row: {
          extra_id: number
          name: string
          order_item_id: number
          price: number
        }
        Insert: {
          extra_id: number
          name: string
          order_item_id: number
          price: number
        }
        Update: {
          extra_id?: number
          name?: string
          order_item_id?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_extras_extra_id_fkey"
            columns: ["extra_id"]
            isOneToOne: false
            referencedRelation: "extras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_extras_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_options: {
        Row: {
          extra_price: number
          group_name: string
          name: string
          option_id: number
          order_item_id: number
        }
        Insert: {
          extra_price?: number
          group_name: string
          name: string
          option_id: number
          order_item_id: number
        }
        Update: {
          extra_price?: number
          group_name?: string
          name?: string
          option_id?: number
          order_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_options_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "option_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_options_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_item_removed_ingredients: {
        Row: {
          ingredient_id: number
          name: string
          order_item_id: number
        }
        Insert: {
          ingredient_id: number
          name: string
          order_item_id: number
        }
        Update: {
          ingredient_id?: number
          name?: string
          order_item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_item_removed_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_item_removed_ingredients_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          details: Json
          extra_charge: number
          id: number
          line_total: number
          notes: string | null
          order_id: number
          product_id: number
          product_name: string
          quantity: number
          size: Database["public"]["Enums"]["product_size"]
          station_id: number | null
          station_name: string | null
          status: Database["public"]["Enums"]["order_status"]
          unit_price: number
        }
        Insert: {
          created_at?: string
          details?: Json
          extra_charge?: number
          id?: never
          line_total: number
          notes?: string | null
          order_id: number
          product_id: number
          product_name: string
          quantity?: number
          size?: Database["public"]["Enums"]["product_size"]
          station_id?: number | null
          station_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          unit_price: number
        }
        Update: {
          created_at?: string
          details?: Json
          extra_charge?: number
          id?: never
          line_total?: number
          notes?: string | null
          order_id?: number
          product_id?: number
          product_name?: string
          quantity?: number
          size?: Database["public"]["Enums"]["product_size"]
          station_id?: number | null
          station_name?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          created_by: number | null
          created_by_name: string | null
          customer_name: string | null
          delivered_at: string | null
          delivered_by: number | null
          delivered_by_name: string | null
          folio: number
          id: number
          notes: string | null
          payment: Database["public"]["Enums"]["payment_method"] | null
          service: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["order_status"]
          table_number: number | null
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: number | null
          created_by_name?: string | null
          customer_name?: string | null
          delivered_at?: string | null
          delivered_by?: number | null
          delivered_by_name?: string | null
          folio?: never
          id?: never
          notes?: string | null
          payment?: Database["public"]["Enums"]["payment_method"] | null
          service?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["order_status"]
          table_number?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: number | null
          created_by_name?: string | null
          customer_name?: string | null
          delivered_at?: string | null
          delivered_by?: number | null
          delivered_by_name?: string | null
          folio?: never
          id?: never
          notes?: string | null
          payment?: Database["public"]["Enums"]["payment_method"] | null
          service?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["order_status"]
          table_number?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_prices: {
        Row: {
          id: number
          price: number
          product_id: number
          size: Database["public"]["Enums"]["product_size"]
        }
        Insert: {
          id?: never
          price: number
          product_id: number
          size: Database["public"]["Enums"]["product_size"]
        }
        Update: {
          id?: never
          price?: number
          product_id?: number
          size?: Database["public"]["Enums"]["product_size"]
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          name: string
          station_id: number | null
          updated_at: string
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name: string
          station_id?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name?: string
          station_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      stations: {
        Row: {
          id: number
          is_active: boolean
          name: string
          role_hint: Database["public"]["Enums"]["user_role"] | null
          sort_order: number
        }
        Insert: {
          id?: never
          is_active?: boolean
          name: string
          role_hint?: Database["public"]["Enums"]["user_role"] | null
          sort_order?: number
        }
        Update: {
          id?: never
          is_active?: boolean
          name?: string
          role_hint?: Database["public"]["Enums"]["user_role"] | null
          sort_order?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_id: string
          created_at: string
          email: string
          id: number
          is_active: boolean
          lastname: string | null
          name: string
          phone: string | null
          type: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          auth_id: string
          created_at?: string
          email: string
          id?: never
          is_active?: boolean
          lastname?: string | null
          name: string
          phone?: string | null
          type?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          auth_id?: string
          created_at?: string
          email?: string
          id?: never
          is_active?: boolean
          lastname?: string | null
          name?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_order_item: {
        Args: {
          p_item: Json
          p_order_id: number
          p_user: number
          p_user_name: string
        }
        Returns: number
      }
      assert_open: { Args: { p_order: number }; Returns: undefined }
      create_order: { Args: { payload: Json }; Returns: number }
      current_user_id: { Args: never; Returns: number }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      deliver_order: {
        Args: {
          p_delivered_by: number
          p_order_id: number
          p_payment: Database["public"]["Enums"]["payment_method"]
        }
        Returns: undefined
      }
      get_report: { Args: { p_end: string; p_start: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      log_order: {
        Args: {
          p_action: string
          p_detail: Json
          p_name: string
          p_order: number
          p_user: number
        }
        Returns: undefined
      }
      recompute_order_status: {
        Args: { p_order_id: number }
        Returns: undefined
      }
      recompute_total: { Args: { p_order: number }; Returns: undefined }
      remove_order_item: {
        Args: { p_item_id: number; p_user: number; p_user_name: string }
        Returns: undefined
      }
      resolve_station: { Args: { p_product_id: number }; Returns: number }
      save_product: { Args: { payload: Json }; Returns: number }
      set_item_status: {
        Args: {
          p_item_id: number
          p_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: undefined
      }
      set_order_payment: {
        Args: {
          p_order: number
          p_payment: Database["public"]["Enums"]["payment_method"]
          p_user: number
          p_user_name: string
        }
        Returns: undefined
      }
      set_order_total: {
        Args: { p_order: number; p_total: number; p_user: number; p_user_name: string }
        Returns: undefined
      }
      update_order_data: {
        Args: {
          p_customer: string
          p_notes: string
          p_order_id: number
          p_service: Database["public"]["Enums"]["service_type"]
          p_table: number
          p_user: number
          p_user_name: string
        }
        Returns: undefined
      }
      update_order_item_qty: {
        Args: {
          p_item_id: number
          p_qty: number
          p_user: number
          p_user_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      cash_direction: "entrada" | "salida"
      order_status:
        | "pendiente"
        | "preparando"
        | "listo"
        | "entregado"
        | "cancelado"
      payment_method: "efectivo" | "tarjeta" | "transferencia"
      pricing_mode: "unico" | "tres_tamanos"
      product_size: "unico" | "chico" | "mediano" | "grande"
      service_type: "llevar" | "aqui"
      user_role: "admin" | "cocina" | "user" | "barra"
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
    Enums: {
      cash_direction: ["entrada", "salida"],
      order_status: [
        "pendiente",
        "preparando",
        "listo",
        "entregado",
        "cancelado",
      ],
      payment_method: ["efectivo", "tarjeta", "transferencia"],
      pricing_mode: ["unico", "tres_tamanos"],
      product_size: ["unico", "chico", "mediano", "grande"],
      service_type: ["llevar", "aqui"],
      user_role: ["admin", "cocina", "user", "barra"],
    },
  },
} as const
