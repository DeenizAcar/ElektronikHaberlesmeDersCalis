import { useEffect, useRef, useState } from 'react'
import { Bell, ShieldCheck, DoorOpen, KeyRound, RotateCw } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Glossary from '../components/ui/Glossary'
import CompleteButton from '../components/ui/CompleteButton'

type State = 'idle' | 'arming' | 'armed' | 'triggered' | 'alarm' | 'disarmed'

export default function Alarm() {
  const [state, setState] = useState<State>('idle')
  const [countdown, setCountdown] = useState(0)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (state !== 'arming' && state !== 'triggered') return
    if (countdown <= 0) {
      if (state === 'arming') setState('armed')
      if (state === 'triggered') setState('alarm')
      return
    }
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [state, countdown])

  const arm = () => {
    if (state === 'idle' || state === 'disarmed') {
      setState('arming')
      setCountdown(20)
    }
  }
  const openDoor = () => {
    if (state === 'armed') {
      setState('triggered')
      setCountdown(10)
    }
  }
  const enterCode = () => {
    if (state === 'triggered') {
      setState('disarmed')
      setCountdown(0)
    } else if (state === 'alarm') {
      setState('disarmed')
      setCountdown(0)
    }
  }
  const reset = () => {
    setState('idle')
    setCountdown(0)
  }

  const status = (() => {
    switch (state) {
      case 'idle':       return { label: 'Boşta', color: 'bg-lavender-200 text-inkSoft' }
      case 'arming':     return { label: `Kuruluyor (${countdown}s)`, color: 'bg-peach-200 text-ink' }
      case 'armed':      return { label: 'Aktif (Armed)', color: 'bg-mint-200 text-mint-500' }
      case 'triggered':  return { label: `Entry delay (${countdown}s)`, color: 'bg-peach-300 text-ink' }
      case 'alarm':      return { label: 'ALARM!', color: 'bg-blush-300 text-ink' }
      case 'disarmed':   return { label: 'Güvenli — devre dışı', color: 'bg-mint-100 text-mint-500' }
    }
  })()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Alarm Sistemi"
        subtitle="Exit delay ile çıkış için 20 saniye, entry delay ile içeri giren kişinin şifre girmesi için 10 saniye. Süre dolarsa alarm."
        icon={<Bell className="w-6 h-6" />}
        accent="sky"
      />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Block diagram */}
        <div className="lg:col-span-5">
          <PlainCard>
            <h3 className="font-display font-semibold text-ink mb-4">Blok Diyagram</h3>
            <svg viewBox="0 0 360 280" className="w-full">
              {/* sensör */}
              <BlockNode x={20} y={110} w={80} h={50} label="Sensör" active={state === 'triggered'} />
              <Arrow x1={100} y1={135} x2={140} y2={135} active={state === 'triggered'} />
              {/* kontrolcü */}
              <BlockNode x={140} y={100} w={90} h={70} label="Kontrolcü" active={state !== 'idle' && state !== 'disarmed'} dark />
              <Arrow x1={230} y1={120} x2={270} y2={70} active={state === 'alarm'} />
              <Arrow x1={230} y1={150} x2={270} y2={220} active={state === 'armed' || state === 'alarm'} />
              {/* buzzer */}
              <BlockNode x={270} y={40} w={80} h={50} label="Buzzer" active={state === 'alarm'} />
              {/* led */}
              <BlockNode x={270} y={195} w={80} h={50} label="LED" active={state === 'armed' || state === 'alarm'} />
            </svg>
          </PlainCard>
        </div>

        {/* Sahne */}
        <div className="lg:col-span-7">
          <PlainCard className="relative overflow-hidden">
            <h3 className="font-display font-semibold text-ink mb-3">Dükkân</h3>
            <motion.div
              animate={{ backgroundColor: state === 'alarm' ? ['#FFE4EC', '#FFFBF5', '#FFE4EC'] : '#FFFBF5' }}
              transition={{ duration: 0.8, repeat: state === 'alarm' ? Infinity : 0 }}
              className="rounded-2xl p-4"
            >
              <svg viewBox="0 0 400 200" className="w-full">
                {/* zemin */}
                <rect x="20" y="40" width="360" height="140" fill="#FFE7D1" stroke="#FF9F58" strokeWidth="2" rx="6" />
                {/* kapı */}
                <rect x={state === 'triggered' || state === 'alarm' ? 180 : 200} y="60" width="40" height="80" fill={state === 'idle' ? '#FFFBF5' : '#FFD0A8'} stroke="#FF9F58" strokeWidth="2" rx="2" />
                {/* tezgah */}
                <rect x="50" y="120" width="60" height="40" fill="#D7C7EF" stroke="#A88CD6" strokeWidth="1.5" rx="4" />
                <rect x="280" y="110" width="80" height="50" fill="#B8EAD0" stroke="#73CCA0" strokeWidth="1.5" rx="4" />
                {/* LED indicator on building */}
                <motion.circle
                  cx="200"
                  cy="50"
                  r="6"
                  animate={{
                    fill: state === 'armed' ? '#52BC88' : state === 'alarm' ? '#E88AAB' : state === 'arming' || state === 'triggered' ? '#FF9F58' : '#D7C7EF',
                    scale: state === 'alarm' ? [1, 1.4, 1] : 1,
                  }}
                  transition={{ duration: 0.6, repeat: state === 'alarm' ? Infinity : 0 }}
                />
              </svg>
            </motion.div>

            {/* Status & countdown */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className={`chip ${status.color}`}>{status.label}</span>
              {(state === 'arming' || state === 'triggered') && (
                <motion.span
                  key={countdown}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono text-3xl font-bold text-blush-500"
                >
                  {countdown}
                </motion.span>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={arm}
                disabled={state !== 'idle' && state !== 'disarmed'}
                className="btn-pill bg-mint-300 text-ink hover:bg-mint-400 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" /> Kur
              </button>
              <button
                onClick={openDoor}
                disabled={state !== 'armed'}
                className="btn-pill bg-peach-300 text-ink hover:bg-peach-400 disabled:opacity-50"
              >
                <DoorOpen className="w-4 h-4" /> Kapıyı Aç
              </button>
              <button
                onClick={enterCode}
                disabled={state !== 'triggered' && state !== 'alarm'}
                className="btn-pill bg-lavender-300 text-ink hover:bg-lavender-400 disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" /> Şifreyi Gir
              </button>
              <button onClick={reset} className="btn-ghost">
                <RotateCw className="w-4 h-4" /> Sıfırla
              </button>
            </div>
          </PlainCard>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Scenario />
        <div className="card-soft p-6">
          <h3 className="font-display font-bold text-lg text-ink mb-3">Mantığı nasıl çalışıyor?</h3>
          <p className="text-inkSoft leading-relaxed">
            İki tane retriggerable monostable multivibrator (555 zamanlayıcı veya MCU timer) — biri çıkış için 20 sn, biri giriş için 10 sn. Sensör tetiklendiğinde giriş zamanlayıcısı başlar; süre dolduğunda hâlâ disarm yapılmadıysa alarm tetiklenir.
          </p>
        </div>
      </div>

      <Glossary
        items={[
          { term: 'Monostable multivibrator', def: 'Tek bir kararlı durumu olan, tetikleme aldığında belirli süre boyunca diğer duruma geçen devre. 555 entegresi klasik bir örnek.' },
          { term: 'Exit / Entry delay', def: 'Kurulumdan sonra çıkış için verilen süre / kapı tetiklenmesiyle alarmın çalmasına kadar geçen süre.' },
          { term: 'Retriggerable', def: 'Süre dolmadan tekrar tetiklenirse sayacın baştan başlaması. Hareket sensörlerinde sürekli tetikleme gerekirse kullanışlı.' },
        ]}
      />
      <CompleteButton topicId="alarm" />
    </div>
  )
}

function BlockNode({ x, y, w, h, label, active, dark = false }: { x: number; y: number; w: number; h: number; label: string; active: boolean; dark?: boolean }) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        animate={{
          fill: active ? (dark ? '#A88CD6' : '#94DDB8') : dark ? '#ECE4F7' : '#FFFBF5',
          stroke: active ? (dark ? '#9070C8' : '#52BC88') : '#D7C7EF',
        }}
        strokeWidth={2}
      />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fill={active && dark ? '#fff' : '#3D3654'} className="font-display font-semibold">
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, active }: { x1: number; y1: number; x2: number; y2: number; active: boolean }) {
  return (
    <g>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={active ? '#52BC88' : '#BFA8E4'} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? '#52BC88' : '#BFA8E4'} strokeWidth={2} markerEnd="url(#arrowhead)" />
    </g>
  )
}

function Scenario() {
  const steps = [
    { t: '1', text: '"Kur" → 20 saniye çıkış gecikmesi başlar.' },
    { t: '2', text: 'Süre dolduğunda alarm "armed" olur (yeşil LED).' },
    { t: '3', text: '"Kapıyı Aç" → 10 saniye giriş gecikmesi başlar.' },
    { t: '4', text: 'Şifre 10 sn içinde girilirse → güvenli.' },
    { t: '5', text: 'Girilmezse → ALARM (kırmızı flash + buzzer).' },
  ]
  return (
    <div className="card-soft p-6">
      <h3 className="font-display font-bold text-lg text-ink mb-3">Senaryo</h3>
      <ol className="space-y-2">
        {steps.map((s) => (
          <li key={s.t} className="flex gap-3 text-sm">
            <span className="shrink-0 w-6 h-6 rounded-full bg-blush-200 text-ink font-bold flex items-center justify-center text-xs">{s.t}</span>
            <span className="text-inkSoft">{s.text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
