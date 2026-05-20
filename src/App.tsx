import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import LoadingHeart from './components/ui/LoadingHeart'

const Home = lazy(() => import('./pages/Home'))
const AADevre = lazy(() => import('./pages/AADevre'))
const Segment = lazy(() => import('./pages/Segment'))
const Mux = lazy(() => import('./pages/Mux'))
const Sayicilar = lazy(() => import('./pages/Sayicilar'))
const Alarm = lazy(() => import('./pages/Alarm'))
const AdcDac = lazy(() => import('./pages/AdcDac'))
const Notlar = lazy(() => import('./pages/Notlar'))
const Quiz = lazy(() => import('./pages/Quiz'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-blobs">
      <Navbar />
      <main className="flex-1 w-full">
        <Suspense fallback={<LoadingHeart />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/aa-devre" element={<AADevre />} />
                <Route path="/segment" element={<Segment />} />
                <Route path="/mux" element={<Mux />} />
                <Route path="/sayicilar" element={<Sayicilar />} />
                <Route path="/alarm" element={<Alarm />} />
                <Route path="/adc-dac" element={<AdcDac />} />
                <Route path="/notlar" element={<Notlar />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  )
}
