import { C, SvgBg, Ground, VCC } from './gates'

/* ── Schematic: 74LS47 → 7-Seg display ── */
export function SegmentSchematic() {
  const icX = 160, icY = 60, icW = 110, icH = 200
  const dispX = 400, dispY = 60, dispW = 90, dispH = 200
  const segColors = ['#f87171','#fb923c','#fbbf24','#a3e635','#34d399','#38bdf8','#a78bfa']

  return (
    <SvgBg w={600} h={300}>
      <text x={300} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">74LS47 → 7-Segment Bağlantısı</text>

      {/* 74LS47 IC */}
      <rect x={icX} y={icY} width={icW} height={icH} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="6" />
      <text x={icX + icW / 2} y={icY + icH / 2 - 8} textAnchor="middle" fill={C.label} fontSize="12" fontWeight="bold">74LS47</text>
      <text x={icX + icW / 2} y={icY + icH / 2 + 8} textAnchor="middle" fill={C.label} fontSize="10">BCD→7Seg</text>

      {/* Input pins (left side of IC) */}
      {['D (MSB)','C','B','A (LSB)'].map((name, i) => {
        const py = icY + 35 + i * 38
        return (
          <g key={name}>
            <line x1={icX - 30} y1={py} x2={icX} y2={py} stroke={C.bus} strokeWidth="2" />
            <circle cx={icX - 30} cy={py} r={3} fill={C.pin} />
            <text x={icX - 34} y={py + 4} textAnchor="end" fill={C.pin} fontSize="10">{name}</text>
          </g>
        )
      })}

      {/* VCC and GND */}
      <line x1={icX + 30} y1={icY} x2={icX + 30} y2={icY - 20} stroke={C.pow} strokeWidth="2" />
      <VCC x={icX + 30} y={icY - 20} label="+5V" />
      <line x1={icX + 70} y1={icY + icH} x2={icX + 70} y2={icY + icH + 20} stroke={C.gnd} strokeWidth="2" />
      <Ground x={icX + 70} y={icY + icH + 20} />

      {/* Output pins (right side of IC) → resistors → display */}
      {['a','b','c','d','e','f','g'].map((seg, i) => {
        const py = icY + 20 + i * 26
        const rx = icX + icW + 20
        const col = segColors[i]
        return (
          <g key={seg}>
            <line x1={icX + icW} y1={py} x2={rx} y2={py} stroke={col} strokeWidth="1.5" />
            {/* Resistor symbol */}
            <rect x={rx} y={py - 7} width={26} height={14} fill={C.fill} stroke={col} strokeWidth="1.5" rx="2" />
            <text x={rx + 13} y={py + 4} textAnchor="middle" fill={col} fontSize="8">330Ω</text>
            <line x1={rx + 26} y1={py} x2={dispX} y2={py} stroke={col} strokeWidth="1.5" />
            <text x={icX + icW + 5} y={py - 3} fill={C.label} fontSize="9">{seg}</text>
          </g>
        )
      })}

      {/* 7-Segment Display */}
      <rect x={dispX} y={dispY} width={dispW} height={dispH} fill="#111827" stroke="#374151" strokeWidth="2" rx="6" />
      <text x={dispX + dispW / 2} y={dispY + dispH / 2 - 6} textAnchor="middle" fill="#374151" fontSize="28" fontWeight="bold" fontFamily="monospace">8</text>
      <text x={dispX + dispW / 2} y={dispY + dispH / 2 + 16} textAnchor="middle" fill={C.label} fontSize="10">7-Seg</text>
      <text x={dispX + dispW / 2} y={dispY + dispH / 2 + 28} textAnchor="middle" fill={C.label} fontSize="9">Common</text>
      <text x={dispX + dispW / 2} y={dispY + dispH / 2 + 40} textAnchor="middle" fill={C.label} fontSize="9">Cathode</text>

      {/* Common cathode GND */}
      <line x1={dispX + dispW / 2} y1={dispY + dispH} x2={dispX + dispW / 2} y2={dispY + dispH + 20} stroke={C.gnd} strokeWidth="2" />
      <Ground x={dispX + dispW / 2} y={dispY + dispH + 20} />
    </SvgBg>
  )
}

