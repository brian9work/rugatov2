// ⚠️ SOLO DESARROLLO — quitar antes de producción.
// Con true: se omite el login/auth y se entra al dashboard como admin falso.
// Para reactivar el login real: poner false (o borrar este archivo y sus usos).
export const DEV_BYPASS_AUTH = false

// Usuario simulado cuando DEV_BYPASS_AUTH está activo.
export const DEV_MOCK_USER = {
  id: 0,
  name: 'Dev',
  lastname: 'Admin',
  email: 'dev@rugato.local',
  phone: '',
  type: 'admin' as const,
  is_active: true,
}
