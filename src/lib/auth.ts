import { supabase } from './supabase'
import { getDeviceId } from './device'

const SESSION_KEY = 'devreaski.session'

export type Session = { username: string; deviceId: string }

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export type LoginResult =
  | { ok: true; session: Session }
  | { ok: false; reason: 'not_found' | 'wrong_password' | 'inactive' | 'device_locked' | 'error' }

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const hash = await sha256(password)
    const deviceId = getDeviceId()

    const { data, error } = await supabase.rpc('verify_login', {
      p_username: username,
      p_hash: hash,
    })

    if (error || !data || data.length === 0) return { ok: false, reason: 'not_found' }

    const row = data[0] as { success: boolean; device_id: string | null; is_active: boolean }

    if (!row.success) return { ok: false, reason: 'wrong_password' }
    if (!row.is_active) return { ok: false, reason: 'inactive' }

    // Device binding
    if (row.device_id === null) {
      // First login — bind device
      const { data: bound } = await supabase.rpc('bind_device', {
        p_username: username,
        p_hash: hash,
        p_device_id: deviceId,
      })
      if (!bound) return { ok: false, reason: 'error' }
    } else if (row.device_id !== deviceId) {
      return { ok: false, reason: 'device_locked' }
    }

    const session: Session = { username, deviceId }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { ok: true, session }
  } catch {
    return { ok: false, reason: 'error' }
  }
}

export async function resetDevice(username: string, password: string): Promise<boolean> {
  try {
    const hash = await sha256(password)
    const { data } = await supabase.rpc('reset_device', {
      p_username: username,
      p_hash: hash,
    })
    if (data) localStorage.removeItem(SESSION_KEY)
    return !!data
  } catch {
    return false
  }
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}
