import { useMemo, useState } from 'react'
import Slider from '../ui/Slider'

type Wave = 'sin' | 'square' | 'triangle'

export default function Oscilloscope() {
  const [wave, setWave] = useState<Wave>('sin')
  const [freq, setFreq] = useState(500) // Hz
  const [vpp, setVpp] = useState(4) // V

  const points = useMemo(() => buildPath(wave, freq, vpp), [wave, freq, vpp])

  const vrms = useMemo(() => {
    switch (wave) {
      case 'sin':      return vpp / (2 * Math.sqrt(2))
      case 'square':   return vpp / 2
      case 'triangle': return vpp / (2 * Math.sqrt(3))
    }
  }, [wave, vpp])

  const period = 1 / freq

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-soft p-4">
        <svg viewBox="0 0 400 200" className="w-full rounded-2xl bg-ink/95">
          {/* grid */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={200} stroke="#3F3552" strokeWidth={i === 4 ? 1.2 : 0.5} />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 50} x2={400} y2={i * 50} stroke="#3F3552" strokeWidth={i === 2 ? 1.2 : 0.5} />
          ))}
          <path d={points} fill="none" stroke="#73CCA0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="card-soft p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {(['sin', 'square', 'triangle'] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWave(w)}
              className={`chip transition-colors ${
                wave === w ? 'bg-blush-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'
              }`}
            >
              {w === 'sin' ? 'Sinüs' : w === 'square' ? 'Kare' : 'Üçgen'}
            </button>
          ))}
        </div>
        <Slider
          label="Frekans"
          value={freq}
          onChange={setFreq}
          min={50}
          max={10000}
          step={10}
          format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)} kHz` : `${v.toFixed(0)} Hz`)}
        />
        <Slider label="Vpp" value={vpp} onChange={setVpp} min={0.2} max={10} step={0.1} format={(v) => `${v.toFixed(1)} V`} />

        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <Stat label="Vpp" value={`${vpp.toFixed(2)} V`} />
          <Stat label="Vrms" value={`${vrms.toFixed(2)} V`} />
          <Stat label="T" value={periodLabel(period)} />
        </div>
        <Stat label="f" value={freq >= 1000 ? `${(freq / 1000).toFixed(2)} kHz` : `${freq.toFixed(0)} Hz`} full />

        <div className="text-xs text-inkSoft pt-2 space-y-1">
          <p><span className="font-mono">Sinüs:</span> Vrms = Vpp / (2√2)</p>
          <p><span className="font-mono">Kare:</span> Vrms = Vpp / 2</p>
          <p><span className="font-mono">Üçgen:</span> Vrms = Vpp / (2√3)</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, full = false }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`bg-lavender-50 rounded-2xl px-3 py-2 ${full ? 'col-span-3' : ''}`}>
      <p className="text-[10px] font-semibold text-inkSoft uppercase">{label}</p>
      <p className="font-mono font-bold text-ink">{value}</p>
    </div>
  )
}

function periodLabel(t: number) {
  if (t >= 1) return `${t.toFixed(2)} s`
  if (t >= 1e-3) return `${(t * 1e3).toFixed(2)} ms`
  return `${(t * 1e6).toFixed(1)} µs`
}

function buildPath(wave: Wave, freq: number, vpp: number) {
  const N = 240
  const W = 400
  const H = 200
  const cy = H / 2
  // göstermek istediğimiz periyot sayısı (frekansa göre)
  const periods = Math.min(8, Math.max(2, Math.round(freq / 200)))
  const amp = (vpp / 10) * (H / 2 - 8)
  let d = ''
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * W
    const phase = (i / N) * periods * 2 * Math.PI
    let y = 0
    switch (wave) {
      case 'sin':
        y = Math.sin(phase)
        break
      case 'square':
        y = Math.sin(phase) >= 0 ? 1 : -1
        break
      case 'triangle': {
        const p = (phase / (2 * Math.PI)) % 1
        y = p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : -4 + 4 * p
        break
      }
    }
    const yPx = cy - y * amp
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yPx.toFixed(1)} `
  }
  return d
}
