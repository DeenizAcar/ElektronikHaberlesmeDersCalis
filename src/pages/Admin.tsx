import { useState } from 'react'
import { BarChart2, Trash2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import { getAllActivities, getStats, resetProgress, type Activity } from '../lib/progress'

const topicNames: Record<string, string> = {
  'aa-devre': 'AA Devre',
  segment: '7-Segment',
  mux: 'MUX',
  sayicilar: 'Sayıcılar',
  alarm: 'Alarm',
  'adc-dac': 'ADC/DAC',
  aa_devre: 'AA Devre',
  rc: 'RC',
  rl: 'RL',
  resonance: 'Rezonans',
  filter: 'Filtre',
  counters: 'Sayıcılar',
}

function typeBadge(type: Activity['type']) {
  if (type === 'complete') return <span className="chip bg-mint-100 text-mint-500 text-xs">✓ Tamamlandı</span>
  if (type === 'quiz_correct') return <span className="chip bg-lavender-100 text-lavender-500 text-xs">Doğru</span>
  return <span className="chip bg-blush-100 text-blush-500 text-xs">Yanlış</span>
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type Period = 'today' | 'week' | 'month' | 'all'

export default function Admin() {
  const [period, setPeriod] = useState<Period>('week')
  const [cleared, setCleared] = useState(false)

  const allActivities = getAllActivities()

  const cutoff = (() => {
    const now = Date.now()
    if (period === 'today') { const d = new Date(now); d.setHours(0, 0, 0, 0); return d.getTime() }
    if (period === 'week') return now - 7 * 24 * 60 * 60 * 1000
    if (period === 'month') return now - 30 * 24 * 60 * 60 * 1000
    return 0
  })()

  const filtered = [...allActivities].filter((a) => a.ts >= cutoff).reverse()

  const today = getStats('today')
  const week = getStats('week')
  const month = getStats('month')

  const handleClear = () => {
    if (!window.confirm('Tüm aktivite ve ilerleme kaydı silinsin mi?')) return
    resetProgress()
    setCleared(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="İstatistikler"
        subtitle="Bu cihazdaki çalışma aktivitesi. Kullanıcı girişi eklendiğinde tüm kullanıcılar buradan görünecek."
        icon={<BarChart2 className="w-6 h-6" />}
        accent="lavender"
      />

      {/* Özet kartları */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Bugün', s: today },
          { label: 'Bu Hafta', s: week },
          { label: 'Bu Ay', s: month },
        ].map(({ label, s }) => (
          <PlainCard key={label} className="text-center">
            <p className="text-xs font-bold text-inkSoft uppercase tracking-wider mb-3">{label}</p>
            <p className="text-3xl font-bold text-ink">{s.uniqueTopics}</p>
            <p className="text-xs text-inkSoft mt-1">konu tamamlandı</p>
            <div className="mt-3 flex justify-center gap-3 text-xs">
              <span className="text-mint-500 font-semibold">{s.quizCorrect} ✓</span>
              <span className="text-blush-500 font-semibold">{s.quizWrong} ✗</span>
            </div>
          </PlainCard>
        ))}
      </div>

      {/* Aktivite tablosu */}
      <PlainCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-semibold text-ink">Aktivite Geçmişi</h3>
          <div className="flex gap-1 flex-wrap">
            {(['today', 'week', 'month', 'all'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`chip text-xs transition-all ${period === p ? 'bg-lavender-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
              >
                {{ today: 'Bugün', week: 'Bu Hafta', month: 'Bu Ay', all: 'Tümü' }[p]}
              </button>
            ))}
          </div>
        </div>

        {cleared ? (
          <p className="text-sm text-inkSoft py-8 text-center">Kayıtlar silindi.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-inkSoft py-8 text-center">Bu dönemde aktivite yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-inkSoft border-b border-lavender-100">
                  <th className="text-left py-2 pr-4">Tarih & Saat</th>
                  <th className="text-left py-2 pr-4">Konu</th>
                  <th className="text-left py-2">Tür</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i} className="border-b border-lavender-50 hover:bg-lavender-50/50 transition-colors">
                    <td className="py-2 pr-4 text-inkSoft font-mono text-xs">{formatTime(a.ts)}</td>
                    <td className="py-2 pr-4 text-ink font-semibold">
                      {topicNames[a.topicId] ?? a.topicId}
                    </td>
                    <td className="py-2">{typeBadge(a.type)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PlainCard>

      {/* Tehlikeli alan */}
      <div className="mt-6 card-soft p-4 border border-blush-200">
        <p className="text-xs font-semibold text-inkSoft mb-2">Veri yönetimi</p>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 text-sm text-blush-500 hover:text-blush-600 font-semibold transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Tüm kayıtları sıfırla
        </button>
      </div>
    </div>
  )
}
