# DevreAşkı 🌷

Devreleri ezberlemeden, mantığıyla öğreten interaktif çalışma sitesi.
Ege Üniversitesi Elektronik Haberleşme Teknolojisi laboratuvar deneyleri ve dijital proje konuları için ufak bir sevgi projesi.

## İçerik

- **AA Devre Analizi** — 7 deney (osiloskop, RL, RC, rezonans, LPF/HPF)
- **7-Segment Hex Decoder Lab** — interaktif 4-bit giriş ve truth table
- **8'e-1 Multiplexer Lab** — animasyonlu sinyal yönlendirme
- **Sayıcılar & Zamanlayıcılar** — 6 digit decade counter, sensörlü up/down, time relay
- **Alarm Sistemi** — exit/entry delay senaryo simülasyonu
- **ADC/DAC & PCM** — örnekleme, kuantizasyon, rekonstrüksiyon
- **Notlar** — Markdown destekli, localStorage'a kaydedilen kişisel notlar
- **Quiz** — konuya göre filtrelenebilen 25+ soru

## Tech Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS (custom pastel palette)
- Framer Motion (yumuşak animasyonlar)
- React Router (lazy loaded pages)
- Recharts (frekans grafikleri)
- Lucide React (ikonlar)
- react-markdown (notlar için)

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda: http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deploy (GitHub Pages)

`vite.config.ts`'de `base: './'` ayarlı; `dist/` çıktısını herhangi bir statik hosta yükleyebilirsin. GitHub Pages için:

```bash
npm run build
# dist klasörünü gh-pages branch'ine push et
```

## Klasör Yapısı

```
src/
  components/
    ui/          temel bileşenler (Toggle, Slider, Card, ...)
    simulators/  her devre simülatörü kendi component'i
    layout/      Navbar, Footer
  pages/         route başına 1 sayfa
  data/          truth tablolar, quiz soruları, mesajlar
  lib/           progress (localStorage)
  styles/        global tailwind
```

## Kişiselleştirme

- Sürpriz mesajlar: `src/data/messages.ts`
- Tailwind renkleri: `tailwind.config.js`
- Quiz soruları: `src/data/quizQuestions.ts`

🌸 küçük bir sevgi projesi
