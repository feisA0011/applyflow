export const colors = {
  bg: {
    primary: "#FAFAF8",
    secondary: "#F5F3EF",
    tertiary: "#EDEAE4",
    inverse: "#1C1917",
  },
  text: {
    primary: "#1C1917",
    secondary: "#57534E",
    muted: "#A8A29E",
  },
  accent: {
    default: "#0D9488",
    light: "#CCFBF1",
    hover: "#0F766E",
  },
} as const;

export const fonts = {
  display: "Fraunces, serif",
  body: "General Sans, sans-serif",
  mono: "JetBrains Mono, monospace",
} as const;

export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(28, 25, 23, 0.06)",
  md: "0 4px 8px rgba(28, 25, 23, 0.08)",
  lg: "0 8px 24px rgba(28, 25, 23, 0.10)",
  xl: "0 16px 48px rgba(28, 25, 23, 0.12)",
} as const;
