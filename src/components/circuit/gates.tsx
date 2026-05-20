// Shared Proteus-style SVG gate + component primitives

export const C = {
  bg: '#0d1117',
  wire: '#26d97f',
  pow: '#ef4444',
  gnd: '#6b7280',
  fill: '#1a1a3a',
  stroke: '#6366f1',
  strokeAlt: '#818cf8',
  label: '#e8eaf6',
  pin: '#fbbf24',
  bus: '#38bdf8',
  active: '#a3e635',
}

export function AndGate({ cx, cy, w = 44, h = 32 }: { cx: number; cy: number; w?: number; h?: number }) {
  const x0 = cx - w / 2
  const x1 = cx
  const y0 = cy - h / 2
  const y1 = cy + h / 2
  return (
    <path
      d={`M ${x0} ${y0} L ${x0} ${y1} L ${x1} ${y1} C ${cx + w / 2} ${y1} ${cx + w / 2} ${y0} ${x1} ${y0} Z`}
      fill={C.fill}
      stroke={C.strokeAlt}
      strokeWidth="1.5"
    />
  )
}

export function OrGate({ cx, cy, w = 44, h = 32 }: { cx: number; cy: number; w?: number; h?: number }) {
  const x0 = cx - w / 2
  const xm = cx - w / 5
  const x1 = cx + w / 2
  const y0 = cy - h / 2
  const y1 = cy + h / 2
  return (
    <path
      d={`M ${x0} ${y0} Q ${xm} ${y0} ${x1} ${cy} Q ${xm} ${y1} ${x0} ${y1} Q ${xm} ${cy} ${x0} ${y0} Z`}
      fill={C.fill}
      stroke={C.strokeAlt}
      strokeWidth="1.5"
    />
  )
}

export function NotGate({ cx, cy, w = 30, h = 22 }: { cx: number; cy: number; w?: number; h?: number }) {
  const x0 = cx - w / 2
  const x1 = cx + w / 2 - 5
  const y0 = cy - h / 2
  const y1 = cy + h / 2
  return (
    <g>
      <polygon points={`${x0},${y0} ${x0},${y1} ${x1},${cy}`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={x1 + 4} cy={cy} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
    </g>
  )
}

export function ICBox({
  x, y, w, h, name, leftPins, rightPins,
}: {
  x: number; y: number; w: number; h: number; name: string
  leftPins: string[]; rightPins: string[]
}) {
  const spacing = h / (Math.max(leftPins.length, rightPins.length) + 1)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="6" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        {name}
      </text>
      {leftPins.map((p, i) => {
        const py = y + spacing * (i + 1)
        return (
          <g key={p}>
            <line x1={x - 18} y1={py} x2={x} y2={py} stroke={C.wire} strokeWidth="1.5" />
            <circle cx={x - 18} cy={py} r={3} fill={C.pin} />
            <text x={x - 22} y={py + 4} textAnchor="end" fill={C.pin} fontSize="10">{p}</text>
          </g>
        )
      })}
      {rightPins.map((p, i) => {
        const py = y + spacing * (i + 1)
        return (
          <g key={p}>
            <line x1={x + w} y1={py} x2={x + w + 18} y2={py} stroke={C.wire} strokeWidth="1.5" />
            <circle cx={x + w + 18} cy={py} r={3} fill={C.pin} />
            <text x={x + w + 22} y={py + 4} fill={C.pin} fontSize="10">{p}</text>
          </g>
        )
      })}
    </g>
  )
}

export function Resistor({ x, y, val, id }: { x: number; y: number; val: string; id: string }) {
  return (
    <g>
      <line x1={x - 28} y1={y} x2={x - 18} y2={y} stroke={C.wire} strokeWidth="2" />
      <rect x={x - 18} y={y - 10} width={36} height={20} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" rx="3" />
      <text x={x} y={y + 4} textAnchor="middle" fill={C.label} fontSize="10">{id}</text>
      <text x={x} y={y + 16} textAnchor="middle" fill={C.pin} fontSize="9">{val}</text>
      <line x1={x + 18} y1={y} x2={x + 28} y2={y} stroke={C.wire} strokeWidth="2" />
    </g>
  )
}

export function Capacitor({ x, y, val, id }: { x: number; y: number; val: string; id: string }) {
  return (
    <g>
      <line x1={x} y1={y - 28} x2={x} y2={y - 10} stroke={C.wire} strokeWidth="2" />
      <line x1={x - 16} y1={y - 10} x2={x + 16} y2={y - 10} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={x - 16} y1={y} x2={x + 16} y2={y} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={x} y1={y} x2={x} y2={y + 10} stroke={C.wire} strokeWidth="2" />
      <text x={x + 22} y={y - 6} fill={C.pin} fontSize="9">{val}</text>
      <text x={x + 22} y={y + 6} fill={C.label} fontSize="9">{id}</text>
    </g>
  )
}

export function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + 8} stroke={C.gnd} strokeWidth="2" />
      <line x1={x - 14} y1={y + 8} x2={x + 14} y2={y + 8} stroke={C.gnd} strokeWidth="2.5" />
      <line x1={x - 9} y1={y + 13} x2={x + 9} y2={y + 13} stroke={C.gnd} strokeWidth="2.5" />
      <line x1={x - 4} y1={y + 18} x2={x + 4} y2={y + 18} stroke={C.gnd} strokeWidth="2.5" />
    </g>
  )
}

export function VCC({ x, y, label = 'VCC' }: { x: number; y: number; label?: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 8} stroke={C.pow} strokeWidth="2" />
      <line x1={x - 12} y1={y - 8} x2={x + 12} y2={y - 8} stroke={C.pow} strokeWidth="2.5" />
      <text x={x} y={y - 14} textAnchor="middle" fill={C.pow} fontSize="10" fontWeight="bold">{label}</text>
    </g>
  )
}

export function Wire({ x1, y1, x2, y2, color = C.wire }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" />
}

export function Junction({ x, y, color = C.wire }: { x: number; y: number; color?: string }) {
  return <circle cx={x} cy={y} r={4} fill={color} />
}

import React from 'react'
export function SvgBg({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ background: C.bg }}>
      {children}
    </svg>
  )
}
