// Zona horaria del negocio. México abolió el horario de verano en 2022,
// así que la Ciudad de México es UTC−6 todo el año.
const MX_TZ = 'America/Mexico_City'
const MX_OFFSET = '-06:00'

/**
 * Inicio del día de hoy en horario mexicano, como ISO con offset.
 * Se usa para filtrar "solo hoy" independientemente de la zona del navegador
 * o del servidor.
 */
export function mexicoTodayStartISO(): string {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: MX_TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date()) // "2026-08-02"
  return `${ymd}T00:00:00${MX_OFFSET}`
}
