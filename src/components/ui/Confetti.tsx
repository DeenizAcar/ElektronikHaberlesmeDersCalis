import { motion } from 'framer-motion'
import { useMemo } from 'react'

const COLORS = ['#F8B4CC', '#BFA8E4', '#94DDB8', '#FFB87E', '#88CCF1']

export default function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.3,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        shape: i % 2 === 0 ? 'circle' : 'square',
      })),
    [show],
  )
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: '120%', rotate: p.rotate, opacity: 0 }}
          transition={{ duration: 1.6 + Math.random() * 0.5, delay: p.delay, ease: 'easeOut' }}
          className="absolute top-0"
          style={{
            width: 8,
            height: 8,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
