import { useState, useEffect, useCallback } from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    Switch, StyleSheet, ActivityIndicator, Alert, TextInput, Modal
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";
import {tokenStorage} from "@/utils/tokenStorage";
import {User} from "@/app/shared/model";

import * as userService from "@/app/shared/service/userService";


export default function Profile() {
    const router = useRouter();
    const { logout } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [push, setPush] = useState(true);
    const [dark, setDark] = useState(false);

    // Edit name modal state
    const [editVisible, setEditVisible] = useState(false);
    const [editField, setEditField] = useState<"name" | "email" | null>(null);
    const [editValue, setEditValue] = useState("");
    const [saving, setSaving] = useState(false);

    // ── Fetch user by stored email ──────────────────────────────────────────
    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            console.log("TEEEEEST")

            const data = await userService.getAuthenticatedUser();
            console.log(data)
            setUser(data);

        } catch (err) {
            Alert.alert("Error", "Could not load profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // ── Update user (PUT /api/user/update) ──────────────────────────────────
    const handleEdit = async () => {
        if (!user) return;

        try {
            setSaving(true);

            const updatedUser = {
                ...user,
                [editField!]: editValue
            };

            const res = await userService.updateUser(updatedUser);
            setUser(res);

            setEditVisible(false);
        } catch (e) {
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

    // ── Render ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Failed to load profile.</Text>
                <TouchableOpacity onPress={fetchUser} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials(user.name)}</Text>
                    </View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <Text style={styles.joinedText}>Member since {joinedDate}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        { v: String(programCount), l: "Programs" },
                        { v: "—", l: "Sessions" },
                        { v: "—", l: "Avg Score" },
                    ].map((s) => (
                        <View key={s.l} style={styles.statCard}>
                            <Text style={styles.statValue}>{s.v}</Text>
                            <Text style={styles.statLabel}>{s.l}</Text>
                        </View>
                    ))}
                </View>

                {/* Personal info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PERSONAL INFO</Text>
                    <View style={styles.card}>
                        {(["name", "email"] as const).map((field, i, arr) => (
                            <View key={field} style={[styles.row, i < arr.length - 1 && styles.rowBorder]}>
                                <View>
                                    <Text style={styles.rowLabel}>{field.toUpperCase()}</Text>
                                    <Text style={styles.rowValue}>
                                        {field === "name" ? user.name : user.email}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => openEdit(field)}>
                                    <Text style={styles.editIcon}>✏️</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Security */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SECURITY</Text>
                    <TouchableOpacity style={[styles.card, styles.row]}>
                        <Text style={styles.rowValue}>Change password</Text>
                        <Text style={{ color: "#64748b" }}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PREFERENCES</Text>
                    <View style={styles.card}>
                        <View style={[styles.row, styles.rowBorder]}>
                            <Text style={styles.rowValue}>Push notifications</Text>
                            <Switch value={push} onValueChange={setPush} trackColor={{ true: "#3b82f6" }} />
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowValue}>Dark mode</Text>
                            <Switch value={dark} onValueChange={setDark} trackColor={{ true: "#3b82f6" }} />
                        </View>
                    </View>
                </View>

                {/* Logout */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>🚪  Log out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            Edit {editField === "name" ? "Name" : "Email"}
                        </Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editValue}
                            onChangeText={setEditValue}
                            autoCapitalize={editField === "name" ? "words" : "none"}
                            keyboardType={editField === "email" ? "email-address" : "default"}
                            autoFocus
                            placeholderTextColor="#64748b"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancel}
                                onPress={() => setEditVisible(false)}
                                disabled={saving}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalSave}
                                onPress={handleEdit}
                                disabled={saving || editValue.trim() === ""}
                            >
                                {saving
                                    ? <ActivityIndicator size="small" color="#fff" />
                                    : <Text style={styles.modalSaveText}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    centered: { flex: 1, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center" },
    errorText: { color: "#f1f5f9", fontSize: 14, marginBottom: 12 },
    retryBtn: { backgroundColor: "#3b82f6", paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
    retryText: { color: "#fff", fontWeight: "600" },

    header: { alignItems: "center", backgroundColor: "#0f172a", paddingTop: 56, paddingBottom: 32 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 24, fontWeight: "800", color: "#fff" },
    name: { marginTop: 12, fontSize: 20, fontWeight: "700", color: "#fff" },
    email: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
    joinedText: { fontSize: 11, color: "#475569", marginTop: 4 },

    statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginTop: -16 },
    statCard: { flex: 1, backgroundColor: "#1e293b", borderRadius: 12, padding: 12, alignItems: "center" },
    statValue: { fontSize: 18, fontWeight: "800", color: "#f1f5f9" },
    statLabel: { fontSize: 10, fontWeight: "600", color: "#64748b", textTransform: "uppercase", marginTop: 2 },

    section: { marginTop: 20, paddingHorizontal: 16 },
    sectionTitle: { fontSize: 10, fontWeight: "700", color: "#64748b", letterSpacing: 1, marginBottom: 8 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, overflow: "hidden" },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: "#334155" },
    rowLabel: { fontSize: 10, fontWeight: "600", color: "#64748b", textTransform: "uppercase" },
    rowValue: { fontSize: 14, fontWeight: "600", color: "#f1f5f9" },
    editIcon: { fontSize: 14 },

    logoutButton: { height: 52, backgroundColor: "#ef4444", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    logoutText: { color: "#fff", fontSize: 15, fontWeight: "600" },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
    modalCard: { backgroundColor: "#1e293b", borderRadius: 16, padding: 24, width: "85%" },
    modalTitle: { fontSize: 16, fontWeight: "700", color: "#f1f5f9", marginBottom: 16 },
    modalInput: {
        backgroundColor: "#0f172a", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
        color: "#f1f5f9", fontSize: 14, borderWidth: 1, borderColor: "#334155", marginBottom: 20,
    },
    modalActions: { flexDirection: "row", gap: 12 },
    modalCancel: { flex: 1, height: 44, borderRadius: 8, borderWidth: 1, borderColor: "#334155", alignItems: "center", justifyContent: "center" },
    modalCancelText: { color: "#94a3b8", fontWeight: "600" },
    modalSave: { flex: 1, height: 44, borderRadius: 8, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    modalSaveText: { color: "#fff", fontWeight: "600" },
});