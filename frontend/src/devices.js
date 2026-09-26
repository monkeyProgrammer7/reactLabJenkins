// Lógica de negocio de los dispositivos, separada de la interfaz para poder probarla

export const STATUS_LABELS = {
  online: 'En línea',
  offline: 'Desconectado',
  maintenance: 'Mantenimiento',
}

export const DEVICE_TYPES = ['Temperatura', 'Humedad', 'GPS', 'Presión', 'Energía']

export const initialDevices = [
  { id: 'TEL-001', name: 'Sensor Bodega Norte', type: 'Temperatura', location: 'Bogotá', status: 'online', lastReading: '4.2 °C' },
  { id: 'TEL-002', name: 'Camión 17', type: 'GPS', location: 'Medellín', status: 'online', lastReading: '6.2518, -75.5636' },
  { id: 'TEL-003', name: 'Medidor Planta 2', type: 'Energía', location: 'Cali', status: 'maintenance', lastReading: '312 kWh' },
  { id: 'TEL-004', name: 'Sensor Invernadero', type: 'Humedad', location: 'Pereira', status: 'offline', lastReading: '68 %' },
]

export function validateDevice({ name, type, location }) {
  const errors = {}
  if (!name || name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres'
  if (!DEVICE_TYPES.includes(type)) errors.type = 'Selecciona un tipo válido'
  if (!location || !location.trim()) errors.location = 'La ubicación es obligatoria'
  return errors
}

export function nextId(devices) {
  const max = devices.reduce((acc, d) => Math.max(acc, Number(d.id.replace('TEL-', '')) || 0), 0)
  return `TEL-${String(max + 1).padStart(3, '0')}`
}

export function createDevice(data, devices) {
  return {
    id: nextId(devices),
    name: data.name.trim(),
    type: data.type,
    location: data.location.trim(),
    status: 'offline',
    lastReading: '—',
  }
}

export function filterDevices(devices, { status = 'all', search = '' } = {}) {
  const term = search.trim().toLowerCase()
  return devices.filter((d) => {
    const matchesStatus = status === 'all' || d.status === status
    const matchesSearch =
      !term || [d.id, d.name, d.location, d.type].some((v) => v.toLowerCase().includes(term))
    return matchesStatus && matchesSearch
  })
}

export function summarize(devices) {
  return devices.reduce(
    (acc, d) => ({ ...acc, total: acc.total + 1, [d.status]: acc[d.status] + 1 }),
    { total: 0, online: 0, offline: 0, maintenance: 0 },
  )
}
