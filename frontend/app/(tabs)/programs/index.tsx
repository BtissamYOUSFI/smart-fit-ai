import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { mockPrograms } from "@/mocks/programs";

const statusColors: Record<string, { bg: string; text: string }> = {
    Active:   { bg: "#1e3a5f", text: "#3b82f6" },
    Upcoming: { bg: "#1e293b", text: "#64748b" },
    Completed:{ bg: "#14532d", text: "#22c55e" },
};

export default function ProgramsList() {
    const router = useRouter();

    return (
        <View style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>My Programs</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/programs/create" as any)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {mockPrograms.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={styles.emptyTitle}>No programs yet</Text>
                        <Text style={styles.emptyDesc}>Create your first program to get started.</Text>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push("/programs/create" as any)}
                        >
                            <Text style={styles.outlineButtonText}>Create your first program</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    mockPrograms.map((p) => {
                        const sc = statusColors[p.status] ?? statusColors.Upcoming;
                        return (
                            <TouchableOpacity
                                key={p.id}
                                style={styles.card}
                                onPress={() =>
                                    router.push({
                                        pathname: "/programs/[id]",
                                        params: {
                                            id: p.id,
                                        },
                                    })
                                }
                            >
                                <View style={styles.cardTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
                                        <Text style={styles.cardDate}>{p.startDate} → {p.endDate}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                                        <Text style={[styles.badgeText, { color: sc.text }]}>{p.status}</Text>
                                    </View>
                                </View>
                                {/* Progress bar */}
                                <View style={styles.progressBg}>
                                    <View style={[styles.progressFill, { width: `${p.completionRate}%` as any }]} />
                                </View>
                                <Text style={styles.progressLabel}>{p.completionRate}% complete</Text>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
    addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    addButtonText: { color: "#fff", fontSize: 24, lineHeight: 28 },
    list: { padding: 16, gap: 12 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16 },
    cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
    cardTitle: { fontSize: 15, fontWeight: "700", color: "#f1f5f9" },
    cardDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
    badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    progressBg: { height: 6, backgroundColor: "#334155", borderRadius: 3 },
    progressFill: { height: 6, backgroundColor: "#3b82f6", borderRadius: 3 },
    progressLabel: { fontSize: 11, color: "#64748b", marginTop: 6 },
    empty: { alignItems: "center", paddingTop: 80 },
    emptyTitle: { fontSize: 16, fontWeight: "700", color: "#f1f5f9" },
    emptyDesc: { fontSize: 13, color: "#64748b", marginTop: 4 },
    outlineButton: { marginTop: 16, borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
    outlineButtonText: { color: "#3b82f6", fontWeight: "600" },
});