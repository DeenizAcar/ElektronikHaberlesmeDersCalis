# Devreleri Anla

Ege Üniversitesi Elektronik Haberleşme Teknolojisi laboratuvar deneyleri ve dijital proje konuları için interaktif çalışma sitesi.

🌐 **Canlı site:** [deenizacar.github.io/ElektronikHaberlesmeDersCalis](https://deenizacar.github.io/ElektronikHaberlesmeDersCalis/)

---

## Konular

| Sayfa | İçerik |
|-------|--------|
| AA Devre Analizi | Osiloskop, RL, seri RC, seri/paralel rezonans, LPF, HPF — 7 interaktif deney |
| 7-Segment Hex Decoder | 4-bit toggle girişi, animasyonlu 7-seg display, truth table, quiz modu |
| Multiplexer Lab | 8'e-1 MUX, select line simülasyonu |
| Sayıcılar & Zamanlayıcılar | 6-digit decade counter, sensörlü up/down, time relay |
| Alarm Sistemi | Exit/entry delay senaryo simülasyonu |
| ADC/DAC & PCM | Örnekleme, kuantizasyon, rekonstrüksiyon, PCM bit stream |
| Notlar | Markdown destekli, localStorage'a kaydedilen ders notları |
| Quiz | Konuya göre filtrelenebilen 25+ soru |

## Tech Stack

- **Vite + React 18 + TypeScript** (strict mode)
- **Tailwind CSS** — özel pastel renk paleti
- **Framer Motion** — sayfa geçişleri ve animasyonlar
- **React Router** — lazy loaded sayfalar
- **Recharts** — frekans ve Bode grafikleri
- **Lucide React** — ikonlar
- **react-markdown** — notlar sayfası

## Kurulum

```bash
npm install
npm run dev
# http://localhost:5173
```

## Build & Deploy

Site `main` branch'e push edildiğinde GitHub Actions otomatik olarak deploy eder.

Manuel build:
```bash
npm run build   # dist/ klasörünü oluşturur
npm run preview # build'i lokal önizle
```

## Klasör Yapısı

```
src/
  components/
    ui/           Toggle, Slider, Card, Confetti, ...
    simulators/   Oscilloscope, Filter, Resonance, SevenSegment, ...
    layout/       Navbar
  pages/          Her route için ayrı sayfa (lazy loaded)
  data/           segmentTable, quizQuestions, messages
  lib/            localStorage progress tracker
  styles/         Tailwind global CSS
```

## Özelleştirme

- Quiz soruları → `src/data/quizQuestions.ts`
- Renk paleti → `tailwind.config.js`
