import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";

export default function Splash() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;

  useEffect(() => {
    const t = setTimeout(() => router.replace("/auth/onboarding" as any), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View style={[styles.iconBox, { backgroundColor: c.accent }]}>
        <Ionicons name="barbell" size={36} color={c.accentFg} />
      </View>
      <Text style={[styles.title, { color: c.text }]}>SmartFit AI</Text>
      <Text style={[styles.sub, { color: c.textSecondary }]}>Train smarter. Move better.</Text>
      <View style={styles.dotsRow}>
        {[0.3, 0.6, 1].map((op, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: c.textMuted, opacity: op }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  iconBox: { width: 72, height: 72, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  title:   { marginTop: 20, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  sub:     { marginTop: 6, fontSize: 14 },
  dotsRow: { marginTop: 48, flexDirection: "row", gap: 8 },
  dot:     { width: 7, height: 7, borderRadius: 4 },
});
