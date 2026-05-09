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
    background:      "#FFFFFF",
    surface:         "#F0FDF4",
    surfaceElevated: "#DCFCE7",
    text:            "#0A1A10",
    textSecondary:   "#166534",
    textMuted:       "#4D8A63",
    border:          "#BBF7D0",
    borderStrong:    "#86EFAC",
    accent:          "#16A34A",
    accentFg:        "#FFFFFF",
    success:         "#15803D",
    successBg:       "#F0FDF4",
    warning:         "#D97706",
    warningBg:       "#FFFBEB",
    error:           "#DC2626",
    errorBg:         "#FEF2F2",
    blue:            "#2563EB",
    blueBg:          "#EFF6FF",
    overlay:         "rgba(0,0,0,0.45)",
    tabBar:          "#FFFFFF",
    tabBarBorder:    "#BBF7D0",
    inputBg:         "#F7FEF9",
    placeholder:     "#4D8A63",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background:      "#080C0A",
    surface:         "#0E1612",
    surfaceElevated: "#162117",
    text:            "#ECFDF5",
    textSecondary:   "#A3D9B8",
    textMuted:       "#6AAF88",
    border:          "#1E3D28",
    borderStrong:    "#2D5C3C",
    accent:          "#4ADE80",
    accentFg:        "#052E16",
    success:         "#22C55E",
    successBg:       "#052E16",
    warning:         "#F59E0B",
    warningBg:       "#1C1007",
    error:           "#EF4444",
    errorBg:         "#1C0607",
    blue:            "#3B82F6",
    blueBg:          "#172554",
    overlay:         "rgba(0,0,0,0.75)",
    tabBar:          "#080C0A",
    tabBarBorder:    "#1E3D28",
    inputBg:         "#0E1612",
    placeholder:     "#4D8A63",
  },
};
