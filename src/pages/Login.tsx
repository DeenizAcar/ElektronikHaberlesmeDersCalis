import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { login } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

const MESSAGES: Record<string, string> = {
  not_found: 'Kullanıcı adı bulunamadı.',
  wrong_password: 'Şifre hatalı.',
  inactive: 'Hesabınız devre dışı. Yetkiliyle iletişime geçin.',
  device_locked: 'Bu hesap başka bir cihaza bağlı. Ayarlardan cihaz değiştirebilirsiniz.',
  error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
}

export default function Login() {
  const { setSession } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) return
    setLoading(true)
    setError(null)

    const result = await login(username.trim(), password)

    if (result.ok) {
      setSession(result.session)
    } else {
      setError(MESSAGES[result.reason] ?? MESSAGES.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-bold text-ink">Devreleri Anla</h1>
          <p className="text-sm text-ink/50 mt-1">Ege Üniversitesi — Elektronik Haberleşme</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-ink/60 uppercase tracking-wide">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-lavender focus:ring-2 focus:ring-lavender/20"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="mt-2 bg-lavender text-white font-semibold py-2.5 rounded-lg text-sm transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center text-xs text-ink/30 mt-6">
          Hesabın yok mu? Yetkili kişiden satın al.
        </p>
      </motion.div>
    </div>
  )
}
