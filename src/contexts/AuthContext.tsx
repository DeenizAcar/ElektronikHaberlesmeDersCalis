import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { getSession, logout as doLogout, type Session } from '../lib/auth'

type AuthCtx = {
  session: Session | null
  setSession: (s: Session | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession())

  const setSession = useCallback((s: Session | null) => setSessionState(s), [])

  const logout = useCallback(() => {
    doLogout()
    setSessionState(null)
  }, [])

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
