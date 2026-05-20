import { useEffect, useState } from 'react'
import { BookText, Save, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'

type Topic = { id: string; label: string }

const topics: Topic[] = [
  { id: 'aa-devre', label: 'AA Devre Analizi' },
  { id: 'segment',  label: '7-Segment Decoder' },
  { id: 'mux',      label: 'Multiplexer' },
  { id: 'sayicilar',label: 'Sayıcılar & Zamanlayıcılar' },
  { id: 'alarm',    label: 'Alarm Sistemi' },
  { id: 'adc-dac',  label: 'ADC/DAC & PCM' },
  { id: 'gunluk',   label: 'Günlük (Bugün ne öğrendin?)' },
]

const STORAGE = 'devreaski.notes.v1'

type NotesMap = Record<string, string>

function load(): NotesMap {
  try {
    const raw = localStorage.getItem(STORAGE)
    return raw ? (JSON.parse(raw) as NotesMap) : {}
  } catch {
    return {}
  }
}

function save(m: NotesMap) {
  localStorage.setItem(STORAGE, JSON.stringify(m))
}

export default function Notlar() {
  const [active, setActive] = useState(topics[0].id)
  const [notes, setNotes] = useState<NotesMap>({})
  const [preview, setPreview] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    setNotes(load())
  }, [])

  const update = (val: string) => {
    const next = { ...notes, [active]: val }
    setNotes(next)
    save(next)
    setSavedAt(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="Notlar"
        subtitle="Her konuya kendi notunu yazabilirsin. Markdown destekli. localStorage'a kendi kendine kaydeder."
        icon={<BookText className="w-6 h-6" />}
        accent="mint"
      />

      <div className="grid lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <PlainCard>
            <h3 className="font-display font-semibold text-ink mb-2 text-sm">Konular</h3>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`w-full text-left px-3 py-2 rounded-2xl transition-colors text-sm mb-0.5 ${
                  active === t.id ? 'bg-mint-100 text-ink font-semibold' : 'text-inkSoft hover:bg-white/70'
                }`}
              >
                {t.label}
                {notes[t.id]?.trim() && <span className="ml-1 text-mint-500">●</span>}
              </button>
            ))}
          </PlainCard>
        </aside>

        <section className="lg:col-span-9">
          <PlainCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-lg text-ink">
                {topics.find((t) => t.id === active)?.label}
              </h3>
              <div className="flex gap-2 items-center">
                {savedAt && (
                  <span className="text-xs text-mint-500 flex items-center gap-1">
                    <Save className="w-3 h-3" /> {savedAt}'de kaydedildi
                  </span>
                )}
                <button
                  onClick={() => setPreview((p) => !p)}
                  className="chip bg-lavender-100 text-ink hover:bg-lavender-200"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {preview ? 'Düzenle' : 'Önizle'}
                </button>
              </div>
            </div>

            {preview ? (
              <article className="prose prose-sm max-w-none text-ink min-h-[300px]">
                <ReactMarkdown>{notes[active] || '_Henüz not yok. Düzenle butonuyla başlayabilirsin._'}</ReactMarkdown>
              </article>
            ) : (
              <textarea
                value={notes[active] ?? ''}
                onChange={(e) => update(e.target.value)}
                placeholder="Buraya yaz...&#10;**kalın** _italik_ - madde işareti gibi markdown çalışır"
                className="w-full min-h-[320px] p-4 bg-cream rounded-2xl outline-none border border-lavender-100 focus:border-lavender-300 font-mono text-sm resize-none"
              />
            )}
          </PlainCard>
        </section>
      </div>
    </div>
  )
}
