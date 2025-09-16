/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular'],
      },
      colors: {
        primary: {
          50: '#f1f7ff',
          100: '#dbe7ff',
          200: '#bfd4ff',
          300: '#95b9ff',
          400: '#6695ff',
          500: '#386bff',
          600: '#1f4df2',
          700: '#163ed0',
          800: '#1737a7',
          900: '#172f86',
        },
        accent: {
          400: '#50e3c2',
          500: '#2dd4bf',
          600: '#14b8a6',
        },
        background: '#05060a',
        surface: 'rgba(15, 17, 26, 0.85)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(80, 227, 194, 0.45)',
        panel: '0 20px 50px rgba(8, 12, 30, 0.45)',
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(80, 227, 194, 0.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
