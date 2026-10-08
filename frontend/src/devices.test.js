import { describe, expect, it } from 'vitest'
import { createDevice, filterDevices, nextId, summarize, validateDevice } from './devices.js'

const devices = [
  { id: 'TEL-001', name: 'Sensor Bodega', type: 'Temperatura', location: 'Bogotá', status: 'online' },
  { id: 'TEL-002', name: 'Camión 17', type: 'GPS', location: 'Medellín', status: 'offline' },
  { id: 'TEL-005', name: 'Medidor Planta', type: 'Energía', location: 'Cali', status: 'maintenance' },
]

describe('validateDevice', () => {
  it('acepta un dispositivo válido', () => {
    expect(validateDevice({ name: 'Sensor 1', type: 'GPS', location: 'Cali' })).toEqual({})
  })

  it('rechaza nombre corto, tipo inválido y ubicación vacía', () => {
    const errors = validateDevice({ name: 'ab', type: 'Radio', location: '  ' })
    expect(Object.keys(errors)).toEqual(['name', 'type', 'location'])
  })
})

describe('nextId', () => {
  it('genera el siguiente ID a partir del mayor existente', () => {
    expect(nextId(devices)).toBe('TEL-006')
  })

  it('empieza en TEL-001 cuando no hay dispositivos', () => {
    expect(nextId([])).toBe('TEL-001')
  })
})

describe('createDevice', () => {
  it('crea el dispositivo desconectado y sin lectura', () => {
    const device = createDevice({ name: '  Nuevo  ', type: 'Humedad', location: 'Pasto ' }, devices)
    expect(device).toEqual({
      id: 'TEL-006',
      name: 'Nuevo',
      type: 'Humedad',
      location: 'Pasto',
      status: 'offline',
      lastReading: '—',
    })
  })
})

describe('filterDevices', () => {
  it('devuelve todos sin filtros', () => {
    expect(filterDevices(devices)).toHaveLength(3)
  })

  it('filtra por estado', () => {
    expect(filterDevices(devices, { status: 'online' }).map((d) => d.id)).toEqual(['TEL-001'])
  })

  it('busca por texto sin distinguir mayúsculas', () => {
    expect(filterDevices(devices, { search: 'medellín' }).map((d) => d.id)).toEqual(['TEL-002'])
  })
})

describe('summarize', () => {
  it('cuenta dispositivos por estado', () => {
    expect(summarize(devices)).toEqual({ total: 3, online: 1, offline: 1, maintenance: 1 })
  })
})

