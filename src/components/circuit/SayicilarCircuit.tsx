import { C, SvgBg, Ground, VCC } from './gates'

export function SayicilarSchematic() {
  return (
    <SvgBg w={620} h={300}>
      <text x={310} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        74LS90 Decade Counter Cascade (3 Basamak)
      </text>

      {/* Clock source (555) */}
      <rect x={20} y={110} width={55} height={50} fill={C.fill} stroke={C.bus} strokeWidth="1.5" rx="4" />
      <text x={47} y={132} textAnchor="middle" fill={C.bus} fontSize="9" fontWeight="bold">555</text>
      <text x={47} y={145} textAnchor="middle" fill={C.label} fontSize="8">Clock</text>
      <text x={47} y={157} textAnchor="middle" fill={C.pin} fontSize="8">~2 Hz</text>
      <line x1={75} y1={135} x2={95} y2={135} stroke={C.bus} strokeWidth="2" />

      {/* 3x 74LS90 + 74LS47 + 7-Seg cascaded */}
      {[0, 1, 2].map((i) => {
        const x = 95 + i * 165

        return (
          <g key={i}>
            {/* 74LS90 */}
            <rect x={x} y={100} width={65} height={70} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="5" />
            <text x={x + 32} y={128} textAnchor="middle" fill={C.label} fontSize="10" fontWeight="bold">74LS90</text>
            <text x={x + 32} y={142} textAnchor="middle" fill={C.label} fontSize="8">Decade</text>
            <text x={x + 32} y={155} textAnchor="middle" fill={C.label} fontSize="8">Counter</text>

            {/* CLK input */}
            <line x1={x} y1={115} x2={x - (i === 0 ? 0 : 10)} y2={115} stroke={C.bus} strokeWidth="1.5" />
            <text x={x - 2} y={109} textAnchor="end" fill={C.bus} fontSize="8">CLK</text>

            {/* QA-QD outputs (right side) */}
            <line x1={x + 65} y1={110} x2={x + 90} y2={110} stroke={C.wire} strokeWidth="1.5" />
            <line x1={x + 65} y1={122} x2={x + 90} y2={122} stroke={C.wire} strokeWidth="1.5" />
            <line x1={x + 65} y1={134} x2={x + 90} y2={134} stroke={C.wire} strokeWidth="1.5" />
            <line x1={x + 65} y1={146} x2={x + 90} y2={146} stroke={C.wire} strokeWidth="1.5" />
            {['QA','QB','QC','QD'].map((q, qi) => (
              <text key={q} x={x + 68} y={110 + qi * 12 + 3} fill={C.wire} fontSize="8">{q}</text>
            ))}

            {/* 74LS47 decoder */}
            <rect x={x + 90} y={100} width={40} height={60} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" rx="4" />
            <text x={x + 110} y={126} textAnchor="middle" fill={C.label} fontSize="8" fontWeight="bold">74LS47</text>
            <text x={x + 110} y={138} textAnchor="middle" fill={C.label} fontSize="7">BCD-7S</text>
            <text x={x + 110} y={150} textAnchor="middle" fill={C.label} fontSize="7">decode</text>

            {/* 7-segment display */}
            <rect x={x + 132} y={95} width={30} height={75} fill="#111827" stroke="#374151" strokeWidth="1.5" rx="4" />
            <text x={x + 147} y={137} textAnchor="middle" fill="#4ade80" fontSize="22" fontWeight="bold" fontFamily="monospace">
              {i === 0 ? '0' : i === 1 ? '0' : '0'}
            </text>

            {/* Carry output for cascade */}
            {i < 2 && (
              <g>
                <line x1={x + 65} y1={163} x2={x + 162} y2={163} stroke={C.pow} strokeWidth="1.5" />
                <line x1={x + 162} y1={163} x2={x + 162} y2={115} stroke={C.pow} strokeWidth="1.5" />
                <line x1={x + 162} y1={115} x2={x + 165} y2={115} stroke={C.pow} strokeWidth="1.5" />
                <text x={x + 68} y={174} fill={C.pow} fontSize="7">Carry</text>
              </g>
            )}

            {/* VCC */}
            <line x1={x + 20} y1={100} x2={x + 20} y2={85} stroke={C.pow} strokeWidth="1.5" />
            <VCC x={x + 20} y={85} />
            {/* GND */}
            <line x1={x + 45} y1={170} x2={x + 45} y2={185} stroke={C.gnd} strokeWidth="1.5" />
            <Ground x={x + 45} y={185} />
          </g>
        )
      })}

      {/* Labels */}
      <text x={128} y={225} textAnchor="middle" fill={C.label} fontSize="9">Birler</text>
      <text x={293} y={225} textAnchor="middle" fill={C.label} fontSize="9">Onlar</text>
      <text x={458} y={225} textAnchor="middle" fill={C.label} fontSize="9">Yüzler</text>

      <text x={310} y={262} textAnchor="middle" fill={C.label} fontSize="9">Her 74LS90 0-9 arası sayar; QD carry bir sonraki basamağı tetikler. 74LS47, BCD&#x27;yi 7-seg için decode eder.</text>
    </SvgBg>
  )
}
