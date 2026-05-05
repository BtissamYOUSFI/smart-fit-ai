import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchProgramById, deleteProgramById, ApiError } from "@/app/shared/service/trainingProgramApi";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export default function ProgramDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [program, setProgram] = useState<TrainingProgram | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<"template" | "weeks">("template");
    const [openWeek, setOpenWeek] = useState<string | null>(null);

    const loadProgram = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProgramById(Number(id));
            setProgram(data);
        } catch (err) {
            const msg = err instanceof ApiError ? err.message : "Failed to load program.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { loadProgram(); }, [loadProgram]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Program",
            `Are you sure you want to delete "${program?.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteProgramById(Number(id));
                            router.back();
                        } catch (err) {
                            const msg = err instanceof ApiError ? err.message : "Failed to delete program.";
                            Alert.alert("Error", msg);
                        }
                    },
                },
            ]
        );
    };

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[styles.root, styles.centered]}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading program…</Text>
            </View>
        );
    }

    // ── Error state ────────────────────────────────────────────────────────────
    if (error || !program) {
        return (
            <View style={[styles.root, styles.centered]}>
                <Text style={styles.errorTitle}>⚠️</Text>
                <Text style={styles.errorTitle}>{error ?? "Program not found."}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadProgram}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
                    <Text style={styles.backLink}>← Back to programs</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── Derived values ─────────────────────────────────────────────────────────
    const templateWeek = program.weeklyTemplates?.[0];
    const today = new Date().toISOString().split("T")[0];
    const isActive = program.startDate <= today && program.endDate >= today;

    return (
        <View style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{program.title}</Text>
                <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteBtn}>🗑</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* Info card */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <View>
                            <Text style={styles.sectionTitle}>Schedule</Text>
                            <Text style={styles.cardValue}>{program.startDate} → {program.endDate}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: isActive ? "#1e3a5f" : "#14532d" }]}>
                            <Text style={[styles.badgeText, { color: isActive ? "#3b82f6" : "#22c55e" }]}>
                                {isActive ? "Active" : "Completed"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.sectionTitle}>Weekly templates</Text>
                            <Text style={styles.statBig}>{program.weeklyTemplates?.length ?? 0}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.sectionTitle}>Program weeks</Text>
                            <Text style={styles.statBig}>{program.programWeeks?.length ?? 0}</Text>
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    {(["template", "weeks"] as const).map((t) => (
                        <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
                            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                                {t === "template" ? "Templates" : "Weeks"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Template tab */}
                {tab === "template" && (
                    <View>
                        {!templateWeek ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No templates yet.</Text>
                            </View>
                        ) : (
                            <View style={styles.calendarGrid}>
                                {DAYS.map((d) => (
                                    <Text key={d} style={styles.dayHeader}>{d}</Text>
                                ))}
                                {DAYS.map((d) => {
                                    const sessions = (templateWeek as any).sessions?.filter((s: any) => s.day === d) ?? [];
                                    return (
                                        <View key={d} style={[styles.dayCell, { backgroundColor: sessions.length ? "#1e3a5f" : "#1e293b" }]}>
                                            {sessions.length === 0 ? (
                                                <Text style={styles.dayCellEmpty}>—</Text>
                                            ) : (
                                                sessions.map((s: any) => (
                                                    <Text key={s.id} style={styles.dayCellText} numberOfLines={2}>{s.name}</Text>
                                                ))
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.push(`/(tabs)/pages/templateBuilder?id=${program.id}` as any)}
                        >
                            <Text style={styles.outlineButtonText}>✏️  Edit template</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Weeks tab */}
                {tab === "weeks" && (
                    <View style={{ gap: 8 }}>
                        {(!program.programWeeks || program.programWeeks.length === 0) ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateText}>No weeks generated yet.</Text>
                            </View>
                        ) : (
                            program.programWeeks.map((w: any) => {
                                const open = openWeek === String(w.id);
                                return (
                                    <View key={w.id} style={styles.card}>
                                        <TouchableOpacity
                                            style={styles.weekRow}
                                            onPress={() => setOpenWeek(open ? null : String(w.id))}
                                        >
                                            <Text style={styles.cardValue}>Week {w.index ?? w.weekNumber}</Text>
                                            <Text style={{ color: "#64748b" }}>{open ? "▲" : "▼"}</Text>
                                        </TouchableOpacity>
                                        {open && (
                                            <View style={{ borderTopWidth: 1, borderTopColor: "#334155", paddingTop: 12, gap: 8 }}>
                                                {(w.sessions ?? []).map((s: any) => (
                                                    <View key={s.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                        <View>
                                                            <Text style={{ fontSize: 11, color: "#64748b" }}>{s.day}</Text>
                                                            <Text style={styles.cardValue}>{s.name}</Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                router.push({
                                                                    pathname: "/sessions/[id]",
                                                                    params: { id: s.id, programId: program.id, weekId: w.id },
                                                                })
                                                            }
                                                        >
                                                            <Text style={{ color: "#3b82f6", fontSize: 13, fontWeight: "600" }}>Open</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    centered: { alignItems: "center", justifyContent: "center" },
    loadingText: { color: "#64748b", marginTop: 12, fontSize: 14 },
    errorTitle: { fontSize: 15, fontWeight: "700", color: "#fca5a5", textAlign: "center", marginHorizontal: 32 },
    retryButton: { marginTop: 16, borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
    retryButtonText: { color: "#3b82f6", fontWeight: "600" },
    backLink: { color: "#64748b", fontSize: 13 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    back: { color: "#3b82f6", fontSize: 16, width: 48 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9", flex: 1, textAlign: "center" },
    deleteBtn: { fontSize: 18, width: 36, textAlign: "right" },
    card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 8 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    sectionTitle: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, textTransform: "uppercase" },
    cardValue: { fontSize: 14, fontWeight: "600", color: "#f1f5f9", marginTop: 2 },
    statsGrid: { flexDirection: "row", gap: 8, marginTop: 12 },
    statBox: { flex: 1, backgroundColor: "#0f172a", borderRadius: 8, padding: 10 },
    statBig: { fontSize: 18, fontWeight: "700", color: "#f1f5f9" },
    tabs: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 10, padding: 4, marginVertical: 16 },
    tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
    tabActive: { backgroundColor: "#0f172a" },
    tabText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
    tabTextActive: { color: "#f1f5f9" },
    calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
    dayHeader: { width: "13%", textAlign: "center", fontSize: 9, fontWeight: "700", color: "#64748b" },
    dayCell: { width: "13%", minHeight: 80, borderRadius: 6, padding: 4, alignItems: "center", justifyContent: "center" },
    dayCellEmpty: { fontSize: 10, color: "#64748b" },
    dayCellText: { fontSize: 8, fontWeight: "700", color: "#f1f5f9", textAlign: "center" },
    badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    outlineButton: { borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignItems: "center", marginTop: 8 },
    outlineButtonText: { color: "#3b82f6", fontWeight: "600", fontSize: 13 },
    weekRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    emptyState: { alignItems: "center", paddingVertical: 32 },
    emptyStateText: { color: "#64748b", fontSize: 14 },
});

// import { useMemo, useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { mockPrograms } from "@/mocks/programs";
//
// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
//
// const statusColors: Record<string, { bg: string; text: string }> = {
//     Modified: { bg: "#451a03", text: "#f59e0b" },
//     Active:   { bg: "#1e3a5f", text: "#3b82f6" },
//     Completed:{ bg: "#14532d", text: "#22c55e" },
// };
//
// export default function ProgramDetail() {
//     const { id } = useLocalSearchParams<{ id: string }>();
//     const router = useRouter();
//     const program = useMemo(() => mockPrograms.find((p) => p.id === id), [id]);
//     const [tab, setTab] = useState<"template" | "weeks">("template");
//     const [openWeek, setOpenWeek] = useState<string | null>(null);
//
//     if (!program) {
//         return (
//             <View style={styles.root}>
//                 <Text style={styles.notFound}>Program not found.</Text>
//             </View>
//         );
//     }
//
//     const templateWeek = program.weeks[0];
//
//     return (
//         <View style={styles.root}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Text style={styles.back}>‹ Back</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle} numberOfLines={1}>{program.title}</Text>
//                 <View style={{ width: 48 }} />
//             </View>
//
//             <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//                 {/* Info card */}
//                 <View style={styles.card}>
//                     <View style={styles.infoRow}>
//                         <View>
//                             <Text style={styles.sectionTitle}>SCHEDULE</Text>
//                             <Text style={styles.cardValue}>{program.startDate} → {program.endDate}</Text>
//                         </View>
//                         {program.globalScore > 0 && (
//                             <View style={[styles.scoreBadge, { backgroundColor: program.globalScore >= 75 ? "#22c55e" : program.globalScore >= 50 ? "#f59e0b" : "#ef4444" }]}>
//                                 <Text style={styles.scoreText}>{Math.round(program.globalScore)}</Text>
//                             </View>
//                         )}
//                     </View>
//                     <View style={styles.statsGrid}>
//                         <View style={styles.statBox}>
//                             <Text style={styles.sectionTitle}>COMPLETION</Text>
//                             <Text style={styles.statBig}>{program.completionRate}%</Text>
//                         </View>
//                         <View style={styles.statBox}>
//                             <Text style={styles.sectionTitle}>WEEKS</Text>
//                             <Text style={styles.statBig}>{program.totalWeeks}</Text>
//                         </View>
//                     </View>
//                 </View>
//
//                 {/* Tabs */}
//                 <View style={styles.tabs}>
//                     {(["template", "weeks"] as const).map((t) => (
//                         <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
//                             <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
//                                 {t === "template" ? "Template" : "By Week"}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//
//                 {tab === "template" ? (
//                     <View>
//                         <View style={styles.calendarGrid}>
//                             {DAYS.map((d) => (
//                                 <Text key={d} style={styles.dayHeader}>{d}</Text>
//                             ))}
//                             {DAYS.map((d) => {
//                                 const sessions = templateWeek.sessions.filter((s: any) => s.day === d);
//                                 return (
//                                     <View key={d} style={[styles.dayCell, { backgroundColor: sessions.length ? "#1e3a5f" : "#1e293b" }]}>
//                                         {sessions.length === 0 ? (
//                                             <Text style={styles.dayCellEmpty}>—</Text>
//                                         ) : (
//                                             sessions.map((s: any) => (
//                                                 <Text key={s.id} style={styles.dayCellText} numberOfLines={2}>{s.name}</Text>
//                                             ))
//                                         )}
//                                     </View>
//                                 );
//                             })}
//                         </View>
//                         <TouchableOpacity
//                             style={styles.outlineButton}
//                             onPress={() => router.push(`/(tabs)/pages/templateBuilder?id=${program.id}` as any)}
//                         >
//                             <Text style={styles.outlineButtonText}>✏️  Edit template</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     <View style={{ gap: 8 }}>
//                         {program.weeks.map((w: any) => {
//                             const open = openWeek === w.id;
//                             const sc = statusColors[w.status] ?? { bg: "#1e293b", text: "#94a3b8" };
//                             return (
//                                 <View key={w.id} style={styles.card}>
//                                     <TouchableOpacity
//                                         style={styles.weekRow}
//                                         onPress={() => setOpenWeek(open ? null : w.id)}
//                                     >
//                                         <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//                                             <Text style={styles.cardValue}>Week {w.index}</Text>
//                                             {w.modified && (
//                                                 <View style={[styles.badge, { backgroundColor: "#451a03" }]}>
//                                                     <Text style={[styles.badgeText, { color: "#f59e0b" }]}>Modified</Text>
//                                                 </View>
//                                             )}
//                                         </View>
//                                         <Text style={{ color: "#64748b" }}>{open ? "▲" : "▼"}</Text>
//                                     </TouchableOpacity>
//                                     {open && (
//                                         <View style={{ borderTopWidth: 1, borderTopColor: "#334155", paddingTop: 12, gap: 8 }}>
//                                             {w.sessions.map((s: any) => (
//                                                 <View key={s.id} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
//                                                     <View>
//                                                         <Text style={{ fontSize: 11, color: "#64748b" }}>{s.day}</Text>
//                                                         <Text style={styles.cardValue}>{s.name}</Text>
//                                                         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
//                                                             {s.exercises.map((e: any) => (
//                                                                 <View key={e.id} style={styles.chip}>
//                                                                     <Text style={styles.chipText}>{e.type}</Text>
//                                                                 </View>
//                                                             ))}
//                                                         </View>
//                                                     </View>
//                                                     <TouchableOpacity
//                                                         onPress={() =>
//                                                             router.push({
//                                                                 pathname: "/sessions/[id]",
//                                                                 params: {
//                                                                     id: s.id,
//                                                                     programId: program.id,
//                                                                     weekId: w.id,
//                                                                 },
//                                                             })
//                                                         }
//                                                     >
//                                                         <Text style={{ color: "#3b82f6", fontSize: 13, fontWeight: "600" }}>Open</Text>
//                                                     </TouchableOpacity>
//                                                 </View>
//                                             ))}
//                                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//                                                 <TouchableOpacity
//                                                     style={styles.outlineButton}
//                                                     onPress={() =>
//                                                         router.push({
//                                                             pathname: "/sessions/editor",
//                                                             params: {
//                                                                 programId: program.id,
//                                                                 weekId: w.id,
//                                                             },
//                                                         })
//                                                     }
//                                                 >
//                                                     <Text style={styles.outlineButtonText}>Edit</Text>
//                                                 </TouchableOpacity>
//                                                 <TouchableOpacity>
//                                                     <Text style={{ color: "#ef4444", fontSize: 12, fontWeight: "600" }}>Reset to template</Text>
//                                                 </TouchableOpacity>
//                                             </View>
//                                         </View>
//                                     )}
//                                 </View>
//                             );
//                         })}
//                     </View>
//                 )}
//             </ScrollView>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     root: { flex: 1, backgroundColor: "#0f172a" },
//     notFound: { color: "#64748b", textAlign: "center", marginTop: 40 },
//     header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
//     back: { color: "#3b82f6", fontSize: 16, width: 48 },
//     headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9", flex: 1, textAlign: "center" },
//     card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 0 },
//     infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
//     sectionTitle: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, textTransform: "uppercase" },
//     cardValue: { fontSize: 14, fontWeight: "600", color: "#f1f5f9", marginTop: 2 },
//     scoreBadge: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
//     scoreText: { color: "#fff", fontWeight: "700", fontSize: 13 },
//     statsGrid: { flexDirection: "row", gap: 8, marginTop: 12 },
//     statBox: { flex: 1, backgroundColor: "#0f172a", borderRadius: 8, padding: 10 },
//     statBig: { fontSize: 18, fontWeight: "700", color: "#f1f5f9" },
//     tabs: { flexDirection: "row", backgroundColor: "#1e293b", borderRadius: 10, padding: 4, marginVertical: 16 },
//     tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
//     tabActive: { backgroundColor: "#0f172a" },
//     tabText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
//     tabTextActive: { color: "#f1f5f9" },
//     calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
//     dayHeader: { width: "13%", textAlign: "center", fontSize: 9, fontWeight: "700", color: "#64748b" },
//     dayCell: { width: "13%", minHeight: 80, borderRadius: 6, padding: 4, alignItems: "center", justifyContent: "center" },
//     dayCellEmpty: { fontSize: 10, color: "#64748b" },
//     dayCellText: { fontSize: 8, fontWeight: "700", color: "#f1f5f9", textAlign: "center" },
//     outlineButton: { borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, alignItems: "center" },
//     outlineButtonText: { color: "#3b82f6", fontWeight: "600", fontSize: 13 },
//     weekRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     badge: { borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
//     badgeText: { fontSize: 10, fontWeight: "600" },
//     chip: { backgroundColor: "#0f172a", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
//     chipText: { fontSize: 10, color: "#94a3b8" },
// });