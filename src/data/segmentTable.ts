// 7-Segment Hex Decoder Truth Table
// A = LSB, D = MSB → decimal = 8D + 4C + 2B + A
// segments order: [a, b, c, d, e, f, g]
// 1 = aktif (yanık), 0 = pasif

export type SegBits = [number, number, number, number, number, number, number]

export type Row = {
  value: number       // 0–15
  inputs: [number, number, number, number] // [D, C, B, A]
  segments: SegBits
  glyph: string       // gösterilen karakter
}

export const segmentTable: Row[] = [
  { value: 0,  inputs: [0,0,0,0], segments: [1,1,1,1,1,1,0], glyph: '0' },
  { value: 1,  inputs: [0,0,0,1], segments: [0,1,1,0,0,0,0], glyph: '1' },
  { value: 2,  inputs: [0,0,1,0], segments: [1,1,0,1,1,0,1], glyph: '2' },
  { value: 3,  inputs: [0,0,1,1], segments: [1,1,1,1,0,0,1], glyph: '3' },
  { value: 4,  inputs: [0,1,0,0], segments: [0,1,1,0,0,1,1], glyph: '4' },
  { value: 5,  inputs: [0,1,0,1], segments: [1,0,1,1,0,1,1], glyph: '5' },
  { value: 6,  inputs: [0,1,1,0], segments: [1,0,1,1,1,1,1], glyph: '6' },
  { value: 7,  inputs: [0,1,1,1], segments: [1,1,1,0,0,0,0], glyph: '7' },
  { value: 8,  inputs: [1,0,0,0], segments: [1,1,1,1,1,1,1], glyph: '8' },
  { value: 9,  inputs: [1,0,0,1], segments: [1,1,1,1,0,1,1], glyph: '9' },
  { value: 10, inputs: [1,0,1,0], segments: [1,1,1,0,1,1,1], glyph: 'A' },
  { value: 11, inputs: [1,0,1,1], segments: [0,0,1,1,1,1,1], glyph: 'b' },
  { value: 12, inputs: [1,1,0,0], segments: [1,0,0,1,1,1,0], glyph: 'C' },
  { value: 13, inputs: [1,1,0,1], segments: [0,1,1,1,1,0,1], glyph: 'd' },
  { value: 14, inputs: [1,1,1,0], segments: [1,0,0,1,1,1,1], glyph: 'E' },
  { value: 15, inputs: [1,1,1,1], segments: [1,0,0,0,1,1,1], glyph: 'F' },
]

export function segmentsForValue(v: number): SegBits {
  return segmentTable[v & 0xF].segments
}

export function glyphForValue(v: number): string {
  return segmentTable[v & 0xF].glyph
}
