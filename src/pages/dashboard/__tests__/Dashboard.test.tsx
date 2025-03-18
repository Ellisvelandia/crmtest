import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../index'

describe('DashboardPage', () => {
  it('renders the title correctly', () => {
    render(<DashboardPage />)
    expect(
      screen.getByText('SOLICITUD DE MODIFICACIONES Y PENDIENTES POS JOYERÍA EL ZAFIRO')
    ).toBeInTheDocument()
  })
}) 