import { useEffect, useState } from 'react'
import { Hash, RotateCw, Sparkles } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Toggle from '../components/ui/Toggle'
import SevenSegment from '../components/simulators/SevenSegment'
import Confetti from '../components/ui/Confetti'
import Glossary from '../components/ui/Glossary'
import { segmentTable, segmentsForValue, glyphForValue } from '../data/segmentTable'
import CompleteButton from '../components/ui/CompleteButton'
import CircuitPanel from '../components/circuit/CircuitPanel'
import { SegmentSchematic, SegmentLogic } from '../components/circuit/SegmentCircuit'

export default function Segment() {
  // A = LSB, D = MSB
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [c, setC] = useState(false)
  const [d, setD] = useState(false)

  const value = (d ? 8 : 0) + (c ? 4 : 0) + (b ? 2 : 0) + (a ? 1 : 0)
  const binary = `${d ? 1 : 0}${c ? 1 : 0}${b ? 1 : 0}${a ? 1 : 0}`
  const hex = value.toString(16).toUpperCase()
  const seg = segmentsForValue(value)

  // Quiz modu
  const [quiz, setQuiz] = useState<number | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (quiz === null) return
    if (value === quiz) {
      setConfetti(true)
      setStreak((s) => s + 1)
      const t1 = setTimeout(() => setConfetti(false), 1800)
      const t2 = setTimeout(() => setQuiz(randomTarget(quiz)), 1500)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [value, quiz])

  const startQuiz = () => {
    setStreak(0)
    setQuiz(randomTarget(value))
  }
  const stopQuiz = () => {
    setQuiz(null)
    setStreak(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
      <PageHeader
        title="7-Segment Hex Decoder"
        subtitle="Dört bitlik girişin 0-F arası 16 değeri nasıl harf ve rakama dönüştüğünü kendi gözünle gör. Her LED'in mantığı saklı değil — sadece anlatılmamış."
        icon={<Hash className="w-6 h-6" />}
        accent="lavender"
      />

      <CircuitPanel
        materials={[
          { name: '7-Segment Display', value: 'Common Cathode, 1 haneli', qty: 1 },
          { name: '74LS47 BCD-7Seg Decoder', value: 'veya 4511 (CC uyumlu)', qty: 1 },
          { name: 'DIP Switch', value: '4 kanal (A B C D giriş)', qty: 1 },
          { name: 'Direnç', value: '330 Ω × 7 (segment akım sınır)', qty: 7 },
          { name: 'Breadboard', value: '830 delik', qty: 1 },
          { name: 'Jumper Kablo', value: 'M-M', qty: 20 },
          { name: 'Güç Kaynağı', value: '+5V DC', qty: 1 },
        ]}
        steps={[
          '74LS47\'yi breadboard\'a yerleştir. Pin 16 → +5V, Pin 8 → GND.',
          'LT̄ (pin 3), RBI̊ (pin 4), BI̊/RBO (pin 5) pinlerini +5V\'a bağla — test ve blanking devre dışı.',
          'DIP switch A(pin 7) B(pin 1) C(pin 2) D(pin 6) girişlerine bağla; switch açık = HIGH (pull-up ile).',
          '74LS47 çıkışları a(13) b(12) c(11) d(10) e(9) f(15) g(14) — her birinden 330Ω direnç geçirerek 7-seg pin\'lerine bağla.',
          '7-segment\'in ortak katot (common cathode) pinini GND\'e bağla.',
          'Switch kombinasyonlarını 0000 → 1001 (0–9) dene; display\'in doğru rakamı gösterdiğini kontrol et.',
          '1010 (A) → 1111 (F) için display üretici datasheetine bakarak gösterimi doğrula.',
        ]}
        schematic={<SegmentSchematic />}
        logic={<SegmentLogic />}
      />

      {/* Üstte hâlihazırdaki giriş */}
      <div className="card-soft inline-flex flex-wrap items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 mb-6 w-full sm:w-auto">
        <div>
          <p className="text-xs font-semibold text-inkSoft uppercase tracking-wider">Binary</p>
          <p className="font-mono text-2xl font-bold text-ink">{binary}</p>
        </div>
        <div className="w-px h-10 bg-lavender-100" />
        <div>
          <p className="text-xs font-semibold text-inkSoft uppercase tracking-wider">Decimal</p>
          <p className="font-mono text-2xl font-bold text-ink">{value}</p>
        </div>
        <div className="w-px h-10 bg-lavender-100" />
        <div>
          <p className="text-xs font-semibold text-inkSoft uppercase tracking-wider">Hex</p>
          <p className="font-mono text-2xl font-bold text-blush-500">{hex}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Sol: Switches */}
        <div className="sm:col-span-1 lg:col-span-3">
          <PlainCard>
            <h3 className="font-display font-semibold text-ink mb-4">Girişler</h3>
            <div className="space-y-4">
              {([
                { name: 'D', label: '8 · MSB', val: d, set: setD },
                { name: 'C', label: '4', val: c, set: setC },
                { name: 'B', label: '2', val: b, set: setB },
                { name: 'A', label: '1 · LSB', val: a, set: setA },
              ] as const).map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-bold text-lg text-ink">{s.name}</p>
                    <p className="text-xs text-inkSoft">{s.label}</p>
                  </div>
                  <Toggle value={s.val} onChange={s.set} size="lg" label={s.name} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setA(false); setB(false); setC(false); setD(false)
                }}
                className="btn-ghost text-sm flex-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> Sıfırla
              </button>
            </div>
          </PlainCard>

          {/* Quiz */}
          <PlainCard className="mt-4 relative overflow-hidden">
            <Confetti show={confetti} />
            <h3 className="font-display font-semibold text-ink mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blush-400" /> Quiz Modu
            </h3>
            {quiz === null ? (
              <>
                <p className="text-sm text-inkSoft mb-3">Sana bir hex değer söyleyeceğim — switch'leri o değere ayarla.</p>
                <button onClick={startQuiz} className="btn-primary text-sm w-full">Başla</button>
              </>
            ) : (
              <>
                <p className="text-sm text-inkSoft mb-2">Ekrana <span className="font-bold text-blush-500">{quiz.toString(16).toUpperCase()}</span> göster!</p>
                <p className="text-xs text-inkSoft">Doğru üst üste: <span className="font-bold text-mint-500">{streak}</span></p>
                <button onClick={stopQuiz} className="btn-ghost text-sm w-full mt-3">Bitir</button>
              </>
            )}
          </PlainCard>
        </div>

        {/* Orta: 7-segment display */}
        <div className="sm:col-span-1 lg:col-span-5">
          <PlainCard className="flex flex-col items-center justify-center min-h-[320px] sm:min-h-[420px]">
            <SevenSegment segments={seg} showLabels size={150} />
            <div className="mt-4 text-center">
              <p className="text-sm text-inkSoft">Görünen değer</p>
              <p className="font-mono text-5xl font-bold text-blush-500 tracking-wide">{glyphForValue(value)}</p>
            </div>
            <p className="text-xs text-inkSoft mt-3 max-w-xs text-center">
              Her segment kendi adına sahip (a-g). Yandığında pembe parlıyor; sönükken pasif.
            </p>
          </PlainCard>
        </div>

        {/* Sağ: Truth Table */}
        <div className="sm:col-span-2 lg:col-span-4">
          <PlainCard className="overflow-auto max-h-[520px]">
            <h3 className="font-display font-semibold text-ink mb-3">Truth Table</h3>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-inkSoft">
                  <th className="text-left">D C B A</th>
                  <th>a b c d e f g</th>
                  <th>Göst.</th>
                </tr>
              </thead>
              <tbody>
                {segmentTable.map((row) => {
                  const active = row.value === value
                  return (
                    <tr
                      key={row.value}
                      className={`transition-colors ${active ? 'bg-lavender-100 text-ink' : 'text-inkSoft'}`}
                    >
                      <td className="py-1 pl-1">
                        <span className={active ? 'font-bold' : ''}>{row.inputs.join(' ')}</span>
                      </td>
                      <td className="py-1 text-center">{row.segments.join(' ')}</td>
                      <td className={`py-1 text-center font-bold ${active ? 'text-blush-500' : ''}`}>{row.glyph}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </PlainCard>
        </div>
      </div>

      {/* Mantık açıklaması */}
      <div className="mt-8 card-soft p-6 max-w-4xl">
        <h3 className="font-display font-bold text-lg text-ink mb-3">Mantığı nasıl çalışıyor?</h3>
        <p className="text-inkSoft leading-relaxed">
          7-segment display'in 7 ledi var (a'dan g'ye). Her rakamı ya da harfi göstermek için belirli ledlerin yanması gerekiyor. 4 bitlik girişle (A B C D) 0-F arası 16 farklı değer gösterebiliriz. Bu bir <span className="font-semibold text-ink">"kombinasyonel devre"</span> — yani çıkış sadece o anki girişe bağlı, hafıza yok. Sen toggle'ları değiştirdikçe truth table'daki ilgili satır seçiliyor ve o satırdaki 1'ler ışığı yakıyor.
        </p>
        <p className="text-inkSoft leading-relaxed mt-3">
          Örneğin <span className="font-mono bg-blush-50 px-1.5 py-0.5 rounded">8 (1000)</span> için tüm segmentler yanar, çünkü 8 rakamı bütün ledleri gerektirir. <span className="font-mono bg-blush-50 px-1.5 py-0.5 rounded">1 (0001)</span> için sadece <span className="font-mono">b</span> ve <span className="font-mono">c</span> yanar — sağ taraf yani. Mantık aslında her segment için ayrı bir boolean ifadesi: <span className="formula">a = f(A, B, C, D)</span>, <span className="formula">b = f(A, B, C, D)</span> ... 7 farklı fonksiyon.
        </p>
        <p className="text-inkSoft leading-relaxed mt-3">
          Gerçek dünyada bu 74LS47, 4511 gibi entegrelerle ya da PLD/MCU'larla yapılır. K-Map çıkarmadan da olur — sadece truth table'a bakıp lookup yaparsın.
        </p>
      </div>

      <Glossary
        items={[
          { term: 'Kombinasyonel devre', def: 'Çıkışı yalnızca o anki girişe bağlı, içinde hafıza/flip-flop barındırmayan devre.' },
          { term: 'MSB / LSB', def: 'Most/Least Significant Bit. En yüksek ve en düşük değerli bit. 1010 ifadesinde sol taraf MSB.' },
          { term: 'Common-cathode 7-segment', def: 'Tüm katotları ortak hatta bağlanmış, her bir segmente "1" verilince ışık yanan ekran tipi. Burada bu tipi kullandık.' },
          { term: 'Hex (onaltılık)', def: 'Tabanı 16 olan sayı sistemi. 0-9 sonrasında A-F harfleri devam eder.' },
        ]}
      />
      <CompleteButton topicId="segment" />
    </div>
  )
}

function randomTarget(avoid: number): number {
  let n = Math.floor(Math.random() * 16)
  while (n === avoid) n = Math.floor(Math.random() * 16)
  return n
}
