import { ReactNode } from 'react'

type Tone = 'blush' | 'lavender' | 'mint' | 'peach' | 'sky'

const tones: Record<Tone, { bg: string; ring: string; shadow: string }> = {
  blush:    { bg: 'from-blush-50 to-blush-100',       ring: 'ring-blush-200',    shadow: 'hover:shadow-soft-blush' },
  lavender: { bg: 'from-lavender-50 to-lavender-100', ring: 'ring-lavender-200', shadow: 'hover:shadow-soft-lavender' },
  mint:     { bg: 'from-mint-50 to-mint-100',         ring: 'ring-mint-200',     shadow: 'hover:shadow-soft-mint' },
  peach:    { bg: 'from-peach-50 to-peach-100',       ring: 'ring-peach-200',    shadow: 'hover:shadow-soft-peach' },
  sky:      { bg: 'from-sky-50 to-sky-100',           ring: 'ring-sky-200',      shadow: 'hover:shadow-soft-sky' },
}

export function Card({
  children,
  tone = 'blush',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  const t = tones[tone]
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${t.bg} ring-1 ${t.ring} ring-inset shadow-soft ${t.shadow} transition-all duration-300 p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function PlainCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card-soft p-6 ${className}`}>{children}</div>
}
