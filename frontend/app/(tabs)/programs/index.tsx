import { useEffect, useState, useCallback } from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { fetchMyPrograms, deleteProgramById, ApiError } from "@/app/shared/service/trainingProgramApi";
import { TrainingProgram } from "@/app/shared/model/TrainingProgram";

function deriveStatus(p: TrainingProgram): "Active" | "Upcoming" | "Completed" {
    const today = new Date().toISOString().split("T")[0];
    if (p.endDate < today)    return "Completed";
    if (p.startDate <= today) return "Active";
    return "Upcoming";
}

function completionRate(p: TrainingProgram): number {
    const today = new Date();
    const start = new Date(p.startDate);
    const end   = new Date(p.endDate);
    if (today < start) return 0;
    if (today > end)   return 100;
    return Math.round(
        (today.getTime() - start.getTime()) /
        (end.getTime()   - start.getTime()) * 100
    );
}

export default function ProgramsList() {
    const router = useRouter();
    const { theme } = useTheme();
    const c = theme.colors;

    const [programs,   setPrograms]   = useState<TrainingProgram[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error,      setError]      = useState<string | null>(null);

    const loadPrograms = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            setError(null);
            const data = await fetchMyPrograms();
            setPrograms(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load programs.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadPrograms(); }, [loadPrograms]);

    const handleDelete = (p: TrainingProgram) => {
        Alert.alert("Delete Program", `Delete "${p.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete", style: "destructive",
                onPress: async () => {
                    try {
                        await deleteProgramById(p.id);
                        setPrograms((prev) => prev.filter((x) => x.id !== p.id));
                    } catch (err) {
                        Alert.alert("Error", err instanceof ApiError ? err.message : "Failed to delete.");
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={[{ flex: 1, backgroundColor: c.background }, styles.centered]}>
                <ActivityIndicator size="large" color={c.accent} />
                <Text style={{ color: c.textMuted, marginTop: 12, fontSize: 14 }}>
                    Loading programs...
                </Text>
            </View>
        );
    }

    const statusBgColor = (status: "Active" | "Upcoming" | "Completed") => {
        if (status === "Active")    return c.blueBg;
        if (status === "Completed") return c.successBg;
        return c.surface;
    };

    const statusTextColor = (status: "Active" | "Upcoming" | "Completed") => {
        if (status === "Active")    return c.blue;
        if (status === "Completed") return c.success;
        return c.textMuted;
    };

    return (
        <View style={{ flex: 1, backgroundColor: c.background }}>
            {/* Header */}
            <View style={[styles.header]}>
                <Text style={[styles.title, { color: c.text }]}>My Programs</Text>
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: c.accent }]}
                    onPress={() => router.push("/programs/create" as any)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={22} color={c.accentFg} />
                </TouchableOpacity>
            </View>

            {/* Error banner */}
            {error && (
                <View style={[styles.errorBanner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
                    <Text style={[styles.errorText, { color: c.error }]} numberOfLines={2}>
                        {error}
                    </Text>
                    <TouchableOpacity onPress={() => loadPrograms()} style={styles.retryTouchable}>
                        <Text style={[styles.retryText, { color: c.accent }]}>Retry</Text>
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
                        tintColor={c.accent}
                    />
                }
            >
                {programs.length === 0 && !error ? (
                    /* Empty state */
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconBox, { backgroundColor: c.surface }]}>
                            <Ionicons name="calendar-outline" size={48} color={c.textMuted} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: c.text }]}>No programs yet</Text>
                        <Text style={[styles.emptySubtitle, { color: c.textSecondary }]}>
                            Create your first training program to get started.
                        </Text>
                        <TouchableOpacity
                            style={[styles.outlineButton, { borderColor: c.accent }]}
                            onPress={() => router.push("/programs/create" as any)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.outlineButtonText, { color: c.accent }]}>
                                Create program
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    programs.map((p) => {
                        const status = deriveStatus(p);
                        const rate   = completionRate(p);
                        return (
                            <View
                                key={p.id}
                                style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
                            >
                                {/* Tappable card body */}
                                <TouchableOpacity
                                    onPress={() => router.push({
                                        pathname: "/programs/[id]",
                                        params: { id: String(p.id) },
                                    } as any)}
                                    activeOpacity={0.7}
                                    style={styles.cardBody}
                                >
                                    {/* Title row + badge */}
                                    <View style={styles.cardTopRow}>
                                        <Text
                                            style={[styles.cardTitle, { color: c.text }]}
                                            numberOfLines={1}
                                        >
                                            {p.title}
                                        </Text>
                                        <View
                                            style={[
                                                styles.badge,
                                                { backgroundColor: statusBgColor(status) },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.badgeText,
                                                    { color: statusTextColor(status) },
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Date range */}
                                    <Text style={[styles.cardDate, { color: c.textMuted }]}>
                                        {p.startDate}  {p.endDate}
                                    </Text>

                                    {/* Progress bar */}
                                    <View style={[styles.progressBg, { backgroundColor: c.border }]}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: `${rate}%` as any, backgroundColor: c.accent },
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.progressLabel, { color: c.textMuted }]}>
                                        {rate}% complete
                                    </Text>
                                </TouchableOpacity>

                                {/* Delete button row */}
                                <View style={[styles.cardActions, { borderTopColor: c.border }]}>
                                    <TouchableOpacity
                                        style={[styles.deleteBtn, { backgroundColor: c.errorBg, borderColor: c.error }]}
                                        onPress={() => handleDelete(p)}
                                        activeOpacity={0.75}
                                    >
                                        <Ionicons name="trash-outline" size={13} color={c.error} />
                                        <Text style={[styles.deleteBtnText, { color: c.error }]}>
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 8,
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
    },
    errorText: {
        fontSize: 13,
        flex: 1,
        fontWeight: "500",
    },
    retryTouchable: {
        marginLeft: 12,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    retryText: {
        fontSize: 13,
        fontWeight: "700",
    },
    list: {
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 40,
        gap: 12,
    },
    /* Empty state */
    emptyState: {
        alignItems: "center",
        paddingTop: 80,
        paddingHorizontal: 32,
    },
    emptyIconBox: {
        width: 88,
        height: 88,
        borderRadius: 44,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    outlineButton: {
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 11,
    },
    outlineButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    /* Program card */
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    cardBody: {
        padding: 16,
    },
    cardTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        flex: 1,
    },
    badge: {
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },
    cardDate: {
        fontSize: 12,
        marginBottom: 12,
    },
    progressBg: {
        height: 5,
        borderRadius: 3,
        overflow: "hidden",
    },
    progressFill: {
        height: 5,
        borderRadius: 3,
    },
    progressLabel: {
        fontSize: 11,
        marginTop: 5,
    },
    /* Delete row */
    cardActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTopWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    deleteBtnText: {
        fontSize: 12,
        fontWeight: "600",
    },
});
