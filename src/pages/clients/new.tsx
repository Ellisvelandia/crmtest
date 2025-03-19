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
        throw new Error('Ya existe un cliente con este ID')
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
        console.error('Error de inserción:', insertError)
        throw new Error(handleSupabaseError(insertError))
      }

      if (!newClient) {
        throw new Error('Error al crear el cliente - no se devolvieron datos')
      }

      toast.success('¡Cliente creado exitosamente!')
      navigate('/clients')
    } catch (error) {
      console.error('Error al crear el cliente:', error)
      const message = error instanceof Error ? error.message : 'Error al crear el cliente'
      toast.error(message)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 to-emerald-100/30">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Registrar Nuevo Cliente</h1>
            <p className="mt-1 text-sm text-emerald-600">Agregar un nuevo cliente al sistema</p>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
          >
            ← Volver a Clientes
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-xl border border-emerald-100">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50/50">
            <h2 className="text-lg font-medium text-gray-900">Información del Cliente</h2>
            <p className="mt-1 text-sm text-emerald-600">Complete los detalles a continuación para registrar un nuevo cliente</p>
          </div>
          <div className="p-6">
            <ClientRegistrationForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
} 