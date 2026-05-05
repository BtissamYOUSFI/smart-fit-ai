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
            <Tabs.Screen name="programs/index" options={{ title: "Programs", tabBarIcon: ({ color }) => <TabIcon emoji="📅" color={color} /> }} />
            <Tabs.Screen name="pages/profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <TabIcon emoji="👤" color={color} /> }} />

            {/* Pages cachées de la tab bar */}
            <Tabs.Screen name="index" options={{ href: null }} />
            <Tabs.Screen name="explore" options={{ href: null }} />
            <Tabs.Screen name="auth/splash" options={{ href: null }} />
            <Tabs.Screen name="auth/onboarding" options={{ href: null }} />
            <Tabs.Screen name="auth/login" options={{ href: null }} />
            <Tabs.Screen name="auth/register" options={{ href: null }} />
            <Tabs.Screen name="programs/create" options={{ href: null }} />
            <Tabs.Screen name="programs/[id]" options={{ href: null }} />
            <Tabs.Screen name="pages/templateBuilder" options={{ href: null }} />
            <Tabs.Screen name="sessions/editor" options={{ href: null }} />
            <Tabs.Screen name="sessions/[id]" options={{ href: null }} />
        </Tabs>
    );
}
function TabIcon({ emoji, color }: { emoji: string; color: string }) {
    return (
        <Text style={{ fontSize: 20, opacity: color === "#3b82f6" ? 1 : 0.5 }}>{emoji}</Text>
    );
}