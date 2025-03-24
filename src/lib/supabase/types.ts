export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          customer_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          date_of_birth: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      products: {
        Row: {
          id: string
          name: string
          sku: string | null
          description: string | null
          price_usd: number | null
          price_mxn: number | null
          category: string | null
          brand: string | null
          weight: number | null
          material: string | null
          purity: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      warehouses: {
        Row: {
          id: string
          name: string
          code: string
          is_active: boolean | null
          is_default: boolean | null
          address: string | null
          phone: string | null
          email: string | null
          manager_name: string | null
          created_at: string | null
          updated_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: Omit<Database['public']['Tables']['warehouses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['warehouses']['Insert']>
      }
      warehouse_products: {
        Row: {
          id: string
          warehouse_id: string | null
          product_id: string | null
          quantity: number
          min_stock: number | null
          max_stock: number | null
          location: string | null
          last_counted_at: string | null
          created_at: string | null
          updated_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: Omit<Database['public']['Tables']['warehouse_products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['warehouse_products']['Insert']>
      }
      warehouse_history: {
        Row: {
          id: string
          warehouse_id: string | null
          product_id: string | null
          action_type: string
          quantity_change: number
          previous_quantity: number
          new_quantity: number
          reference_number: string | null
          user_id: string | null
          notes: string | null
          created_at: string | null
          metadata: Record<string, any> | null
        }
        Insert: Omit<Database['public']['Tables']['warehouse_history']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['warehouse_history']['Insert']>
      }
    }
  }
}

export type Warehouse = Database['public']['Tables']['warehouses']['Row'] 