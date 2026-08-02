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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
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
          updated_at?: string
        }
        Relationships: []
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
          updated_at: string
        }
        Insert: {
          category_id: number
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string | null
          id?: never
          is_active?: boolean
          name?: string
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
        ]
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
      current_user_id: { Args: never; Returns: number }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
      save_product: { Args: { payload: Json }; Returns: number }
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
      user_role: "admin" | "cocina" | "user"
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
      user_role: ["admin", "cocina", "user"],
    },
  },
} as const
