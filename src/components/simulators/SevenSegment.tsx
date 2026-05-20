import { motion } from 'framer-motion'
import { SegBits } from '../../data/segmentTable'

type Props = {
  segments: SegBits
  showLabels?: boolean
  size?: number
  on?: string
  off?: string
}

// Segment polygonları (a, b, c, d, e, f, g)
// Koordinatlar 100x180 viewBox üzerinde
const PATHS: Record<string, string> = {
  a: 'M 18 6 L 78 6 L 70 18 L 26 18 Z',          // üst yatay
  b: 'M 82 10 L 82 78 L 70 86 L 70 22 Z',        // sağ üst dikey
  c: 'M 82 102 L 82 170 L 70 158 L 70 94 Z',     // sağ alt dikey
  d: 'M 18 174 L 78 174 L 70 162 L 26 162 Z',    // alt yatay
  e: 'M 14 102 L 14 170 L 26 158 L 26 94 Z',     // sol alt dikey
  f: 'M 14 10 L 14 78 L 26 86 L 26 22 Z',        // sol üst dikey
  g: 'M 18 90 L 26 82 L 70 82 L 78 90 L 70 98 L 26 98 Z', // orta yatay
}

const LABEL_POS: Record<string, { x: number; y: number; anchor: 'start' | 'end' | 'middle' }> = {
  a: { x: 48, y: 0, anchor: 'middle' },
  b: { x: 96, y: 44, anchor: 'start' },
  c: { x: 96, y: 130, anchor: 'start' },
  d: { x: 48, y: 188, anchor: 'middle' },
  e: { x: 0, y: 130, anchor: 'end' },
  f: { x: 0, y: 44, anchor: 'end' },
  g: { x: 86, y: 94, anchor: 'start' },
}

const ORDER: ('a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g')[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

export default function SevenSegment({
  segments,
  showLabels = false,
  size = 200,
  on = '#E88AAB',
  off = '#ECE4F7',
}: Props) {
  const w = size
  const h = size * 1.8
  return (
    <svg width={w} height={h} viewBox="-10 -6 120 200">
      <defs>
        <filter id="seg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ORDER.map((seg, i) => {
        const active = segments[i] === 1
        return (
          <motion.path
            key={seg}
            d={PATHS[seg]}
            initial={false}
            animate={{
              fill: active ? on : off,
              opacity: active ? 1 : 0.45,
            }}
            transition={{ duration: 0.25 }}
            filter={active ? 'url(#seg-glow)' : undefined}
          />
        )
      })}
      {showLabels && ORDER.map((seg) => {
        const pos = LABEL_POS[seg]
        return (
          <text
            key={`l-${seg}`}
            x={pos.x}
            y={pos.y}
            textAnchor={pos.anchor}
            className="font-mono"
            fontSize={9}
            fill="#6B6385"
          >
            {seg}
          </text>
        )
      })}
    </svg>
  )
}
