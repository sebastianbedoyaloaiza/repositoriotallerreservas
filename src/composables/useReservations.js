import { ref } from 'vue'

const KEY = 'prueba-reservas-vite:reservas:v1'

function safeParse(str) {
  try { 
    return JSON.parse(str) 
  } catch (e) { 
    console.warn('localStorage parse error for', KEY, e)
    return [] 
  }
}


//Tener la hora en varios formatos 
function parseTimeString(horaStr) {
  if (!horaStr) return null
  const s = horaStr.trim()
  const ampmMatch = s.match(/(am|pm|AM|PM)$/)
  let modifier = null
  let timePart = s
  if (ampmMatch) {
    modifier = ampmMatch[0].toLowerCase()
    timePart = s.slice(0, ampmMatch.index).trim()
  }
  
  const hm = timePart.split(':')
  if (hm.length < 2) return null
  let hh = parseInt(hm[0].replace(/\D/g, ''), 10)
  const mins = parseInt(hm[1].replace(/\D/g, ''), 10) || 0
  if (Number.isNaN(hh) || Number.isNaN(mins)) return null

  if (modifier) {
    if (modifier === 'am' && hh === 12) hh = 0
    if (modifier === 'pm' && hh !== 12) hh += 12
  }

  hh = ((hh % 24) + 24) % 24
  return { hh, mins: Math.max(0, Math.min(59, mins)) }
}

/**
 * Construye un Date local a partir de fecha "YYYY-MM-DD" y hora en varios formatos.
 * Devuelve null si no pudo.
 */
function buildDateFromFechaHora(fecha, horaStr) {
  if (!fecha || !horaStr) return null
  const parts = String(fecha).split('-')
  if (parts.length < 3) return null
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  if ([year, month, day].some(v => Number.isNaN(v))) return null

  const t = parseTimeString(horaStr)
  if (!t) return null

  return new Date(year, month, day, t.hh, t.mins, 0, 0)
}

/**
 * Composable para reservas con bloqueo de solapamientos de 1 hora y control de horas pasadas
 */
export function useReservations(key = KEY) {
  const raw = localStorage.getItem(key)
  const reservas = ref(safeParse(raw || '[]'))

  const isConflict = ({ espacioId, fecha, hora }) => {
    const newStartDate = buildDateFromFechaHora(fecha, hora)
    if (!newStartDate) return false

    const now = new Date()
    if (newStartDate < now) return true // no permitir reservas en el pasado

    const newStartMs = newStartDate.getTime()
    const newEndMs = newStartMs + 60 * 60 * 1000 // 1 hora

    const overlap = reservas.value.some(r => {
      if (String(r.espacioId) !== String(espacioId)) return false
      if (r.fecha !== fecha) return false
      const existingStartDate = buildDateFromFechaHora(r.fecha, r.hora)
      if (!existingStartDate) return false
      const existingStartMs = existingStartDate.getTime()
      const existingEndMs = existingStartMs + 60 * 60 * 1000
      return newStartMs < existingEndMs && existingStartMs < newEndMs
    })
    return overlap ? 'overlap' : false
  }

  const save = () => localStorage.setItem(key, JSON.stringify(reservas.value))

  const add = (reserva) => {
    if (isConflict(reserva)) return false
    reservas.value.push(reserva)
    save()
    return true
  }

  const removeById = (id) => {
    reservas.value = reservas.value.filter(r => r.id !== id)
    save()
  }

  const clear = () => {
    reservas.value = []
    localStorage.removeItem(key)
  }

  return { reservas, add, removeById, clear, isConflict }
}
