import { useState } from 'react'
import './App.css'
import {
  DEVICE_TYPES,
  STATUS_LABELS,
  createDevice,
  filterDevices,
  initialDevices,
  summarize,
  validateDevice,
} from './devices.js'

const emptyForm = { name: '', type: DEVICE_TYPES[0], location: '' }

function App() {
  const [devices, setDevices] = useState(initialDevices)
  const [filters, setFilters] = useState({ status: 'all', search: '' })
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const summary = summarize(devices)
  const visible = filterDevices(devices, filters)

  function handleSubmit(e) {
    e.preventDefault()
    const found = validateDevice(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setDevices([...devices, createDevice(form, devices)])
    setForm(emptyForm)
  }

  function changeStatus(id, status) {
    setDevices(devices.map((d) => (d.id === id ? { ...d, status } : d)))
  }

  function removeDevice(id) {
    setDevices(devices.filter((d) => d.id !== id))
  }

  return (
    <div className="app">
      <header>
        <h1>Panel de dispositivos de telemetría</h1>
        <p>Administra los sensores y rastreadores de la empresa</p>
      </header>

      <section className="summary" aria-label="Resumen">
        <div className="card"><span>Total</span><strong data-testid="total">{summary.total}</strong></div>
        <div className="card online"><span>En línea</span><strong data-testid="online">{summary.online}</strong></div>
        <div className="card offline"><span>Desconectados</span><strong data-testid="offline">{summary.offline}</strong></div>
        <div className="card maintenance"><span>Mantenimiento</span><strong data-testid="maintenance">{summary.maintenance}</strong></div>
      </section>

      <section className="panel">
        <h2>Registrar dispositivo</h2>
        <form onSubmit={handleSubmit} className="form" noValidate>
          <label>
            Nombre
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <small className="error">{errors.name}</small>}
          </label>
          <label>
            Tipo
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {DEVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>
            Ubicación
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            {errors.location && <small className="error">{errors.location}</small>}
          </label>
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <h2>Dispositivos</h2>
          <input
            type="search"
            placeholder="Buscar por ID, nombre, tipo o ubicación"
            aria-label="Buscar"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            aria-label="Filtrar por estado"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Todos</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="empty">No hay dispositivos que coincidan.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nombre</th><th>Tipo</th><th>Ubicación</th><th>Última lectura</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.type}</td>
                  <td>{d.location}</td>
                  <td>{d.lastReading}</td>
                  <td>
                    <select
                      aria-label={`Estado de ${d.name}`}
                      className={`status ${d.status}`}
                      value={d.status}
                      onChange={(e) => changeStatus(d.id, e.target.value)}
                    >
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="danger" onClick={() => removeDevice(d.id)} aria-label={`Eliminar ${d.name}`}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default App
