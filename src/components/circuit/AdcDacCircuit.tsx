import { C, SvgBg, Ground, VCC } from './gates'

export function AdcDacSchematic() {
  return (
    <SvgBg w={620} h={300}>
      <text x={310} y={22} textAnchor="middle" fill={C.label} fontSize="13" fontWeight="bold">
        ADC0804 → Dijital İşlem → DAC0808 Zinciri
      </text>

      {/* Analog input (potentiometer) */}
      <ellipse cx={40} cy={150} rx={20} ry={20} fill={C.fill} stroke={C.bus} strokeWidth="1.5" />
      <text x={40} y={146} textAnchor="middle" fill={C.bus} fontSize="9" fontWeight="bold">POT</text>
      <text x={40} y={158} textAnchor="middle" fill={C.label} fontSize="8">10kΩ</text>
      <line x1={60} y1={150} x2={85} y2={150} stroke={C.bus} strokeWidth="2" />
      <text x={50} y={180} textAnchor="middle" fill={C.label} fontSize="8">Vin (0-5V)</text>

      {/* ADC0804 */}
      <rect x={85} y={95} width={90} height={115} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="5" />
      <text x={130} y={145} textAnchor="middle" fill={C.label} fontSize="11" fontWeight="bold">ADC0804</text>
      <text x={130} y={159} textAnchor="middle" fill={C.label} fontSize="9">8-bit ADC</text>
      <text x={130} y={173} textAnchor="middle" fill={C.pin} fontSize="8">Vin+ / Vin-</text>
      <text x={130} y={185} textAnchor="middle" fill={C.pin} fontSize="8">CLK · CS̄</text>

      {/* ADC input pin */}
      <line x1={85} y1={150} x2={72} y2={150} stroke={C.bus} strokeWidth="1.5" />
      <text x={83} y={144} textAnchor="end" fill={C.bus} fontSize="8">Vin+</text>

      {/* ADC digital output bus (D0-D7) */}
      <line x1={175} y1={135} x2={240} y2={135} stroke={C.active} strokeWidth="3" />
      <text x={207} y={127} textAnchor="middle" fill={C.active} fontSize="9" fontWeight="bold">D0–D7</text>
      <text x={207} y={150} textAnchor="middle" fill={C.label} fontSize="8">8-bit bus</text>

      {/* "Digital Processing" block */}
      <rect x={240} y={110} width={80} height={70} fill={C.fill} stroke={C.bus} strokeWidth="1.5" rx="5" strokeDasharray="5,3" />
      <text x={280} y={138} textAnchor="middle" fill={C.bus} fontSize="9" fontWeight="bold">MCU /</text>
      <text x={280} y={150} textAnchor="middle" fill={C.bus} fontSize="9" fontWeight="bold">FPGA</text>
      <text x={280} y={165} textAnchor="middle" fill={C.label} fontSize="8">(opsiyonel)</text>

      <line x1={320} y1={145} x2={345} y2={145} stroke={C.active} strokeWidth="3" />
      <text x={332} y={138} textAnchor="middle" fill={C.active} fontSize="8">D0–D7</text>

      {/* DAC0808 */}
      <rect x={345} y={95} width={90} height={115} fill={C.fill} stroke={C.stroke} strokeWidth="2" rx="5" />
      <text x={390} y={145} textAnchor="middle" fill={C.label} fontSize="11" fontWeight="bold">DAC0808</text>
      <text x={390} y={159} textAnchor="middle" fill={C.label} fontSize="9">8-bit DAC</text>
      <text x={390} y={173} textAnchor="middle" fill={C.pin} fontSize="8">Iout → LPF</text>

      {/* DAC analog output */}
      <line x1={435} y1={150} x2={460} y2={150} stroke={C.bus} strokeWidth="2" />

      {/* Op-amp LPF / buffer */}
      <polygon points={`460,130 460,170 500,150`} fill={C.fill} stroke={C.strokeAlt} strokeWidth="1.5" />
      <text x={475} y={154} textAnchor="middle" fill={C.label} fontSize="8">LM741</text>
      <line x1={500} y1={150} x2={545} y2={150} stroke={C.bus} strokeWidth="2" />

      {/* Output */}
      <circle cx={550} cy={150} r={8} fill={C.fill} stroke={C.bus} strokeWidth="2" />
      <text x={550} y={154} textAnchor="middle" fill={C.bus} fontSize="8">Vout</text>
      <text x={550} y={170} textAnchor="middle" fill={C.label} fontSize="8">Analog</text>

      {/* Power rails */}
      <VCC x={130} y={85} />
      <line x1={130} y1={85} x2={130} y2={95} stroke={C.pow} strokeWidth="1.5" />
      <Ground x={130} y={220} />
      <line x1={130} y1={210} x2={130} y2={220} stroke={C.gnd} strokeWidth="1.5" />

      <VCC x={390} y={85} />
      <line x1={390} y1={85} x2={390} y2={95} stroke={C.pow} strokeWidth="1.5" />
      <Ground x={390} y={220} />
      <line x1={390} y1={210} x2={390} y2={220} stroke={C.gnd} strokeWidth="1.5" />

      {/* Legend */}
      <text x={310} y={262} textAnchor="middle" fill={C.label} fontSize="9">Analog sinyal orneklenir, 8-bit sayıya donusturulur, DAC geri gerilime cevirir, LPF merdiveni duzlestir.</text>
    </SvgBg>
  )
}
