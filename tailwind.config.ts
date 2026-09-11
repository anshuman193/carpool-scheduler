import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      mobile: '320px',
      tablet: '641px',
      desktop: '1025px',
    },
    extend: {
      colors: {
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
      },
      borderRadius: {
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        soft: '0 18px 40px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}

export default config
