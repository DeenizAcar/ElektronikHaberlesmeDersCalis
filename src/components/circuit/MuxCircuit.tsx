import { C, SvgBg, Junction, Ground, VCC } from './gates'

/* ── Schematic: 74LS151 IC pinout ── */
export function MuxSchematic() {
  const icX = 180, icY = 50, icW = 120, icH = 200

  return (
    <SvgBg w={600} h={290}>
      <text x={300} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        74LS151 — 8'e-1 MUX Pin Bağlantısı
      </text>

      {/* IC body */}
      <rect x={icX} y={icY} width={icW} height={icH} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="6" />
      <text x={icX + icW / 2} y={icY + icH / 2 - 6} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">74LS151</text>
      <text x={icX + icW / 2} y={icY + icH / 2 + 10} textAnchor="middle" fill={C.label} fontSize="9">8:1 MUX</text>

      {/* Left pins: I0-I7 */}
      {Array.from({ length: 8 }, (_, i) => {
        const py = icY + 20 + i * 22
        return (
          <g key={i}>
            <line x1={icX - 30} y1={py} x2={icX} y2={py} stroke={C.wire} strokeWidth="1.5" />
            <circle cx={icX - 30} cy={py} r={3} fill={C.pin} />
            <text x={icX - 34} y={py + 4} textAnchor="end" fill={C.pin} fontSize="10">I{i}</text>
          </g>
        )
      })}

      {/* Right pins: S0, S1, S2, Y, W̄ */}
      {[
        { name: 'S0', color: C.bus },
        { name: 'S1', color: C.bus },
        { name: 'S2', color: C.bus },
        { name: 'Y (çıkış)', color: C.active },
        { name: 'W̄ (ters)', color: '#f87171' },
      ].map(({ name, color }, i) => {
        const py = icY + 30 + i * 34
        return (
          <g key={name}>
            <line x1={icX + icW} y1={py} x2={icX + icW + 30} y2={py} stroke={color} strokeWidth="1.5" />
            <circle cx={icX + icW + 30} cy={py} r={3} fill={color} />
            <text x={icX + icW + 34} y={py + 4} fill={color} fontSize="10">{name}</text>
          </g>
        )
      })}

      {/* VCC */}
      <line x1={icX + 40} y1={icY} x2={icX + 40} y2={icY - 20} stroke={C.pow} strokeWidth="2" />
      <VCC x={icX + 40} y={icY - 20} />

      {/* GND */}
      <line x1={icX + 80} y1={icY + icH} x2={icX + 80} y2={icY + icH + 20} stroke={C.gnd} strokeWidth="2" />
      <Ground x={icX + 80} y={icY + icH + 20} />

      {/* Enable (Strobe) */}
      <line x1={icX + icW} y1={icY + icH - 20} x2={icX + icW + 30} y2={icY + icH - 20} stroke={C.pow} strokeWidth="1.5" />
      <text x={icX + icW + 34} y={icY + icH - 16} fill={C.pow} fontSize="10">Ḡ (EN, GND'e)</text>

      {/* Select DIP switch */}
      <rect x={360} y={80} width={70} height={60} fill={C.fill} stroke={C.bus} strokeWidth="1.5" rx="4" />
      <text x={395} y={102} textAnchor="middle" fill={C.bus} fontSize="10" fontWeight="bold">DIP SW</text>
      <text x={395} y={116} textAnchor="middle" fill={C.label} fontSize="9">S2 S1 S0</text>
      <text x={395} y={130} textAnchor="middle" fill={C.label} fontSize="9">3-bit</text>
      {['S0','S1','S2'].map((s, i) => (
        <line key={s} x1={360} y1={87 + i * 14} x2={icX + icW + 34} y2={icY + 30 + i * 34} stroke={C.bus} strokeWidth="1.5" strokeDasharray="4,3" />
      ))}

      {/* LED output indicator */}
      <circle cx={540} cy={icY + 30} r={12} fill="#1a1a1a" stroke={C.active} strokeWidth="2" />
      <text x={540} y={icY + 35} textAnchor="middle" fill={C.active} fontSize="10">LED</text>
      <line x1={icX + icW + 30 + 60} y1={icY + 30} x2={528} y2={icY + 30} stroke={C.active} strokeWidth="2" />
    </SvgBg>
  )
}

/* ── Logic Gate: 4:1 MUX gate-level ── */
export function MuxLogic() {
  return (
    <SvgBg w={620} h={340}>
      <text x={310} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        4'e-1 MUX — Kapı Seviyesi İmplementasyon
      </text>
      <text x={310} y={38} textAnchor="middle" fill={C.label} fontSize="9">Y = S1&#x27;·S0&#x27;·I0 + S1&#x27;·S0·I1 + S1·S0&#x27;·I2 + S1·S0·I3</text>

      {/* Select inputs S0, S1 */}
      <circle cx={30} cy={80} r={5} fill={C.pin} />
      <text x={30} y={68} textAnchor="middle" fill={C.pin} fontSize="11" fontWeight="bold">S0</text>
      <line x1={35} y1={80} x2={80} y2={80} stroke={C.bus} strokeWidth="2" />
      <Junction x={80} y={80} color={C.bus} />

      <circle cx={30} cy={115} r={5} fill={C.pin} />
      <text x={30} y={103} textAnchor="middle" fill={C.pin} fontSize="11" fontWeight="bold">S1</text>
      <line x1={35} y1={115} x2={80} y2={115} stroke={C.bus} strokeWidth="2" />
      <Junction x={80} y={115} color={C.bus} />

      {/* Vertical select bus */}
      <line x1={80} y1={80} x2={80} y2={280} stroke={C.bus} strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1={100} y1={80} x2={100} y2={280} stroke={C.bus} strokeWidth="1.5" strokeDasharray="4,3" />

      {/* NOT(S0) at x=115, y=80 */}
      <polygon points={`115,73 115,87 133,80`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={136} cy={80} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <line x1={80} y1={80} x2={115} y2={80} stroke={C.bus} strokeWidth="1.5" />
      <text x={143} y={84} fill={C.label} fontSize="10">S0'</text>

      {/* NOT(S1) at x=115, y=115 */}
      <polygon points={`115,108 115,122 133,115`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <circle cx={136} cy={115} r={4} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <line x1={100} y1={115} x2={115} y2={115} stroke={C.bus} strokeWidth="1.5" />
      <text x={143} y={119} fill={C.label} fontSize="10">S1'</text>

      {/* Data inputs I0-I3 */}
      {[0,1,2,3].map((i) => {
        const y = 155 + i * 50
        return (
          <g key={i}>
            <circle cx={30} cy={y} r={5} fill={C.wire} />
            <text x={30} y={y - 9} textAnchor="middle" fill={C.wire} fontSize="11" fontWeight="bold">I{i}</text>
            <line x1={35} y1={y} x2={165} y2={y} stroke={C.wire} strokeWidth="1.5" />
          </g>
        )
      })}

      {/* 4 AND gates */}
      {[
        { y: 160, selA: 'S1\'', selB: 'S0\'', label: 'S1\'·S0\'·I0' },
        { y: 210, selA: 'S1\'', selB: 'S0',  label: 'S1\'·S0·I1'  },
        { y: 260, selA: 'S1',  selB: 'S0\'', label: 'S1·S0\'·I2' },
        { y: 310, selA: 'S1',  selB: 'S0',   label: 'S1·S0·I3'   },
      ].map(({ y }, i) => {
        const ax = 190
        return (
          <g key={i}>
            {/* AND gate body */}
            <path d={`M ${ax} ${y - 18} L ${ax} ${y + 18} L ${ax + 20} ${y + 18} C ${ax + 46} ${y + 18} ${ax + 46} ${y - 18} ${ax + 20} ${y - 18} Z`}
              fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
            <text x={ax + 20} y={y + 4} textAnchor="middle" fill={C.label} fontSize="8">AND</text>
            {/* Output wire */}
            <line x1={ax + 46} y1={y} x2={360} y2={y} stroke={C.wire} strokeWidth="1.5" />
            {/* Input wires to AND (from data) */}
            <line x1={165} y1={155 + i * 50} x2={ax} y2={y} stroke={C.wire} strokeWidth="1.5" />
          </g>
        )
      })}

      {/* OR gate — 4 input */}
      <path
        d={`M 360 152 Q 372 152 400 230 Q 372 308 360 308 Q 372 230 360 152 Z`}
        fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5"
      />
      <text x={375} y={234} textAnchor="middle" fill={C.label} fontSize="9">OR</text>
      {/* Output */}
      <line x1={400} y1={230} x2={450} y2={230} stroke={C.active} strokeWidth="2.5" />
      <circle cx={460} cy={230} r={8} fill={C.active} />
      <text x={473} y={226} fill={C.active} fontSize="13" fontWeight="bold">Y</text>
      <text x={473} y={240} fill={C.label} fontSize="9">çıkış</text>

      <text x={310} y={335} textAnchor="middle" fill={C.label} fontSize="9">8:1 MUX aynı yapıyı 8 AND + 1 OR kapısıyla 3 select line kullanarak uygular.</text>
    </SvgBg>
  )
}
