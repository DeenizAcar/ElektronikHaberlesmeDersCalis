import { BookOpen } from 'lucide-react'

type Item = { term: string; def: string }

export default function Glossary({ items }: { items: Item[] }) {
  return (
    <details className="group card-soft mt-8">
      <summary className="cursor-pointer list-none flex items-center justify-between p-4 select-none">
        <span className="flex items-center gap-2 font-display font-semibold text-ink">
          <BookOpen className="w-5 h-5 text-lavender-400" />
          Sözlük
        </span>
        <span className="text-inkSoft text-sm group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="px-4 pb-4 space-y-3">
        {items.map((it) => (
          <div key={it.term} className="border-l-2 border-blush-200 pl-3">
            <p className="font-semibold text-ink text-sm">{it.term}</p>
            <p className="text-inkSoft text-sm">{it.def}</p>
          </div>
        ))}
      </div>
    </details>
  )
}
