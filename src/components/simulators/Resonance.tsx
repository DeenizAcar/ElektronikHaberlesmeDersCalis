import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot, CartesianGrid } from 'recharts'
import Slider from '../ui/Slider'

type Mode = 'series' | 'parallel'

export default function Resonance({ mode = 'series' }: { mode?: Mode }) {
  const L = mode === 'series' ? 4.7e-3 : 4.7e-3
  const C = mode === 'series' ? 47e-9 : 100e-9
  const R = mode === 'series' ? 100 : 1000
  const f0 = 1 / (2 * Math.PI * Math.sqrt(L * C))
  const [f, setF] = useState(Math.round(f0))

  const XL = 2 * Math.PI * f * L
  const XC = 1 / (2 * Math.PI * f * C)

  let Z = 0
  let I = 0
  let phi = 0
  const V = 5
  if (mode === 'series') {
    Z = Math.sqrt(R * R + (XL - XC) ** 2)
    I = V / Z
    phi = (Math.atan2(XL - XC, R) * 180) / Math.PI
  } else {
    // Paralel L || C, seri R
    // YL = 1/(jXL), YC = jωC => Ytank = j(ωC - 1/ωL)
    const Btank = 2 * Math.PI * f * C - 1 / (2 * Math.PI * f * L)
    const Ztank = Math.abs(Btank) > 1e-12 ? 1 / Math.abs(Btank) : 1e9
    Z = Math.sqrt(R * R + Ztank * Ztank)
    I = V / Z
    phi = (Math.atan2(Btank, 1 / R) * 180) / Math.PI
  }

  const data = useMemo(() => {
    const arr: { f: number; Vout: number }[] = []
    const fmin = f0 * 0.1
    const fmax = f0 * 4
    const steps = 80
    for (let i = 0; i <= steps; i++) {
      const ff = fmin * Math.pow(fmax / fmin, i / steps)
      const xl = 2 * Math.PI * ff * L
      const xc = 1 / (2 * Math.PI * ff * C)
      let vout = 0
      if (mode === 'series') {
        const z = Math.sqrt(R * R + (xl - xc) ** 2)
        vout = (V * R) / z // R üzerinden çıkış
      } else {
        const Btank = 2 * Math.PI * ff * C - 1 / (2 * Math.PI * ff * L)
        const Ztank = Math.abs(Btank) > 1e-12 ? 1 / Math.abs(Btank) : 1e6
        // çıkış tank gerilimi (gerilim bölücü)
        vout = (V * Ztank) / Math.sqrt(R * R + Ztank * Ztank)
      }
      arr.push({ f: ff, Vout: vout })
    }
    return arr
  }, [L, C, R, mode, f0])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-soft p-4 space-y-3">
        <p className="text-xs text-inkSoft">
          {mode === 'series'
            ? 'Devre: R=100Ω, L=4.7mH, C=47nF seri RLC.'
            : 'Devre: L=4.7mH ∥ C=100nF (tank), seri R=1kΩ.'}
        </p>
        <Slider
          label="Frekans"
          value={f}
          onChange={setF}
          min={Math.round(f0 * 0.1)}
          max={Math.round(f0 * 4)}
          step={Math.max(1, Math.round(f0 * 0.005))}
          format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)} kHz` : `${v.toFixed(0)} Hz`)}
        />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Box label="f₀ rezonans" value={f0 >= 1000 ? `${(f0 / 1000).toFixed(2)} kHz` : `${f0.toFixed(0)} Hz`} accent />
          <Box label="Faz φ" value={`${phi.toFixed(1)}°`} />
          <Box label="XL" value={`${XL.toFixed(1)} Ω`} />
          <Box label="XC" value={`${XC.toFixed(1)} Ω`} />
          <Box label="|Z|" value={`${Z.toFixed(1)} Ω`} />
          <Box label="I" value={`${(I * 1000).toFixed(2)} mA`} />
        </div>

        {/* XL XC bar dengesi */}
        <div>
          <p className="text-xs font-semibold text-inkSoft mt-2 mb-1">XL ↔ XC dengesi</p>
          <div className="space-y-1">
            <BalanceBar label="XL" value={XL} max={Math.max(XL, XC) * 1.2} color="#A88CD6" />
            <BalanceBar label="XC" value={XC} max={Math.max(XL, XC) * 1.2} color="#E88AAB" />
          </div>
          {Math.abs(XL - XC) / Math.max(XL, XC) < 0.05 && (
            <p className="text-xs text-mint-500 mt-1 font-semibold">⚖ Rezonans: XL ≈ XC</p>
          )}
        </div>
      </div>
      <div className="card-soft p-3 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#ECE4F7" strokeDasharray="3 3" />
            <XAxis
              dataKey="f"
              tick={{ fontSize: 10, fill: '#6B6385' }}
              scale="log"
              domain={['auto', 'auto']}
              type="number"
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v.toFixed(0)}`)}
            />
            <YAxis tick={{ fontSize: 10, fill: '#6B6385' }} />
            <Tooltip
              contentStyle={{ background: '#FFFBF5', border: '1px solid #ECE4F7', borderRadius: 12, fontSize: 12 }}
              labelFormatter={(v) => `f = ${Number(v).toFixed(0)} Hz`}
              formatter={(v: number) => v.toFixed(2) + ' V'}
            />
            <ReferenceLine x={f0} stroke="#52BC88" strokeDasharray="4 4" label={{ value: 'f₀', fill: '#52BC88', fontSize: 11 }} />
            <Line type="monotone" dataKey="Vout" stroke="#E88AAB" strokeWidth={2.5} dot={false} name="Vout" />
            <ReferenceDot x={f} y={data.find((d) => Math.abs(d.f - f) < f0 * 0.05)?.Vout ?? 0} r={5} fill="#A88CD6" stroke="#fff" />
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

function BalanceBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono w-6 text-inkSoft">{label}</span>
      <div className="flex-1 h-3 rounded-full bg-white/70 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono text-inkSoft w-16 text-right">{value.toFixed(0)} Ω</span>
    </div>
  )
}
