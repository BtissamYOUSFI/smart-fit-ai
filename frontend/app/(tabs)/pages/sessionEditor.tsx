import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const EXERCISES = ["SQUAT", "PUSHUP", "PLANK", "LUNGE", "BICEP", "DEADLIFT"] as const;
type ExerciseType = typeof EXERCISES[number];

interface Row { id: string; type: ExerciseType; reps: number; }

export default function SessionEditor() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [rows, setRows] = useState<Row[]>([
        { id: "r1", type: "SQUAT", reps: 12 },
        { id: "r2", type: "LUNGE", reps: 10 },
        { id: "r3", type: "PLANK", reps: 1 },
    ]);
    const [modalOpen, setModalOpen] = useState(false);
    const [picked, setPicked] = useState<ExerciseType>("SQUAT");
    const [reps, setReps] = useState(10);

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Back</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Edit Session</Text>
                    <Text style={styles.headerSub}>Monday</Text>
                </View>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <View style={{ gap: 8 }}>
                    {rows.map((r) => (
                        <View key={r.id} style={styles.exRow}>
                            <Text style={styles.grip}>⋮⋮</Text>
                            <View style={styles.exIcon}><Text>🏋️</Text></View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.exName}>{r.type}</Text>
                                <Text style={styles.exReps}>{r.reps} reps planned</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                                style={styles.deleteBtn}
                            >
                                <Text style={styles.deleteBtnText}>🗑️</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={[styles.outlineButton, { marginTop: 16 }]} onPress={() => setModalOpen(true)}>
                    <Text style={styles.outlineButtonText}>+  Add exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.mainButtonText}>Save changes</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal */}
            <Modal visible={modalOpen} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <Text style={styles.modalTitle}>Add exercise</Text>
                        <View style={styles.exerciseGrid}>
                            {EXERCISES.map((e) => (
                                <TouchableOpacity
                                    key={e}
                                    onPress={() => setPicked(e)}
                                    style={[styles.exChip, picked === e && styles.exChipActive]}
                                >
                                    <Text style={{ fontSize: 20 }}>🏋️</Text>
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
                        <TouchableOpacity
                            style={styles.mainButton}
                            onPress={() => {
                                setRows((rs) => [...rs, { id: `r-${Date.now()}`, type: picked, reps }]);
                                setModalOpen(false);
                                setReps(10);
                            }}
                        >
                            <Text style={styles.mainButtonText}>Add to session</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => setModalOpen(false)}>
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
    headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9", textAlign: "center" },
    headerSub: { fontSize: 12, color: "#64748b", textAlign: "center" },
    exRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#1e293b", borderRadius: 12, padding: 12 },
    grip: { color: "#64748b", fontSize: 16 },
    exIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#1e3a5f", alignItems: "center", justifyContent: "center" },
    exName: { fontSize: 13, fontWeight: "700", color: "#f1f5f9" },
    exReps: { fontSize: 11, color: "#64748b" },
    deleteBtn: { padding: 4 },
    deleteBtnText: { fontSize: 16 },
    outlineButton: { borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, height: 44, alignItems: "center", justifyContent: "center" },
    outlineButtonText: { color: "#3b82f6", fontWeight: "600" },
    mainButton: { marginTop: 12, height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
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