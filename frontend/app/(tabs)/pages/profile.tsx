import { useState, useEffect, useCallback } from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    Switch, StyleSheet, ActivityIndicator, Alert, TextInput, Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import { tokenStorage } from "@/utils/tokenStorage";
import { User } from "@/app/shared/model";
import * as userService from "@/app/shared/service/userService";

export default function Profile() {
    const router = useRouter();
    const { logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const c = theme.colors;

    const [user,        setUser]        = useState<User | null>(null);
    const [loading,     setLoading]     = useState(true);
    const [editVisible, setEditVisible] = useState(false);
    const [editField,   setEditField]   = useState<"name" | "email" | null>(null);
    const [editValue,   setEditValue]   = useState("");
    const [saving,      setSaving]      = useState(false);

    const [pwVisible,   setPwVisible]   = useState(false);
    const [pwCurrent,   setPwCurrent]   = useState("");
    const [pwNew,       setPwNew]       = useState("");
    const [pwConfirm,   setPwConfirm]   = useState("");
    const [pwSaving,    setPwSaving]    = useState(false);
    const [pwError,     setPwError]     = useState<string | null>(null);
    const [pwShowCur,   setPwShowCur]   = useState(false);
    const [pwShowNew,   setPwShowNew]   = useState(false);
    const [pwShowCon,   setPwShowCon]   = useState(false);

    // ── Fetch user ──────────────────────────────────────────────────────────
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getAuthenticatedUser();
            setUser(data);
        } catch (err) {
            Alert.alert("Error", "Could not load profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    // ── Update user ─────────────────────────────────────────────────────────
    const handleEdit = async () => {
        if (!user) return;
        try {
            setSaving(true);
            const updatedUser = { ...user, [editField!]: editValue };
            const res = await userService.updateUser(updatedUser);
            setUser(res);
            setEditVisible(false);
        } catch {
            Alert.alert("Error", "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const openEdit = (field: "name" | "email") => {
        setEditField(field);
        setEditValue(field === "name" ? user?.name ?? "" : user?.email ?? "");
        setEditVisible(true);
    };

    const openChangePassword = () => {
        setPwCurrent(""); setPwNew(""); setPwConfirm("");
        setPwError(null);
        setPwShowCur(false); setPwShowNew(false); setPwShowCon(false);
        setPwVisible(true);
    };

    const handleChangePassword = async () => {
        if (!pwCurrent || !pwNew || !pwConfirm) {
            setPwError("All fields are required."); return;
        }
        if (pwNew.length < 6) {
            setPwError("New password must be at least 6 characters."); return;
        }
        if (pwNew !== pwConfirm) {
            setPwError("New passwords do not match."); return;
        }
        try {
            setPwSaving(true);
            setPwError(null);
            await userService.changePassword(pwCurrent, pwNew);
            setPwVisible(false);
            Alert.alert("Password updated", "Your password has been changed successfully.");
        } catch (err: any) {
            const status = err?.response?.status;
            setPwError(status === 401 ? "Current password is incorrect." : "Failed to update password.");
        } finally {
            setPwSaving(false);
        }
    };

    // ── Logout ──────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        await logout();
        router.replace("/auth/splash");
    };

    // ── Helpers ─────────────────────────────────────────────────────────────
    const initials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const programCount = user?.programs?.length ?? 0;
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—";

    // ── Loading state ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={[s.centered, { backgroundColor: c.background }]}>
                <ActivityIndicator size="large" color={c.accent} />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[s.centered, { backgroundColor: c.background }]}>
                <Text style={[s.errorText, { color: c.text }]}>Failed to load profile.</Text>
                <TouchableOpacity
                    onPress={fetchUser}
                    style={[s.retryBtn, { backgroundColor: c.accent }]}
                >
                    <Text style={[s.retryText, { color: c.accentFg }]}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={[s.root, { backgroundColor: c.background }]}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* ── Profile header ── */}
                <View style={[s.header, { backgroundColor: c.background }]}>
                    <View style={[s.avatar, { backgroundColor: c.accent }]}>
                        <Text style={[s.avatarText, { color: c.accentFg }]}>
                            {initials(user.name)}
                        </Text>
                    </View>
                    <Text style={[s.name, { color: c.text }]}>{user.name}</Text>
                    <Text style={[s.email, { color: c.textSecondary }]}>{user.email}</Text>
                    <Text style={[s.joinedText, { color: c.textMuted }]}>
                        Member since {joinedDate}
                    </Text>
                </View>

                {/* ── Stats row ── */}
                <View style={s.statsRow}>
                    {[
                        { v: String(programCount), l: "Programs" },
                        { v: "—",                  l: "Sessions"  },
                        { v: "—",                  l: "Avg Score" },
                    ].map((stat) => (
                        <View key={stat.l} style={[s.statCard, { backgroundColor: c.surface }]}>
                            <Text style={[s.statValue, { color: c.text }]}>{stat.v}</Text>
                            <Text style={[s.statLabel, { color: c.textMuted }]}>{stat.l}</Text>
                        </View>
                    ))}
                </View>

                {/* ── Account section ── */}
                <View style={s.section}>
                    <Text style={[s.sectionTitle, { color: c.textMuted }]}>ACCOUNT</Text>
                    <View style={[s.card, { backgroundColor: c.surface }]}>
                        {(["name", "email"] as const).map((field, i, arr) => (
                            <View
                                key={field}
                                style={[
                                    s.row,
                                    i < arr.length - 1 && [s.rowBorder, { borderBottomColor: c.border }],
                                ]}
                            >
                                <View style={s.rowTextGroup}>
                                    <Text style={[s.rowLabel, { color: c.textMuted }]}>
                                        {field.toUpperCase()}
                                    </Text>
                                    <Text style={[s.rowValue, { color: c.text }]}>
                                        {field === "name" ? user.name : user.email}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => openEdit(field)}
                                    style={[s.editBtn, { backgroundColor: c.surfaceElevated }]}
                                >
                                    <Ionicons name="pencil-outline" size={15} color={c.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Preferences section ── */}
                <View style={s.section}>
                    <Text style={[s.sectionTitle, { color: c.textMuted }]}>PREFERENCES</Text>
                    <View style={[s.card, { backgroundColor: c.surface }]}>
                        {/* Theme toggle */}
                        <View style={s.row}>
                            <View style={s.rowLeft}>
                                <Ionicons
                                    name={isDark ? "moon" : "sunny"}
                                    size={18}
                                    color={isDark ? c.blue : c.warning}
                                    style={{ marginRight: 12 }}
                                />
                                <View>
                                    <Text style={[s.rowValue, { color: c.text }]}>Appearance</Text>
                                    <Text style={[s.rowSubValue, { color: c.textMuted }]}>
                                        {isDark ? "Dark" : "Light"}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: c.border, true: c.accent }}
                                thumbColor={c.accentFg}
                            />
                        </View>
                    </View>
                </View>

                {/* ── Security section ── */}
                <View style={s.section}>
                    <Text style={[s.sectionTitle, { color: c.textMuted }]}>SECURITY</Text>
                    <TouchableOpacity style={[s.card, s.row, { backgroundColor: c.surface }]} onPress={openChangePassword} activeOpacity={0.75}>
                        <View style={s.rowLeft}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={18}
                                color={c.textSecondary}
                                style={{ marginRight: 12 }}
                            />
                            <Text style={[s.rowValue, { color: c.text }]}>Change password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={c.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* ── Logout ── */}
                <View style={[s.section, { marginTop: 32 }]}>
                    <TouchableOpacity
                        style={[s.logoutButton, { backgroundColor: c.errorBg, borderColor: c.error }]}
                        onPress={handleLogout}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={18}
                            color={c.error}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={[s.logoutText, { color: c.error }]}>Log out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* ── Change-password modal ── */}
            <Modal visible={pwVisible} transparent animationType="fade">
                <View style={[s.modalOverlay, { backgroundColor: c.overlay }]}>
                    <View style={[s.modalCard, { backgroundColor: c.surface }]}>
                        <Text style={[s.modalTitle, { color: c.text }]}>Change Password</Text>

                        {([
                            { label: "Current password", value: pwCurrent, set: setPwCurrent, show: pwShowCur, toggle: setPwShowCur },
                            { label: "New password",     value: pwNew,     set: setPwNew,     show: pwShowNew, toggle: setPwShowNew },
                            { label: "Confirm new",      value: pwConfirm, set: setPwConfirm, show: pwShowCon, toggle: setPwShowCon },
                        ] as const).map((f) => (
                            <View key={f.label} style={[s.pwFieldWrap, { borderColor: c.border, backgroundColor: c.inputBg }]}>
                                <TextInput
                                    style={[s.pwInput, { color: c.text }]}
                                    value={f.value}
                                    onChangeText={f.set}
                                    placeholder={f.label}
                                    placeholderTextColor={c.placeholder}
                                    secureTextEntry={!f.show}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => f.toggle((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                    <Ionicons name={f.show ? "eye-off-outline" : "eye-outline"} size={18} color={c.textMuted} />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {pwError && (
                            <Text style={[s.pwError, { color: c.error }]}>{pwError}</Text>
                        )}

                        <View style={[s.modalActions, { marginTop: 8 }]}>
                            <TouchableOpacity
                                style={[s.modalCancel, { borderColor: c.border }]}
                                onPress={() => setPwVisible(false)}
                                disabled={pwSaving}
                            >
                                <Text style={[s.modalCancelText, { color: c.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.modalSave, { backgroundColor: c.accent }, pwSaving && { opacity: 0.6 }]}
                                onPress={handleChangePassword}
                                disabled={pwSaving}
                            >
                                {pwSaving
                                    ? <ActivityIndicator size="small" color={c.accentFg} />
                                    : <Text style={[s.modalSaveText, { color: c.accentFg }]}>Update</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ── Edit modal ── */}
            <Modal visible={editVisible} transparent animationType="fade">
                <View style={[s.modalOverlay, { backgroundColor: c.overlay }]}>
                    <View style={[s.modalCard, { backgroundColor: c.surface }]}>
                        <Text style={[s.modalTitle, { color: c.text }]}>
                            Edit {editField === "name" ? "Name" : "Email"}
                        </Text>
                        <TextInput
                            style={[
                                s.modalInput,
                                {
                                    backgroundColor: c.inputBg,
                                    borderColor: c.border,
                                    color: c.text,
                                },
                            ]}
                            value={editValue}
                            onChangeText={setEditValue}
                            autoCapitalize={editField === "name" ? "words" : "none"}
                            keyboardType={editField === "email" ? "email-address" : "default"}
                            autoFocus
                            placeholderTextColor={c.placeholder}
                        />
                        <View style={s.modalActions}>
                            <TouchableOpacity
                                style={[s.modalCancel, { borderColor: c.border }]}
                                onPress={() => setEditVisible(false)}
                                disabled={saving}
                            >
                                <Text style={[s.modalCancelText, { color: c.textSecondary }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    s.modalSave,
                                    { backgroundColor: c.accent },
                                    (saving || editValue.trim() === "") && { opacity: 0.5 },
                                ]}
                                onPress={handleEdit}
                                disabled={saving || editValue.trim() === ""}
                            >
                                {saving
                                    ? <ActivityIndicator size="small" color={c.accentFg} />
                                    : <Text style={[s.modalSaveText, { color: c.accentFg }]}>Save</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

// ─── Styles (layout only — colors injected inline) ────────────────────────────

const s = StyleSheet.create({
    root:    { flex: 1 },
    centered:{ flex: 1, alignItems: "center", justifyContent: "center" },
    errorText:{ fontSize: 14, marginBottom: 12 },
    retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
    retryText:{ fontWeight: "600" },

    // Header
    header:     { alignItems: "center", paddingTop: 60, paddingBottom: 28 },
    avatar:     { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 26, fontWeight: "800" },
    name:       { marginTop: 14, fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
    email:      { fontSize: 13, marginTop: 3 },
    joinedText: { fontSize: 11, marginTop: 5 },

    // Stats
    statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 4 },
    statCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
    statValue:{ fontSize: 20, fontWeight: "800" },
    statLabel:{ fontSize: 10, fontWeight: "700", textTransform: "uppercase", marginTop: 3, letterSpacing: 0.5 },

    // Section
    section:      { marginTop: 22, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "700", letterSpacing: 1.2, marginBottom: 8 },
    card:         { borderRadius: 16, overflow: "hidden" },

    // Rows
    row:          { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
    rowLeft:      { flexDirection: "row", alignItems: "center", flex: 1 },
    rowBorder:    { borderBottomWidth: StyleSheet.hairlineWidth },
    rowTextGroup: { flex: 1 },
    rowLabel:     { fontSize: 10, fontWeight: "600", textTransform: "uppercase", marginBottom: 3 },
    rowValue:     { fontSize: 14, fontWeight: "600" },
    rowSubValue:  { fontSize: 11, marginTop: 1 },
    editBtn:      { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },

    // Logout
    logoutButton: { height: 52, borderRadius: 12, alignItems: "center",
                    justifyContent: "center", flexDirection: "row",
                    borderWidth: StyleSheet.hairlineWidth },
    logoutText:   { fontSize: 15, fontWeight: "700" },

    // Modal
    modalOverlay: { flex: 1, alignItems: "center", justifyContent: "center" },
    modalCard:    { borderRadius: 20, padding: 24, width: "85%" },
    modalTitle:   { fontSize: 17, fontWeight: "700", marginBottom: 16 },
    modalInput:   {
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
        fontSize: 14, borderWidth: 1, marginBottom: 20,
    },
    modalActions:     { flexDirection: "row", gap: 12 },
    modalCancel:      { flex: 1, height: 46, borderRadius: 10, borderWidth: 1,
                        alignItems: "center", justifyContent: "center" },
    modalCancelText:  { fontWeight: "600" },
    modalSave:        { flex: 1, height: 46, borderRadius: 10,
                        alignItems: "center", justifyContent: "center" },
    modalSaveText:    { fontWeight: "700" },

    pwFieldWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        marginBottom: 12,
        height: 48,
    },
    pwInput: { flex: 1, fontSize: 14 },
    pwError: { fontSize: 12, fontWeight: "600", marginBottom: 8, textAlign: "center" },
});
