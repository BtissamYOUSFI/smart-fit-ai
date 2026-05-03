import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { mockPrograms } from "@/mocks/programs";

function getScoreBg(score: number) {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
}

export default function SessionDetail() {
    const { id, weekId, sessionId } = useLocalSearchParams<{ id: string; weekId: string; sessionId: string }>();
    const router = useRouter();

    const initial = useMemo(() => {
        const p = mockPrograms.find((x) => x.id === id) ?? mockPrograms[0];
        const w = p.weeks.find((x: any) => x.id === weekId) ?? p.weeks[0];
        return w.sessions.find((x: any) => x.id === sessionId) ?? w.sessions[0];
    }, [id, weekId, sessionId]);

    const [exercises, setExercises] = useState<any[]>(initial.exercises);
    const [busyId, setBusyId] = useState<string | null>(null);

    const allScored = exercises.every((e) => typeof e.score === "number");

    const analyze = (exId: string) => {
        setBusyId(exId);
        setTimeout(() => {
            setExercises((es) =>
                es.map((e) => e.id === exId ? { ...e, status: "Scored", score: Math.round(40 + Math.random() * 55) } : e)
            );
            setBusyId(null);
        }, 900);
    };

    const dateLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{dateLabel}</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <View style={styles.sessionMeta}>
                    <Text style={styles.sessionName}>{initial.name}</Text>
                    <View style={[styles.badge, { backgroundColor: allScored ? "#14532d" : busyId ? "#1e3a5f" : "#1e293b" }]}>
                        <Text style={[styles.badgeText, { color: allScored ? "#22c55e" : busyId ? "#3b82f6" : "#94a3b8" }]}>
                            {allScored ? "Completed" : busyId ? "In Progress" : "Planned"}
                        </Text>
                    </View>
                </View>

                <View style={{ gap: 8 }}>
                    {exercises.map((ex) => (
                        <View key={ex.id} style={styles.exRow}>
                            <View style={styles.exIcon}><Text>🏋️</Text></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.exName}>{ex.type}</Text>
                                <Text style={styles.exReps}>Planned: {ex.plannedReps} reps</Text>
                            </View>
                            {typeof ex.score === "number" ? (
                                <View style={[styles.scoreBadge, { backgroundColor: getScoreBg(ex.score) }]}>
                                    <Text style={styles.scoreText}>{ex.score}</Text>
                                </View>
                            ) : busyId === ex.id ? (
                                <ActivityIndicator color="#3b82f6" />
                            ) : (
                                <TouchableOpacity style={styles.analyzeBtn} onPress={() => analyze(ex.id)}>
                                    <Text style={styles.analyzeBtnText}>Analyze</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={[styles.mainButton, { backgroundColor: allScored ? "#22c55e" : "#3b82f6" }]}>
                    <Text style={styles.mainButtonText}>{allScored ? "✓  Complete Session" : "▶  Start Session"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    back: { color: "#3b82f6", fontSize: 16, width: 48 },
    headerTitle: { fontSize: 15, fontWeight: "700", color: "#f1f5f9", flex: 1, textAlign: "center" },
    sessionMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    sessionName: { fontSize: 15, fontWeight: "700", color: "#f1f5f9" },
    badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    exRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1e293b", borderRadius: 12, padding: 12 },
    exIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#1e3a5f", alignItems: "center", justifyContent: "center" },
    exName: { fontSize: 13, fontWeight: "700", color: "#f1f5f9" },
    exReps: { fontSize: 11, color: "#64748b" },
    scoreBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    scoreText: { color: "#fff", fontWeight: "700", fontSize: 12 },
    analyzeBtn: { borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    analyzeBtnText: { color: "#3b82f6", fontSize: 12, fontWeight: "600" },
    mainButton: { marginTop: 24, height: 52, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    mainButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});