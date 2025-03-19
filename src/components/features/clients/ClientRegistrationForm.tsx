'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../../components/ui/form'
import { Client } from '../../../types'

// Form validation schema
const clientSchema = z.object({
  customer_id: z.string()
    .min(1, 'El ID de cliente es requerido')
    .regex(/^[A-Z0-9]+$/, 'El ID de cliente solo debe contener letras mayúsculas y números'),
  first_name: z.string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre debe tener menos de 50 caracteres')
    .regex(/^[a-zA-Z\s'-]+$/, 'El nombre solo puede contener letras, espacios, guiones y apóstrofes'),
  last_name: z.string()
    .min(1, 'El apellido es requerido')
    .max(50, 'El apellido debe tener menos de 50 caracteres')
    .regex(/^[a-zA-Z\s'-]+$/, 'El apellido solo puede contener letras, espacios, guiones y apóstrofes'),
  email: z.string()
    .email('Dirección de correo electrónico inválida')
    .min(1, 'El correo electrónico es requerido')
    .max(255, 'El correo electrónico debe tener menos de 255 caracteres'),
  phone: z.string()
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
    .max(20, 'El número de teléfono debe tener menos de 20 dígitos')
    .regex(/^\+?[0-9]+$/, 'Número de teléfono inválido'),
  date_of_birth: z.string()
    .min(1, 'La fecha de nacimiento es requerida')
    .refine((date) => {
      const today = new Date()
      const dob = new Date(date)
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      return age >= 18
    }, 'El cliente debe tener al menos 18 años'),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .max(200, 'La dirección debe tener menos de 200 caracteres'),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientRegistrationFormProps {
  onSubmit: (data: ClientFormData) => Promise<void>
  initialData?: Partial<Client>
}

export function ClientRegistrationForm({ onSubmit, initialData }: ClientRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      customer_id: initialData?.customer_id || '',
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      date_of_birth: initialData?.date_of_birth ? new Date(initialData.date_of_birth).toISOString().split('T')[0] : '',
      address: initialData?.address || '',
    },
  })

  const handleSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)
      const formattedData = {
        ...data,
        date_of_birth: new Date(data.date_of_birth).toISOString()
      }
      await onSubmit(formattedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">ID de Cliente</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese ID de cliente" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese nombre" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Apellido</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese apellido" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Ingrese correo electrónico" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Teléfono</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Ingrese número de teléfono" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Dirección</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ingrese dirección" 
                      {...field}
                      className="h-10 bg-white border border-gray-200 hover:border-emerald-100 shadow-sm text-sm rounded-md focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-emerald-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-600" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
            className="h-10 px-4 border border-gray-200 text-gray-700 hover:text-emerald-700 hover:border-emerald-100 hover:bg-emerald-50 transition-colors rounded-md text-sm font-medium"
          >
            Restablecer
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Cliente'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 