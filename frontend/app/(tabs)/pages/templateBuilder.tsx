import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type Day = typeof DAYS[number];
const EXERCISES = ["SQUAT", "PUSHUP", "PLANK", "LUNGE", "BICEP", "DEADLIFT"] as const;
type ExerciseType = typeof EXERCISES[number];
interface Slot { type: ExerciseType; reps: number; }

export default function TemplateBuilder() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [plan, setPlan] = useState<Record<Day, Slot[]>>({
        Mon: [{ type: "SQUAT", reps: 12 }], Tue: [], Wed: [{ type: "PUSHUP", reps: 15 }],
        Thu: [], Fri: [{ type: "PLANK", reps: 1 }], Sat: [], Sun: [],
    });
    const [openDay, setOpenDay] = useState<Day | null>(null);
    const [picked, setPicked] = useState<ExerciseType>("SQUAT");
    const [reps, setReps] = useState(10);

    const addToDay = () => {
        if (!openDay) return;
        setPlan((p) => ({ ...p, [openDay]: [...p[openDay], { type: picked, reps }] }));
        setOpenDay(null);
        setReps(10);
    };

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Build your week</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <View style={styles.grid}>
                    {DAYS.map((d) => (
                        <View key={d} style={styles.dayCard}>
                            <Text style={styles.dayLabel}>{d}</Text>
                            {plan[d].length === 0 ? (
                                <TouchableOpacity style={styles.emptyCell} onPress={() => setOpenDay(d)}>
                                    <Text style={styles.emptyCellText}>+</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ gap: 6 }}>
                                    {plan[d].map((s, i) => (
                                        <View key={i} style={styles.slotCard}>
                                            <Text style={styles.slotType}>{s.type}</Text>
                                            <Text style={styles.slotReps}>{s.reps} reps</Text>
                                        </View>
                                    ))}
                                    <TouchableOpacity style={styles.addMoreBtn} onPress={() => setOpenDay(d)}>
                                        <Text style={styles.addMoreText}>+ Add</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.mainButton} onPress={() => router.back()}>
                    <Text style={styles.mainButtonText}>Save & Continue</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={openDay !== null} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <Text style={styles.modalTitle}>Add session for {openDay}</Text>
                        <View style={styles.exerciseGrid}>
                            {EXERCISES.map((e) => (
                                <TouchableOpacity
                                    key={e}
                                    onPress={() => setPicked(e)}
                                    style={[styles.exChip, picked === e && styles.exChipActive]}
                                >
                                    <Text style={{ fontSize: 18 }}>🏋️</Text>
                                    <Text style={[styles.exChipText, picked === e && { color: "#fff" }]}>{e}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.repsLabel}>REPS</Text>
                        <View style={styles.repsRow}>
                            <TouchableOpacity style={styles.repsBtn} onPress={() => setReps((r) => Math.max(1, r - 1))}>
                                <Text style={styles.repsBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.repsValue}>{reps}</Text>
                            <TouchableOpacity style={styles.repsBtn} onPress={() => setReps((r) => r + 1)}>
                                <Text style={styles.repsBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.mainButton} onPress={addToDay}>
                            <Text style={styles.mainButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => setOpenDay(null)}>
                            <Text style={{ color: "#64748b" }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    back: { color: "#3b82f6", fontSize: 16, width: 48 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    dayCard: { width: "47%", backgroundColor: "#1e293b", borderRadius: 12, padding: 12 },
    dayLabel: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginBottom: 8 },
    emptyCell: { height: 80, borderWidth: 2, borderColor: "#334155", borderStyle: "dashed", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    emptyCellText: { fontSize: 24, color: "#64748b" },
    slotCard: { backgroundColor: "#0f172a", borderRadius: 8, padding: 8 },
    slotType: { fontSize: 11, fontWeight: "700", color: "#f1f5f9" },
    slotReps: { fontSize: 10, color: "#64748b" },
    addMoreBtn: { borderWidth: 1, borderColor: "#334155", borderStyle: "dashed", borderRadius: 6, paddingVertical: 4, alignItems: "center" },
    addMoreText: { fontSize: 11, color: "#64748b" },
    mainButton: { marginTop: 24, height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    mainButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
    modalSheet: { backgroundColor: "#1e293b", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9", marginBottom: 16 },
    exerciseGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    exChip: { width: "30%", alignItems: "center", gap: 4, backgroundColor: "#0f172a", borderRadius: 12, padding: 10 },
    exChipActive: { backgroundColor: "#3b82f6" },
    exChipText: { fontSize: 10, fontWeight: "700", color: "#94a3b8" },
    repsLabel: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginTop: 20, marginBottom: 8 },
    repsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 24 },
    repsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
    repsBtnText: { fontSize: 20, color: "#f1f5f9" },
    repsValue: { fontSize: 28, fontWeight: "800", color: "#f1f5f9", width: 56, textAlign: "center" },
});