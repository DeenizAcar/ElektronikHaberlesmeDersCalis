type Props = {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
  format?: (v: number) => string
}

export default function Slider({ label, value, onChange, min, max, step = 1, unit, format }: Props) {
  const display = format ? format(value) : `${value}${unit ?? ''}`
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-inkSoft">{label}</label>
        <span className="font-mono text-sm bg-white/70 px-2 py-0.5 rounded-full text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-lavender-100 outline-none accent-blush-400 cursor-pointer"
      />
    </div>
  )
}
