import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Zap, LogOut, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { resetDevice } from '../../lib/auth'

const links = [
  { to: '/aa-devre', label: 'AA Devre' },
  { to: '/segment', label: '7-Segment' },
  { to: '/mux', label: 'Mux' },
  { to: '/sayicilar', label: 'Sayıcılar' },
  { to: '/alarm', label: 'Alarm' },
  { to: '/adc-dac', label: 'ADC/DAC' },
  { to: '/notlar', label: 'Notlar' },
  { to: '/quiz', label: 'Quiz' },
]

function DeviceResetModal({ username, onClose }: { username: string; onClose: () => void }) {
  const { logout } = useAuth()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle() {
    if (!password) return
    setLoading(true)
    const ok = await resetDevice(username, password)
    if (ok) {
      logout()
    } else {
      setError('Şifre hatalı.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-lavender-500" />
          <h2 className="font-display font-bold text-ink">Cihaz Değiştir</h2>
        </div>
        <p className="text-sm text-inkSoft mb-4">
          Şifreni gir. Hesabın bu cihazdan çözülecek ve bir sonraki girişte yeni cihaza bağlanacak.
        </p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Şifren"
          className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink mb-3 focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
          onKeyDown={e => e.key === 'Enter' && handle()}
          autoFocus
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-ink/15 text-sm text-inkSoft hover:bg-ink/5 transition"
          >
            İptal
          </button>
          <button
            onClick={handle}
            disabled={loading || !password}
            className="flex-1 py-2 rounded-lg bg-lavender text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition"
          >
            {loading ? 'İşleniyor…' : 'Onayla'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showDeviceReset, setShowDeviceReset] = useState(false)
  const { session, logout } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/70 border-b border-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="relative inline-flex w-8 h-8 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-200 to-lavender-200 shadow-soft-blush">
              <Zap className="w-4 h-4 text-ink" />
            </span>
            <span className="font-display font-bold text-base sm:text-lg text-ink group-hover:text-blush-500 transition-colors leading-tight">
              Devreleri Anla
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blush-200 text-ink shadow-soft-blush'
                      : 'text-inkSoft hover:bg-white/70 hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {session && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-inkSoft hover:bg-white/70 hover:text-ink transition-all"
                >
                  <span className="w-5 h-5 rounded-full bg-lavender-200 flex items-center justify-center text-xs font-bold text-lavender-700">
                    {session.username[0].toUpperCase()}
                  </span>
                  {session.username}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-40 bg-white rounded-2xl shadow-xl border border-lavender-100 py-1 min-w-[160px]"
                      >
                        <button
                          onClick={() => { setUserMenuOpen(false); setShowDeviceReset(true) }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-inkSoft hover:bg-lavender-50 hover:text-ink transition-colors"
                        >
                          <Smartphone className="w-4 h-4" /> Cihaz Değiştir
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); logout() }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-blush-500 hover:bg-blush-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Çıkış Yap
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              aria-label="Menüyü aç"
              className="lg:hidden p-2 rounded-full hover:bg-white/70"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-white/60 bg-cream/80"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blush-200 text-ink'
                          : 'text-inkSoft hover:bg-white/70 hover:text-ink'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                {session && (
                  <>
                    <button
                      onClick={() => { setOpen(false); setShowDeviceReset(true) }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold text-inkSoft hover:bg-white/70 hover:text-ink transition-all"
                    >
                      <Smartphone className="w-4 h-4" /> Cihaz Değiştir
                    </button>
                    <button
                      onClick={() => { setOpen(false); logout() }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold text-blush-500 hover:bg-blush-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Çıkış Yap
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {showDeviceReset && session && (
        <DeviceResetModal username={session.username} onClose={() => setShowDeviceReset(false)} />
      )}
    </>
  )
}
