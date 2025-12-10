/** @type {import('tailwindcss').Config} */
export default {
  // Habilitar el modo oscuro usando la estrategia de clase
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta de colores cálidos y grises mejorada
        'slate': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Azul corporativo mejorado
        'corp-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Dorado corporativo mejorado
        'corp-gold': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Colores adicionales para mayor variedad
        'emerald': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.6', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.4', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.3', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.045em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'xs': '0 1px 3px rgba(15, 23, 42, 0.03)',
        'sm': '0 4px 8px rgba(15, 23, 42, 0.04)',
        'md': '0 8px 20px rgba(15, 23, 42, 0.06)',
        'lg': '0 12px 30px rgba(15, 23, 42, 0.08)',
        'xl': '0 20px 40px rgba(15, 23, 42, 0.10)',
        '2xl': '0 25px 60px rgba(15, 23, 42, 0.12)',
        'inner': 'inset 0 2px 8px rgba(15, 23, 42, 0.06)',
        'glow': '0 0 40px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 60px rgba(59, 130, 246, 0.4)',
        // Sombras para modo oscuro
        'dark-sm': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'dark-md': '0 8px 20px rgba(0, 0, 0, 0.25)',
        'dark-lg': '0 12px 30px rgba(0, 0, 0, 0.3)',
        'dark-xl': '0 20px 40px rgba(0, 0, 0, 0.35)',
        'dark-2xl': '0 25px 60px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      keyframes: {
        // Animaciones mejoradas
        fadeIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px) scale(0.95)',
            filter: 'blur(8px)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'translateY(10px) scale(0.98)',
            filter: 'blur(4px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)'
          },
        },
        slideDown: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-50px) scale(0.95)',
            filter: 'blur(6px)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'translateY(8px) scale(1.02)',
            filter: 'blur(2px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)'
          },
        },
        bounceIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(50px) scale(0.8) rotateX(90deg)',
            filter: 'blur(10px)'
          },
          '30%': {
            opacity: '0.6',
            transform: 'translateY(-20px) scale(1.15) rotateX(-15deg)',
            filter: 'blur(4px)'
          },
          '70%': {
            opacity: '0.95',
            transform: 'translateY(-4px) scale(1.05) rotateX(-4deg)',
            filter: 'blur(1px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1) rotateX(0deg)',
            filter: 'blur(0px)'
          },
        },
        glow: {
          '0%, 100%': { 
            opacity: '1',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
          },
          '50%': { 
            opacity: '0.7',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)'
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '25%': { 
            transform: 'translateY(-15px) rotate(1deg)' 
          },
          '50%': { 
            transform: 'translateY(-25px) rotate(0deg)' 
          },
          '75%': { 
            transform: 'translateY(-15px) rotate(-1deg)' 
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(1.05)'
          }
        },
        slideUp: {
          '0%': {
            transform: 'translateY(60px) scale(0.9)',
            opacity: '0',
            filter: 'blur(6px)'
          },
          '40%': {
            transform: 'translateY(-8px) scale(1.03)',
            opacity: '0.7',
            filter: 'blur(2px)'
          },
          '100%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        // Nueva animación para indicar deslizamiento
        nudge: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-10px)' },
          '40%': { transform: 'translateX(10px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        slideDown: 'slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        bounceIn: 'bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        slideUp: 'slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s infinite',
        // Nueva utilidad de animación
        nudge: 'nudge 3s ease-in-out infinite',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
    },
  },
  plugins: [],
};
