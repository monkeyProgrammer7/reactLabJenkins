import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('muestra los dispositivos iniciales y el resumen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /dispositivos de telemetría/i })).toBeInTheDocument()
    expect(screen.getByText('Sensor Bodega Norte')).toBeInTheDocument()
    expect(screen.getByTestId('total')).toHaveTextContent('4')
  })

  it('registra un dispositivo nuevo', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Nombre'), 'Sensor Cuarto Frío')
    await user.selectOptions(screen.getByLabelText('Tipo'), 'Temperatura')
    await user.type(screen.getByLabelText('Ubicación'), 'Barranquilla')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    const row = screen.getByText('Sensor Cuarto Frío').closest('tr')
    expect(within(row).getByText('TEL-005')).toBeInTheDocument()
    expect(screen.getByTestId('total')).toHaveTextContent('5')
  })

  it('muestra errores si el formulario está incompleto', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument()
    expect(screen.getByText(/ubicación es obligatoria/i)).toBeInTheDocument()
  })

  it('filtra por estado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText('Filtrar por estado'), 'maintenance')
    expect(screen.getByText('Medidor Planta 2')).toBeInTheDocument()
    expect(screen.queryByText('Camión 17')).not.toBeInTheDocument()
  })

  it('elimina un dispositivo', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Eliminar Camión 17' }))
    expect(screen.queryByText('Camión 17')).not.toBeInTheDocument()
    expect(screen.getByTestId('total')).toHaveTextContent('3')
  })
})
