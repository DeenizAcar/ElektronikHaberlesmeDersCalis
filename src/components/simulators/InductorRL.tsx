import { useState } from 'react'
import Slider from '../ui/Slider'

export default function InductorRL() {
  const R = 100 // Ohm
  const L = 4.7e-3 // H
  const V = 5 // V (etkin değer kabul edildi)
  const [f, setF] = useState(1000) // Hz

  const XL = 2 * Math.PI * f * L
  const Z = Math.sqrt(R * R + XL * XL)
  const I = V / Z
  const phi = (Math.atan2(XL, R) * 180) / Math.PI

  // Vector diagram dimensions
  const scale = 1.4 // pixels per ohm cap
  const maxLen = 140
  const Rlen = Math.min(maxLen, R * scale * 0.7)
  const XLlen = Math.min(maxLen, XL * scale * 0.05)

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="card-soft p-4 space-y-3">
        <p className="text-xs text-inkSoft">Devre: AC kaynak → R (100 Ω) → L (4.7 mH)</p>
        <Slider
          label="Frekans"
          value={f}
          onChange={setF}
          min={50}
          max={5000}
          step={10}
          format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)} kHz` : `${v.toFixed(0)} Hz`)}
        />
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Box label="XL = 2πfL" value={`${XL.toFixed(2)} Ω`} />
          <Box label="Z = √(R² + XL²)" value={`${Z.toFixed(2)} Ω`} />
          <Box label="I = V/Z" value={`${(I * 1000).toFixed(1)} mA`} />
          <Box label="Faz φ" value={`${phi.toFixed(1)}°`} />
        </div>
      </div>
      <div className="card-soft p-4 flex items-center justify-center">
        <svg viewBox="0 0 240 200" className="w-full max-w-xs">
          <line x1="20" y1="160" x2="220" y2="160" stroke="#D7C7EF" strokeWidth="1" />
          <line x1="20" y1="20" x2="20" y2="180" stroke="#D7C7EF" strokeWidth="1" />
          {/* R vector (yatay, blush) */}
          <line x1="20" y1="160" x2={20 + Rlen} y2="160" stroke="#E88AAB" strokeWidth="4" strokeLinecap="round" />
          <text x={20 + Rlen + 4} y={158} className="font-mono" fontSize="11" fill="#E88AAB">R</text>
          {/* XL vector (yukarı, lavender) */}
          <line x1={20 + Rlen} y1="160" x2={20 + Rlen} y2={160 - XLlen} stroke="#A88CD6" strokeWidth="4" strokeLinecap="round" />
          <text x={20 + Rlen + 4} y={160 - XLlen + 4} className="font-mono" fontSize="11" fill="#A88CD6">XL</text>
          {/* Z resultant */}
          <line x1="20" y1="160" x2={20 + Rlen} y2={160 - XLlen} stroke="#52BC88" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#52BC88" />
            </marker>
          </defs>
          <text x={20 + Rlen / 2 - 8} y={160 - XLlen / 2 - 4} className="font-mono" fontSize="11" fill="#52BC88">Z</text>
          <text x="120" y="190" textAnchor="middle" fontSize="10" fill="#6B6385">Faz diyagramı (RL)</text>
        </svg>
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
