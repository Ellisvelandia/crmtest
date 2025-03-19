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
    .min(1, 'Customer ID is required')
    .regex(/^[A-Z0-9]+$/, 'Customer ID must contain only uppercase letters and numbers'),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 digits')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number'),
  date_of_birth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const today = new Date()
      const dob = new Date(date)
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }
      return age >= 18
    }, 'Client must be at least 18 years old'),
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
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
      setError(err instanceof Error ? err.message : 'An error occurred')
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
                  <FormLabel className="text-sm font-medium text-gray-700">Customer ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter customer ID" 
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
                  <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter first name" 
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
                  <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter last name" 
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
                  <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email" 
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
                  <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="Enter phone number" 
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
                  <FormLabel className="text-sm font-medium text-gray-700">Date of Birth</FormLabel>
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
                  <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter address" 
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
            Reset
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
                Saving...
              </span>
            ) : (
              'Save Client'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
} 