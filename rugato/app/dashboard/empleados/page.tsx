'use client'

import { useEffect, useState } from 'react'
import { UserPlus, X, Mail, Lock, User, Phone, Shield, Pencil, PowerOff, Power } from 'lucide-react'
import { type UserRole, ROLE_LABELS, ROLE_BG, ROLE_TEXT, ROLE_BORDER } from '@/lib/roles'

interface Employee {
  id: number
  name: string
  lastname: string
  email: string
  type: UserRole
  is_active: boolean
  phone: string
  created_at: string
}

const emptyForm = {
  name: '', lastname: '', email: '',
  password: '', phone: '', type: 'user' as UserRole,
}

type ModalMode = 'create' | 'edit'

export default function EmpleadosPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function fetchEmployees() {
    setLoading(true)
    const res = await fetch('/api/usuarios')
    const data = await res.json()
    setEmployees(data.users ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchEmployees() }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function openCreate() {
    setModalMode('create')
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  function openEdit(emp: Employee) {
    setModalMode('edit')
    setEditingId(emp.id)
    setForm({
      name: emp.name ?? '',
      lastname: emp.lastname ?? '',
      email: emp.email ?? '',
      password: '',
      phone: emp.phone ?? '',
      type: emp.type,
    })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (modalMode === 'create') {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al crear el usuario'); setSaving(false); return }
    } else {
      const res = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al actualizar'); setSaving(false); return }
    }

    setShowModal(false)
    setForm(emptyForm)
    fetchEmployees()
    setSaving(false)
  }

  async function toggleActive(emp: Employee) {
    setTogglingId(emp.id)
    await fetch('/api/usuarios', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: emp.id, is_active: !emp.is_active }),
    })
    await fetchEmployees()
    setTogglingId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Empleados</h1>
          <p className="text-gray-400 text-sm mt-0.5">{employees.length} usuarios registrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-role-admin text-bg-primary font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
        >
          <UserPlus size={16} />
          Nuevo usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-bg-secondary rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <p className="text-gray-400 text-sm p-6">Cargando...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No hay usuarios registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr
                  key={emp.id}
                  className={`border-b border-gray-700/50 hover:bg-bg-primary/50 transition-colors ${i === employees.length - 1 ? 'border-0' : ''} ${!emp.is_active ? 'opacity-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-bg-primary font-bold text-xs ${ROLE_BG[emp.type]}`}>
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{emp.name} {emp.lastname}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{emp.email}</td>
                  <td className="px-4 py-3 text-gray-300">{emp.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${ROLE_TEXT[emp.type]} ${ROLE_BORDER[emp.type]}`}>
                      {ROLE_LABELS[emp.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${emp.is_active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {emp.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(emp)}
                        title="Editar"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-bg-primary transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => toggleActive(emp)}
                        disabled={togglingId === emp.id}
                        title={emp.is_active ? 'Desactivar' : 'Activar'}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${emp.is_active
                            ? 'text-gray-400 hover:text-status-cancelado hover:bg-bg-primary'
                            : 'text-gray-400 hover:text-role-admin hover:bg-bg-primary'
                          }`}
                      >
                        {emp.is_active ? <PowerOff size={15} /> : <Power size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal crear / editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-secondary border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {modalMode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field icon={<User size={14} />} label="Nombre" name="name" value={form.name} onChange={handleChange} required />
                <Field icon={<User size={14} />} label="Apellido" name="lastname" value={form.lastname} onChange={handleChange} />
              </div>

              {modalMode === 'create' && (
                <Field icon={<Mail size={14} />} label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} required />
              )}

              {modalMode === 'edit' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 flex items-center gap-1.5"><Mail size={14} /> Correo</label>
                  <p className="text-gray-500 text-sm px-3 py-2.5 bg-bg-primary/50 rounded-lg border border-gray-700/50">{form.email}</p>
                </div>
              )}

              <Field icon={<Phone size={14} />} label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />

              {modalMode === 'create' && (
                <Field icon={<Lock size={14} />} label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required />
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 flex items-center gap-1.5"><Shield size={14} /> Rol</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-bg-primary border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-role-admin transition-colors"
                >
                  <option value="admin">Administrador</option>
                  <option value="cocina">Cocina</option>
                  <option value="barra">Barra</option>
                  <option value="user">Mesero</option>
                </select>
              </div>

              {error && <p className="text-status-cancelado text-xs text-center">{error}</p>}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-700 text-gray-300 rounded-lg py-2.5 text-sm hover:bg-bg-primary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-role-admin text-bg-primary font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : modalMode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({
  icon, label, name, value, onChange, type = 'text', required = false, maxLength, placeholder,
}: {
  icon: React.ReactNode
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
  maxLength?: number
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 flex items-center gap-1.5">{icon} {label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className="bg-bg-primary border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-role-admin transition-colors"
      />
    </div>
  )
}
