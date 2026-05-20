import { useMemo, useState } from 'react'
import { ListChecks, RotateCw, Sparkles, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Confetti from '../components/ui/Confetti'
import { questions, topicLabels, Question } from '../data/quizQuestions'
import { quizPraise, quizGentle } from '../data/messages'
import { logActivity } from '../lib/progress'

type Filter = Question['topic'] | 'all'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Quiz() {
  const [filter, setFilter] = useState<Filter>('all')
  const [started, setStarted] = useState(false)
  const [order, setOrder] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [wrongTopics, setWrongTopics] = useState<Record<string, number>>({})
  const [confetti, setConfetti] = useState(false)
  const [praise, setPraise] = useState<string>('')

  const filtered = useMemo(() => questions.filter((q) => filter === 'all' || q.topic === filter), [filter])

  const start = () => {
    setOrder(shuffle(filtered))
    setIdx(0)
    setPicked(null)
    setScore(0)
    setWrongTopics({})
    setStarted(true)
  }

  const current = order[idx]
  const finished = started && idx >= order.length

  const pick = (i: number) => {
    if (picked !== null) return
    setPicked(i)
    if (i === current.answer) {
      setScore((s) => s + 1)
      setPraise(quizPraise[Math.floor(Math.random() * quizPraise.length)])
      setConfetti(true)
      setTimeout(() => setConfetti(false), 1600)
      logActivity('quiz_correct', current.topic)
    } else {
      setPraise(quizGentle[Math.floor(Math.random() * quizGentle.length)])
      setWrongTopics((w) => ({ ...w, [current.topic]: (w[current.topic] ?? 0) + 1 }))
      logActivity('quiz_wrong', current.topic)
    }
  }
  const next = () => {
    setPicked(null)
    setPraise('')
    setIdx((i) => i + 1)
  }

  const weakest = useMemo(() => {
    let max = 0
    let topic: string | null = null
    for (const [k, v] of Object.entries(wrongTopics)) {
      if (v > max) {
        max = v
        topic = k
      }
    }
    return topic
  }, [wrongTopics])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative">
      <PageHeader
        title="Quiz"
        subtitle="Kısa cevaplı sorularla hızlı bir test. Konuya göre filtreleyebilirsin."
        icon={<ListChecks className="w-6 h-6" />}
        accent="blush"
      />

      <Confetti show={confetti} />

      {!started && (
        <PlainCard>
          <h3 className="font-display font-bold text-lg text-ink mb-2">Konu seç</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`chip ${filter === 'all' ? 'bg-blush-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
            >
              Hepsi ({questions.length})
            </button>
            {(Object.keys(topicLabels) as Question['topic'][]).map((k) => {
              const count = questions.filter((q) => q.topic === k).length
              return (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={`chip ${filter === k ? 'bg-blush-300 text-ink' : 'bg-white/60 text-inkSoft hover:bg-white'}`}
                >
                  {topicLabels[k]} ({count})
                </button>
              )
            })}
          </div>
          <p className="text-sm text-inkSoft mb-4">
            {filtered.length} soru seçildi. Karıştırılarak gelecek.
          </p>
          <button onClick={start} disabled={filtered.length === 0} className="btn-primary">
            <Sparkles className="w-4 h-4" /> Başla
          </button>
        </PlainCard>
      )}

      {started && !finished && current && (
        <PlainCard>
          <div className="flex items-center justify-between mb-3">
            <span className="chip bg-lavender-100 text-ink">{topicLabels[current.topic]}</span>
            <span className="text-sm text-inkSoft">
              {idx + 1} / {order.length} · skor <span className="font-bold text-mint-500">{score}</span>
            </span>
          </div>

          <h2 className="font-display font-bold text-xl text-ink mb-5">{current.prompt}</h2>

          <div className="space-y-2">
            {current.options.map((opt, i) => {
              const isCorrect = i === current.answer
              const isPicked = i === picked
              const showResult = picked !== null
              const cls = !showResult
                ? 'bg-white hover:bg-lavender-50 border-lavender-100'
                : isCorrect
                  ? 'bg-mint-100 border-mint-300'
                  : isPicked
                    ? 'bg-blush-100 border-blush-300'
                    : 'bg-white/50 border-lavender-100 opacity-70'
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={showResult}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${cls}`}
                >
                  <span className="text-sm text-ink">{opt}</span>
                  {showResult && isCorrect && <Check className="w-4 h-4 text-mint-500" />}
                  {showResult && isPicked && !isCorrect && <X className="w-4 h-4 text-blush-500" />}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className={`text-sm font-semibold ${picked === current.answer ? 'text-mint-500' : 'text-blush-500'}`}>
                  {praise}
                </p>
                {current.explain && (
                  <p className="text-xs text-inkSoft mt-1">{current.explain}</p>
                )}
                <button onClick={next} className="btn-primary mt-3 text-sm">
                  {idx + 1 < order.length ? 'Sonraki' : 'Bitir'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </PlainCard>
      )}

      {finished && (
        <PlainCard className="text-center">
          <h2 className="font-display font-bold text-2xl text-ink mb-2">Bitti! 🌷</h2>
          <p className="text-5xl font-mono font-bold text-blush-500 my-4">
            {score}/{order.length}
          </p>
          {weakest && (
            <p className="text-sm text-inkSoft">
              En çok zorlandığın konu: <span className="font-bold text-ink">{topicLabels[weakest as Question['topic']]}</span> — birlikte bir daha bakalım.
            </p>
          )}
          <div className="flex gap-2 justify-center mt-5">
            <button onClick={() => setStarted(false)} className="btn-ghost">
              <RotateCw className="w-4 h-4" /> Konu değiştir
            </button>
            <button onClick={start} className="btn-primary">
              <Sparkles className="w-4 h-4" /> Tekrar dene
            </button>
          </div>
        </PlainCard>
      )}
    </div>
  )
}
