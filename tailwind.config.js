/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Futuristic Bento AI Glass & Neon colors
        obsidian: '#070913',
        void: '#0a0d1d',
        deepMidnight: '#0d1124',
        indigoAccent: '#6366f1',
        electricViolet: '#8b5cf6',
        periwinkle: '#a5b4fc',
        cyanGlow: '#38bdf8',
        glassBg: 'rgba(13, 17, 36, 0.72)',
        glassBorder: 'rgba(129, 140, 248, 0.18)',
        specular: 'rgba(255, 255, 255, 0.15)',

        // Purple color schema – matches sign-in card
        brand: {
          50:  '#f6eeff',
          100: '#ead9ff',
          200: '#d4b3ff',
          300: '#b97eff',
          400: '#9d4dff',
          500: '#8b22ff',
          600: '#7c00f0',
          700: '#6600cc',
          800: '#4c0099',
          900: '#2f0646',
          950: '#190226',
        },
        // Background layers (deep purple-black)
        surface: {
          base:   '#05010b',
          deep:   '#0d0118',
          card:   '#170d26',
          elevated: '#1e1035',
          border: 'rgba(168,85,247,0.15)',
          hover:  'rgba(168,85,247,0.08)',
        },
        // Accent purple tones
        purple: {
          950: '#0d0118',
          900: '#190226',
          800: '#2f0646',
          700: '#4c116d',
          600: '#7e22ce',
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
          200: '#ede9fe',
          100: '#f5f3ff',
        }
      },
      boxShadow: {
        glowSm: '0 0 16px -2px rgba(99, 102, 241, 0.45)',
        glowLg: '0 10px 40px -10px rgba(139, 92, 246, 0.45)',
        glowCyan: '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        glassCard: '0 20px 50px -12px rgba(3, 4, 10, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.14), inset 0 -1px 1px 0 rgba(99, 102, 241, 0.12)',
        glowButton: '0 8px 30px -4px rgba(99, 102, 241, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
        subtlePill: 'inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 4px 15px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'purple-radial': 'radial-gradient(ellipse 95% 70% at 50% 45%, #4c116d 0%, #440f62 14%, #3a0c54 28%, #2f0844 42%, #240536 56%, #1a0328 69%, #12021c 80%, #0b0113 90%, #05010b 100%)',
        'purple-card': 'linear-gradient(135deg, rgba(23,13,38,0.82) 0%, rgba(15,3,27,0.95) 100%)',
        'sidebar-grad': 'linear-gradient(180deg, #0d0118 0%, #190226 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%':   { boxShadow: '0 0 15px -4px rgba(168,85,247,0.3)' },
          '100%': { boxShadow: '0 0 30px -4px rgba(168,85,247,0.6)' },
        }
      }
    },
  },
  plugins: [],
}
