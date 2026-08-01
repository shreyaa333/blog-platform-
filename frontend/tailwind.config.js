/** Inkwell design tokens — matte pink & lavender palette
 *  Colors are driven by CSS variables (see index.css :root / .dark)
 *  so the same class names (bg-paper, text-ink, etc.) work in both themes.
 */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        "paper-2": "rgb(var(--c-paper-2) / <alpha-value>)",
        signal: "rgb(var(--c-signal) / <alpha-value>)",
        "signal-dark": "rgb(var(--c-signal-dark) / <alpha-value>)",
        teal: "rgb(var(--c-teal) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        stone: "rgb(var(--c-stone) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        drawLine: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease both",
        fadeIn: "fadeIn 0.4s ease both",
        drawLine: "drawLine 0.8s ease both",
      },
    },
  },
  plugins: [],
};
