import { supabase, handleSupabaseError } from '../supabase/config'
import type { Database } from '../../types/supabase'

type Appointment = Database['public']['Tables']['appointments']['Row']
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']
type Repair = Database['public']['Tables']['repairs']['Row']
type RepairInsert = Database['public']['Tables']['repairs']['Insert']
type RepairUpdate = Database['public']['Tables']['repairs']['Update']

export const servicesApi = {
  // Appointments
  appointments: {
    // Get all appointments
    async getAll(): Promise<Appointment[]> {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('date_time', { ascending: true })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Get appointments by client ID
    async getByClient(clientId: string): Promise<Appointment[]> {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('client_id', clientId)
          .order('date_time', { ascending: true })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Create appointment
    async create(appointment: AppointmentInsert): Promise<Appointment> {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .insert([appointment])
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Update appointment
    async update(id: string, updates: AppointmentUpdate): Promise<Appointment> {
      try {
        const { data, error } = await supabase
          .from('appointments')
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

    // Update appointment status
    async updateStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled'): Promise<Appointment> {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .update({ status })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Get appointments by date range
    async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .gte('date_time', startDate)
          .lte('date_time', endDate)
          .order('date_time', { ascending: true })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    }
  },

  // Repairs
  repairs: {
    // Get all repairs
    async getAll(): Promise<Repair[]> {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Get repairs by client ID
    async getByClient(clientId: string): Promise<Repair[]> {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .eq('client_id', clientId)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Create repair
    async create(repair: RepairInsert): Promise<Repair> {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .insert([repair])
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Update repair
    async update(id: string, updates: RepairUpdate): Promise<Repair> {
      try {
        const { data, error } = await supabase
          .from('repairs')
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

    // Update repair status
    async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed' | 'delivered'): Promise<Repair> {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .update({ status })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    },

    // Get repairs by status
    async getByStatus(status: 'pending' | 'in_progress' | 'completed' | 'delivered'): Promise<Repair[]> {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error(handleSupabaseError(error))
      }
    }
  }
} 