import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
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

        <button
          aria-label="Menüyü aç"
          className="lg:hidden p-2 rounded-full hover:bg-white/70"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
