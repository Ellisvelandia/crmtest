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
    }
  }
} 