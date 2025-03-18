export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
          sku: string
          name: string
          description: string
          category: string
          price: number
          cost: number
          stock_quantity: number
          metal_type?: string
          gem_type?: string
          weight_grams?: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      sales: {
        Row: {
          id: string
          invoice_number: string
          client_id: string
          total_amount: number
          payment_method: string
          payment_status: 'pending' | 'paid' | 'cancelled'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sales']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sales']['Insert']>
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string
          quantity: number
          unit_price: number
          discount?: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sale_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sale_items']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          client_id: string
          date_time: string
          purpose: string
          status: 'scheduled' | 'completed' | 'cancelled'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      repairs: {
        Row: {
          id: string
          client_id: string
          description: string
          estimated_cost: number
          status: 'pending' | 'in_progress' | 'completed' | 'delivered'
          completion_date?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['repairs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['repairs']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 