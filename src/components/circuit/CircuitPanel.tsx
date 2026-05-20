import { useState, ReactNode } from 'react'
import { List, Cpu, GitBranch, Wrench } from 'lucide-react'
import { PlainCard } from '../ui/Card'

export type Material = { name: string; value: string; qty: number }
type Tab = 'materials' | 'schematic' | 'logic' | 'steps'

type Props = {
  materials: Material[]
  steps: string[]
  schematic: ReactNode
  logic?: ReactNode
}

export const proteusBg = '#0d1117'
export const wire = '#26d97f'
export const wirePow = '#ef4444'
export const wireGnd = '#6b7280'
export const compFill = '#1e204a'
export const compStroke = '#6366f1'
export const label = '#e8eaf6'
export const pin = '#fbbf24'
export const busColor = '#38bdf8'

export default function CircuitPanel({ materials, steps, schematic, logic }: Props) {
  const [tab, setTab] = useState<Tab>('materials')

  const tabs: { id: Tab; icon: typeof List; label: string }[] = [
    { id: 'materials', icon: List, label: 'Malzemeler' },
    { id: 'schematic', icon: Cpu, label: 'Devre Şeması' },
    ...(logic ? [{ id: 'logic' as Tab, icon: GitBranch, label: 'Lojik Devre' }] : []),
    { id: 'steps', icon: Wrench, label: 'Yapım Aşamaları' },
  ]

  return (
    <PlainCard className="mb-6">
      <div className="flex gap-1 flex-wrap mb-4 border-b border-lavender-100 pb-3">
        {tabs.map(({ id, icon: Icon, label: lbl }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              tab === id ? 'bg-lavender-200 text-ink' : 'text-inkSoft hover:bg-lavender-50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'materials' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-inkSoft border-b border-lavender-100">
                <th className="text-left py-2 pr-6">Malzeme</th>
                <th className="text-left py-2 pr-6">Değer / Model</th>
                <th className="text-left py-2">Adet</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m, i) => (
                <tr key={i} className={`border-b border-lavender-50 ${i % 2 ? 'bg-lavender-50/30' : ''}`}>
                  <td className="py-2 pr-6 font-semibold text-ink">{m.name}</td>
                  <td className="py-2 pr-6 font-mono text-xs text-inkSoft">{m.value}</td>
                  <td className="py-2 text-inkSoft">×{m.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'schematic' && (
        <div className="rounded-2xl overflow-hidden">{schematic}</div>
      )}

      {tab === 'logic' && logic && (
        <div className="rounded-2xl overflow-hidden">{logic}</div>
      )}

      {tab === 'steps' && (
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 w-7 h-7 rounded-full bg-lavender-200 text-ink font-bold flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="text-inkSoft pt-1 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      )}
    </PlainCard>
  )
}
