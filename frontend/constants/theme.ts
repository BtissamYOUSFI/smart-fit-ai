export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentFg: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  blue: string;
  blueBg: string;
  overlay: string;
  tabBar: string;
  tabBarBorder: string;
  tabBarActive: string;
  inputBg: string;
  placeholder: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background:      "#F1F4F8",
    surface:         "#FFFFFF",
    surfaceElevated: "#EDF0F5",
    text:            "#1B2D4F",
    textSecondary:   "#4A5878",
    textMuted:       "#8998B4",
    border:          "#E4E8F0",
    borderStrong:    "#C8D1E0",
    accent:          "#1B2D4F",
    accentFg:        "#FFFFFF",
    success:         "#22C55E",
    successBg:       "#F0FDF4",
    warning:         "#F97316",
    warningBg:       "#FFF7ED",
    error:           "#EF4444",
    errorBg:         "#FEF2F2",
    blue:            "#4F74F4",
    blueBg:          "#EEF2FF",
    overlay:         "rgba(0,0,0,0.45)",
    tabBar:          "#1B2D4F",
    tabBarBorder:    "#243660",
    tabBarActive:    "#FF6930",
    inputBg:         "#F8FAFC",
    placeholder:     "#8998B4",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background:      "#0D1520",
    surface:         "#162033",
    surfaceElevated: "#1E2D44",
    text:            "#F0F4FC",
    textSecondary:   "#B8C5D8",
    textMuted:       "#6E7E99",
    border:          "#1E2D44",
    borderStrong:    "#283D5C",
    accent:          "#4F74F4",
    accentFg:        "#FFFFFF",
    success:         "#22C55E",
    successBg:       "#052E16",
    warning:         "#F97316",
    warningBg:       "#1C0A03",
    error:           "#EF4444",
    errorBg:         "#1C0607",
    blue:            "#4F74F4",
    blueBg:          "#0D1A4A",
    overlay:         "rgba(0,0,0,0.75)",
    tabBar:          "#0D1520",
    tabBarBorder:    "#162033",
    tabBarActive:    "#FF6930",
    inputBg:         "#162033",
    placeholder:     "#6E7E99",
  },
};
