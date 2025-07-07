/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'app-bg': '#0f0f0f',
        'app-bg-light': '#111111',
        'card-base': '#1b1b1b',
        'light-border': '#2a2a2a',
        'text-primary': '#ffffff',
        'text-muted': '#aaaaaa',
        'accent-from': '#666666',
        'accent-to': '#aaaaaa',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        'app': '0 4px 8px rgba(255,255,255,0.03)',
        'lift': '0 8px 16px rgba(255,255,255,0.06)',
        'glow': '0 0 20px rgba(255,255,255,0.1)',
      },
      backdropBlur: {
        'app': '8px',
      },
      transitionTimingFunction: {
        'app': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'scale-in': 'scaleIn 0.18s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
