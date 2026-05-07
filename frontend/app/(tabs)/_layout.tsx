import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";

type IoniconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, color, focused }: { name: IoniconName; color: string; focused: boolean }) {
  return <Ionicons name={focused ? name : `${name}-outline` as IoniconName} size={22} color={color} />;
}

export default function TabsLayout() {
  const { theme } = useTheme();
  const c = theme.colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: c.tabBar,
          borderTopColor: c.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="pages/dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="programs/index"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, focused }) => <TabIcon name="calendar" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pages/profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabIcon name="person" color={color} focused={focused} />,
        }}
      />

      {/* Hidden from tab bar */}
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
