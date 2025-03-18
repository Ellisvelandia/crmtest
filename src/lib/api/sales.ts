import { supabase, handleSupabaseError } from '../supabase/config'
import type { Database } from '../../types/supabase'

type Sale = Database['public']['Tables']['sales']['Row']
type SaleInsert = Database['public']['Tables']['sales']['Insert']
type SaleUpdate = Database['public']['Tables']['sales']['Update']
type SaleItem = Database['public']['Tables']['sale_items']['Row']
type SaleItemInsert = Database['public']['Tables']['sale_items']['Insert']

export const salesApi = {
  // Get all sales
  async getAllSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get sale by invoice number
  async getSaleByInvoice(invoiceNumber: string): Promise<Sale | null> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('invoice_number', invoiceNumber)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get sales by client ID
  async getSalesByClient(clientId: string): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Create new sale with items
  async createSale(sale: SaleInsert, items: SaleItemInsert[]): Promise<{ sale: Sale; items: SaleItem[] }> {
    try {
      // Start a Supabase transaction
      const { data: newSale, error: saleError } = await supabase
        .from('sales')
        .insert([sale])
        .select()
        .single()

      if (saleError) throw saleError

      // Add sale ID to each item
      const itemsWithSaleId = items.map(item => ({
        ...item,
        sale_id: newSale.id
      }))

      // Insert sale items
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_items')
        .insert(itemsWithSaleId)
        .select()

      if (itemsError) throw itemsError

      return {
        sale: newSale,
        items: saleItems
      }
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update sale
  async updateSale(id: string, updates: SaleUpdate): Promise<Sale> {
    try {
      const { data, error } = await supabase
        .from('sales')
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

  // Get sale items by sale ID
  async getSaleItems(saleId: string): Promise<SaleItem[]> {
    try {
      const { data, error } = await supabase
        .from('sale_items')
        .select('*, products(*)')
        .eq('sale_id', saleId)

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Get sales report by date range
  async getSalesReport(startDate: string, endDate: string): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*)')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: 'pending' | 'paid' | 'cancelled'): Promise<Sale> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({ payment_status: status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  }
} 