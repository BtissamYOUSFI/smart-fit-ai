import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { AppThemeProvider, useTheme } from "@/app/context/ThemeContext";
import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator, StatusBar } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const c = theme.colors;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={c.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={c.background} />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/splash" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      {isAuthenticated
        ? <Redirect href="/(tabs)/pages/dashboard" />
        : <Redirect href="/auth/onboarding" />
      }
    </>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </AppThemeProvider>
  );
}
