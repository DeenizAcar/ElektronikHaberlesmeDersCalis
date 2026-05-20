import { useEffect, useRef, useState } from 'react'
import { Clock, Play, Pause, RotateCw, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Slider from '../components/ui/Slider'
import SevenSegment from '../components/simulators/SevenSegment'
import { segmentsForValue } from '../data/segmentTable'
import Glossary from '../components/ui/Glossary'
import CompleteButton from '../components/ui/CompleteButton'
import CircuitPanel from '../components/circuit/CircuitPanel'
import { SayicilarSchematic } from '../components/circuit/SayicilarCircuit'

type Tab = 'decade' | 'updown' | 'relay'

export default function Sayicilar() {
  const [tab, setTab] = useState<Tab>('decade')
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Sayıcılar & Zamanlayıcılar"
        subtitle="Decade counter ile 0–999999, sensörlerle yön bilen up/down, ve klasik time relay — üç sekme, üç hikâye."
        icon={<Clock className="w-6 h-6" />}
        accent="peach"
      />

      <CircuitPanel
        materials={[
          { name: '74LS90 Decade Counter', value: 'BCD çıkışlı', qty: 3 },
          { name: '74LS47 BCD-7Seg Decoder', value: 'Common Anode uyumlu', qty: 3 },
          { name: '7-Segment Display', value: 'Common Cathode, 1 haneli', qty: 3 },
          { name: 'NE555 Timer', value: 'Astable mod (clock)', qty: 1 },
          { name: 'Direnç', value: '330 Ω (segment serisi) × 21', qty: 21 },
          { name: 'Direnç', value: '10 kΩ, 100 kΩ (555 ayar)', qty: 2 },
          { name: 'Elektrolitik Kapasitör', value: '10 µF (555 zamanlama)', qty: 1 },
          { name: 'Breadboard', value: '2× 830 delik', qty: 2 },
          { name: 'Jumper Kablo', value: 'M-M', qty: 40 },
          { name: 'Güç Kaynağı', value: '+5V DC 1A', qty: 1 },
        ]}
        steps={[
          '555\'i astable modda kur: Ra=10kΩ, Rb=100kΩ, C=10µF → f≈0.7/(Ra+2Rb)C≈0.5Hz. Yavaş sayım için.',
          'İlk 74LS90\'ı breadboard\'a koy. Pin 5 (VCC) +5V, pin 10 (GND) GND\'e bağla.',
          'CKA (pin 14) ve CKB (pin 1) girişlerini bağla: CKA → clock, CKB → QA çıkışına bağlayınca BCD mod.',
          'QA(12) QB(9) QC(8) QD(11) çıkışlarını 74LS47\'nin A B C D girişlerine bağla.',
          '74LS47 a-g çıkışlarından her birini 330Ω dirençle 7-segment\'in ilgili segment pinine bağla.',
          '7-segment\'in common cathode (ortak katot) pinini GND\'e bağla.',
          'Cascade için: 74LS90 #1\'in QD çıkışını → 74LS90 #2\'nin CKA\'sına bağla. Aynı şekilde #2→#3.',
          'Tüm sayıcıların R01(6), R02(7), R91(2), R92(3) pinlerini GND\'e bağla (reset devre dışı).',
        ]}
        schematic={<SayicilarSchematic />}
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {([
          { id: 'decade', label: '6-Digit Decade Counter' },
          { id: 'updown', label: 'Sensörlü Up/Down' },
          { id: 'relay', label: 'Time Relay' },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`chip transition-all ${tab === t.id ? 'bg-peach-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'decade' && <DecadeCounter />}
      {tab === 'updown' && <UpDownCounter />}
      {tab === 'relay' && <TimeRelay />}

      <Glossary
        items={[
          { term: 'Decade counter', def: '0\'dan 9\'a sayıp tekrar 0\'a dönen, her döngüde carry üreten sayıcı. 74LS90 klasik örnek.' },
          { term: 'Cascade', def: 'Birden fazla sayıcıyı uç uca bağlamak. Önceki carry, sonrakine clock olur.' },
          { term: 'State machine', def: 'Belirli durumlar ve geçişlerle çalışan sistem. Up/Down counter, hangi sensörün önce tetiklendiğine göre durum değiştirir.' },
          { term: 'Time relay', def: 'Tetiklendikten sonra ayarlı süre sonra çıkışı aktive eden (on-delay) ya da kapatan (off-delay) röle.' },
        ]}
      />
      <CompleteButton topicId="sayicilar" />
    </div>
  )
}

/* ---------- Decade Counter ---------- */
function DecadeCounter() {
  const [count, setCount] = useState(0)
  const [hz, setHz] = useState(2)
  const [running, setRunning] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setCount((c) => (c + 1) % 1000000)
    }, 1000 / hz)
    timer.current = id
    return () => window.clearInterval(id)
  }, [running, hz])

  const digits = count.toString().padStart(6, '0').split('').map(Number)

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <PlainCard className="flex flex-col items-center">
          <p className="text-sm text-inkSoft mb-4">0 → 999999</p>
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            {digits.map((d, i) => (
              <motion.div
                key={i}
                animate={{ scale: i === 5 && running ? [1, 1.04, 1] : 1 }}
                transition={{ duration: 0.3, repeat: i === 5 ? Infinity : 0 }}
                className="bg-ink/95 rounded-xl sm:rounded-2xl p-1 sm:p-2"
              >
                <SevenSegment segments={segmentsForValue(d)} size={36} on="#FFB87E" off="#3F3552" />
              </motion.div>
            ))}
          </div>
          <p className="font-mono text-3xl font-bold text-ink mt-6">{count.toLocaleString('tr-TR')}</p>
        </PlainCard>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <PlainCard>
          <h3 className="font-display font-semibold text-ink mb-3">Kontrol</h3>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setRunning((v) => !v)}
              className={`flex-1 btn-pill ${running ? 'bg-blush-300' : 'bg-mint-300'} text-ink`}
            >
              {running ? <><Pause className="w-4 h-4" /> Dur</> : <><Play className="w-4 h-4" /> Başlat</>}
            </button>
            <button onClick={() => { setCount(0); setRunning(false) }} className="btn-ghost">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
          <Slider label="Hız" value={hz} onChange={setHz} min={0.1} max={10} step={0.1} format={(v) => `${v.toFixed(1)} Hz`} />
        </PlainCard>
        <div className="card-soft p-5 text-sm text-inkSoft leading-relaxed">
          <p className="font-semibold text-ink mb-1">Mantık</p>
          Her decade counter (74LS90 gibi) 0'dan 9'a sayar, sonra carry üretip bir sonraki haneye geçirir. 6 tane cascade bağlanırsa 0–999999 sayar. Birim hane "saatin saniyesi", onlar "saniyenin onlar basamağı"... aynı mantık.
        </div>
      </div>
    </div>
  )
}

/* ---------- Up/Down Counter ---------- */
function UpDownCounter() {
  const [count, setCount] = useState(0)
  const [lastSensor, setLastSensor] = useState<'S1' | 'S2' | null>(null)
  const [busy, setBusy] = useState(false)
  const [walker, setWalker] = useState<{ direction: 'in' | 'out' } | null>(null)

  const trigger = (sensor: 'S1' | 'S2') => {
    if (busy) return
    if (lastSensor === null) {
      setLastSensor(sensor)
      return
    }
    if (lastSensor === sensor) {
      setLastSensor(sensor)
      return
    }
    setBusy(true)
    if (lastSensor === 'S1' && sensor === 'S2') {
      setWalker({ direction: 'in' })
      setTimeout(() => {
        setCount((c) => Math.min(99, c + 1))
        setWalker(null)
        setBusy(false)
        setLastSensor(null)
      }, 1100)
    } else if (lastSensor === 'S2' && sensor === 'S1') {
      setWalker({ direction: 'out' })
      setTimeout(() => {
        setCount((c) => Math.max(0, c - 1))
        setWalker(null)
        setBusy(false)
        setLastSensor(null)
      }, 1100)
    }
  }

  const tens = Math.floor(count / 10)
  const ones = count % 10

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <PlainCard>
          <h3 className="font-display font-semibold text-ink mb-3">Kapı görseli</h3>
          <svg viewBox="0 0 480 200" className="w-full">
            {/* zemin */}
            <line x1="20" y1="170" x2="460" y2="170" stroke="#BFA8E4" strokeWidth="2" />
            {/* duvar - kapı çerçevesi */}
            <rect x="180" y="70" width="120" height="100" fill="#FFE7D1" stroke="#FF9F58" strokeWidth="2" rx="4" />
            <rect x="200" y="90" width="80" height="80" fill="#FFFBF5" stroke="#FF9F58" strokeWidth="2" />
            {/* iç / dış labels */}
            <text x="80" y="60" fontSize="13" fill="#6B6385" className="font-display">Dışarı</text>
            <text x="380" y="60" fontSize="13" fill="#6B6385" className="font-display">İçeri</text>

            {/* sensörler */}
            <g>
              <circle cx="160" cy="170" r="8" fill={lastSensor === 'S1' ? '#52BC88' : '#D7C7EF'} />
              <text x="160" y="195" fontSize="11" textAnchor="middle" fill="#6B6385" className="font-mono">S1</text>
            </g>
            <g>
              <circle cx="320" cy="170" r="8" fill={lastSensor === 'S2' ? '#52BC88' : '#D7C7EF'} />
              <text x="320" y="195" fontSize="11" textAnchor="middle" fill="#6B6385" className="font-mono">S2</text>
            </g>

            {/* yürüyen kişi */}
            {walker && (
              <motion.g
                initial={{ x: walker.direction === 'in' ? 60 : 380, opacity: 0 }}
                animate={{ x: walker.direction === 'in' ? 380 : 60, opacity: 1 }}
                transition={{ duration: 1.0, ease: 'easeInOut' }}
              >
                <circle cx="0" cy="130" r="8" fill="#F8B4CC" />
                <rect x="-5" y="138" width="10" height="22" fill="#A88CD6" rx="3" />
              </motion.g>
            )}
          </svg>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => trigger('S1')} disabled={busy} className="btn-pill bg-lavender-200 text-ink hover:bg-lavender-300 disabled:opacity-50">
              Sensör S1
            </button>
            <button onClick={() => trigger('S2')} disabled={busy} className="btn-pill bg-blush-200 text-ink hover:bg-blush-300 disabled:opacity-50">
              Sensör S2
            </button>
          </div>
          <p className="text-xs text-inkSoft text-center mt-3">
            Sıra S1 → S2 ise içeri (+1). Sıra S2 → S1 ise dışarı (–1).
          </p>
        </PlainCard>
      </div>
      <div className="lg:col-span-5 space-y-4">
        <PlainCard className="flex flex-col items-center">
          <p className="text-xs font-semibold text-inkSoft uppercase mb-2">İçerideki kişi sayısı</p>
          <div className="flex gap-3">
            <div className="bg-ink/95 rounded-2xl p-2">
              <SevenSegment segments={segmentsForValue(tens)} size={56} on="#73CCA0" off="#3F3552" />
            </div>
            <div className="bg-ink/95 rounded-2xl p-2">
              <SevenSegment segments={segmentsForValue(ones)} size={56} on="#73CCA0" off="#3F3552" />
            </div>
          </div>
          <p className="font-mono text-2xl font-bold text-ink mt-4">{count.toString().padStart(2, '0')}</p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setCount((c) => Math.min(99, c + 1))} className="btn-ghost text-xs">
              <Plus className="w-3.5 h-3.5" /> elle +1
            </button>
            <button onClick={() => setCount((c) => Math.max(0, c - 1))} className="btn-ghost text-xs">
              <Minus className="w-3.5 h-3.5" /> elle -1
            </button>
            <button onClick={() => setCount(0)} className="btn-ghost text-xs">
              <RotateCw className="w-3.5 h-3.5" /> sıfırla
            </button>
          </div>
        </PlainCard>
        <div className="card-soft p-5 text-sm text-inkSoft leading-relaxed">
          <p className="font-semibold text-ink mb-1">Mantık</p>
          Hangi sensör önce tetiklendiğine bakarak yön belirler — S1 önce ise içeri (+1), S2 önce ise dışarı (–1). Bu basit bir <span className="font-semibold text-ink">state machine</span>'dir: önce hangi sensörü gördün, sonra hangisi geliyor?
        </div>
      </div>
    </div>
  )
}

/* ---------- Time Relay ---------- */
function TimeRelay() {
  const [mode, setMode] = useState<'sec' | 'hour'>('sec')
  const [type, setType] = useState<'on' | 'off'>('on')
  const [setpoint, setSetpoint] = useState(5)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [relayOn, setRelayOn] = useState(false)
  const timer = useRef<number | null>(null)

  const tick = useRef(() => {})
  tick.current = () => {
    setRemaining((r) => {
      if (r === null) return r
      if (r <= 1) {
        if (type === 'on') setRelayOn(true)
        else setRelayOn(false)
        return null
      }
      return r - 1
    })
  }

  useEffect(() => {
    if (remaining === null) {
      if (timer.current !== null) window.clearInterval(timer.current)
      timer.current = null
      return
    }
    const id = window.setInterval(() => tick.current(), 1000)
    timer.current = id
    return () => window.clearInterval(id)
  }, [remaining])

  const start = () => {
    if (type === 'on') setRelayOn(false)
    else setRelayOn(true)
    setRemaining(setpoint)
  }
  const reset = () => {
    setRemaining(null)
    setRelayOn(false)
  }

  const maxSet = mode === 'sec' ? 60 : 24
  const unit = mode === 'sec' ? 's' : 'h'

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 space-y-4">
        <PlainCard>
          <h3 className="font-display font-semibold text-ink mb-3">Ayarlar</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-inkSoft mb-1.5">Mod</p>
              <div className="flex gap-2">
                <button onClick={() => setMode('sec')} className={`chip ${mode === 'sec' ? 'bg-peach-300 text-ink' : 'bg-white/60 text-inkSoft'}`}>Saniye (0-60 s)</button>
                <button onClick={() => setMode('hour')} className={`chip ${mode === 'hour' ? 'bg-peach-300 text-ink' : 'bg-white/60 text-inkSoft'}`}>Saat (0-24 h)</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-inkSoft mb-1.5">Gecikme Tipi</p>
              <div className="flex gap-2">
                <button onClick={() => setType('on')} className={`chip ${type === 'on' ? 'bg-lavender-300 text-ink' : 'bg-white/60 text-inkSoft'}`}>Turn-on delay</button>
                <button onClick={() => setType('off')} className={`chip ${type === 'off' ? 'bg-lavender-300 text-ink' : 'bg-white/60 text-inkSoft'}`}>Turn-off delay</button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Slider
              label={`Süre (${unit})`}
              value={setpoint}
              onChange={(v) => setSetpoint(Math.round(v))}
              min={1}
              max={maxSet}
              step={1}
              format={(v) => `${v.toFixed(0)} ${unit}`}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={start} disabled={remaining !== null} className="btn-primary disabled:opacity-60">
              <Play className="w-4 h-4" /> Tetikle
            </button>
            <button onClick={reset} className="btn-ghost">
              <RotateCw className="w-4 h-4" /> Sıfırla
            </button>
          </div>
        </PlainCard>
        <div className="card-soft p-5 text-sm text-inkSoft leading-relaxed">
          <p className="font-semibold text-ink mb-1">Mantık</p>
          Zamanlayıcı röle, tetiklendikten sonra belirlenen süre kadar bekler ve sonra çıkışını aktive eder (turn-on delay) ya da deaktive eder (turn-off delay). Pratik kullanım: yıldız-üçgen marş, merdiven otomatı, ev otomasyonu...
        </div>
      </div>
      <div className="lg:col-span-5">
        <PlainCard className="flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-xs font-semibold text-inkSoft uppercase mb-2">Kalan süre</p>
          <p className="font-mono text-6xl font-bold text-ink">{remaining ?? '—'}</p>
          <p className="text-sm text-inkSoft mt-1">{remaining !== null ? unit : 'bekleniyor'}</p>
          <motion.div
            className={`mt-6 w-24 h-24 rounded-full flex items-center justify-center ${relayOn ? 'bg-mint-200' : 'bg-lavender-100'}`}
            animate={{ scale: relayOn ? [1, 1.06, 1] : 1 }}
            transition={{ duration: 1.4, repeat: relayOn ? Infinity : 0 }}
          >
            <div className={`w-14 h-14 rounded-full ${relayOn ? 'bg-mint-400 shadow-soft-mint' : 'bg-lavender-300'}`} />
          </motion.div>
          <p className={`text-sm font-bold mt-3 ${relayOn ? 'text-mint-500' : 'text-inkSoft'}`}>
            Röle {relayOn ? 'AÇIK' : 'KAPALI'}
          </p>
        </PlainCard>
      </div>
    </div>
  )
}
