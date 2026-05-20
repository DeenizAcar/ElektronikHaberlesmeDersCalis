import { C, SvgBg, Ground, VCC } from './gates'

export function AlarmSchematic() {
  return (
    <SvgBg w={620} h={320}>
      <text x={310} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        555 Monostable — Exit/Entry Delay Devresi
      </text>

      {/* === 555 Timer #1: Exit delay (20s) === */}
      <rect x={60} y={55} width={90} height={120} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="5" />
      <text x={105} y={112} textAnchor="middle" fill={C.label} fontSize="11" fontWeight="bold">NE555</text>
      <text x={105} y={126} textAnchor="middle" fill={C.label} fontSize="9">#1 Exit</text>
      <text x={105} y={140} textAnchor="middle" fill={C.pin} fontSize="9">20 sn</text>

      {/* Pin labels #1 */}
      <text x={58} y={75} textAnchor="end" fill={C.pin} fontSize="9">Trig</text>
      <text x={58} y={95} textAnchor="end" fill={C.pin} fontSize="9">Rst</text>
      <text x={58} y={115} textAnchor="end" fill={C.pin} fontSize="9">GND</text>
      <text x={152} y={75} fill={C.pin} fontSize="9">VCC</text>
      <text x={152} y={95} fill={C.pin} fontSize="9">Out</text>
      <text x={152} y={115} fill={C.pin} fontSize="9">Dis</text>
      <text x={152} y={135} fill={C.pin} fontSize="9">Thr</text>
      <text x={152} y={155} fill={C.pin} fontSize="9">CV</text>

      {/* Wires #1 */}
      <line x1={60} y1={70} x2={42} y2={70} stroke={C.wire} strokeWidth="1.5" />
      <line x1={60} y1={110} x2={42} y2={110} stroke={C.gnd} strokeWidth="1.5" />
      <line x1={150} y1={70} x2={168} y2={70} stroke={C.pow} strokeWidth="1.5" />
      <line x1={150} y1={90} x2={230} y2={90} stroke={C.active} strokeWidth="2" />
      <VCC x={168} y={60} />
      <Ground x={42} y={118} />

      {/* Trigger button for #1 */}
      <rect x={20} y={62} width={22} height={10} fill={C.fill} stroke={C.bus} strokeWidth="1.5" rx="2" />
      <text x={31} y={71} textAnchor="middle" fill={C.bus} fontSize="8">KUR</text>

      {/* RC timing #1: R=2MΩ, C=10µF → 20s */}
      <line x1={168} y1={130} x2={185} y2={130} stroke={C.wire} strokeWidth="1.5" />
      <rect x={185} y={122} width={30} height={16} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" rx="2" />
      <text x={200} y={133} textAnchor="middle" fill={C.label} fontSize="8">2MΩ</text>
      <line x1={215} y1={130} x2={235} y2={130} stroke={C.wire} strokeWidth="1.5" />
      <line x1={235} y1={130} x2={235} y2={150} stroke={C.wire} strokeWidth="1.5" />
      <line x1={220} y1={150} x2={250} y2={150} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={220} y1={158} x2={250} y2={158} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={235} y1={158} x2={235} y2={175} stroke={C.wire} strokeWidth="1.5" />
      <text x={255} y={157} fill={C.pin} fontSize="8">10µF</text>
      <Ground x={235} y={175} />

      {/* Arrow / connection from #1 out to #2 trigger */}
      <line x1={230} y1={90} x2={290} y2={90} stroke={C.active} strokeWidth="2" />
      <text x={260} y={82} textAnchor="middle" fill={C.active} fontSize="9">→ tetikle</text>

      {/* === 555 Timer #2: Entry delay (10s) === */}
      <rect x={300} y={55} width={90} height={120} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="5" />
      <text x={345} y={112} textAnchor="middle" fill={C.label} fontSize="11" fontWeight="bold">NE555</text>
      <text x={345} y={126} textAnchor="middle" fill={C.label} fontSize="9">#2 Entry</text>
      <text x={345} y={140} textAnchor="middle" fill={C.pin} fontSize="9">10 sn</text>

      <text x={298} y={75} textAnchor="end" fill={C.pin} fontSize="9">Trig</text>
      <text x={392} y={75} fill={C.pin} fontSize="9">VCC</text>
      <text x={392} y={95} fill={C.active} fontSize="9">Out</text>

      <line x1={290} y1={90} x2={300} y2={73} stroke={C.active} strokeWidth="1.5" />
      <line x1={390} y1={70} x2={408} y2={70} stroke={C.pow} strokeWidth="1.5" />
      <line x1={390} y1={90} x2={440} y2={90} stroke={C.active} strokeWidth="2" />
      <VCC x={408} y={60} />

      {/* RC timing #2: R=1MΩ, C=10µF → 10s */}
      <line x1={408} y1={130} x2={425} y2={130} stroke={C.wire} strokeWidth="1.5" />
      <rect x={425} y={122} width={28} height={16} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" rx="2" />
      <text x={439} y={133} textAnchor="middle" fill={C.label} fontSize="8">1MΩ</text>
      <line x1={453} y1={130} x2={465} y2={130} stroke={C.wire} strokeWidth="1.5" />
      <line x1={465} y1={130} x2={465} y2={148} stroke={C.wire} strokeWidth="1.5" />
      <line x1={452} y1={148} x2={478} y2={148} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={452} y1={156} x2={478} y2={156} stroke={C.strokeAlt} strokeWidth="3" />
      <line x1={465} y1={156} x2={465} y2={175} stroke={C.wire} strokeWidth="1.5" />
      <text x={482} y={155} fill={C.pin} fontSize="8">10µF</text>
      <Ground x={465} y={175} />

      {/* Output: Buzzer + LED */}
      <line x1={440} y1={90} x2={490} y2={90} stroke={C.active} strokeWidth="2" />
      {/* Buzzer */}
      <ellipse cx={510} cy={75} rx={16} ry={12} fill={C.fill} stroke="#f59e0b" strokeWidth="2" />
      <text x={510} y={79} textAnchor="middle" fill="#f59e0b" fontSize="9">BZR</text>
      <line x1={490} y1={90} x2={494} y2={80} stroke={C.active} strokeWidth="1.5" />
      {/* LED */}
      <circle cx={510} cy={108} r={10} fill={C.fill} stroke={C.pow} strokeWidth="2" />
      <text x={510} y={112} textAnchor="middle" fill={C.pow} fontSize="9">LED</text>
      <line x1={490} y1={90} x2={500} y2={108} stroke={C.active} strokeWidth="1.5" />
      <text x={510} y={132} textAnchor="middle" fill={C.pow} fontSize="8">ALARM!</text>

      {/* Disarm button */}
      <rect x={430} y={175} width={40} height={12} fill={C.fill} stroke={C.bus} strokeWidth="1.5" rx="2" />
      <text x={450} y={184} textAnchor="middle" fill={C.bus} fontSize="8">ŞİFRE / RST</text>
      <line x1={345} y1={90} x2={345} y2={187} stroke={C.wire} strokeWidth="1.5" strokeDasharray="3,3" />
      <line x1={345} y1={187} x2={430} y2={187} stroke={C.wire} strokeWidth="1.5" strokeDasharray="3,3" />

      {/* Legend */}
      <text x={30} y={230} fill={C.label} fontSize="10" fontWeight="bold">Çalışma prensibi:</text>
      <text x={30} y={246} fill={C.label} fontSize="9">1. KUR butonuna basılır → 555#1 tetiklenir → 20sn çıkış gecikmesi başlar (exit delay)</text>
      <text x={30} y={260} fill={C.label} fontSize="9">2. 20sn sonra armed → kapı açılırsa 555#2 tetiklenir → 10sn giriş gecikmesi (entry delay)</text>
      <text x={30} y={274} fill={C.label} fontSize="9">3. 10sn içinde RST/şifre girilirse sistem devre dışı; girilmezse buzzer + LED aktif (ALARM)</text>
      <text x={30} y={288} fill={C.label} fontSize="9">t = 1.1 × R × C  →  #1: 1.1 × 2MΩ × 10µF ≈ 22sn  |  #2: 1.1 × 1MΩ × 10µF ≈ 11sn</text>
    </SvgBg>
  )
}
