/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#005cac",
        "primary-container": "#2375cf",
        "primary-fixed": "#d5e3ff",
        "primary-fixed-dim": "#a6c8ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#fefcff",
        "on-primary-fixed": "#001c3b",
        "on-primary-fixed-variant": "#004787",
        "inverse-primary": "#a6c8ff",

        "secondary": "#525f71",
        "secondary-container": "#d3e1f6",
        "secondary-fixed": "#d6e4f9",
        "secondary-fixed-dim": "#bac8dc",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#566475",
        "on-secondary-fixed": "#0f1c2c",
        "on-secondary-fixed-variant": "#3a4859",

        "surface": "#f9f9ff",
        "surface-bg": "#F8FAFC",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#d8dae2",
        "surface-container": "#ecedf6",
        "surface-container-low": "#f2f3fb",
        "surface-container-high": "#e6e8f0",
        "surface-container-highest": "#e1e2ea",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e1e2ea",
        "surface-tint": "#005eb1",

        "on-surface": "#191c21",
        "on-surface-variant": "#414752",
        "inverse-surface": "#2d3037",
        "inverse-on-surface": "#eff0f8",

        "background": "#f9f9ff",
        "on-background": "#191c21",

        "outline": "#717783",
        "outline-variant": "#c1c6d4",
        "border-subtle": "#E2E8F0",

        "safe-green": "#28A745",
        "caution-amber": "#F59E0B",
        "risk-red": "#DC3545",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "tertiary": "#8e4a00",
        "tertiary-container": "#b25f00",
        "tertiary-fixed": "#ffdcc4",
        "tertiary-fixed-dim": "#ffb77f",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",

        // Dark theme specific palettes
        "dark-bg": "#0f131c",
        "dark-surface": "#181b25",
        "dark-card": "#1c1f29",
        "dark-border": "#262a34"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "gutter": "24px",
        "stack-gap": "1rem",
        "section-gap": "2.5rem",
        "container-max-width": "1440px"
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
        display: ['"Hanken Grotesk"', 'sans-serif']
      }
    }
  },
  plugins: []
};
