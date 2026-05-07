import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeMode, lightTheme, darkTheme } from "@/constants/theme";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const THEME_STORAGE_KEY = "smartfit_theme";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((stored) => {
      if (stored === "dark" || stored === "light") {
        setModeState(stored);
      } else if (systemScheme === "dark") {
        setModeState("dark");
      }
      setReady(true);
    });
  }, []);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, m);
  };

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{
      theme: mode === "dark" ? darkTheme : lightTheme,
      mode,
      isDark: mode === "dark",
      toggleTheme,
      setMode,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside AppThemeProvider");
  return ctx;
}
