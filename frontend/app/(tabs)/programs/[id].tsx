import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { fetchProgramById, deleteProgramById, ApiError } from "@/app/shared/service/trainingProgramApi";
import { fetchOrGenerateWeek } from "@/app/shared/service/programWeekApi";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";
import { ProgramWeek } from "@/app/shared/model/ProgramWeek";
import { Session } from "@/app/shared/model/Session";
import { WeeklyTemplate } from "@/app/shared/model/WeeklyTemplate";
import { SessionTemplate } from "@/app/shared/model/SessionTemplate";
import { Exercise } from "@/app/shared/model/Exercise";
import { ExerciseTemplate } from "@/app/shared/model/ExerciseTemplate";

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_SHORT: Record<string, string> = {
    MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
    FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

type IoniconName = keyof typeof Ionicons.glyphMap;

const EXERCISE_ICONS: Record<string, IoniconName> = {
    SQUAT:  "barbell-outline",
    PUSHUP: "body-outline",
    BICEP:  "fitness-outline",
    PLANK:  "remove-outline",
};

const DEFAULT_EXERCISE_ICON: IoniconName = "walk-outline";

// ─── Business logic helpers ───────────────────────────────────────────────────

function totalWeeks(program: TrainingProgram): number {
    const ms = new Date(program.endDate).getTime() - new Date(program.startDate).getTime();
    return Math.max(1, Math.ceil(ms / (7 * 24 * 60 * 60 * 1000)));
}

function deriveStatus(program: TrainingProgram): "Active" | "Upcoming" | "Completed" {
    const today = new Date().toISOString().split("T")[0];
    if (program.endDate < today)    return "Completed";
    if (program.startDate <= today) return "Active";
    return "Upcoming";
}

function currentWeekNumber(program: TrainingProgram): number {
    const start = new Date(program.startDate).getTime();
    const now   = Date.now();
    if (now < start) return 1;
    return Math.min(
        Math.ceil((now - start) / (7 * 24 * 60 * 60 * 1000)),
        totalWeeks(program)
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ExerciseRow({
    iconKey,
    name,
    sets,
    reps,
    surfaceColor,
    textColor,
    mutedColor,
    accentColor,
}: {
    iconKey: string;
    name: string;
    sets: number;
    reps: number;
    surfaceColor: string;
    textColor: string;
    mutedColor: string;
    accentColor: string;
}) {
    const icon: IoniconName = EXERCISE_ICONS[iconKey] ?? DEFAULT_EXERCISE_ICON;
    return (
        <View style={ex.row}>
            <View style={[ex.iconBox, { backgroundColor: surfaceColor }]}>
                <Ionicons name={icon} size={14} color={accentColor} />
            </View>
            <Text style={[ex.name, { color: textColor }]} numberOfLines={1}>
                {name}
            </Text>
            <Text style={[ex.detail, { color: mutedColor }]}>
                {sets} x {reps}
            </Text>
        </View>
    );
}

const ex = StyleSheet.create({
    row:     { flexDirection: "row", alignItems: "center", gap: 10 },
    iconBox: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center" },
    name:    { flex: 1, fontSize: 12, fontWeight: "600" },
    detail:  { fontSize: 11, fontWeight: "500" },
});

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProgramDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router  = useRouter();
    const { theme } = useTheme();
    const c = theme.colors;

    const [program,     setProgram]     = useState<TrainingProgram | null>(null);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState<string | null>(null);
    const [tab,         setTab]         = useState<"weeks" | "template">("weeks");

    const [weekData,    setWeekData]    = useState<Record<number, ProgramWeek>>({});
    const [weekLoading, setWeekLoading] = useState<Record<number, boolean>>({});
    const [openWeek,    setOpenWeek]    = useState<number | null>(null);

    const loadProgram = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProgramById(Number(id));
            setProgram(data);
            setOpenWeek(currentWeekNumber(data));
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load program.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useFocusEffect(useCallback(() => {
        setWeekData({});
        loadProgram();
    }, [loadProgram]));

    useEffect(() => {
        if (tab === "weeks" && program && openWeek !== null) {
            loadWeek(openWeek);
        }
    }, [tab, program]);

    async function loadWeek(weekNum: number) {
        if (!program || weekData[weekNum] || weekLoading[weekNum]) return;
        setWeekLoading((prev) => ({ ...prev, [weekNum]: true }));
        try {
            const week = await fetchOrGenerateWeek(program.id, weekNum);
            setWeekData((prev) => ({ ...prev, [weekNum]: week }));
        } catch {
            // silently ignore — week stays unloaded
        } finally {
            setWeekLoading((prev) => ({ ...prev, [weekNum]: false }));
        }
    }

    function toggleWeek(weekNum: number) {
        if (openWeek === weekNum) {
            setOpenWeek(null);
        } else {
            setOpenWeek(weekNum);
            loadWeek(weekNum);
        }
    }

    const handleDelete = () => {
        Alert.alert("Delete Program", `Delete "${program?.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive",
                onPress: async () => {
                    try {
                        await deleteProgramById(Number(id));
                        router.back();
                    } catch (err) {
                        Alert.alert("Error", err instanceof Error ? err.message : "Failed.");
                    }
                },
            },
        ]);
    };

    // ─── Loading ──────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <View style={[{ flex: 1, backgroundColor: c.background }, s.centered]}>
                <ActivityIndicator size="large" color={c.accent} />
                <Text style={{ color: c.textMuted, marginTop: 12, fontSize: 14 }}>
                    Loading program...
                </Text>
            </View>
        );
    }

    // ─── Error / not found ────────────────────────────────────────────────────

    if (error || !program) {
        return (
            <View style={[{ flex: 1, backgroundColor: c.background }, s.centered]}>
                <Ionicons name="alert-circle-outline" size={40} color={c.error} style={{ marginBottom: 12 }} />
                <Text style={[s.errText, { color: c.error }]}>
                    {error ?? "Program not found."}
                </Text>
                <TouchableOpacity
                    style={[s.retryBtn, { borderColor: c.accent }]}
                    onPress={loadProgram}
                >
                    <Text style={[s.retryBtnText, { color: c.accent }]}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
                    <Text style={{ color: c.textMuted, fontSize: 14 }}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ─── Derived state ────────────────────────────────────────────────────────

    const status    = deriveStatus(program);
    const numWeeks  = totalWeeks(program);
    const curWeekNo = currentWeekNumber(program);

    const statusBg = status === "Active"
        ? c.blueBg
        : status === "Completed"
        ? c.successBg
        : c.surface;

    const statusFg = status === "Active"
        ? c.blue
        : status === "Completed"
        ? c.success
        : c.textMuted;

    const sessionStatusBg = (st: string) => {
        if (st === "IN_PROGRESS") return c.blueBg;
        if (st === "COMPLETED")   return c.successBg;
        if (st === "SKIPPED")     return c.surface;
        return c.surface; // PLANNED
    };

    const sessionStatusFg = (st: string) => {
        if (st === "IN_PROGRESS") return c.blue;
        if (st === "COMPLETED")   return c.success;
        if (st === "SKIPPED")     return c.textMuted;
        return c.textMuted; // PLANNED
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <View style={{ flex: 1, backgroundColor: c.background }}>
            {/* ── Header ── */}
            <View style={[s.header, { borderBottomColor: c.border }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={s.headerBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={22} color={c.accent} />
                </TouchableOpacity>

                <Text style={[s.headerTitle, { color: c.text }]} numberOfLines={1}>
                    {program.title}
                </Text>

                <TouchableOpacity
                    onPress={handleDelete}
                    style={s.headerBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color={c.error} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
            >
                {/* ── Info card ── */}
                <View style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}>
                    <View style={s.infoRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[s.label, { color: c.textMuted }]}>Schedule</Text>
                            <Text style={[s.infoValue, { color: c.text }]}>
                                {program.startDate}  {program.endDate}
                            </Text>
                        </View>
                        <View style={[s.badge, { backgroundColor: statusBg }]}>
                            <Text style={[s.badgeText, { color: statusFg }]}>{status}</Text>
                        </View>
                    </View>

                    <View style={[s.divider, { backgroundColor: c.border }]} />

                    <View style={s.statsGrid}>
                        <View style={[s.statBox, { backgroundColor: c.background, borderColor: c.border }]}>
                            <Text style={[s.label, { color: c.textMuted }]}>Total weeks</Text>
                            <Text style={[s.statBig, { color: c.text }]}>{numWeeks}</Text>
                        </View>
                        <View style={[s.statBox, { backgroundColor: c.background, borderColor: c.border }]}>
                            <Text style={[s.label, { color: c.textMuted }]}>Templates</Text>
                            <Text style={[s.statBig, { color: c.text }]}>
                                {program.weeklyTemplates?.length ?? 0}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ── Tab switcher ── */}
                <View style={[s.tabsContainer, { backgroundColor: c.surface, borderColor: c.border }]}>
                    {(["weeks", "template"] as const).map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setTab(t)}
                            style={[
                                s.tabPill,
                                tab === t && [s.tabPillActive, { backgroundColor: c.background }],
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    s.tabText,
                                    { color: tab === t ? c.text : c.textMuted },
                                ]}
                            >
                                {t === "weeks" ? "Weeks" : "Templates"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Weeks tab ── */}
                {tab === "weeks" && (
                    <View style={{ gap: 8 }}>
                        {Array.from({ length: numWeeks }, (_, i) => i + 1).map((wn) => {
                            const open      = openWeek === wn;
                            const wk        = weekData[wn];
                            const busy      = weekLoading[wn];
                            const isCurrent = wn === curWeekNo;

                            return (
                                <View
                                    key={wn}
                                    style={[
                                        s.card,
                                        { backgroundColor: c.surface, borderColor: c.border },
                                        isCurrent && { borderColor: c.accent },
                                    ]}
                                >
                                    {/* Week accordion header */}
                                    <TouchableOpacity
                                        style={s.weekRow}
                                        onPress={() => toggleWeek(wn)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={s.weekRowLeft}>
                                            <Text style={[s.weekLabel, { color: c.text }]}>
                                                Week {wn}
                                            </Text>
                                            {isCurrent && (
                                                <View style={[s.badge, { backgroundColor: c.blueBg }]}>
                                                    <Text style={[s.badgeText, { color: c.blue }]}>
                                                        Current
                                                    </Text>
                                                </View>
                                            )}
                                            {wk?.isCustomized && (
                                                <View style={[s.badge, { backgroundColor: c.warningBg }]}>
                                                    <Text style={[s.badgeText, { color: c.warning }]}>
                                                        Modified
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        <Ionicons
                                            name={open ? "chevron-up" : "chevron-down"}
                                            size={16}
                                            color={c.textMuted}
                                        />
                                    </TouchableOpacity>

                                    {/* Week expanded content */}
                                    {open && (
                                        <View
                                            style={[
                                                s.weekContent,
                                                { borderTopColor: c.border },
                                            ]}
                                        >
                                            {busy ? (
                                                <ActivityIndicator color={c.accent} size="small" />
                                            ) : wk ? (
                                                wk.sessions && wk.sessions.length > 0 ? (
                                                    wk.sessions.map((session: Session) => (
                                                        <View
                                                            key={session.id}
                                                            style={[
                                                                s.sessionBlock,
                                                                { backgroundColor: c.background, borderColor: c.border },
                                                            ]}
                                                        >
                                                            {/* Session header */}
                                                            <View style={s.sessionHeader}>
                                                                <View style={{ flex: 1 }}>
                                                                    <Text style={[s.sessionDay, { color: c.text }]}>
                                                                        {DAY_SHORT[String(session.dayOfWeek)] ?? String(session.dayOfWeek)}
                                                                    </Text>
                                                                    <Text style={[s.sessionDate, { color: c.textMuted }]}>
                                                                        {session.scheduledDate}
                                                                    </Text>
                                                                </View>
                                                                <View
                                                                    style={[
                                                                        s.badge,
                                                                        { backgroundColor: sessionStatusBg(session.status) },
                                                                    ]}
                                                                >
                                                                    <Text
                                                                        style={[
                                                                            s.badgeText,
                                                                            { color: sessionStatusFg(session.status) },
                                                                        ]}
                                                                    >
                                                                        {String(session.status).replace(/_/g, " ")}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            {/* Exercise list */}
                                                            {(session.exercises ?? []).length > 0 ? (
                                                                <View style={s.exList}>
                                                                    {session.exercises.map((ex: Exercise) => (
                                                                        <ExerciseRow
                                                                            key={ex.id}
                                                                            iconKey={ex.exerciseType}
                                                                            name={ex.exerciseType}
                                                                            sets={ex.plannedSets}
                                                                            reps={ex.plannedRepsPerSet}
                                                                            surfaceColor={c.surface}
                                                                            textColor={c.text}
                                                                            mutedColor={c.textMuted}
                                                                            accentColor={c.accent}
                                                                        />
                                                                    ))}
                                                                </View>
                                                            ) : (
                                                                <Text style={[s.emptyNote, { color: c.textMuted }]}>
                                                                    No exercises.
                                                                </Text>
                                                            )}

                                                            {/* Start / View session button */}
                                                            <TouchableOpacity
                                                                style={[
                                                                    s.openBtn,
                                                                    session.status === "COMPLETED"
                                                                        ? { backgroundColor: c.successBg, borderColor: c.success }
                                                                        : { backgroundColor: c.blueBg, borderColor: c.blue },
                                                                ]}
                                                                onPress={() =>
                                                                    router.push({
                                                                        pathname: "/sessions/[id]",
                                                                        params: { id: String(session.id) },
                                                                    })
                                                                }
                                                                activeOpacity={0.75}
                                                            >
                                                                <Ionicons
                                                                    name={
                                                                        session.status === "COMPLETED"
                                                                            ? "checkmark-circle-outline"
                                                                            : "play-circle-outline"
                                                                    }
                                                                    size={14}
                                                                    color={
                                                                        session.status === "COMPLETED"
                                                                            ? c.success
                                                                            : c.blue
                                                                    }
                                                                />
                                                                <Text
                                                                    style={[
                                                                        s.openBtnText,
                                                                        {
                                                                            color:
                                                                                session.status === "COMPLETED"
                                                                                    ? c.success
                                                                                    : c.blue,
                                                                        },
                                                                    ]}
                                                                >
                                                                    {session.status === "COMPLETED"
                                                                        ? "View session"
                                                                        : "Start session"}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    ))
                                                ) : (
                                                    <Text style={[s.emptyNote, { color: c.textMuted }]}>
                                                        Rest week — no sessions scheduled.
                                                    </Text>
                                                )
                                            ) : (
                                                <Text style={[s.emptyNote, { color: c.textMuted }]}>
                                                    Tap to load...
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* ── Templates tab ── */}
                {tab === "template" && (
                    <View style={{ gap: 12 }}>
                        {(!program.weeklyTemplates || program.weeklyTemplates.length === 0) ? (
                            <View style={[s.centered, { paddingVertical: 40 }]}>
                                <Ionicons name="document-text-outline" size={36} color={c.textMuted} />
                                <Text style={[{ color: c.textMuted, marginTop: 10, fontSize: 14 }]}>
                                    No templates defined.
                                </Text>
                            </View>
                        ) : (
                            program.weeklyTemplates.map((wt: WeeklyTemplate) => (
                                <View
                                    key={wt.id}
                                    style={[s.card, { backgroundColor: c.surface, borderColor: c.border }]}
                                >
                                    {/* Template header */}
                                    <View style={s.templateHeader}>
                                        <Text style={[s.weekLabel, { color: c.text }]}>
                                            {wt.label}
                                        </Text>
                                        {wt.repeatMode && (
                                            <View style={[s.modeTag, { backgroundColor: c.background, borderColor: c.border }]}>
                                                <Text style={[s.modeTagText, { color: c.textSecondary }]}>
                                                    {wt.repeatMode.replace(/_/g, " ")}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Session templates */}
                                    <View style={{ marginTop: 12, gap: 10 }}>
                                        {(wt.sessionTemplates ?? []).length === 0 ? (
                                            <Text style={[s.emptyNote, { color: c.textMuted }]}>
                                                No sessions in this template.
                                            </Text>
                                        ) : (
                                            (wt.sessionTemplates ?? []).map((st: SessionTemplate) => (
                                                <View
                                                    key={st.id}
                                                    style={[
                                                        s.stBlock,
                                                        { backgroundColor: c.background, borderColor: c.border },
                                                    ]}
                                                >
                                                    <Text style={[s.stDay, { color: c.textMuted }]}>
                                                        {DAY_SHORT[st.dayOfWeek] ?? st.dayOfWeek}
                                                    </Text>

                                                    {(st.exerciseTemplates ?? []).length === 0 ? (
                                                        <Text style={[s.emptyNote, { color: c.textMuted }]}>
                                                            No exercises.
                                                        </Text>
                                                    ) : (
                                                        <View style={s.exList}>
                                                            {(st.exerciseTemplates ?? []).map(
                                                                (et: ExerciseTemplate, idx: number) => (
                                                                    <ExerciseRow
                                                                        key={idx}
                                                                        iconKey={et.exerciseType}
                                                                        name={et.exerciseType}
                                                                        sets={et.sets}
                                                                        reps={et.repsPerSet}
                                                                        surfaceColor={c.surface}
                                                                        textColor={c.text}
                                                                        mutedColor={c.textMuted}
                                                                        accentColor={c.accent}
                                                                    />
                                                                )
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            ))
                                        )}
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    errText: {
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 32,
        fontWeight: "600",
        marginBottom: 4,
    },
    retryBtn: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    retryBtnText: {
        fontWeight: "600",
        fontSize: 14,
    },
    /* Header */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    headerBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        flex: 1,
        textAlign: "center",
    },
    /* Card */
    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        marginBottom: 0,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    label: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 2,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    statsGrid: {
        flexDirection: "row",
        gap: 8,
    },
    statBox: {
        flex: 1,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
    },
    statBig: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 4,
    },
    badge: {
        borderRadius: 99,
        paddingHorizontal: 9,
        paddingVertical: 3,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
    },
    /* Tabs */
    tabsContainer: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 4,
        marginVertical: 16,
        borderWidth: 1,
    },
    tabPill: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 9,
        alignItems: "center",
    },
    tabPillActive: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
    },
    /* Week accordion */
    weekRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    weekRowLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
    },
    weekLabel: {
        fontSize: 14,
        fontWeight: "700",
    },
    weekContent: {
        borderTopWidth: 1,
        paddingTop: 12,
        marginTop: 10,
        gap: 10,
    },
    /* Session block */
    sessionBlock: {
        borderRadius: 12,
        padding: 12,
        gap: 10,
        borderWidth: 1,
    },
    sessionHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    sessionDay: {
        fontSize: 13,
        fontWeight: "700",
    },
    sessionDate: {
        fontSize: 11,
        marginTop: 1,
    },
    /* Start / view session button */
    openBtn: {
        height: 36,
        borderRadius: 9,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderWidth: 1,
    },
    openBtnText: {
        fontSize: 12,
        fontWeight: "600",
    },
    /* Exercise list */
    exList: {
        gap: 7,
    },
    emptyNote: {
        fontSize: 12,
    },
    /* Template */
    templateHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    modeTag: {
        borderRadius: 7,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    modeTagText: {
        fontSize: 11,
        fontWeight: "500",
    },
    stBlock: {
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
    },
    stDay: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 8,
    },
});
