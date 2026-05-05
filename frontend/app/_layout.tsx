import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useAuth();
    const colorScheme = useColorScheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth/onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                <Stack.Screen name="auth/register" options={{ headerShown: false }} />
                <Stack.Screen name="auth/splash" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
            {isAuthenticated
                ? <Redirect href="/(tabs)/pages/dashboard" />
                : <Redirect href="/auth/onboarding" />
            }
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
//
// import { useColorScheme } from '@/hooks/use-color-scheme';
//
// export const unstable_settings = {
//   anchor: '(tabs)',
// };
//
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
// import { Slot, useRouter, useSegments } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { tokenStorage } from "@/utils/tokenStorage";
//
// export default function RootLayout() {
//     const router = useRouter();
//     const segments = useSegments();
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
//
//     useEffect(() => {
//         const check = async () => {
//             const token = await tokenStorage.get();
//             setIsAuthenticated(!!token);
//         };
//         check();
//     }, []);
//
//     useEffect(() => {
//         if (isAuthenticated === null) return; // encore en vérification
//
//         const inAuthPages = (segments as string[]).some(s =>
//             ["login", "register", "splash", "onboarding"].includes(s)
//         );
//
//         const inProtectedPages = (segments as string[]).some(s =>
//             ["dashboard", "programsList", "profile"].includes(s)
//         );
//
//         if (!isAuthenticated && inProtectedPages) {
//             router.replace("/(tabs)/pages/auth/login");
//         }
//
//         if (isAuthenticated && inAuthPages) {
//             router.replace("/(tabs)/pages/dashboard");
//         }
//     }, [isAuthenticated, segments]);
//
//     if (isAuthenticated === null) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
//                 <ActivityIndicator size="large" color="#3b82f6" />
//             </View>
//         );
//     }
//
//     return <Slot />;
// }