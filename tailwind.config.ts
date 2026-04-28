import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        black:           '#0A0A0A',
        surface:         '#141414',
        'surface-2':     '#1E1E1E',
        'surface-3':     '#2A2A2A',
        white:           '#F5F5F5',
        'white-muted':   '#9A9A9A',
        'white-subtle':  '#6A6A6A',
        'green-deep':    '#0D1A0D',
        'green-forest':  '#1F4A1F',
        'green-mid':     '#2D6B2D',
        'green-sage':    '#5A8F5A',
        'green-bright':  '#7CB87C',
        'green-light':   '#A8D5A8',
      },
      fontFamily: {
        serif:  ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:   ['var(--font-inter)', 'system-ui', 'sans-serif'],
        label:  ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'green-glow':    '0 0 40px rgba(45,107,45,0.25)',
        'green-glow-sm': '0 0 16px rgba(45,107,45,0.20)',
        'green-glow-xs': '0 0 8px rgba(45,107,45,0.15)',
      },
      backgroundImage: {
        'green-gradient': 'linear-gradient(135deg, #0D1A0D 0%, #1F4A1F 50%, #0A0A0A 100%)',
        'vine-gradient':  'linear-gradient(180deg, transparent 0%, #0A0A0A 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'vine-grow':  'vineGrow 2.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { from: { opacity: '0', transform: 'translateY(28px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        vineGrow:   { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        pulseSoft:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        float:      { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
