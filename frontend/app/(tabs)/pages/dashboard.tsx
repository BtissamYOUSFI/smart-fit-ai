import { useCallback, useEffect, useState } from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { getAuthenticatedUser } from "@/app/shared/service/userService";
import { fetchActiveProgram } from "@/app/shared/service/trainingProgramApi";
import { fetchOrGenerateWeek } from "@/app/shared/service/programWeekApi";
import { User } from "@/app/shared/model/User";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";
import { ProgramWeek } from "@/app/shared/model/ProgramWeek";
import { Session } from "@/app/shared/model/Session";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
type DayKey = typeof DAYS[number];

const DAY_OF_WEEK_TO_SHORT: Record<string, DayKey> = {
    MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
    FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const EXERCISE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    SQUAT:  "barbell",
    PUSHUP: "body",
    BICEP:  "fitness",
    PLANK:  "remove",
};

function todayDayKey(): DayKey {
    const i = new Date().getDay(); // 0 = Sun
    return DAYS[(i + 6) % 7];     // shift so Mon = 0
}

function currentWeekNumber(program: TrainingProgram): number {
    const start = new Date(program.startDate).getTime();
    const now   = Date.now();
    if (now < start) return 1;
    const ms = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.ceil(
        (new Date(program.endDate).getTime() - start) / ms
    );
    return Math.min(Math.ceil((now - start) / ms), totalWeeks);
}

function greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}

