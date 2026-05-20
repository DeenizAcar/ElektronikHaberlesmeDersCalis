import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Oscilloscope from '../components/simulators/Oscilloscope'
import InductorRL from '../components/simulators/InductorRL'
import SeriesRC from '../components/simulators/SeriesRC'
import Resonance from '../components/simulators/Resonance'
import Filter from '../components/simulators/Filter'
import Glossary from '../components/ui/Glossary'
import { markCompleted } from '../lib/progress'

type Deney = {
  id: string
  title: string
  amac: string
  mantik: string
  formul: string[]
  ipucu: string
  render: () => JSX.Element
}

const deneyler: Deney[] = [
  {
    id: 'd1',
    title: 'Deney 1 · Sinyaller ve Osiloskop',
    amac: 'Sinüs, kare, üçgen sinyallerin Vpp / Vrms / T / f bağıntılarını gözlemlemek.',
    mantik: 'Osiloskop sinyali zaman ekseninde çiziyor. Vpp tepeden tepeye gerilim; Vrms ise "aynı ısıyı verecek DC eşdeğeri". Sinüs için Vpp/(2√2), kare için Vpp/2, üçgen için Vpp/(2√3) formülleriyle çıkar — şekil değiştikçe katsayı değişir.',
    formul: ['Sinüs Vrms = Vpp / (2√2)', 'Kare Vrms = Vpp / 2', 'Üçgen Vrms = Vpp / (2√3)', 'T = 1 / f'],
    ipucu: 'Hocan "kaç bölme?" diye sorduğunda → Vpp = bölme sayısı × V/div. Period için T = bölme × s/div.',
    render: () => <Oscilloscope />,
  },
  {
    id: 'd2',
    title: 'Deney 2 · Bobin (Endüktans) ve Endüktif Reaktans',
    amac: 'Frekans arttıkça bobinin AC akıma karşı gösterdiği "direnç"in (XL) nasıl değiştiğini görmek.',
    mantik: 'Bobin DC için kısa devre, AC için zorluyor. XL = 2πfL — frekans arttıkça XL büyür, akım küçülür. R ile birlikte impedans Z = √(R² + XL²). Faz olarak akım, gerilimi 90° geriden takip eder.',
    formul: ['XL = 2πfL', 'Z = √(R² + XL²)', 'I = V / Z', 'φ = arctan(XL / R)'],
    ipucu: 'Bobinin endüktansı küçükse (mH), düşük frekanslarda XL çok küçüktür — R baskındır. Yüksek frekansta tablo terstir.',
    render: () => <InductorRL />,
  },
  {
    id: 'd3',
    title: 'Deney 3 · Seri RC Devresi',
    amac: 'R ve C üzerindeki gerilimlerin frekansa göre nasıl bölüştüğünü incelemek.',
    mantik: 'XC = 1/(2πfC) — frekans arttıkça XC küçülür. Düşük frekansta C bütün gerilimi tutar (VC ≈ Vin), yüksekte ise R baskındır (VR ≈ Vin). Bu davranış aslında filtre temeli.',
    formul: ['XC = 1/(2πfC)', 'Z = √(R² + XC²)', 'VR = Vin · R/Z', 'VC = Vin · XC/Z'],
    ipucu: 'Kesim frekansı: fc = 1/(2πRC). Bu noktada VR = VC = Vin/√2 olur.',
    render: () => <SeriesRC />,
  },
  {
    id: 'd4',
    title: 'Deney 4 · Seri Rezonans (RLC)',
    amac: 'XL ile XC nin birbirini sönümlediği özel frekansı bulmak ve etkilerini gözlemek.',
    mantik: 'Seri RLC devresinde rezonansta XL = XC olur. Bu durumda impedans en küçük (sadece R) ve akım maksimumdur. Devre o frekansta "saf rezistif" gibi davranır — faz farkı sıfır.',
    formul: ['f₀ = 1/(2π√(LC))', 'Z(f₀) = R', 'I(f₀) = V/R'],
    ipucu: 'Rezonansta L ve C üzerindeki gerilimler tek tek Vin\'den büyük olabilir — birbirini iptal ederler ama enerji depolama yüksektir (Q faktörü).',
    render: () => <Resonance mode="series" />,
  },
  {
    id: 'd5',
    title: 'Deney 5 · Paralel Rezonans (Tank)',
    amac: 'L ve C paralel bağlandığında rezonansta tankın yüksek empedans davranışını görmek.',
    mantik: 'Paralel L ∥ C bir "tank devresi"dir. Rezonansta L ve C aralarında enerji takas eder; dışarıdan bakıldığında çok az akım çeker — yani tankın empedansı çok yüksektir. Bu yüzden radyo kanalı seçici olarak kullanılır.',
    formul: ['f₀ = 1/(2π√(LC))', 'Q = R/(2πf₀L)', 'B = f₀/Q'],
    ipucu: 'Rezonans dışında akım daha kolay akar — yani tank "bant geçiren" gibi davranır, sadece rezonans frekansının etrafını süzer.',
    render: () => <Resonance mode="parallel" />,
  },
  {
    id: 'd6',
    title: 'Deney 6 · Alçak Geçiren Filtre (LPF)',
    amac: 'RC alçak geçiren filtrenin kesim frekansını ve davranışını incelemek.',
    mantik: 'R - C yapısında çıkışı C üzerinden alırsan: alçak frekanslarda XC büyük, çıkış yüksek → geçer. Yüksek frekanslarda XC küçük, gerilim R üzerinde düşer → kısılır. Kesim frekansı fc = 1/(2πRC).',
    formul: ['fc = 1/(2πRC)', '|H(f)| = XC / √(R² + XC²)', '|H(fc)| = 1/√2 ≈ -3 dB'],
    ipucu: 'Bode plot\'a "logaritmik kâğıt" gözüyle bak: x ekseni log f, y ekseni dB. Kesim sonrası eğim ~ -20 dB/dekat.',
    render: () => <Filter kind="LPF" />,
  },
  {
    id: 'd7',
    title: 'Deney 7 · Yüksek Geçiren Filtre (HPF)',
    amac: 'Aynı RC bileşenleriyle R ve C\'nin yeri ters konulduğunda davranışın nasıl tersine döndüğünü görmek.',
    mantik: 'Bu sefer çıkışı R üzerinden alıyoruz. Düşük frekansta XC büyük → C üzerinde gerilim düşer → çıkış küçük. Yüksek frekansta XC küçük → C kısa devre gibi → çıkış R üzerinde, yani giriş ≈ çıkış.',
    formul: ['fc = 1/(2πRC)', '|H(f)| = R / √(R² + XC²)'],
    ipucu: 'LPF ve HPF\'nin yan yana eğrileri ayna görüntüsü gibidir; fc\'de ikisi de -3 dB seviyesindedir.',
    render: () => <Filter kind="HPF" />,
  },
]

