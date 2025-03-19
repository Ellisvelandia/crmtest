import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClientRegistrationForm } from '../../components/features/clients/ClientRegistrationForm'
import { supabase, handleSupabaseError } from '../../lib/supabase/config'
import type { Database } from '../../lib/supabase/types'
import { toast } from 'sonner'

type ClientInsert = Database['public']['Tables']['clients']['Insert']

export default function NewClientPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ClientInsert) => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      // First check if customer_id already exists
      const { data: existingClients, error: checkError } = await supabase
        .from('clients')
        .select('customer_id')
        .eq('customer_id', data.customer_id)
        .limit(1)

      if (checkError) {
        throw new Error(handleSupabaseError(checkError))
      }

      if (existingClients && existingClients.length > 0) {
        throw new Error('A client with this Customer ID already exists')
      }

      // Format the date to match PostgreSQL date format
      const formattedData = {
        ...data,
        date_of_birth: new Date(data.date_of_birth).toISOString().split('T')[0]
      }

      // Insert new client
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert([formattedData])
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error(handleSupabaseError(insertError))
      }

      if (!newClient) {
        throw new Error('Failed to create client - no data returned')
      }

      toast.success('Client created successfully!')
      navigate('/clients')
    } catch (error) {
      console.error('Client creation error:', error)
      const message = error instanceof Error ? error.message : 'Failed to create client'
      toast.error(message)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Register New Client</h1>
          <button
            onClick={() => navigate('/clients')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Clients
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <ClientRegistrationForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
} 