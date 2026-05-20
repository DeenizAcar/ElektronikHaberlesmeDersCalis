import { motion } from 'framer-motion'

export default function LoadingHeart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="32" cy="32" r="22" stroke="#F8B4CC" strokeWidth="3" strokeDasharray="6 8" fill="none" />
        <circle cx="32" cy="32" r="10" fill="#FBCFE0" />
        <circle cx="32" cy="32" r="4" fill="#E88AAB" />
      </motion.svg>
      <p className="text-inkSoft text-sm font-medium animate-pulse-soft">yükleniyor…</p>
    </div>
  )
}
