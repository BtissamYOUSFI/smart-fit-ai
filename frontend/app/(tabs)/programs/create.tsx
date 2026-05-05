import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createProgram, ApiError } from "@/app/shared/service/trainingProgramApi";
import { tokenStorage } from "@/utils/tokenStorage";

type Mode = "repeat" | "monthly" | "weekly";

const MODES: { id: Mode; title: string; desc: string; icon: string }[] = [
    { id: "repeat",  title: "Repeat same week",  desc: "One week template repeated throughout", icon: "🔁" },
    { id: "monthly", title: "Monthly cycle",      desc: "4 weekly patterns cycling each month",  icon: "📅" },
    { id: "weekly",  title: "Week by week",       desc: "Plan each week independently",           icon: "📋" },
];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(val: string): boolean {
    if (!DATE_REGEX.test(val)) return false;
    const d = new Date(val);
    return !isNaN(d.getTime());
}

export default function CreateProgram() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [mode, setMode] = useState<Mode>("repeat");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ title?: string; start?: string; end?: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);

    function validate(): boolean {
        const errors: typeof fieldErrors = {};
        if (!title.trim()) errors.title = "Title is required.";
        if (!validateDate(start)) errors.start = "Enter a valid date (YYYY-MM-DD).";
        if (!validateDate(end)) errors.end = "Enter a valid date (YYYY-MM-DD).";
        if (!errors.start && !errors.end && end <= start) {
            errors.end = "End date must be after start date.";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit() {
        setApiError(null);
        if (!validate()) return;

        try {
            setLoading(true);
            const email = await tokenStorage.getEmail?.() ?? "";
            const created = await createProgram({
                title: title.trim(),
                startDate: start,
                endDate: end,
                userEmail: email,
                weeklyTemplates: [],
                programWeeks: [],
            });
            // Navigate to the new program's detail page
            router.replace({
                pathname: "/programs/[id]",
                params: { id: String(created.id) },
            });
        } catch (err) {
            if (err instanceof ApiError) {
                if (err.status === 409) {
                    setFieldErrors((prev) => ({ ...prev, title: "A program with this title already exists." }));
                } else {
                    setApiError(err.message);
                }
            } else {
                setApiError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Program</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                {/* API-level error */}
                {apiError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{apiError}</Text>
                    </View>
                )}

                {/* Title */}
                <Text style={styles.label}>Program title</Text>
                <TextInput
                    value={title}
                    onChangeText={(v) => { setTitle(v); setFieldErrors((p) => ({ ...p, title: undefined })); }}
                    placeholder="e.g. Summer Strength"
                    placeholderTextColor="#64748b"
                    style={[styles.input, fieldErrors.title && styles.inputError]}
                />
                {fieldErrors.title && <Text style={styles.fieldError}>{fieldErrors.title}</Text>}

                {/* Dates */}
                <View style={styles.dateRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>Start date</Text>
                        <TextInput
                            value={start}
                            onChangeText={(v) => { setStart(v); setFieldErrors((p) => ({ ...p, start: undefined })); }}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#64748b"
                            style={[styles.input, fieldErrors.start && styles.inputError]}
                        />
                        {fieldErrors.start && <Text style={styles.fieldError}>{fieldErrors.start}</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.label}>End date</Text>
                        <TextInput
                            value={end}
                            onChangeText={(v) => { setEnd(v); setFieldErrors((p) => ({ ...p, end: undefined })); }}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#64748b"
                            style={[styles.input, fieldErrors.end && styles.inputError]}
                        />
                        {fieldErrors.end && <Text style={styles.fieldError}>{fieldErrors.end}</Text>}
                    </View>
                </View>

                {/* Mode */}
                <Text style={[styles.label, { marginTop: 8 }]}>Schedule mode</Text>
                <View style={{ gap: 8 }}>
                    {MODES.map(({ id, title: t, desc, icon }) => {
                        const selected = mode === id;
                        return (
                            <TouchableOpacity
                                key={id}
                                onPress={() => setMode(id)}
                                style={[styles.modeCard, selected && styles.modeCardActive]}
                            >
                                <View style={[styles.modeIcon, selected && styles.modeIconActive]}>
                                    <Text style={{ fontSize: 22 }}>{icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modeTitle}>{t}</Text>
                                    <Text style={styles.modeDesc}>{desc}</Text>
                                </View>
                                {selected && <Text style={{ color: "#3b82f6", fontSize: 18 }}>✓</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.mainButton, loading && styles.mainButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.mainButtonText}>Create Program</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
    back: { color: "#3b82f6", fontSize: 16, width: 48 },
    headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9" },
    errorBanner: { backgroundColor: "#450a0a", borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: "#ef4444" },
    errorBannerText: { color: "#fca5a5", fontSize: 13 },
    label: { fontSize: 11, fontWeight: "700", color: "#64748b", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" },
    input: { height: 48, backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", marginBottom: 4, borderWidth: 1, borderColor: "transparent" },
    inputError: { borderColor: "#ef4444" },
    fieldError: { fontSize: 11, color: "#ef4444", marginBottom: 10 },
    dateRow: { flexDirection: "row", gap: 12 },
    modeCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1e293b", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "transparent" },
    modeCardActive: { borderColor: "#3b82f6", backgroundColor: "#1e3a5f" },
    modeIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
    modeIconActive: { backgroundColor: "#3b82f6" },
    modeTitle: { fontSize: 14, fontWeight: "700", color: "#f1f5f9" },
    modeDesc: { fontSize: 12, color: "#64748b", marginTop: 2 },
    mainButton: { marginTop: 24, height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    mainButtonDisabled: { opacity: 0.6 },
    mainButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});

// import { useState } from "react";
// import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
//
// type Mode = "repeat" | "monthly" | "weekly";
//
// const MODES: { id: Mode; title: string; desc: string; icon: string }[] = [
//     { id: "repeat",  title: "Repeat same week",  desc: "One week template repeated throughout", icon: "🔁" },
//     { id: "monthly", title: "Monthly cycle",      desc: "4 weekly patterns cycling each month",  icon: "📅" },
//     { id: "weekly",  title: "Week by week",       desc: "Plan each week independently",           icon: "📋" },
// ];
//
// export default function CreateProgram() {
//     const router = useRouter();
//     const [title, setTitle] = useState("");
//     const [start, setStart] = useState("");
//     const [end, setEnd] = useState("");
//     const [mode, setMode] = useState<Mode>("repeat");
//
//     return (
//         <View style={styles.root}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()}>
//                     <Text style={styles.back}>‹ Back</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>New Program</Text>
//                 <View style={{ width: 48 }} />
//             </View>
//
//             <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
//                 {/* Title */}
//                 <Text style={styles.label}>Program title</Text>
//                 <TextInput
//                     value={title}
//                     onChangeText={setTitle}
//                     placeholder="e.g. Summer Strength"
//                     placeholderTextColor="#64748b"
//                     style={styles.input}
//                 />
//
//                 {/* Dates */}
//                 <View style={styles.dateRow}>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.label}>Start date</Text>
//                         <TextInput
//                             value={start}
//                             onChangeText={setStart}
//                             placeholder="YYYY-MM-DD"
//                             placeholderTextColor="#64748b"
//                             style={styles.input}
//                         />
//                     </View>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.label}>End date</Text>
//                         <TextInput
//                             value={end}
//                             onChangeText={setEnd}
//                             placeholder="YYYY-MM-DD"
//                             placeholderTextColor="#64748b"
//                             style={styles.input}
//                         />
//                     </View>
//                 </View>
//
//                 {/* Mode */}
//                 <Text style={[styles.label, { marginTop: 8 }]}>SCHEDULE MODE</Text>
//                 <View style={{ gap: 8 }}>
//                     {MODES.map(({ id, title: t, desc, icon }) => {
//                         const selected = mode === id;
//                         return (
//                             <TouchableOpacity
//                                 key={id}
//                                 onPress={() => setMode(id)}
//                                 style={[styles.modeCard, selected && styles.modeCardActive]}
//                             >
//                                 <View style={[styles.modeIcon, selected && styles.modeIconActive]}>
//                                     <Text style={{ fontSize: 22 }}>{icon}</Text>
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.modeTitle}>{t}</Text>
//                                     <Text style={styles.modeDesc}>{desc}</Text>
//                                 </View>
//                             </TouchableOpacity>
//                         );
//                     })}
//                 </View>
//
//                 <TouchableOpacity
//                     style={styles.mainButton}
//                     onPress={() => router.push(`/(tabs)/pages/templateBuilder?id=new` as any)}
//                 >
//                     <Text style={styles.mainButtonText}>Continue</Text>
//                 </TouchableOpacity>
//             </ScrollView>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     root: { flex: 1, backgroundColor: "#0f172a" },
//     header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
//     back: { color: "#3b82f6", fontSize: 16, width: 48 },
//     headerTitle: { fontSize: 17, fontWeight: "700", color: "#f1f5f9" },
//     label: { fontSize: 11, fontWeight: "700", color: "#64748b", letterSpacing: 0.5, marginBottom: 6, textTransform: "uppercase" },
//     input: { height: 48, backgroundColor: "#1e293b", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", marginBottom: 16 },
//     dateRow: { flexDirection: "row", gap: 12 },
//     modeCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#1e293b", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "transparent" },
//     modeCardActive: { borderColor: "#3b82f6", backgroundColor: "#1e3a5f" },
//     modeIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
//     modeIconActive: { backgroundColor: "#3b82f6" },
//     modeTitle: { fontSize: 14, fontWeight: "700", color: "#f1f5f9" },
//     modeDesc: { fontSize: 12, color: "#64748b", marginTop: 2 },
//     mainButton: { marginTop: 24, height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
//     mainButtonText: { color: "#fff", fontSize: 15, fontWeight: "600" },
// });