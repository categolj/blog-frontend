/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Define color tokens that change based on mode
        'fg': 'var(--fg)',
        'fg2': 'var(--fg2)',
        'bg': 'var(--bg)',
        'code-fg': 'var(--code-fg)',
        'code-bg': 'var(--code-bg)',
        'meta': 'var(--meta)',
      },
      fontFamily: {
        'mono': ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '13px',
      },
    },
  },
  plugins: [],
}
