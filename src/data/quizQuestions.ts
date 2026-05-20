export type Question = {
  id: string
  topic: 'aa' | 'segment' | 'mux' | 'sayici' | 'alarm' | 'adc'
  prompt: string
  options: string[]
  answer: number // index
  explain?: string
}

export const questions: Question[] = [
  {
    id: 'aa1',
    topic: 'aa',
    prompt: 'Sinüs sinyalinde Vrms ile Vpp arasındaki ilişki nedir?',
    options: ['Vrms = Vpp / 2', 'Vrms = Vpp / √2', 'Vrms = Vpp / (2√2)', 'Vrms = Vpp · √2'],
    answer: 2,
    explain: 'Sinüs için tepe değer Vpp/2; RMS = tepe/√2 = Vpp/(2√2).',
  },
  {
    id: 'aa2',
    topic: 'aa',
    prompt: 'XL = 2πfL formülünde f arttıkça XL ne olur?',
    options: ['Azalır', 'Değişmez', 'Artar', 'Sıfırlanır'],
    answer: 2,
    explain: 'XL frekansla doğru orantılı.',
  },
  {
    id: 'aa3',
    topic: 'aa',
    prompt: 'Seri RLC devresinde rezonans frekansında akım nasıldır?',
    options: ['Minimumdur', 'Maksimumdur', 'Sıfırdır', 'Sonsuza gider'],
    answer: 1,
    explain: 'Z minimum (= R) olduğu için I = V/R maksimumdur.',
  },
  {
    id: 'aa4',
    topic: 'aa',
    prompt: 'RC alçak geçiren filtre kesim frekansı fc nedir?',
    options: ['1/(2πLC)', '1/(2πRC)', 'RC/2π', '2πRC'],
    answer: 1,
    explain: 'fc = 1 / (2πRC).',
  },
  {
    id: 'aa5',
    topic: 'aa',
    prompt: 'Kesim frekansında kazanç kaç dB\'dir?',
    options: ['0 dB', '-3 dB', '-6 dB', '-20 dB'],
    answer: 1,
    explain: 'Genlik 1/√2\'ye düşer → -3 dB.',
  },
  {
    id: 'aa6',
    topic: 'aa',
    prompt: 'Üçgen sinyalde Vrms formülü?',
    options: ['Vpp / 2', 'Vpp / (2√3)', 'Vpp / √3', 'Vpp / (2√2)'],
    answer: 1,
    explain: 'Üçgen için Vrms = Vpp/(2√3).',
  },
  {
    id: 'aa7',
    topic: 'aa',
    prompt: 'Saf kondansatörde gerilim ve akım faz ilişkisi?',
    options: ['Akım gerilimi 90° geriden takip eder', 'Akım gerilimi 90° önden gider', 'Aynı fazdadır', '180° terstir'],
    answer: 1,
    explain: 'Kondansatörde I, V\'den 90° önde.',
  },

  // Segment
  {
    id: 'seg1',
    topic: 'segment',
    prompt: '4 bitlik girişle 7-segment display kaç farklı değer gösterebilir?',
    options: ['8', '15', '16', '32'],
    answer: 2,
    explain: '2⁴ = 16 (0-F).',
  },
  {
    id: 'seg2',
    topic: 'segment',
    prompt: '7-segment\'te "1" rakamı için hangi segmentler yanar?',
    options: ['a, b', 'b, c', 'a, b, c', 'sadece c'],
    answer: 1,
    explain: '"1" rakamı sağ taraf — b (sağ üst) ve c (sağ alt).',
  },
  {
    id: 'seg3',
    topic: 'segment',
    prompt: '7-segment "8" rakamı için kaç segment yanar?',
    options: ['5', '6', '7', '4'],
    answer: 2,
    explain: '"8" tüm 7 segmentin yanmasını gerektirir.',
  },
  {
    id: 'seg4',
    topic: 'segment',
    prompt: 'Kombinasyonel devreyi tanımlayan en doğru ifade?',
    options: [
      'Çıkışı yalnızca o anki girişe bağlı, hafızasız',
      'Çıkış geçmiş durumlara bağlıdır',
      'Sadece saat sinyali ile çalışır',
      'Flip-flop içerir',
    ],
    answer: 0,
    explain: 'Hafıza yok, çıkış = f(şu anki giriş).',
  },

  // Mux
  {
    id: 'mux1',
    topic: 'mux',
    prompt: '8\'e-1 multiplexer\'da kaç select line vardır?',
    options: ['2', '3', '4', '8'],
    answer: 1,
    explain: '2³ = 8 olduğu için 3 select.',
  },
  {
    id: 'mux2',
    topic: 'mux',
    prompt: 'S2S1S0 = 101 olduğunda hangi giriş seçilir?',
    options: ['I3', 'I5', 'I6', 'I7'],
    answer: 1,
    explain: '101 binary = 5 → I5.',
  },
  {
    id: 'mux3',
    topic: 'mux',
    prompt: 'MUX\'un tersi olan devre adı nedir?',
    options: ['Encoder', 'Demultiplexer', 'Decoder', 'Flip-Flop'],
    answer: 1,
    explain: 'DEMUX: 1 girişi N çıkıştan birine yollar.',
  },

  // Counters
  {
    id: 'cnt1',
    topic: 'sayici',
    prompt: 'Decade counter kaça kadar sayar?',
    options: ['0-7', '0-9', '0-15', '0-99'],
    answer: 1,
    explain: 'Decade = on tabanlı → 0-9.',
  },
  {
    id: 'cnt2',
    topic: 'sayici',
    prompt: '6 decade counter cascade edilirse maks sayı?',
    options: ['9999', '99999', '999999', '9999999'],
    answer: 2,
    explain: '6 hane → 999999.',
  },
  {
    id: 'cnt3',
    topic: 'sayici',
    prompt: 'İki sensörlü up/down sayıcı yönünü nasıl belirler?',
    options: [
      'Akıma göre',
      'Sensörlerin tetiklenme sırasına göre',
      'Saat saymaya göre',
      'Sıcaklığa göre',
    ],
    answer: 1,
    explain: 'S1 önce S2 → +1, S2 önce S1 → -1.',
  },
  {
    id: 'cnt4',
    topic: 'sayici',
    prompt: 'Turn-on delay röle ne yapar?',
    options: [
      'Anında açar, gecikme ile kapar',
      'Tetiklendikten sonra ayarlı süre bekleyip açar',
      'Sürekli açıktır',
      'Sürekli kapalıdır',
    ],
    answer: 1,
    explain: 'On-delay: tetik → bekle → AÇ.',
  },

  // Alarm
  {
    id: 'al1',
    topic: 'alarm',
    prompt: 'Exit delay neye yarar?',
    options: [
      'Sensörü kapatır',
      'Alarm kurulduktan sonra çıkış için verilen süre',
      'Şifre değiştirir',
      'Sireni susturur',
    ],
    answer: 1,
    explain: 'Çıkış gecikmesi — alarmı kurup dükkânı terk etmek için.',
  },
  {
    id: 'al2',
    topic: 'alarm',
    prompt: 'Entry delay süresi içinde ne yapılmalı?',
    options: [
      'Hiçbir şey',
      'Sireni elle kapatmak',
      'Disarm/şifre girmek',
      'Sensör kablosunu kesmek',
    ],
    answer: 2,
    explain: 'Süre dolmadan disarm yapılmazsa alarm çalar.',
  },
  {
    id: 'al3',
    topic: 'alarm',
    prompt: '555 monostable multivibrator ne işe yarar?',
    options: [
      'Sürekli osilasyon üretir',
      'Tek tetikleme ile belirli süre çıkış üretir',
      'Sinyal kuvvetlendirir',
      'Frekans bölücüdür',
    ],
    answer: 1,
    explain: 'Tek-vuruşluk zamanlayıcı.',
  },

  // ADC/DAC
  {
    id: 'adc1',
    topic: 'adc',
    prompt: '8-bit ADC kaç seviyede kuantize eder?',
    options: ['8', '64', '256', '1024'],
    answer: 2,
    explain: '2⁸ = 256.',
  },
  {
    id: 'adc2',
    topic: 'adc',
    prompt: 'Nyquist teoremi neyi söyler?',
    options: [
      'Örnekleme frekansı en yüksek frekansın yarısı olmalı',
      'Örnekleme frekansı en yüksek frekansın en az iki katı olmalı',
      'Sinyal kuantize edilemez',
      'DAC her zaman ADC\'den hızlıdır',
    ],
    answer: 1,
    explain: 'fs ≥ 2 fmax.',
  },
  {
    id: 'adc3',
    topic: 'adc',
    prompt: 'PCM\'in temel 3 adımı?',
    options: [
      'Sample · Quantize · Encode',
      'Filter · Amplify · Send',
      'Compress · Modulate · Send',
      'Detect · Mix · Output',
    ],
    answer: 0,
    explain: 'Örnekle, kuantize et, ikiliye çevir.',
  },
  {
    id: 'adc4',
    topic: 'adc',
    prompt: 'DAC çıkışındaki merdiveni yumuşatmak için ne kullanılır?',
    options: [
      'HPF (yüksek geçiren filtre)',
      'LPF (alçak geçiren filtre)',
      'Band-stop filtre',
      'Yükseltici',
    ],
    answer: 1,
    explain: 'Yüksek frekanstaki örnekleme harmoniklerini LPF kısar.',
  },
]

export const topicLabels: Record<Question['topic'], string> = {
  aa: 'AA Devre',
  segment: '7-Segment',
  mux: 'Multiplexer',
  sayici: 'Sayıcılar',
  alarm: 'Alarm',
  adc: 'ADC/DAC',
}
