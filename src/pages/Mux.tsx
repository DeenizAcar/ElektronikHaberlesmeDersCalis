import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '../components/ui/PageHeader'
import { PlainCard } from '../components/ui/Card'
import Toggle from '../components/ui/Toggle'
import Glossary from '../components/ui/Glossary'
import CompleteButton from '../components/ui/CompleteButton'
import CircuitPanel from '../components/circuit/CircuitPanel'
import { MuxSchematic, MuxLogic } from '../components/circuit/MuxCircuit'

export default function Mux() {
  const [inputs, setInputs] = useState<boolean[]>(Array(8).fill(false))
  const [select, setSelect] = useState<[boolean, boolean, boolean]>([false, false, false]) // S2, S1, S0
  const selectVal = (select[0] ? 4 : 0) + (select[1] ? 2 : 0) + (select[2] ? 1 : 0)
  const output = inputs[selectVal]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="8'e-1 Multiplexer"
        subtitle="8 girişten birini seçip çıkışa bağlayan küçük bir kanal seçici. 3 select line'la hangi girişi istediğini söylüyorsun."
        icon={<ArrowLeftRight className="w-6 h-6" />}
        accent="mint"
      />

      <CircuitPanel
        materials={[
          { name: '74LS151 IC', value: '8:1 MUX', qty: 1 },
          { name: 'DIP Switch', value: '3-kanal (S0/S1/S2)', qty: 1 },
          { name: 'Toggle Switch', value: '5V uyumlu', qty: 8 },
          { name: 'LED', value: 'Kırmızı/Yeşil 3mm', qty: 2 },
          { name: 'Direnç', value: '1 kΩ (LED serisi)', qty: 2 },
          { name: 'Breadboard', value: '830 delik', qty: 1 },
          { name: 'Jumper Kablo', value: 'M-M', qty: 20 },
          { name: 'Güç Kaynağı', value: '+5V DC', qty: 1 },
        ]}
        steps={[
          '74LS151\'i breadboard\'a yerleştir; pin 16\'ya +5V, pin 8\'e GND bağla.',
          'Pin 7 (Enable Ḡ) GND\'e bağla — aktif-low enable, 0 yapınca devre etkin.',
          'I0–I7 pinlerine (1–4, 12–15) toggle switch veya pull-down\'lı butonlar bağla.',
          'S0 (pin 11), S1 (pin 10), S2 (pin 9) pinlerine DIP switch bağla.',
          'Çıkış Y (pin 5) üzerinden 1kΩ dirençle LED bağla, diğer bacağı GND\'e.',
          'S0-S1-S2\'yi binary olarak 000–111 arasında değiştir, ilgili I0–I7 girişi Y çıkışına gelir.',
          'W̄ (pin 6) ters çıkış — Y her HIGH olduğunda bu pin LOW olur.',
        ]}
        schematic={<MuxSchematic />}
        logic={<MuxLogic />}
      />

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <PlainCard>
            <h3 className="font-display font-semibold text-ink mb-4">Girişler (I0 - I7)</h3>
            <div className="space-y-2">
              {inputs.map((v, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-2xl px-3 py-2 transition-colors ${
                    selectVal === i ? 'bg-mint-100 ring-1 ring-mint-300' : 'bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-ink w-8">I{i}</span>
                    <span className="text-xs text-inkSoft">({i.toString(2).padStart(3, '0')})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${v ? 'text-mint-500' : 'text-inkSoft/60'}`}>
                      {v ? '1' : '0'}
                    </span>
                    <Toggle
                      value={v}
                      onChange={(nv) => {
                        const a = [...inputs]
                        a[i] = nv
                        setInputs(a)
                      }}
                      size="sm"
                      label={`I${i}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PlainCard>
        </div>

        <div className="lg:col-span-5">
          <PlainCard className="min-h-[420px] relative">
            <h3 className="font-display font-semibold text-ink mb-4">Devre</h3>
            <svg viewBox="0 0 400 420" className="w-full">
              {/* 8 input lines */}
              {Array.from({ length: 8 }).map((_, i) => {
                const y = 30 + i * 42
                const selected = selectVal === i
                return (
                  <g key={i}>
                    <text x="10" y={y + 4} fontSize="13" className="font-mono" fill={selected ? '#52BC88' : '#6B6385'}>I{i}</text>
                    <line
                      x1="40"
                      y1={y}
                      x2="180"
                      y2={y}
                      stroke={selected ? '#52BC88' : '#D7C7EF'}
                      strokeWidth={selected ? 3 : 1.5}
                    />
                    <circle cx="40" cy={y} r="4" fill={inputs[i] ? '#52BC88' : '#D7C7EF'} />
                    {selected && (
                      <motion.circle
                        cx="40"
                        cy={y}
                        r="3"
                        fill="#52BC88"
                        animate={{ cx: [40, 180] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </g>
                )
              })}
              {/* MUX body */}
              <path d="M 180 20 L 260 80 L 260 320 L 180 380 Z" fill="#ECE4F7" stroke="#A88CD6" strokeWidth="2" />
              <text x="220" y="200" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3D3654" className="font-display">MUX</text>
              <text x="220" y="220" textAnchor="middle" fontSize="11" fill="#6B6385">8 → 1</text>

              {/* Output line */}
              <line x1="260" y1="200" x2="370" y2="200" stroke={output ? '#52BC88' : '#D7C7EF'} strokeWidth={output ? 3 : 1.5} />
              <text x="376" y="204" fontSize="14" className="font-mono font-bold" fill={output ? '#52BC88' : '#6B6385'}>Y</text>
              <motion.circle
                cx="365"
                cy="200"
                r="10"
                fill={output ? '#94DDB8' : '#ECE4F7'}
                stroke={output ? '#52BC88' : '#BFA8E4'}
                strokeWidth="2"
                animate={{ scale: output ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />

              {/* Select lines (bottom) */}
              {[0, 1, 2].map((i) => {
                const x = 200 + i * 30
                const on = select[i]
                return (
                  <g key={i}>
                    <line x1={x} y1="380" x2={x} y2="410" stroke={on ? '#A88CD6' : '#D7C7EF'} strokeWidth={on ? 2.5 : 1.5} />
                    <text x={x} y="408" textAnchor="middle" fontSize="10" fill="#6B6385" className="font-mono">S{2 - i}</text>
                  </g>
                )
              })}
            </svg>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-mono text-inkSoft">S{2 - i}</span>
                  <Toggle
                    value={select[i]}
                    onChange={(v) => {
                      const a = [...select] as [boolean, boolean, boolean]
                      a[i] = v
                      setSelect(a)
                    }}
                    size="sm"
                    label={`S${2 - i}`}
                  />
                </div>
              ))}
            </div>
          </PlainCard>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <PlainCard>
            <p className="text-xs font-semibold text-inkSoft uppercase">Seçim</p>
            <p className="font-mono text-2xl font-bold text-ink mt-1">
              S2 S1 S0 = {select[0] ? 1 : 0}{select[1] ? 1 : 0}{select[2] ? 1 : 0}
            </p>
            <p className="text-sm text-inkSoft mt-1">→ I{selectVal} seçildi</p>
          </PlainCard>
          <PlainCard>
            <p className="text-xs font-semibold text-inkSoft uppercase">Çıkış Y</p>
            <p className={`font-mono text-5xl font-bold mt-1 ${output ? 'text-mint-500' : 'text-inkSoft/60'}`}>
              {output ? '1' : '0'}
            </p>
            <p className="text-xs text-inkSoft mt-1">Y = I[S2S1S0]</p>
          </PlainCard>
          <PlainCard>
            <p className="text-xs font-semibold text-inkSoft uppercase mb-2">Mini Truth</p>
            <table className="w-full text-xs font-mono">
              <thead className="text-inkSoft">
                <tr>
                  <th className="text-left">S2S1S0</th>
                  <th className="text-right">Y</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className={selectVal === i ? 'text-mint-500 font-bold' : 'text-inkSoft'}>
                    <td>{i.toString(2).padStart(3, '0')}</td>
                    <td className="text-right">I{i} = {inputs[i] ? 1 : 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PlainCard>
        </div>
      </div>

      <div className="mt-8 card-soft p-6 max-w-4xl">
        <h3 className="font-display font-bold text-lg text-ink mb-3">Mantığı nasıl çalışıyor?</h3>
        <p className="text-inkSoft leading-relaxed">
          Multiplexer 8 girişten birini seçip çıkışa bağlar — sanki 8 kanallı bir radyodaki kanal düğmesi gibi. Select line'ları binary olarak hangi girişi istediğini söyler: <span className="font-mono">000 = I0</span>, <span className="font-mono">111 = I7</span>. n select line ile 2ⁿ giriş seçilebilir; biz burada 3 seçici ile 8 girişi yönlendiriyoruz.
        </p>
        <p className="text-inkSoft leading-relaxed mt-3">
          İçinde aslında her girişi bir AND kapısına bağlamış, AND'in diğer ucuna seçicilerin uygun bir kombinasyonunu (decoder ile üretilmiş) vermiş ve sonra hepsini bir OR kapısında birleştirmişler. Sadece doğru kombinasyonun AND çıkışı 1 olabilir, gerisi 0; OR de o sinyali geçirir.
        </p>
        <p className="text-inkSoft leading-relaxed mt-3">
          Pratik kullanım: Tek bir hat üstünden çok kanal göndermek (TDM telefon hatları), MCU pin tasarrufu, ekran adresleme, ALU içinde gerekli register'ı seçmek...
        </p>
      </div>

      <Glossary
        items={[
          { term: 'Multiplexer', def: 'Çok girişten birini seçen kombinasyonel devre. Tersi: demultiplexer (1 girişi N çıkıştan birine yollar).' },
          { term: 'Select line', def: 'Hangi girişin seçileceğini binary kodla belirleyen kontrol hattı. 3 hat → 8 seçenek.' },
          { term: 'Decoder', def: 'n bit binary girişi 2ⁿ çıkıştan birini "1" yapacak şekilde çözer. MUX\'un içinde gizli kullanılır.' },
        ]}
      />
      <CompleteButton topicId="mux" />
    </div>
  )
}
