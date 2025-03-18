import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ClientSearch } from '../ClientSearch'
import { clientsApi } from '../../../../lib/api/clients'

// Mock the clientsApi
vi.mock('../../../../lib/api/clients', () => ({
  clientsApi: {
    searchByCustomerId: vi.fn()
  }
}))

const mockClient = {
  id: '1',
  customer_id: 'CUST001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  date_of_birth: '1990-01-01',
  address: '123 Main St',
  created_at: '2024-03-17',
  updated_at: '2024-03-17'
}

describe('ClientSearch', () => {
  it('renders search input and button', () => {
    render(
      <BrowserRouter>
        <ClientSearch onClientFound={() => {}} />
      </BrowserRouter>
    )
    
    expect(screen.getByPlaceholderText('Enter customer ID')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('handles successful search', async () => {
    const onClientFound = vi.fn()
    vi.mocked(clientsApi.searchByCustomerId).mockResolvedValueOnce(mockClient)

    render(
      <BrowserRouter>
        <ClientSearch onClientFound={onClientFound} />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Enter customer ID')
    const button = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(input, { target: { value: 'CUST001' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(onClientFound).toHaveBeenCalledWith(mockClient)
    })
  })

  it('handles client not found', async () => {
    vi.mocked(clientsApi.searchByCustomerId).mockResolvedValueOnce(null)

    render(
      <BrowserRouter>
        <ClientSearch onClientFound={() => {}} />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Enter customer ID')
    const button = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(input, { target: { value: 'INVALID' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Client not found')).toBeInTheDocument()
    })
  })

  it('shows recent searches when available', async () => {
    vi.mocked(clientsApi.searchByCustomerId).mockResolvedValueOnce(mockClient)

    render(
      <BrowserRouter>
        <ClientSearch onClientFound={() => {}} />
      </BrowserRouter>
    )

    const input = screen.getByPlaceholderText('Enter customer ID')
    const button = screen.getByRole('button', { name: 'Search' })

    fireEvent.change(input, { target: { value: 'CUST001' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Recent Searches')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })
}) 