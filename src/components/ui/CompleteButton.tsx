import { useState } from 'react'
import { CheckCircle2, CircleDashed } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { isCompleted, markCompleted } from '../../lib/progress'

export default function CompleteButton({ topicId }: { topicId: string }) {
  const [done, setDone] = useState(() => isCompleted(topicId))

  const handle = () => {
    if (done) return
    markCompleted(topicId)
    setDone(true)
  }

  return (
    <div className="mt-10 flex justify-center">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-mint-100 text-mint-500 font-semibold"
          >
            <CheckCircle2 className="w-5 h-5" />
            Konu tamamlandı ✓
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handle}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-lavender-100 text-ink font-semibold hover:bg-lavender-200 transition-colors shadow-soft"
          >
            <CircleDashed className="w-5 h-5 text-lavender-400" />
            Konuyu tamamla
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
