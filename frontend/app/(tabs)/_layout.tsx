// import { Tabs } from 'expo-router';
// import React from 'react';
//
// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';
//
// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: "#1e293b", borderTopColor: "#334155" },
                tabBarActiveTintColor: "#3b82f6",
                tabBarInactiveTintColor: "#64748b",
            }}
        >
            <Tabs.Screen name="pages/dashboard" options={{ title: "Home", tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} /> }} />
            <Tabs.Screen name="pages/programsList" options={{ title: "Programs", tabBarIcon: ({ color }) => <TabIcon emoji="📅" color={color} /> }} />
            <Tabs.Screen name="pages/profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }} />

            {/* Pages cachées de la tab bar */}
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="explore" options={{ href: null }} />
            <Tabs.Screen name="pages/auth/splash" options={{ href: null }} />
            <Tabs.Screen name="pages/auth/onboarding" options={{ href: null }} />
            <Tabs.Screen name="pages/auth/login" options={{ href: null }} />
            <Tabs.Screen name="pages/auth/register" options={{ href: null }} />
            <Tabs.Screen name="pages/createProgram" options={{ href: null }} />
            <Tabs.Screen name="pages/programDetail" options={{ href: null }} />
            <Tabs.Screen name="pages/templateBuilder" options={{ href: null }} />
            <Tabs.Screen name="pages/sessionEditor" options={{ href: null }} />
            <Tabs.Screen name="pages/sessionDetail" options={{ href: null }} />
        </Tabs>
    );
}
function TabIcon({ emoji, color }: { emoji: string; color: string }) {
    return (
        <Text style={{ fontSize: 20, opacity: color === "#3b82f6" ? 1 : 0.5 }}>{emoji}</Text>
    );
}