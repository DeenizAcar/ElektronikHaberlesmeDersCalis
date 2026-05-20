import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot, CartesianGrid } from 'recharts'
import Slider from '../ui/Slider'

type Kind = 'LPF' | 'HPF'
type Preset = { R: number; C: number; label: string }

const PRESETS: Preset[] = [
  { R: 4700, C: 4.7e-9, label: 'R=4.7k · C=4.7n' },
  { R: 10000, C: 10e-9, label: 'R=10k · C=10n' },
]

export default function Filter({ kind }: { kind: Kind }) {
  const [presetIdx, setPresetIdx] = useState(0)
  const preset = PRESETS[presetIdx]
  const fc = 1 / (2 * Math.PI * preset.R * preset.C)
  const [f, setF] = useState(Math.round(fc))

  const xc = 1 / (2 * Math.PI * f * preset.C)
  // gain (linear)
  const gainLin = kind === 'LPF'
    ? xc / Math.sqrt(preset.R * preset.R + xc * xc)
    : preset.R / Math.sqrt(preset.R * preset.R + xc * xc)
  const gainDb = 20 * Math.log10(gainLin)
  const phaseDeg = kind === 'LPF'
    ? -Math.atan(preset.R / xc) * 180 / Math.PI
    : Math.atan(xc / preset.R) * 180 / Math.PI

  const data = useMemo(() => {
    const arr: { f: number; gain: number; phase: number }[] = []
    const fmin = fc * 0.01
    const fmax = fc * 100
    const steps = 80
    for (let i = 0; i <= steps; i++) {
      const ff = fmin * Math.pow(fmax / fmin, i / steps)
      const xc = 1 / (2 * Math.PI * ff * preset.C)
      const g = kind === 'LPF'
        ? xc / Math.sqrt(preset.R * preset.R + xc * xc)
        : preset.R / Math.sqrt(preset.R * preset.R + xc * xc)
      const gdb = 20 * Math.log10(g)
      const phase = kind === 'LPF'
        ? -Math.atan(preset.R / xc) * 180 / Math.PI
        : Math.atan(xc / preset.R) * 180 / Math.PI
      arr.push({ f: ff, gain: gdb, phase })
    }
    return arr
  }, [preset.R, preset.C, kind, fc])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-soft p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => setPresetIdx(i)}
              className={`chip transition-colors ${presetIdx === i ? 'bg-blush-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Slider
          label="Frekans"
          value={f}
          onChange={setF}
          min={Math.round(fc * 0.05)}
          max={Math.round(fc * 50)}
          step={Math.max(1, Math.round(fc * 0.01))}
          format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)} kHz` : `${v.toFixed(0)} Hz`)}
        />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Box label="fc kesim" accent value={fc >= 1000 ? `${(fc / 1000).toFixed(2)} kHz` : `${fc.toFixed(0)} Hz`} />
          <Box label="Kazanç" value={`${gainDb.toFixed(1)} dB`} />
          <Box label="|H(f)|" value={gainLin.toFixed(3)} />
          <Box label="Faz" value={`${phaseDeg.toFixed(1)}°`} />
        </div>
        <p className="text-xs text-inkSoft pt-2 leading-relaxed">
          {kind === 'LPF'
            ? 'Alçak Geçiren: alçak frekanslı sinyaller "geçer", yüksek frekanslar zayıflar. Kesim frekansından sonra dB başına azalır (~-20 dB/dekat).'
            : 'Yüksek Geçiren: alçak frekansları zayıflatır, yüksek frekansları geçirir. Kesim altı bölge sürekli zayıflar.'}
        </p>
      </div>
      <div className="card-soft p-3 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid stroke="#ECE4F7" strokeDasharray="3 3" />
            <XAxis
              dataKey="f"
              tick={{ fontSize: 10, fill: '#6B6385' }}
              scale="log"
              domain={['auto', 'auto']}
              type="number"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v.toFixed(0)}`)}
            />
            <YAxis tick={{ fontSize: 10, fill: '#6B6385' }} unit=" dB" />
            <Tooltip
              contentStyle={{ background: '#FFFBF5', border: '1px solid #ECE4F7', borderRadius: 12, fontSize: 12 }}
              labelFormatter={(v) => `f = ${Number(v).toFixed(0)} Hz`}
              formatter={(v: number, name) => [(v as number).toFixed(1), name]}
            />
            <ReferenceLine x={fc} stroke="#52BC88" strokeDasharray="4 4" label={{ value: 'fc', fill: '#52BC88', fontSize: 11 }} />
            <ReferenceLine y={-3} stroke="#FFB87E" strokeDasharray="3 3" label={{ value: '-3dB', fill: '#FF8530', fontSize: 11 }} />
            <Line type="monotone" dataKey="gain" stroke="#E88AAB" strokeWidth={2.5} dot={false} />
            <ReferenceDot x={f} y={gainDb} r={5} fill="#A88CD6" stroke="#fff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Box({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${accent ? 'bg-mint-100' : 'bg-lavender-50'}`}>
      <p className="text-[10px] font-semibold text-inkSoft">{label}</p>
      <p className={`font-mono font-bold ${accent ? 'text-mint-500' : 'text-ink'}`}>{value}</p>
    </div>
  )
}