export default function AADevre() {
  const [active, setActive] = useState(deneyler[0].id)
  const current = deneyler.find((d) => d.id === active)!

  useEffect(() => {
    markCompleted('aa-devre')
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="AA Devre Analizi"
        subtitle="Frekansın gerilimi nasıl değiştirdiğini, rezonansın neden büyülü olduğunu ve filtrelerin günlük hayatımıza nasıl sızdığını görelim."
        icon={<Zap className="w-6 h-6" />}
        accent="blush"
      />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="card-soft p-2 sticky top-20">
            {deneyler.map((d) => (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                className={`w-full text-left px-3 py-2.5 rounded-2xl transition-colors text-sm ${
                  active === d.id
                    ? 'bg-blush-100 text-ink font-semibold'
                    : 'text-inkSoft hover:bg-white/70'
                }`}
              >
                {d.title.replace(' · ', ' · ').split(' · ')[0]}
                <p className={`text-[11px] mt-0.5 ${active === d.id ? 'text-inkSoft' : 'text-inkSoft/70'}`}>
                  {d.title.split(' · ').slice(1).join(' · ')}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-9 space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-ink">{current.title}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InfoBlock title="Amaç" tone="blush" body={current.amac} />
            <InfoBlock title="Pratik İpucu" tone="mint" body={current.ipucu} />
          </div>

          <InfoBlock title="Mantık" tone="lavender" body={current.mantik} />

          {/* Simulator */}
          <div>{current.render()}</div>

          {/* Formuller */}
          <div className="card-soft p-5">
            <p className="text-sm font-semibold text-inkSoft mb-2">Formüller</p>
            <div className="flex flex-wrap gap-2">
              {current.formul.map((f) => (
                <span key={f} className="formula">{f}</span>
              ))}
            </div>
          </div>

          <Glossary
            items={[
              { term: 'Vpp / Vrms', def: 'Vpp tepeden-tepeye, Vrms etkin (root mean square) değer. RMS, sinyalin "ortalama enerji" değeridir.' },
              { term: 'Empedans (Z)', def: 'AC devrede direncin karmaşık karşılığı. Z = R + jX şeklinde yazılır, modülü √(R² + X²).' },
              { term: 'Reaktans', def: 'Bobin (XL) ve kondansatörün (XC) frekansa bağlı "direnç" benzeri davranışı.' },
              { term: 'Faz farkı', def: 'Gerilim ve akım arasındaki açı farkı. Saf R: 0°, saf L: +90°, saf C: -90°.' },
              { term: 'Rezonans', def: 'XL = XC olduğu frekans. Seri RLC\'de akım maksimum, paralel\'de tank empedansı maksimum.' },
              { term: 'Kesim frekansı', def: 'Çıkış gerilimi giriş gerilimin 1/√2\'sine (-3 dB) düştüğü frekans.' },
            ]}
          />
        </section>
      </div>
    </div>
  )
}

function InfoBlock({ title, body, tone }: { title: string; body: string; tone: 'blush' | 'lavender' | 'mint' }) {
  const bg = {
    blush: 'bg-blush-50 border-blush-100',
    lavender: 'bg-lavender-50 border-lavender-100',
    mint: 'bg-mint-50 border-mint-100',
  }[tone]
  return (
    <div className={`${bg} border rounded-3xl p-5`}>
      <p className="text-xs font-bold text-inkSoft uppercase tracking-wider mb-1.5">{title}</p>
      <p className="text-sm text-ink leading-relaxed">{body}</p>
    </div>
  )
}
