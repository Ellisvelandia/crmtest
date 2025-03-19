import { supabase, handleSupabaseError } from '../supabase/config'
import type { Client } from '../../types'

export const clientsApi = {
  // Search client by customer ID
  async searchByCustomerId(customerId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('customer_id', customerId)
        .limit(1)

      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get all clients
  async getAllClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create new client
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update client
  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Delete client
  async deleteClient(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
} 