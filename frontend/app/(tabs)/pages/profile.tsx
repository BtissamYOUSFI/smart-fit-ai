import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
    const router = useRouter();
    const [push, setPush] = useState(true);
    const [dark, setDark] = useState(false);

    const user = { name: "Btissam", email: "btissam@example.com" };

    const initials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const handleLogout = () => {
        router.replace("/(tabs)/pages/auth/onboarding" as any);
    };

    return (
        <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(user.name)}</Text>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                {[{ v: "12", l: "Sessions" }, { v: "74.2", l: "Avg Score" }, { v: "3", l: "Programs" }].map((s) => (
                    <View key={s.l} style={styles.statCard}>
                        <Text style={styles.statValue}>{s.v}</Text>
                        <Text style={styles.statLabel}>{s.l}</Text>
                    </View>
                ))}
            </View>

            {/* Personal info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
                <View style={styles.card}>
                    {[{ l: "Name", v: user.name }, { l: "Email", v: user.email }].map((row, i, arr) => (
                        <View key={row.l} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
                            <View>
                                <Text style={styles.rowLabel}>{row.l}</Text>
                                <Text style={styles.rowValue}>{row.v}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.editIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            {/* Security */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>SECURITY</Text>
                <TouchableOpacity style={[styles.card, styles.row]}>
                    <Text style={styles.rowValue}>Change password</Text>
                    <Text style={{ color: "#64748b" }}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>PREFERENCES</Text>
                <View style={styles.card}>
                    <View style={[styles.row, styles.rowBorder]}>
                        <Text style={styles.rowValue}>Push notifications</Text>
                        <Switch value={push} onValueChange={setPush} trackColor={{ true: "#3b82f6" }} />
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowValue}>Dark mode</Text>
                        <Switch value={dark} onValueChange={setDark} trackColor={{ true: "#3b82f6" }} />
                    </View>
                </View>
            </View>

            {/* Logout */}
            <View style={[styles.section, { marginBottom: 40 }]}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪  Log out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    header: { alignItems: "center", backgroundColor: "#0f172a", paddingTop: 56, paddingBottom: 32 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 24, fontWeight: "800", color: "#fff" },
    name: { marginTop: 12, fontSize: 20, fontWeight: "700", color: "#fff" },
    email: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
    statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: -16 },
    statCard: { flex: 1, backgroundColor: "#1e293b", borderRadius: 12, padding: 12, alignItems: "center" },
    statValue: { fontSize: 18, fontWeight: "800", color: "#f1f5f9" },
    statLabel: { fontSize: 10, fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginTop: 2 },
    section: { marginTop: 20, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginBottom: 8 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, overflow: "hidden" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: "#334155" },
    rowLabel: { fontSize: 10, fontWeight: "600", color: "#64748b", textTransform: "uppercase" },
    rowValue: { fontSize: 14, fontWeight: "600", color: "#f1f5f9" },
    editIcon: { fontSize: 14 },
    logoutButton: { height: 52, backgroundColor: "#ef4444", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    logoutText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});