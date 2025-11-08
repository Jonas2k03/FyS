/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-grad-a': 'var(--bg-grad-a)',
        'bg-grad-b': 'var(--bg-grad-b)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-body': 'var(--text-body)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        subtle: 'var(--subtle)',
        danger: 'var(--danger)',
        'danger-hover': 'var(--danger-hover)',
        warm: 'var(--warm)',
        /* Compatibilidad */
        'color-primary': 'var(--primary)',
        'color-bg': 'var(--bg)',
        'color-surface': 'var(--surface)',
        'color-text': 'var(--text)',
        'color-subtle': 'var(--text-muted)',
      },
    },
  },
  plugins: [],
}

