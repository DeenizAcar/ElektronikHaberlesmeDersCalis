import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-white/60 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-inkSoft">
        <p className="flex items-center justify-center gap-1.5">
          küçük bir sevgi projesi
          <Heart className="w-3.5 h-3.5 text-blush-400 inline" fill="currentColor" />
          devreler korkutucu değil, sadece yanlış anlatılmış
        </p>
      </div>
    </footer>
  )
}