function scoreColor(score: number, c: ReturnType<typeof useTheme>["theme"]["colors"]) {
    if (score >= 75) return c.success;
    if (score >= 50) return c.warning;
    return c.error;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const c = theme.colors;

    const [user,        setUser]        = useState<User | null>(null);
    const [program,     setProgram]     = useState<TrainingProgram | null>(null);
    const [week,        setWeek]        = useState<ProgramWeek | null>(null);
    const [loading,     setLoading]     = useState(true);
    const [refreshing,  setRefreshing]  = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayKey>(todayDayKey());

    const load = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);

            const [userData, activeProgram] = await Promise.all([
                getAuthenticatedUser(),
                fetchActiveProgram(),
            ]);
            setUser(userData);
            setProgram(activeProgram);

            if (activeProgram) {
                const weekNum = currentWeekNumber(activeProgram);
                const weekData = await fetchOrGenerateWeek(activeProgram.id, weekNum);
                setWeek(weekData);
            }
        } catch {
            // silently degrade — UI handles null states
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Compute KPIs from program week sessions
    const allSessions: Session[] = week?.sessions ?? [];
    const completedSessions = allSessions.filter(s => s.status === "COMPLETED");
    const scoredSessions    = completedSessions.filter(s => s.globalScore != null);
    const weeklyAvg = scoredSessions.length
        ? Math.round(scoredSessions.reduce((acc, s) => acc + (s.globalScore ?? 0), 0) / scoredSessions.length)
        : null;

    const todaySession = allSessions.find(
        s => DAY_OF_WEEK_TO_SHORT[s.dayOfWeek] === selectedDay
    );

    if (loading) {
        return (
            <View style={[s.centered, { backgroundColor: c.background }]}>
                <ActivityIndicator size="large" color={c.accent} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[s.root, { backgroundColor: c.background }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => load(true)}
                    tintColor={c.accent}
                />
            }
        >
            {/* ── Header ── */}
            <View style={s.header}>
                <View style={s.headerLeft}>
                    <Text style={[s.greeting, { color: c.textMuted }]}>
                        {greeting()},
                    </Text>
                    <Text style={[s.username, { color: c.text }]}>
                        {user?.name ?? "Athlete"}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[s.profileBtn, { backgroundColor: c.surfaceElevated }]}
                    onPress={() => router.push("/(tabs)/pages/profile" as any)}
                >
                    <Ionicons name="person-circle-outline" size={26} color={c.text} />
                </TouchableOpacity>
            </View>

            {/* ── KPI row ── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={s.kpiScroll}
                contentContainerStyle={s.kpiContent}
            >
                {[
                    { value: weeklyAvg != null ? String(weeklyAvg) : "—", label: "Weekly Avg" },
                    { value: String(completedSessions.length),              label: "Sessions Done" },
                    { value: program ? String(currentWeekNumber(program)) : "—", label: "Current Week" },
                ].map((kpi) => (
                    <View
                        key={kpi.label}
                        style={[s.kpiCard, { backgroundColor: c.surface }]}
                    >
                        <Text style={[s.kpiValue, { color: c.text }]}>{kpi.value}</Text>
                        <Text style={[s.kpiLabel, { color: c.textMuted }]}>{kpi.label}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* ── Day picker ── */}
            <View style={s.section}>
                <Text style={[s.sectionTitle, { color: c.textMuted }]}>THIS WEEK</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={s.dayRow}>
                        {DAYS.map((d) => {
                            const hasSession = allSessions.some(
                                se => DAY_OF_WEEK_TO_SHORT[se.dayOfWeek] === d
                            );
                            const active = d === selectedDay;
                            return (
                                <TouchableOpacity
                                    key={d}
                                    onPress={() => setSelectedDay(d)}
                                    style={[
                                        s.dayPill,
                                        { backgroundColor: c.surface, borderColor: c.border },
                                        active && { backgroundColor: c.accent, borderColor: c.accent },
                                        hasSession && !active && { borderColor: c.accent, borderWidth: 1.5 },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            s.dayPillText,
                                            { color: c.textSecondary },
                                            active && { color: c.accentFg },
                                        ]}
                                    >
                                        {d}
                                    </Text>
                                    {hasSession && (
                                        <View
                                            style={[
                                                s.dot,
                                                { backgroundColor: active ? c.accentFg : c.accent },
                                            ]}
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            {/* ── Session card ── */}
            <View style={[s.section, { marginBottom: 32 }]}>
                {!program ? (
                    /* No active program */
                    <View style={[s.card, { backgroundColor: c.surface }]}>
                        <Ionicons
                            name="fitness-outline"
                            size={36}
                            color={c.textMuted}
                            style={{ marginBottom: 12 }}
                        />
                        <Text style={[s.emptyTitle, { color: c.text }]}>No active program</Text>
                        <Text style={[s.emptyDesc, { color: c.textSecondary }]}>
                            Create a training program to get started.
                        </Text>
                        <TouchableOpacity
                            style={[s.actionBtn, { backgroundColor: c.accent }]}
                            onPress={() => router.push("/programs/create" as any)}
                        >
                            <Text style={[s.actionBtnText, { color: c.accentFg }]}>
                                Create a program
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : !todaySession ? (
                    /* Rest day */
                    <View style={[s.card, { backgroundColor: c.surface }]}>
                        <Ionicons
                            name="moon-outline"
                            size={36}
                            color={c.textMuted}
                            style={{ marginBottom: 12 }}
                        />
                        <Text style={[s.emptyTitle, { color: c.text }]}>Rest day</Text>
                        <Text style={[s.emptyDesc, { color: c.textSecondary }]}>
                            No session scheduled for {selectedDay}.
                        </Text>
                        <TouchableOpacity
                            style={[s.actionBtn, { backgroundColor: c.surfaceElevated }]}
                            onPress={() => router.push({
                                pathname: "/programs/[id]",
                                params: { id: String(program.id) },
                            } as any)}
                        >
                            <Text style={[s.actionBtnText, { color: c.text }]}>View program</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Session card */
                    <View style={[s.card, { backgroundColor: c.surface }]}>
                        {/* Session header */}
                        <View style={s.sessionHeader}>
                            <View>
                                <Text style={[s.sessionDay, { color: c.text }]}>
                                    {selectedDay}'s session
                                </Text>
                                <Text style={[s.sessionDate, { color: c.textMuted }]}>
                                    {todaySession.scheduledDate ?? ""}
                                </Text>
                            </View>
                            <View style={[
                                s.statusBadge,
                                {
                                    backgroundColor:
                                        todaySession.status === "COMPLETED"   ? c.successBg :
                                        todaySession.status === "IN_PROGRESS" ? c.blueBg    : c.surfaceElevated,
                                },
                            ]}>
                                <Text style={[
                                    s.statusText,
                                    {
                                        color:
                                            todaySession.status === "COMPLETED"   ? c.success :
                                            todaySession.status === "IN_PROGRESS" ? c.blue    : c.textMuted,
                                    },
                                ]}>
                                    {todaySession.status?.replace(/_/g, " ") ?? "PLANNED"}
                                </Text>
                            </View>
                        </View>

                        {/* Exercises preview */}
                        {(todaySession.exercises ?? []).slice(0, 3).map((ex) => (
                            <View
                                key={ex.id}
                                style={[s.exRow, { borderTopColor: c.border }]}
                            >
                                <View style={[s.exIcon, { backgroundColor: c.surfaceElevated }]}>
                                    <Ionicons
                                        name={(EXERCISE_ICONS[ex.exerciseType] ?? "barbell") as any}
                                        size={18}
                                        color={c.textSecondary}
                                    />
                                </View>
                                <View style={s.exInfo}>
                                    <Text style={[s.exName, { color: c.text }]}>
                                        {ex.exerciseType}
                                    </Text>
                                    <Text style={[s.exDetail, { color: c.textMuted }]}>
                                        {ex.plannedSets} sets × {ex.plannedRepsPerSet} reps
                                    </Text>
                                </View>
                                {ex.score != null && (
                                    <View style={[
                                        s.scoreCircle,
                                        { backgroundColor: scoreColor(ex.score, c) },
                                    ]}>
                                        <Text style={s.scoreText}>{Math.round(ex.score)}</Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        {(todaySession.exercises?.length ?? 0) > 3 && (
                            <Text style={[s.moreText, { color: c.textMuted }]}>
                                +{(todaySession.exercises?.length ?? 0) - 3} more
                            </Text>
                        )}

                        {/* Start / View button */}
                        <TouchableOpacity
                            style={[s.startBtn, { backgroundColor: c.accent }]}
                            onPress={() => router.push({
                                pathname: "/sessions/[id]",
                                params: { id: String(todaySession.id) },
                            } as any)}
                        >
                            <Ionicons
                                name={todaySession.status === "COMPLETED" ? "checkmark-circle" : "play"}
                                size={16}
                                color={c.accentFg}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[s.startBtnText, { color: c.accentFg }]}>
                                {todaySession.status === "COMPLETED" ? "View session" : "Start session"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* ── Active program quick-nav ── */}
            {program && (
                <View style={[s.section, { marginBottom: 48 }]}>
                    <Text style={[s.sectionTitle, { color: c.textMuted }]}>ACTIVE PROGRAM</Text>
                    <TouchableOpacity
                        style={[s.programCard, { backgroundColor: c.surface, borderColor: c.border }]}
                        onPress={() => router.push({
                            pathname: "/programs/[id]",
                            params: { id: String(program.id) },
                        } as any)}
                    >
                        <View style={s.programInfo}>
                            <Text style={[s.programTitle, { color: c.text }]}>{program.title}</Text>
                            <Text style={[s.programDates, { color: c.textMuted }]}>
                                {program.startDate} → {program.endDate}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

// ─── Styles (layout only — colors injected inline) ────────────────────────────

const s = StyleSheet.create({
    root:    { flex: 1 },
    centered:{ flex: 1, alignItems: "center", justifyContent: "center" },

    // Header
    header:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                  paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24 },
    headerLeft: { flex: 1 },
    greeting:   { fontSize: 12, fontWeight: "500", marginBottom: 2 },
    username:   { fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
    profileBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },

    // KPI row
    kpiScroll:  { marginBottom: 4 },
    kpiContent: { paddingHorizontal: 16, gap: 10 },
    kpiCard:    { minWidth: 130, borderRadius: 14, padding: 16, paddingBottom: 14 },
    kpiValue:   { fontSize: 26, fontWeight: "800", letterSpacing: -1 },
    kpiLabel:   { marginTop: 4, fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.6 },

    // Section
    section:      { marginTop: 24, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "700", letterSpacing: 1.2, marginBottom: 12 },

    // Day pills
    dayRow:           { flexDirection: "row", gap: 8 },
    dayPill:          { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 22,
                        borderWidth: 1, alignItems: "center", minWidth: 48 },
    dayPillText:      { fontSize: 12, fontWeight: "700" },
    dot:              { width: 5, height: 5, borderRadius: 3, marginTop: 4 },

    // Card
    card:      { borderRadius: 18, padding: 18, alignItems: "stretch" },
    emptyTitle:{ fontSize: 16, fontWeight: "700", marginBottom: 4, textAlign: "center" },
    emptyDesc: { fontSize: 13, textAlign: "center", marginBottom: 20, lineHeight: 18 },
    actionBtn: { height: 46, borderRadius: 10, alignItems: "center",
                 justifyContent: "center", flexDirection: "row" },
    actionBtnText: { fontWeight: "700", fontSize: 14 },

    // Session header
    sessionHeader: { flexDirection: "row", justifyContent: "space-between",
                     alignItems: "flex-start", marginBottom: 14 },
    sessionDay:    { fontSize: 15, fontWeight: "700" },
    sessionDate:   { fontSize: 11, marginTop: 2 },
    statusBadge:   { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    statusText:    { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 },

    // Exercise rows
    exRow:   { flexDirection: "row", alignItems: "center", gap: 12,
                paddingVertical: 11, borderTopWidth: StyleSheet.hairlineWidth },
    exIcon:  { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    exInfo:  { flex: 1 },
    exName:  { fontSize: 13, fontWeight: "700" },
    exDetail:{ fontSize: 11, marginTop: 1 },
    scoreCircle: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
    scoreText:   { color: "#fff", fontWeight: "800", fontSize: 11 },
    moreText:    { fontSize: 11, textAlign: "center", marginTop: 10 },

    // Start button
    startBtn:     { marginTop: 16, height: 50, borderRadius: 12, alignItems: "center",
                    justifyContent: "center", flexDirection: "row" },
    startBtnText: { fontSize: 14, fontWeight: "700" },

    // Program quick-nav
    programCard:  { flexDirection: "row", alignItems: "center", borderRadius: 14,
                    padding: 16, borderWidth: StyleSheet.hairlineWidth },
    programInfo:  { flex: 1 },
    programTitle: { fontSize: 14, fontWeight: "700" },
    programDates: { fontSize: 11, marginTop: 2 },
});
