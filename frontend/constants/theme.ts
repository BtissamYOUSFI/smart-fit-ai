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
    surface:         "#F5F5F7",
    surfaceElevated: "#EBEBEC",
    text:            "#1A1A1A",
    textSecondary:   "#6B7280",
    textMuted:       "#9CA3AF",
    border:          "#E5E7EB",
    borderStrong:    "#D1D5DB",
    accent:          "#1A1A1A",
    accentFg:        "#FFFFFF",
    success:         "#16A34A",
    successBg:       "#F0FDF4",
    warning:         "#D97706",
    warningBg:       "#FFFBEB",
    error:           "#DC2626",
    errorBg:         "#FEF2F2",
    blue:            "#2563EB",
    blueBg:          "#EFF6FF",
    overlay:         "rgba(0,0,0,0.45)",
    tabBar:          "#FFFFFF",
    tabBarBorder:    "#E5E7EB",
    inputBg:         "#F9FAFB",
    placeholder:     "#9CA3AF",
  },
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: {
    background:      "#0A0A0A",
    surface:         "#161616",
    surfaceElevated: "#1F1F1F",
    text:            "#F4F4F5",
    textSecondary:   "#A1A1AA",
    textMuted:       "#71717A",
    border:          "#27272A",
    borderStrong:    "#3F3F46",
    accent:          "#F4F4F5",
    accentFg:        "#0A0A0A",
    success:         "#22C55E",
    successBg:       "#052E16",
    warning:         "#F59E0B",
    warningBg:       "#1C1007",
    error:           "#EF4444",
    errorBg:         "#1C0607",
    blue:            "#3B82F6",
    blueBg:          "#172554",
    overlay:         "rgba(0,0,0,0.70)",
    tabBar:          "#0A0A0A",
    tabBarBorder:    "#27272A",
    inputBg:         "#161616",
    placeholder:     "#71717A",
  },
};
