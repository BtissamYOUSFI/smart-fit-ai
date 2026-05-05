import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { fetchAllPrograms, deleteProgramById, ApiError } from "@/app/shared/service/trainingProgramApi";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";

const statusColors: Record<string, { bg: string; text: string }> = {
    Active:    { bg: "#1e3a5f", text: "#3b82f6" },
    Upcoming:  { bg: "#1e293b", text: "#64748b" },
    Completed: { bg: "#14532d", text: "#22c55e" },
};

function deriveStatus(p: TrainingProgram): string {
    const today = new Date().toISOString().split("T")[0];
    if (p.endDate < today) return "Completed";
    if (p.startDate <= today) return "Active";
    return "Upcoming";
}

function completionRate(p: TrainingProgram): number {
    const today = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    if (today < start) return 0;
    if (today > end) return 100;
    const total = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
}

export default function ProgramsList() {
    const router = useRouter();
    const [programs, setPrograms] = useState<TrainingProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPrograms = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            setError(null);
            const data = await fetchAllPrograms();
            setPrograms(data);
        } catch (err) {
            const msg = err instanceof ApiError ? err.message : "Failed to load programs.";
            setError(msg);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadPrograms(); }, [loadPrograms]);

    const handleDelete = (p: TrainingProgram) => {
        Alert.alert(
            "Delete Program",
            `Are you sure you want to delete "${p.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProgramById(p.id);
                            setPrograms((prev) => prev.filter((x) => x.id !== p.id));
                        } catch (err) {
                            const msg = err instanceof ApiError ? err.message : "Failed to delete program.";
                            Alert.alert("Error", msg);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={[styles.root, styles.centered]}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading programs…</Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.title}>My Programs</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => router.push("/programs/create" as any)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => loadPrograms()}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            <ScrollView
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadPrograms(true)}
                        tintColor="#3b82f6"
                    />
                }
            >
                {programs.length === 0 && !error ? (
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
                    programs.map((p) => {
                        const status = deriveStatus(p);
                        const sc = statusColors[status] ?? statusColors.Upcoming;
                        const rate = completionRate(p);
                        return (
                            <TouchableOpacity
                                key={p.id}
                                style={styles.card}
                                onPress={() =>
                                    router.push({
                                        pathname: "/programs/[id]",
                                        params: { id: String(p.id) },
                                    })
                                }
                                onLongPress={() => handleDelete(p)}
                            >
                                <View style={styles.cardTop}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
                                        <Text style={styles.cardDate}>{p.startDate} → {p.endDate}</Text>
                                    </View>
                                    <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                                        <Text style={[styles.badgeText, { color: sc.text }]}>{status}</Text>
                                    </View>
                                </View>
                                <View style={styles.progressBg}>
                                    <View style={[styles.progressFill, { width: `${rate}%` as any }]} />
                                </View>
                                <Text style={styles.progressLabel}>{rate}% complete</Text>
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
    centered: { alignItems: "center", justifyContent: "center" },
    loadingText: { color: "#64748b", marginTop: 12, fontSize: 14 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
    addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    addButtonText: { color: "#fff", fontSize: 24, lineHeight: 28 },
    errorBanner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#450a0a", marginHorizontal: 16, marginBottom: 8, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: "#ef4444" },
    errorText: { color: "#fca5a5", fontSize: 13, flex: 1 },
    retryText: { color: "#3b82f6", fontSize: 13, fontWeight: "600", marginLeft: 12 },
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

// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
// import { mockPrograms } from "@/mocks/programs";
//
// const statusColors: Record<string, { bg: string; text: string }> = {
//     Active:   { bg: "#1e3a5f", text: "#3b82f6" },
//     Upcoming: { bg: "#1e293b", text: "#64748b" },
//     Completed:{ bg: "#14532d", text: "#22c55e" },
// };
//
// export default function ProgramsList() {
//     const router = useRouter();
//
//     return (
//         <View style={styles.root}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <Text style={styles.title}>My Programs</Text>
//                 <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={() => router.push("/programs/create" as any)}
//                 >
//                     <Text style={styles.addButtonText}>+</Text>
//                 </TouchableOpacity>
//             </View>
//
//             <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
//                 {mockPrograms.length === 0 ? (
//                     <View style={styles.empty}>
//                         <Text style={styles.emptyTitle}>No programs yet</Text>
//                         <Text style={styles.emptyDesc}>Create your first program to get started.</Text>
//                         <TouchableOpacity
//                             style={styles.outlineButton}
//                             onPress={() => router.push("/programs/create" as any)}
//                         >
//                             <Text style={styles.outlineButtonText}>Create your first program</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     mockPrograms.map((p) => {
//                         const sc = statusColors[p.status] ?? statusColors.Upcoming;
//                         return (
//                             <TouchableOpacity
//                                 key={p.id}
//                                 style={styles.card}
//                                 onPress={() =>
//                                     router.push({
//                                         pathname: "/programs/[id]",
//                                         params: {
//                                             id: p.id,
//                                         },
//                                     })
//                                 }
//                             >
//                                 <View style={styles.cardTop}>
//                                     <View style={{ flex: 1 }}>
//                                         <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
//                                         <Text style={styles.cardDate}>{p.startDate} → {p.endDate}</Text>
//                                     </View>
//                                     <View style={[styles.badge, { backgroundColor: sc.bg }]}>
//                                         <Text style={[styles.badgeText, { color: sc.text }]}>{p.status}</Text>
//                                     </View>
//                                 </View>
//                                 {/* Progress bar */}
//                                 <View style={styles.progressBg}>
//                                     <View style={[styles.progressFill, { width: `${p.completionRate}%` as any }]} />
//                                 </View>
//                                 <Text style={styles.progressLabel}>{p.completionRate}% complete</Text>
//                             </TouchableOpacity>
//                         );
//                     })
//                 )}
//             </ScrollView>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     root: { flex: 1, backgroundColor: "#0f172a" },
//     header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
//     title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
//     addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
//     addButtonText: { color: "#fff", fontSize: 24, lineHeight: 28 },
//     list: { padding: 16, gap: 12 },
//     card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16 },
//     cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
//     cardTitle: { fontSize: 15, fontWeight: "700", color: "#f1f5f9" },
//     cardDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
//     badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
//     badgeText: { fontSize: 11, fontWeight: "600" },
//     progressBg: { height: 6, backgroundColor: "#334155", borderRadius: 3 },
//     progressFill: { height: 6, backgroundColor: "#3b82f6", borderRadius: 3 },
//     progressLabel: { fontSize: 11, color: "#64748b", marginTop: 6 },
//     empty: { alignItems: "center", paddingTop: 80 },
//     emptyTitle: { fontSize: 16, fontWeight: "700", color: "#f1f5f9" },
//     emptyDesc: { fontSize: 13, color: "#64748b", marginTop: 4 },
//     outlineButton: { marginTop: 16, borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
//     outlineButtonText: { color: "#3b82f6", fontWeight: "600" },
// });