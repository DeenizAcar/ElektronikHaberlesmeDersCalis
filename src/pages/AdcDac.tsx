import { useEffect, useMemo, useState } from 'react'
import { Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Slider from '../components/ui/Slider'
import Glossary from '../components/ui/Glossary'
import CompleteButton from '../components/ui/CompleteButton'

export default function AdcDac() {
  const [amp, setAmp] = useState(0.8) // 0-1
  const [freq, setFreq] = useState(2) // Hz (görselleştirme için yavaş)
  const [bits, setBits] = useState(4)
  const [samples, setSamples] = useState(16) // samples per visible window
  const [t, setT] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setT((x) => x + 0.04), 60)
    return () => window.clearInterval(id)
  }, [])

  // build continuous sine path and sampled points
  const N = 400
  const W = 600
  const H = 200
  const margin = 12
  const levels = Math.pow(2, bits)

  const cont = useMemo(() => {
    let d = ''
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * W
      const phase = (i / N) * freq * 2 * Math.PI + t
      const y = H / 2 - amp * Math.sin(phase) * (H / 2 - margin)
      d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `
    }
    return d
  }, [amp, freq, t])

  const sampled = useMemo(() => {
    const arr: { x: number; y: number; quant: number; bin: string }[] = []
    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * W
      const phase = (i / samples) * freq * 2 * Math.PI + t
      const raw = amp * Math.sin(phase) // -1..1
      const normalized = (raw + 1) / 2 // 0..1
      const level = Math.min(levels - 1, Math.max(0, Math.round(normalized * (levels - 1))))
      const quant = (level / (levels - 1)) * 2 - 1
      const y = H / 2 - quant * (H / 2 - margin)
      arr.push({ x, y, quant: level, bin: level.toString(2).padStart(bits, '0') })
    }
    return arr
  }, [amp, freq, samples, bits, t, levels])

  // DAC staircase path
  const staircase = useMemo(() => {
    let d = ''
    sampled.forEach((p, i) => {
      const nextX = i + 1 < sampled.length ? sampled[i + 1].x : W
      if (i === 0) d += `M ${p.x} ${p.y} `
      d += `L ${nextX.toFixed(1)} ${p.y.toFixed(1)} `
      if (i + 1 < sampled.length) d += `L ${nextX.toFixed(1)} ${sampled[i + 1].y.toFixed(1)} `
    })
    return d
  }, [sampled])

  // smoothed (low-pass) - basit yumuşatma
  const smooth = useMemo(() => {
    const pts: { x: number; y: number }[] = []
    const win = 5
    for (let i = 0; i < sampled.length; i++) {
      let sum = 0
      let count = 0
      for (let j = Math.max(0, i - win); j <= Math.min(sampled.length - 1, i + win); j++) {
        sum += sampled[j].y
        count++
      }
      pts.push({ x: sampled[i].x, y: sum / count })
    }
    let d = ''
    pts.forEach((p, i) => {
      d += `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} `
    })
    return d
  }, [sampled])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="ADC / DAC & PCM"
        subtitle="Analog sinyali örnekle, kuantize et, ikiliye çevir; sonra tersine — ses geri gelsin. PCM'nin ufak gösterimi."
        icon={<Activity className="w-6 h-6" />}
        accent="lavender"
      />

      {/* kontroller */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Slider label="Genlik" value={amp} onChange={setAmp} min={0.1} max={1} step={0.05} format={(v) => v.toFixed(2)} />
        <Slider label="Frekans (görsel)" value={freq} onChange={setFreq} min={0.5} max={5} step={0.1} format={(v) => `${v.toFixed(1)} Hz`} />
        <div>
          <p className="text-sm font-semibold text-inkSoft mb-1.5">Çözünürlük</p>
          <div className="flex gap-2 flex-wrap">
            {[3, 4, 6, 8].map((b) => (
              <button
                key={b}
                onClick={() => setBits(b)}
                className={`chip ${bits === b ? 'bg-lavender-300 text-ink' : 'bg-white/60 text-inkSoft'}`}
              >
                {b}-bit
              </button>
            ))}
          </div>
        </div>
        <Slider label="Örnekleme" value={samples} onChange={(v) => setSamples(Math.round(v))} min={8} max={64} step={1} format={(v) => `${v.toFixed(0)} örnek`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ADC */}
        <PlainCard>
          <h3 className="font-display font-semibold text-ink mb-2">ADC · Analog → Dijital</h3>
          <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full bg-ink/95 rounded-2xl">
            {/* quantization levels */}
            {Array.from({ length: levels }).map((_, i) => {
              const y = H - (i / (levels - 1)) * (H - 2 * margin) - margin
              return <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#3F3552" strokeWidth="0.5" />
            })}
            <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#3F3552" strokeWidth="1" />
            {/* continuous sine */}
            <path d={cont} stroke="#73CCA0" strokeWidth="2" fill="none" opacity="0.7" />
            {/* sample lines */}
            {sampled.map((p, i) => (
              <line key={`s${i}`} x1={p.x} y1={H - margin} x2={p.x} y2={p.y} stroke="#E88AAB" strokeWidth="1.2" opacity="0.7" />
            ))}
            {/* sample dots */}
            {sampled.map((p, i) => (
              <circle key={`d${i}`} cx={p.x} cy={p.y} r="3.2" fill="#F8B4CC" />
            ))}
          </svg>
          <div className="mt-3 flex gap-2 overflow-x-auto py-1">
            {sampled.slice(0, 16).map((s, i) => (
              <motion.span
                key={i}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono text-[10px] bg-lavender-100 px-1.5 py-0.5 rounded shrink-0 text-ink"
              >
                {s.bin}
              </motion.span>
            ))}
          </div>
          <p className="text-xs text-inkSoft mt-2">
            {levels} kuantizasyon seviyesi · her örnek en yakın seviyeye yuvarlanıyor.
          </p>
        </PlainCard>

        {/* DAC */}
        <PlainCard>
          <h3 className="font-display font-semibold text-ink mb-2">DAC · Dijital → Analog</h3>
          <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full bg-ink/95 rounded-2xl">
            <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#3F3552" strokeWidth="1" />
            {/* staircase */}
            <path d={staircase} stroke="#FFB87E" strokeWidth="2" fill="none" />
            {/* smoothed */}
            <path d={smooth} stroke="#88CCF1" strokeWidth="2.5" fill="none" />
            {sampled.map((p, i) => (
              <circle key={`dd${i}`} cx={p.x} cy={p.y} r="2.5" fill="#FFB87E" />
            ))}
          </svg>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Legend color="#FFB87E" label="Merdiven (raw DAC)" />
            <Legend color="#88CCF1" label="Filtre sonrası (LPF)" />
          </div>
          <p className="text-xs text-inkSoft mt-2">
            DAC binary değerleri tek tek gerilime çeviriyor → merdiven oluşuyor → alçak geçiren filtreden geçince yumuşak sinyale dönüyor.
          </p>
        </PlainCard>
      </div>

      <div className="mt-6 card-soft p-6">
        <h3 className="font-display font-bold text-lg text-ink mb-2">Mantık (ADC ↔ DAC döngüsü)</h3>
        <p className="text-inkSoft leading-relaxed">
          ADC örnekler ve kuantize eder, DAC bunu yeniden bir gerilim seviyesi olarak çıkarır. Sürekli akan bir döngü gibi düşün — biri okuyor, diğeri okuduğunu sese/sinyale geri çeviriyor. Bit sayısı arttıkça merdiven basamakları küçülür → daha pürüzsüz, daha az kuantizasyon gürültüsü.
        </p>
      </div>

      {/* PCM bant */}
      <PCMSection bin={sampled.map((s) => s.bin).join('')} bits={bits} samples={samples} />

      <Glossary
        items={[
          { term: 'Örnekleme (Sampling)', def: 'Sürekli sinyalden eşit zaman aralıklarıyla değer alma. Nyquist: en yüksek frekansın en az 2 katı örnek almak gerekir.' },
          { term: 'Kuantizasyon', def: 'Her örneği sınırlı sayıdaki seviyeden birine yuvarlama. Hata: kuantizasyon gürültüsü.' },
          { term: 'PCM', def: 'Pulse Code Modulation. Örnek → kuantize → ikili kod. Dijital ses ve görüntü iletiminin temeli.' },
          { term: 'LPF (rekonstrüksiyon filtresi)', def: 'DAC çıkışındaki merdiveni yumuşatan alçak geçiren filtre. Örnekleme frekansının üstünü kısar.' },
        ]}
      />
      <CompleteButton topicId="adc-dac" />
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-inkSoft">
      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
      {label}
    </div>
  )
}

function PCMSection({ bin, bits, samples }: { bin: string; bits: number; samples: number }) {
  return (
    <div className="mt-6 card-soft p-6">
      <h3 className="font-display font-bold text-lg text-ink mb-3">PCM Modulator / Demodulator</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <StepRow color="blush" steps={['Sample', 'Quantize', 'Encode']} label="Modulator" />
        <StepRow color="mint" steps={['Decode', 'Reconstruct', 'Filter']} label="Demodulator" />
      </div>
      <p className="text-xs font-semibold text-inkSoft mt-4 mb-1">Serial bit stream ({samples} × {bits} = {samples * bits} bit):</p>
      <div className="bg-ink/95 rounded-2xl p-3 overflow-x-auto">
        <motion.p
          key={bin.length}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="font-mono text-xs text-mint-200 whitespace-nowrap tracking-wider"
        >
          {bin.match(/.{1,8}/g)?.join(' ') ?? bin}
        </motion.p>
      </div>
    </div>
  )
}

function StepRow({ steps, color, label }: { steps: string[]; color: 'blush' | 'mint'; label: string }) {
  const bg = color === 'blush' ? 'bg-blush-100' : 'bg-mint-100'
  return (
    <div>
      <p className="text-xs font-semibold text-inkSoft mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`${bg} rounded-2xl px-3 py-2 text-center w-full text-xs font-semibold text-ink`}>{s}</div>
            {i < steps.length - 1 && <span className="text-inkSoft">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
