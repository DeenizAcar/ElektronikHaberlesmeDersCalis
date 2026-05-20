import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Hash, ArrowLeftRight, Clock, Bell, Activity } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCompleted } from '../lib/progress'

const topics = [
  {
    to: '/aa-devre',
    title: 'AA Devre Analizi',
    desc: 'RC, rezonans, filtreler — frekansın diliyle anlat.',
    icon: Zap,
    gradient: 'from-blush-100 to-blush-200',
  },
  {
    to: '/segment',
    title: '7-Segment Hex Decoder',
    desc: '4 girişle 0-F göster: her LED neden yanar?',
    icon: Hash,
    gradient: 'from-lavender-100 to-lavender-200',
  },
  {
    to: '/mux',
    title: 'Multiplexer Lab',
    desc: '8 girişten birini seçen küçük trafik polisi.',
    icon: ArrowLeftRight,
    gradient: 'from-mint-100 to-mint-200',
  },
  {
    to: '/sayicilar',
    title: 'Sayıcılar & Zamanlayıcılar',
    desc: 'Decade counter, up/down, time relay — saydır.',
    icon: Clock,
    gradient: 'from-peach-100 to-peach-200',
  },
  {
    to: '/alarm',
    title: 'Alarm Sistemi',
    desc: 'Exit & entry delay nasıl çalışır, dene gör.',
    icon: Bell,
    gradient: 'from-sky-100 to-sky-200',
  },
  {
    to: '/adc-dac',
    title: 'ADC/DAC & PCM',
    desc: 'Analogdan dijitale, sonra geri — örnekle anla.',
    icon: Activity,
    gradient: 'from-lavender-100 to-blush-100',
  },
]

export default function Home() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount(getCompleted().length)
  }, [])

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-12">
      {/* Hero */}
      <section className="text-center mb-10 sm:mb-14 relative">
        <motion.div
          className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-blush-200/40 blur-3xl -z-10"
          animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-10 right-1/4 w-48 h-48 rounded-full bg-lavender-200/40 blur-3xl -z-10"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-4xl sm:text-7xl bg-gradient-to-br from-blush-500 via-lavender-500 to-sky-500 bg-clip-text text-transparent leading-tight"
        >
          Devreleri Anla
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-base sm:text-xl text-inkSoft max-w-xl mx-auto"
        >
          Ezberlemeden, mantığıyla öğren ✨
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm text-inkSoft/70"
        >
          Ege Üniversitesi · Elektronik Haberleşme Teknolojisi laboratuvar deneyleri
        </motion.p>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {topics.map((t, i) => {
          const Icon = t.icon
          return (
            <motion.div
              key={t.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              whileHover={{ y: -6 }}
            >
              <Link
                to={t.to}
                className={`block group rounded-3xl bg-gradient-to-br ${t.gradient} p-6 ring-1 ring-white/60 shadow-soft hover:shadow-soft-blush transition-all h-full`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/70 flex items-center justify-center shadow-soft">
                    <Icon className="w-6 h-6 text-ink" />
                  </div>
                  <span className="text-xs font-semibold text-inkSoft/80 group-hover:text-ink transition">
                    keşfet →
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-1.5">{t.title}</h3>
                <p className="text-sm text-inkSoft leading-relaxed">{t.desc}</p>
              </Link>
            </motion.div>
          )
        })}
      </section>

      {/* Alt bant */}
      <section className="mt-8 sm:mt-12 flex flex-wrap items-center justify-between gap-3">
        <div className="card-soft px-5 py-3 inline-flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-mint-100 flex items-center justify-center">
            <span className="font-bold text-mint-500">{count}</span>
          </div>
          <p className="text-sm text-inkSoft">
            <span className="font-bold text-ink">{count}</span> konu tamamlandı
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/notlar" className="btn-ghost text-sm">📓 Notlar</Link>
          <Link to="/quiz" className="btn-primary text-sm">Quiz →</Link>
        </div>
      </section>
    </div>
  )
}
