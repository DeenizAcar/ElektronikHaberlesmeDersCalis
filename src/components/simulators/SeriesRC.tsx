import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, CartesianGrid } from 'recharts'
import Slider from '../ui/Slider'

export default function SeriesRC() {
  const R = 47000 // 47k
  const [Cnf, setCnf] = useState(10) // nF
  const [f, setF] = useState(1000)
  const Vin = 5

  const C = Cnf * 1e-9
  const XC = 1 / (2 * Math.PI * f * C)
  const Z = Math.sqrt(R * R + XC * XC)
  const VR = (Vin * R) / Z
  const VC = (Vin * XC) / Z

  const data = useMemo(() => {
    const arr: { f: number; VR: number; VC: number }[] = []
    for (let i = 0; i <= 60; i++) {
      const ff = 100 + (5000 - 100) * (i / 60)
      const xc = 1 / (2 * Math.PI * ff * C)
      const z = Math.sqrt(R * R + xc * xc)
      arr.push({ f: ff, VR: (Vin * R) / z, VC: (Vin * xc) / z })
    }
    return arr
  }, [C])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-soft p-4 space-y-3">
        <p className="text-xs text-inkSoft">Devre: R = 47 kΩ seri C; çıkış R üzerinden (HPF konfigürasyonu).</p>
        <div className="flex gap-2">
          {[2.2, 10].map((v) => (
            <button
              key={v}
              onClick={() => setCnf(v)}
              className={`chip transition-colors ${Cnf === v ? 'bg-blush-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
            >
              C = {v} nF
            </button>
          ))}
        </div>
        <Slider
          label="Frekans"
          value={f}
          onChange={setF}
          min={100}
          max={5000}
          step={10}
          format={(v) => `${v.toFixed(0)} Hz`}
        />
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Box label="XC = 1/(2πfC)" value={`${(XC / 1000).toFixed(2)} kΩ`} />
          <Box label="Z" value={`${(Z / 1000).toFixed(2)} kΩ`} />
          <Box label="VR" value={`${VR.toFixed(2)} V`} />
          <Box label="VC" value={`${VC.toFixed(2)} V`} />
        </div>
      </div>
      <div className="card-soft p-3 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="#ECE4F7" strokeDasharray="3 3" />
            <XAxis dataKey="f" tick={{ fontSize: 10, fill: '#6B6385' }} tickFormatter={(v) => `${v.toFixed(0)}`} />
            <YAxis tick={{ fontSize: 10, fill: '#6B6385' }} />
            <Tooltip
              contentStyle={{ background: '#FFFBF5', border: '1px solid #ECE4F7', borderRadius: 12, fontSize: 12 }}
              labelFormatter={(v) => `f = ${Number(v).toFixed(0)} Hz`}
              formatter={(v: number) => v.toFixed(2)}
            />
            <Line type="monotone" dataKey="VR" stroke="#E88AAB" strokeWidth={2.5} dot={false} name="VR" />
            <Line type="monotone" dataKey="VC" stroke="#A88CD6" strokeWidth={2.5} dot={false} name="VC" />
            <ReferenceDot x={f} y={VR} r={5} fill="#E88AAB" stroke="#fff" />
            <ReferenceDot x={f} y={VC} r={5} fill="#A88CD6" stroke="#fff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-lavender-50 rounded-2xl px-3 py-2">
      <p className="text-[10px] font-semibold text-inkSoft">{label}</p>
      <p className="font-mono font-bold text-ink">{value}</p>
    </div>
  )
}
