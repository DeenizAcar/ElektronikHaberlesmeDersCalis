/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        blush:    { 50: '#FFF5F7', 100: '#FFE4EC', 200: '#FBCFE0', 300: '#F8B4CC', 400: '#F2A2BD', 500: '#E88AAB' },
        lavender: { 50: '#F7F4FB', 100: '#ECE4F7', 200: '#D7C7EF', 300: '#BFA8E4', 400: '#A88CD6', 500: '#9070C8' },
        mint:     { 50: '#F0FAF5', 100: '#DCF5E7', 200: '#B8EAD0', 300: '#94DDB8', 400: '#73CCA0', 500: '#52BC88' },
        peach:    { 50: '#FFF6EF', 100: '#FFE7D1', 200: '#FFD0A8', 300: '#FFB87E', 400: '#FF9F58', 500: '#FF8530' },
        sky:      { 50: '#EFF8FE', 100: '#D6EEFB', 200: '#B0DEF7', 300: '#88CCF1', 400: '#62B8E9', 500: '#3FA4DE' },
        cream:    '#FFFBF5',
        ink:      '#3D3654',
        inkSoft:  '#6B6385',
      },
      fontFamily: {
        display: ['Quicksand', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'soft-blush':    '0 8px 30px rgba(247, 180, 200, 0.20)',
        'soft-lavender': '0 8px 30px rgba(191, 168, 228, 0.20)',
        'soft-mint':     '0 8px 30px rgba(148, 221, 184, 0.20)',
        'soft-peach':    '0 8px 30px rgba(255, 184, 126, 0.20)',
        'soft-sky':      '0 8px 30px rgba(136, 204, 241, 0.20)',
        'soft':          '0 8px 30px rgba(125, 100, 160, 0.12)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
