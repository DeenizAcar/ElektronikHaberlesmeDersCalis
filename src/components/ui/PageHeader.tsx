import { ReactNode } from 'react'

export default function PageHeader({
  title,
  subtitle,
  icon,
  accent = 'blush',
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  accent?: 'blush' | 'lavender' | 'mint' | 'peach' | 'sky'
}) {
  const ring = {
    blush: 'bg-blush-100 text-blush-500',
    lavender: 'bg-lavender-100 text-lavender-500',
    mint: 'bg-mint-100 text-mint-500',
    peach: 'bg-peach-100 text-peach-500',
    sky: 'bg-sky-100 text-sky-500',
  }[accent]
  return (
    <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
      {icon && (
        <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${ring} flex items-center justify-center`}>
          {icon}
        </div>
      )}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-4xl text-ink">{title}</h1>
        {subtitle && <p className="text-inkSoft mt-1 sm:mt-1.5 max-w-2xl text-sm sm:text-base">{subtitle}</p>}
      </div>
    </div>
  )
}