/* ── Logic Gate Diagram: segment 'a' SOP expression ── */
export function SegmentLogic() {
  // Segment 'a' is OFF only for decimal 1 (0001) and 4 (0100)
  // a = NOT(m1 OR m4) where m1=A'B'C'D, m4=A'BC'D'
  // But simpler: show the AND-NOT structure
  const W = 600, H = 320

  return (
    <SvgBg w={W} h={H}>
      <text x={300} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        Segment 'a' — Lojik Kapı İmplementasyonu
      </text>
      <text x={300} y={38} textAnchor="middle" fill={C.label} fontSize="10">a = OFF yalnızca 1 (0001) ve 4 (0100) için — NAND yapısı</text>

      {/* Input labels */}
      {['D','C','B','A'].map((bit, i) => {
        const y = 75 + i * 52
        return (
          <g key={bit}>
            <circle cx={35} cy={y} r={5} fill={C.pin} />
            <text x={35} y={y - 9} textAnchor="middle" fill={C.pin} fontSize="12" fontWeight="bold">{bit}</text>
            <line x1={40} y1={y} x2={120} y2={y} stroke={C.bus} strokeWidth="2" />
          </g>
        )
      })}

      {/* Vertical bus */}
      <line x1={120} y1={75} x2={120} y2={288} stroke={C.bus} strokeWidth="1.5" strokeDasharray="4,3" />

      {/* NOT gates for D' and B' */}
      {/* NOT(D) at y=75 */}
      <polygon points={`130,68 130,82 148,75`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={151} cy={75} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <text x={158} y={79} fill={C.label} fontSize="10">D'</text>

      {/* NOT(B) at y=180 */}
      <polygon points={`130,173 130,187 148,180`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={151} cy={180} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <text x={158} y={184} fill={C.label} fontSize="10">B'</text>

      {/* --- AND gate for minterm 1: A · B' · C' · D --- */}
      {/* (simplified: show 3-input AND combining A, B', D) */}
      <text x={210} y={110} fill={C.label} fontSize="9">minterm 1 (0001)</text>
      {/* AND gate body */}
      <path d={`M 195 120 L 195 150 L 215 150 C 235 150 235 120 215 120 Z`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <text x={215} y={138} textAnchor="middle" fill={C.label} fontSize="9">AND</text>
      {/* inputs to AND */}
      <line x1={155} y1={79} x2={195} y2={128} stroke={C.wire} strokeWidth="1.5" />
      <line x1={155} y1={184} x2={195} y2={135} stroke={C.wire} strokeWidth="1.5" />
      <line x1={120} y1={127} x2={195} y2={142} stroke={C.wire} strokeWidth="1.5" />
      {/* AND output */}
      <line x1={235} y1={135} x2={310} y2={135} stroke={C.wire} strokeWidth="1.5" />

      {/* --- AND gate for minterm 4: A' · B · C' · D' --- */}
      <text x={210} y={195} fill={C.label} fontSize="9">minterm 4 (0100)</text>
      <path d={`M 195 200 L 195 230 L 215 230 C 235 230 235 200 215 200 Z`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <text x={215} y={218} textAnchor="middle" fill={C.label} fontSize="9">AND</text>
      <line x1={155} y1={79} x2={195} y2={208} stroke={C.wire} strokeWidth="1.5" />
      <line x1={120} y1={127} x2={195} y2={215} stroke={C.wire} strokeWidth="1.5" />
      <line x1={120} y1={180} x2={195} y2={222} stroke={C.wire} strokeWidth="1.5" />
      <line x1={235} y1={215} x2={310} y2={215} stroke={C.wire} strokeWidth="1.5" />

      {/* OR gate (combines the two minterms) */}
      <text x={322} y={162} fill={C.label} fontSize="9">OR</text>
      <path
        d={`M 310 155 Q 318 155 345 175 Q 318 195 310 195 Q 318 175 310 155 Z`}
        fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5"
      />
      <line x1={345} y1={175} x2={380} y2={175} stroke={C.wire} strokeWidth="1.5" />

      {/* NOT gate (invert: a = NOT(m1 OR m4)) */}
      <polygon points={`380,168 380,182 398,175`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={401} cy={175} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <line x1={405} y1={175} x2={450} y2={175} stroke={C.active} strokeWidth="2" />

      {/* Output */}
      <circle cx={455} cy={175} r={6} fill={C.active} />
      <text x={465} y={171} fill={C.active} fontSize="12" fontWeight="bold">a</text>
      <text x={465} y={185} fill={C.label} fontSize="9">segment</text>

      {/* Legend */}
      <text x={30} y={298} fill={C.label} fontSize="9">Aynı yapı b-g segmentleri için de uygulanır — her segment farklı minterm kombinasyonuna sahiptir.</text>
    </SvgBg>
  )
}
