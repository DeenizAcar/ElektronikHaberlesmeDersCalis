import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Plug } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <motion.div
        animate={{ rotate: [0, -8, 8, -6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-block mb-4"
      >
        <Plug className="w-20 h-20 text-blush-400 mx-auto" />
      </motion.div>
      <h1 className="font-display font-bold text-4xl text-ink mb-2">404</h1>
      <p className="text-inkSoft text-lg mb-8">Bu devre kısa devre oldu galiba 🔌</p>
      <Link to="/" className="btn-primary">
        <Home className="w-4 h-4" />
        Anasayfa
      </Link>
    </div>
  )
}
