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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      crm_carvaomascate: {
        Row: {
          Abordagem: boolean | null
          Ativo: string | null
          cidade: string | null
          created_at: string | null
          dia_visita: string | null
          disparo: boolean | null
          entrega: string | null
          id: number
          nome: string | null
          observacoes_rota: string | null
          rota: string | null
          telefone: string | null
          totaldisparomes: number | null
          ultimadatadisparo: string | null
          Verificado: boolean | null
        }
        Insert: {
          Abordagem?: boolean | null
          Ativo?: string | null
          cidade?: string | null
          created_at?: string | null
          dia_visita?: string | null
          disparo?: boolean | null
          entrega?: string | null
          id?: never
          nome?: string | null
          observacoes_rota?: string | null
          rota?: string | null
          telefone?: string | null
          totaldisparomes?: number | null
          ultimadatadisparo?: string | null
          Verificado?: boolean | null
        }
        Update: {
          Abordagem?: boolean | null
          Ativo?: string | null
          cidade?: string | null
          created_at?: string | null
          dia_visita?: string | null
          disparo?: boolean | null
          entrega?: string | null
          id?: never
          nome?: string | null
          observacoes_rota?: string | null
          rota?: string | null
          telefone?: string | null
          totaldisparomes?: number | null
          ultimadatadisparo?: string | null
          Verificado?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          cep: string | null
          city: string | null
          cnpj: string | null
          code: string
          complement: string | null
          created_at: string
          email: string
          id: string
          name: string
          neighborhood: string | null
          number: string | null
          password_hash: string | null
          phone: string
          street: string | null
        }
        Insert: {
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          code: string
          complement?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          neighborhood?: string | null
          number?: string | null
          password_hash?: string | null
          phone: string
          street?: string | null
        }
        Update: {
          cep?: string | null
          city?: string | null
          cnpj?: string | null
          code?: string
          complement?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          neighborhood?: string | null
          number?: string | null
          password_hash?: string | null
          phone?: string
          street?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          items: Json
          order_number: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          items?: Json
          order_number: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          items?: Json
          order_number?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      password_recovery_codes: {
        Row: {
          code: string
          created_at: string
          customer_id: string
          expires_at: string
          id: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          customer_id: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          customer_id?: string
          expires_at?: string
          id?: string
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "password_recovery_codes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_semana_carvao: {
        Row: {
          cliente_id: number | null
          confirmado: boolean | null
          created_at: string | null
          data_confirmacao: string | null
          id: string
          semana: string
          telefone: string | null
        }
        Insert: {
          cliente_id?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          data_confirmacao?: string | null
          id?: string
          semana: string
          telefone?: string | null
        }
        Update: {
          cliente_id?: number | null
          confirmado?: boolean | null
          created_at?: string | null
          data_confirmacao?: string | null
          id?: string
          semana?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_semana_carvao_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "crm_carvaomascate"
            referencedColumns: ["id"]
          },
        ]
      }
      rotas_carvao: {
        Row: {
          ativa: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          dia_semana: string | null
          id: string
          nome: string
          observacoes: string | null
        }
        Insert: {
          ativa?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          dia_semana?: string | null
          id?: string
          nome: string
          observacoes?: string | null
        }
        Update: {
          ativa?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          dia_semana?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_customer: {
        Args: { p_login: string; p_password: string }
        Returns: {
          code: string
          email: string
          id: string
          name: string
        }[]
      }
      generate_customer_code: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_recovery_code: {
        Args: { p_login: string }
        Returns: {
          customer_email: string
          customer_id: string
          customer_name: string
          customer_phone: string
          recovery_code: string
        }[]
      }
      reset_customer_password: {
        Args: { p_customer_id: string; p_new_password: string }
        Returns: boolean
      }
      verify_recovery_code: {
        Args: { p_code: string; p_login: string }
        Returns: {
          customer_id: string
        }[]
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
