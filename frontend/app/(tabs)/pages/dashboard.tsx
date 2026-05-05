import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MobileShell } from "@/components/MobileShell";
import { ScoreBadge } from "@/components/ScoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { DayPill } from "@/components/DayPill";
import { EmptyState } from "@/components/EmptyState";
import { mockDashboard } from "@/mocks/dashboard";
import { mockPrograms } from "@/mocks/programs";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const todayKey = (() => {
    const i = new Date().getDay();
    return DAYS[(i + 6) % 7];
})();

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}

export default function Dashboard() {
    const router = useRouter();
    const [day, setDay] = useState<typeof DAYS[number]>(todayKey);

    const session = useMemo(() => {
        const program = mockPrograms.find((p) => p.status === "Active");
        const week = program?.weeks[0];
        return week?.sessions.find((s) => s.day === day);
    }, [day]);

    const kpis = [
        { label: "Today's Score", value: mockDashboard.todayScore.toFixed(1), trend: mockDashboard.todayTrend },
        { label: "Weekly Avg",    value: mockDashboard.weeklyAvg.toFixed(1),  trend: mockDashboard.weeklyTrend },
        { label: "Total Sessions",value: String(mockDashboard.totalSessions), trend: mockDashboard.totalTrend },
    ];

    return (
        <MobileShell>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()},</Text>
                        <Text style={styles.username}>Athlete</Text>
                    </View>
                    <TouchableOpacity style={styles.bell}>
                        <Text style={{ fontSize: 18 }}>🔔</Text>
                    </TouchableOpacity>
                </View>

                {/* KPIs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
                    {kpis.map((k) => (
                        <View key={k.label} style={styles.kpiCard}>
                            <View style={styles.kpiTop}>
                                <Text style={styles.kpiValue}>{k.value}</Text>
                                <Text style={{ color: k.trend === "up" ? "#22c55e" : "#ef4444", fontSize: 16 }}>
                                    {k.trend === "up" ? "↑" : "↓"}
                                </Text>
                            </View>
                            <Text style={styles.kpiLabel}>{k.label}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Days */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>THIS WEEK</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {DAYS.map((d) => (
                            <DayPill key={d} label={d} active={d === day} onClick={() => setDay(d)} />
                        ))}
                    </ScrollView>
                </View>

                {/* Session */}
                <View style={styles.section}>
                    {session ? (
                        <View style={styles.card}>
                            <View style={styles.sessionHeader}>
                                <View>
                                    <Text style={styles.sessionDay}>{day}'s session</Text>
                                    <Text style={styles.sessionName}>{session.name}</Text>
                                </View>
                                <StatusBadge status={session.status} />
                            </View>
                            {session.exercises.map((ex: any) => (
                                <View key={ex.id} style={styles.exerciseRow}>
                                    <View style={styles.exerciseLeft}>
                                        <View style={styles.exerciseIcon}><Text>🏋️</Text></View>
                                        <View>
                                            <Text style={styles.exerciseName}>{ex.type}</Text>
                                            <Text style={styles.exerciseReps}>{ex.plannedReps} reps</Text>
                                        </View>
                                    </View>
                                    <StatusBadge status={ex.status} />
                                </View>
                            ))}
                            <TouchableOpacity style={styles.startButton}>
                                <Text style={styles.startButtonText}>▶  Start session</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.card}>
                            <EmptyState
                                title="No session planned"
                                description="Plan a session for this day to start training."
                                actionLabel="Plan a session"
                                onAction={() => router.push("/programs/index")}
                            />
                        </View>
                    )}
                </View>

                {/* Recent analyses */}
                <View style={[styles.section, { marginBottom: 32 }]}>
                    <Text style={styles.sectionTitle}>RECENT ANALYSES</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                        {mockDashboard.recentAnalyses.map((a: any) => (
                            <View key={a.id} style={styles.analysisCard}>
                                <ScoreBadge score={a.score} />
                                <Text style={styles.analysisType}>{a.exerciseType}</Text>
                                <Text style={styles.analysisDate}>
                                    {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </MobileShell>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0f172a", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 },
    greeting: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
    username: { fontSize: 20, fontWeight: "800", color: "#fff" },
    bell: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
    kpiRow: { marginTop: -12 },
    kpiCard: { minWidth: 120, backgroundColor: "#1e293b", borderRadius: 12, padding: 12 },
    kpiTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    kpiValue: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
    kpiLabel: { marginTop: 4, fontSize: 10, fontWeight: "600", color: "#64748b", textTransform: "uppercase" },
    section: { marginTop: 20, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginBottom: 10 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16 },
    sessionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
    sessionDay: { fontSize: 12, color: "#64748b" },
    sessionName: { fontSize: 15, fontWeight: "700", color: "#f1f5f9" },
    exerciseRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#334155" },
    exerciseLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    exerciseIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
    exerciseName: { fontSize: 13, fontWeight: "600", color: "#f1f5f9" },
    exerciseReps: { fontSize: 11, color: "#64748b" },
    startButton: { marginTop: 16, height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    startButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
    analysisCard: { minWidth: 130, backgroundColor: "#1e293b", borderRadius: 16, padding: 12, alignItems: "center" },
    analysisType: { marginTop: 8, fontSize: 13, fontWeight: "700", color: "#f1f5f9" },
    analysisDate: { fontSize: 11, color: "#64748b" },
});

// import { useMemo, useState } from "react";
// import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
// import { useRouter } from "expo-router";
// import { MobileShell } from "@/components/MobileShell";
// import { ScoreBadge } from "@/components/ScoreBadge";
// import { StatusBadge } from "@/components/StatusBadge";
// import { DayPill } from "@/components/DayPill";
// import { EmptyState } from "@/components/EmptyState";
// import { mockDashboard } from "@/mocks/dashboard";
// import { mockPrograms } from "@/mocks/programs";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
//
// const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
//
// const todayKey = (() => {
//     const i = new Date().getDay();
//     return DAYS[(i + 6) % 7];
// })();
//
// function getGreeting() {
//     const h = new Date().getHours();
//     if (h < 12) return "Good morning";
//     if (h < 18) return "Good afternoon";
//     return "Good evening";
// }
//
// export default function Dashboard() {
//     const router = useRouter();
//     const [day, setDay] = useState<typeof DAYS[number]>(todayKey);
//
//     const session = useMemo(() => {
//         const program = mockPrograms.find((p) => p.status === "Active");
//         const week = program?.weeks[0];
//         return week?.sessions.find((s) => s.day === day);
//     }, [day]);
//
//     const kpis = [
//         { label: "Today's Score", value: mockDashboard.todayScore.toFixed(1), trend: mockDashboard.todayTrend },
//         { label: "Weekly Avg",    value: mockDashboard.weeklyAvg.toFixed(1),  trend: mockDashboard.weeklyTrend },
//         { label: "Total Sessions",value: String(mockDashboard.totalSessions), trend: mockDashboard.totalTrend },
//     ];
//
//     return (
//         <MobileShell>
//             <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#f8fafc' }}>
//                 {/* --- HEADER MODIFIÉ --- */}
//                 <View style={styles.header}>
//                     <View>
//                         <Text style={styles.greeting}>{getGreeting()},</Text>
//                         <Text style={styles.username}>Alex Martin</Text>
//                     </View>
//                     <TouchableOpacity style={styles.bellContainer}>
//                         <View style={styles.bellCircle}>
//                             <Text style={{ fontSize: 22, color: '#fff' }}>🔔</Text>
//                             <View style={styles.notificationDot} />
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//
//                 {/* KPIs (Modifiés pour être en blanc comme sur l'image) */}
//                 <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     style={styles.kpiRow}
//                     contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
//                 >
//                     {kpis.map((k) => (
//                         <View key={k.label} style={styles.kpiCard}>
//                             <View style={styles.kpiTop}>
//                                 <Text style={styles.kpiValue}>{k.value}</Text>
//                                 <Text style={{ color: "#22c55e", fontSize: 18, fontWeight: 'bold' }}>
//                                     {k.trend === "up" ? "↑" : "↓"}
//                                 </Text>
//                             </View>
//                             <Text style={styles.kpiLabel}>{k.label}</Text>
//                         </View>
//                     ))}
//                 </ScrollView>
//
//                 {/* Days */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>THIS WEEK</Text>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//                         {DAYS.map((d) => (
//                             <DayPill key={d} label={d} active={d === day} onClick={() => setDay(d)} />
//                         ))}
//                     </ScrollView>
//                 </View>
//
//                 {/* Session */}
//                 <View style={styles.section}>
//                     {session ? (
//                         <View style={styles.card}>
//                             <View style={styles.sessionHeader}>
//                                 <View>
//                                     <Text style={styles.sessionDay}>{day}'s session</Text>
//                                     <Text style={styles.sessionName}>{session.name}</Text>
//                                 </View>
//                                 <StatusBadge status={session.status} />
//                             </View>
//                             {session.exercises.map((ex: any) => (
//                                 <View key={ex.id} style={styles.exerciseRow}>
//                                     <View style={styles.exerciseLeft}>
//                                         <View style={styles.exerciseIcon}><Text>🏋️</Text></View>
//                                         <View>
//                                             <Text style={styles.exerciseName}>{ex.type}</Text>
//                                             <Text style={styles.exerciseReps}>{ex.plannedReps} reps</Text>
//                                         </View>
//                                     </View>
//                                     <StatusBadge status={ex.status} />
//                                 </View>
//                             ))}
//                             <TouchableOpacity style={styles.startButton}>
//                                 <Text style={styles.startButtonText}>▶  Start session</Text>
//                             </TouchableOpacity>
//                         </View>
//                     ) : (
//                         // <View style={styles.card}>
//                         //     <EmptyState
//                         //         title="No session planned"
//                         //         description="Plan a session for this day to start training."
//                         //         actionLabel="Plan a session"
//                         //         onAction={() => router.push("/(tabs)/pages/programsList")}
//                         //     />
//                         // </View>
//                         <View style={styles.emptyCardShadow}>
//                             <View style={styles.emptyCardInner}>
//                                 <View style={styles.emptyIconCircle}>
//                                     <MaterialCommunityIcons name="calendar-plus" size={32} color="#162D55" />
//                                 </View>
//
//                                 <Text style={styles.emptyTitle}>No session planned</Text>
//                                 <Text style={styles.emptyDescription}>
//                                     Plan a session for this day to start training and reach your goals.
//                                 </Text>
//
//                                 <TouchableOpacity
//                                     style={styles.emptyActionButton}
//                                     onPress={() => router.push("/(tabs)/pages/programsList")}
//                                 >
//                                     <Text style={styles.emptyActionText}>Plan a session</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     )}
//                 </View>
//
//                 {/* Recent analyses */}
//                 <View style={[styles.section, { marginBottom: 32 }]}>
//                     <Text style={styles.sectionTitle}>RECENT ANALYSES</Text>
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
//                         {mockDashboard.recentAnalyses.map((a: any) => (
//                             <View key={a.id} style={styles.analysisCard}>
//                                 <ScoreBadge score={a.score} />
//                                 <Text style={styles.analysisType}>{a.exerciseType}</Text>
//                                 <Text style={styles.analysisDate}>
//                                     {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
//                                 </Text>
//                             </View>
//                         ))}
//                     </ScrollView>
//                 </View>
//             </ScrollView>
//         </MobileShell>
//     );
// }
//
// const styles = StyleSheet.create({
//     // STYLE DU HEADER (Inspiré de l'image)
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         backgroundColor: "#162D55", // Bleu marine de l'image
//         paddingHorizontal: 20,
//         paddingTop: 64,
//         paddingBottom: 45
//     },
//     greeting: {
//         fontSize: 14,
//         color: "rgba(255,255,255,0.7)",
//         marginBottom: 2
//     },
//     username: {
//         fontSize: 28,
//         fontWeight: "800",
//         color: "#fff"
//     },
//     bellContainer: {
//         position: 'relative',
//     },
//     bellCircle: {
//         width: 48,
//         height: 48,
//         borderRadius: 24,
//         backgroundColor: "rgba(255,255,255,0.15)",
//         alignItems: "center",
//         justifyContent: "center"
//     },
//     notificationDot: {
//         position: 'absolute',
//         top: 12,
//         right: 12,
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#FFD700', // Point jaune de l'image
//         borderWidth: 1.5,
//         borderColor: '#162D55',
//     },
//
//     // STYLE DES CARTES KPI (En blanc comme sur l'image)
//     kpiRow: {
//         marginTop: -25 // Fait chevaucher les cartes sur le header bleu
//     },
//     kpiCard: {
//         minWidth: 120,
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 16,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 5
//     },
//     kpiTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//     kpiValue: { fontSize: 26, fontWeight: "800", color: "#1e293b" },
//     kpiLabel: { marginTop: 6, fontSize: 10, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
//
//     // RESTE DES STYLES
//     section: { marginTop: 24, paddingHorizontal: 16 },
//     sectionTitle: { fontSize: 11, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginBottom: 12 },
//     card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9' },
//     sessionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
//     sessionDay: { fontSize: 12, color: "#64748b" },
//     sessionName: { fontSize: 16, fontWeight: "700", color: "#1e293b" },
//     exerciseRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
//     exerciseLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
//     exerciseIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center" },
//     exerciseName: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
//     exerciseReps: { fontSize: 12, color: "#64748b" },
//     startButton: { backgroundColor: "#162D55", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 16 },
//     startButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
//     analysisCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, width: 120, borderWidth: 1, borderColor: '#f1f5f9' },
//     analysisType: { fontSize: 12, fontWeight: "700", color: "#1e293b", marginTop: 8 },
//     analysisDate: { fontSize: 10, color: "#94a3b8", marginTop: 2 },
//
//     // Styles pour l'état vide (Empty State)
//     emptyCardShadow: {
//         backgroundColor: "#fff",
//         borderRadius: 20,
//         // Ombre portée pour détacher la carte
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.05,
//         shadowRadius: 15,
//         elevation: 4,
//     },
//     emptyCardInner: {
//         padding: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     emptyIconCircle: {
//         width: 64,
//         height: 64,
//         borderRadius: 32,
//         backgroundColor: "#F1F5F9", // Gris très clair
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 16,
//     },
//     emptyTitle: {
//         fontSize: 18,
//         fontWeight: "800",
//         color: "#1E293B",
//         marginBottom: 8,
//     },
//     emptyDescription: {
//         fontSize: 14,
//         color: "#64748B",
//         textAlign: 'center',
//         lineHeight: 20,
//         marginBottom: 24,
//         paddingHorizontal: 10,
//     },
//     emptyActionButton: {
//         backgroundColor: "#162D55", // Même bleu que le header
//         paddingVertical: 12,
//         paddingHorizontal: 24,
//         borderRadius: 12,
//     },
//     emptyActionText: {
//         color: "#fff",
//         fontWeight: "700",
//         fontSize: 14,
//     },
//
// });
