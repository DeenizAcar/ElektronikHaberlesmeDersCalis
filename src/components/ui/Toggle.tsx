import { motion } from 'framer-motion'

type Props = {
  label?: string
  value: boolean
  onChange: (v: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

export default function Toggle({ label, value, onChange, size = 'md' }: Props) {
  const dims = {
    sm: { w: 'w-10', h: 'h-6', knob: 'w-4 h-4', shift: 16 },
    md: { w: 'w-14', h: 'h-8', knob: 'w-6 h-6', shift: 24 },
    lg: { w: 'w-20', h: 'h-11', knob: 'w-9 h-9', shift: 36 },
  }[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
      className={`relative ${dims.w} ${dims.h} rounded-full transition-colors duration-300 ${
        value ? 'bg-mint-300' : 'bg-lavender-100'
      } shadow-inner outline-none focus:ring-2 focus:ring-blush-300`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        className={`absolute top-1 ${dims.knob} rounded-full bg-white shadow-md`}
        style={{ left: value ? `calc(100% - ${dims.shift + 4}px)` : '4px' }}
      />
    </button>
  )
}
