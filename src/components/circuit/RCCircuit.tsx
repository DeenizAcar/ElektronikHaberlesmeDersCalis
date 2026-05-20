import { C, SvgBg, Resistor, Capacitor, Ground, Wire, Junction } from './gates'

export function RCLowPass() {
  return (
    <SvgBg w={600} h={260}>
      {/* Title */}
      <text x={300} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">RC Alçak Geçiren Filtre (LPF)</text>

      {/* Input label */}
      <circle cx={50} cy={130} r={5} fill={C.pin} />
      <text x={50} y={118} textAnchor="middle" fill={C.pin} fontSize="11">Vin</text>
      <text x={50} y={148} textAnchor="middle" fill={C.label} fontSize="9">f. gen.</text>

      {/* Wire: input → R1 */}
      <Wire x1={55} y1={130} x2={120} y2={130} />

      {/* Resistor */}
      <Resistor x={160} y={130} val="1 kΩ" id="R1" />

      {/* Wire: R1 → node */}
      <Wire x1={200} y1={130} x2={280} y2={130} />

      {/* Node dot */}
      <Junction x={280} y={130} />

      {/* Wire: node → output */}
      <Wire x1={280} y1={130} x2={430} y2={130} />

      {/* Output label */}
      <circle cx={440} cy={130} r={5} fill={C.pin} />
      <text x={440} y={118} textAnchor="middle" fill={C.pin} fontSize="11">Vout</text>
      <text x={440} y={148} textAnchor="middle" fill={C.label} fontSize="9">osiloskop</text>

      {/* Capacitor from node down to GND */}
      <Wire x1={280} y1={130} x2={280} y2={155} />
      <Capacitor x={280} y={175} val="100nF" id="C1" />
      <Wire x1={280} y1={185} x2={280} y2={200} />
      <Ground x={280} y={200} />

      {/* Ground ref for input */}
      <Wire x1={50} y1={135} x2={50} y2={220} />
      <Wire x1={50} y1={220} x2={440} y2={220} />
      <Wire x1={440} y1={135} x2={440} y2={220} />
      <Wire x1={440} y1={220} x2={280} y2={220} />
      <text x={300} y={238} textAnchor="middle" fill={C.gnd} fontSize="10">GND</text>

      {/* Frequency response note */}
      <text x={520} y={110} fill={C.label} fontSize="10">fc =</text>
      <text x={520} y={125} fill={C.pin} fontSize="11" fontWeight="bold">1/(2πRC)</text>
      <text x={520} y={140} fill={C.label} fontSize="9">≈ 1.6 kHz</text>
      <text x={520} y={160} fill={C.label} fontSize="9">-3 dB noktası</text>
    </SvgBg>
  )
}

export function RLCircuit() {
  return (
    <SvgBg w={600} h={260}>
      <text x={300} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">RL Devresi</text>

      <circle cx={50} cy={130} r={5} fill={C.pin} />
      <text x={50} y={118} textAnchor="middle" fill={C.pin} fontSize="11">Vin</text>

      <Wire x1={55} y1={130} x2={120} y2={130} />
      <Resistor x={160} y={130} val="1 kΩ" id="R1" />
      <Wire x1={200} y1={130} x2={260} y2={130} />

      {/* Inductor (series of arcs) */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${268 + i * 22} 130 A 11 11 0 0 1 ${290 + i * 22} 130`} fill="none" stroke={C.strokeAlt} strokeWidth="2.5" />
      ))}
      <text x={298} y={118} textAnchor="middle" fill={C.label} fontSize="10">L1</text>
      <text x={298} y={148} textAnchor="middle" fill={C.pin} fontSize="9">10 mH</text>

      <Wire x1={334} y1={130} x2={430} y2={130} />

      <Junction x={280} y={130} />
      <circle cx={440} cy={130} r={5} fill={C.pin} />
      <text x={440} y={118} textAnchor="middle" fill={C.pin} fontSize="11">Vout</text>

      {/* Ground */}
      <Wire x1={50} y1={135} x2={50} y2={210} />
      <Wire x1={50} y1={210} x2={440} y2={210} />
      <Wire x1={440} y1={135} x2={440} y2={210} />
      <text x={245} y={230} textAnchor="middle" fill={C.gnd} fontSize="10">GND</text>

      <text x={520} y={110} fill={C.label} fontSize="10">XL =</text>
      <text x={520} y={125} fill={C.pin} fontSize="11" fontWeight="bold">2πfL</text>
      <text x={520} y={145} fill={C.label} fontSize="9">f yükseldikçe</text>
      <text x={520} y={158} fill={C.label} fontSize="9">XL artar</text>
    </SvgBg>
  )
}
