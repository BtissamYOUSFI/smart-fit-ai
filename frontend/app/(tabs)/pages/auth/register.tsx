// app/auth/register.tsx
import { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
// import { register } from "@/services/auth.service";

const GOALS = [
    { key: "muscle",  icon: "💪", label: "Muscles" },
    { key: "weight",  icon: "🔥", label: "Perte poids" },
    { key: "wellness",icon: "🧘", label: "Bien-être" },
];

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName,  setLastName]  = useState("");
    const [email,     setEmail]     = useState("");
    const [password,  setPassword]  = useState("");
    const [goal,      setGoal]      = useState("muscle");
    const [agreed,    setAgreed]    = useState(false);
    const [loading,   setLoading]   = useState(false);

    const handleRegister = async () => {
        if (!agreed) return Alert.alert("Veuillez accepter les conditions.");
        if (!firstName || !email || !password)
            return Alert.alert("Tous les champs sont requis.");
        try {
            setLoading(true);
            // await register({ firstName, lastName, email, password, goal });
            router.replace("/(tabs)");
        } catch {
            Alert.alert("Erreur", "Inscription impossible, réessayez.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

                {/* Barre de progression */}
                <View style={s.stepRow}>
                    {[1, 0.5, 0].map((fill, i) => (
                        <View key={i} style={s.stepTrack}>
                            <View style={[s.stepFill, { flex: fill }]} />
                        </View>
                    ))}
                </View>

                <Text style={s.title}>CRÉER{"\n"}
                    <Text style={s.accent}>UN COMPTE</Text>
                </Text>
                <Text style={s.subtitle}>Étape 2 sur 3 — Infos personnelles</Text>

                {/* Avatar */}
                <TouchableOpacity style={s.avatarRing}>
                    <View style={s.avatarInner}>
                        <Text style={{ fontSize: 28 }}>👤</Text>
                    </View>
                    <View style={s.avatarPlus}><Text style={s.avatarPlusText}>+</Text></View>
                </TouchableOpacity>

                {/* Prénom / Nom */}
                <View style={s.row2}>
                    <View style={{ flex: 1 }}>
                        <Text style={s.label}>PRÉNOM</Text>
                        <View style={s.field}>
                            <TextInput style={s.input} placeholder="Karim"
                                       placeholderTextColor="#444" value={firstName}
                                       onChangeText={setFirstName} />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.label}>NOM</Text>
                        <View style={s.field}>
                            <TextInput style={s.input} placeholder="Benali"
                                       placeholderTextColor="#444" value={lastName}
                                       onChangeText={setLastName} />
                        </View>
                    </View>
                </View>

                <Text style={s.label}>EMAIL</Text>
                <View style={s.field}>
                    <TextInput style={s.input} placeholder="votre@email.com"
                               placeholderTextColor="#444" value={email}
                               onChangeText={setEmail} keyboardType="email-address"
                               autoCapitalize="none" />
                </View>

                <Text style={s.label}>MOT DE PASSE</Text>
                <View style={s.field}>
                    <TextInput style={s.input} placeholder="Min. 8 caractères"
                               placeholderTextColor="#444" value={password}
                               onChangeText={setPassword} secureTextEntry />
                </View>

                {/* Objectif */}
                <Text style={s.label}>OBJECTIF FITNESS</Text>
                <View style={s.goalRow}>
                    {GOALS.map((g) => (
                        <TouchableOpacity
                            key={g.key}
                            style={[s.goalChip, goal === g.key && s.goalChipActive]}
                            onPress={() => setGoal(g.key)}
                        >
                            <Text style={{ fontSize: 20 }}>{g.icon}</Text>
                            <Text style={[s.goalLabel, goal === g.key && s.goalLabelActive]}>
                                {g.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CGU */}
                <TouchableOpacity style={s.terms} onPress={() => setAgreed(!agreed)}>
                    <View style={[s.checkbox, agreed && s.checkboxOn]}>
                        {agreed && <Text style={s.checkmark}>✓</Text>}
                    </View>
                    <Text style={s.termsText}>
                        Jaccepte les{" "}
                        <Text style={s.termsLink}>conditions dutilisation</Text>
                        {" "}et la{" "}
                        <Text style={s.termsLink}>politique de confidentialité</Text>
                    </Text>
                </TouchableOpacity>

                {/* Bouton */}
                <TouchableOpacity onPress={handleRegister} disabled={loading}>
                    <LinearGradient
                        colors={["#534ab7", "#3c3489"]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={s.btn}
                    >
                        <Text style={s.btnText}>
                            {loading ? "CRÉATION..." : "CRÉER MON COMPTE"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={s.login}>
                    Déjà un compte ?{" "}
                    <Text style={s.loginLink} onPress={() => router.back()}>
                        Se connecter
                    </Text>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe:          { flex: 1, backgroundColor: "#0c0c0f" },
    scroll:        { paddingHorizontal: 28, paddingTop: 40, paddingBottom: 40 },
    stepRow:       { flexDirection: "row", gap: 6, marginBottom: 28 },
    stepTrack:     { flex: 1, height: 3, backgroundColor: "#1e1e2a",
        borderRadius: 2, flexDirection: "row", overflow: "hidden" },
    stepFill:      { backgroundColor: "#534ab7" },
    title:         { fontSize: 44, color: "#f0ede8", lineHeight: 44,
        fontFamily: "BebasNeue_400Regular", marginBottom: 4 },
    accent:        { color: "#534ab7" },
    subtitle:      { fontSize: 12, color: "#5f5e5a", marginBottom: 24, lineHeight: 18 },
    avatarRing:    { width: 72, height: 72, borderRadius: 36,
        borderWidth: 1.5, borderStyle: "dashed", borderColor: "#2a2a35",
        alignSelf: "center", alignItems: "center", justifyContent: "center",
        marginBottom: 28, position: "relative" },
    avatarInner:   { width: 56, height: 56, borderRadius: 28,
        backgroundColor: "#16161d", alignItems: "center",
        justifyContent: "center" },
    avatarPlus:    { position: "absolute", bottom: 2, right: 2, width: 20, height: 20,
        borderRadius: 10, backgroundColor: "#534ab7",
        alignItems: "center", justifyContent: "center" },
    avatarPlusText:{ color: "#fff", fontSize: 14, lineHeight: 20 },
    row2:          { flexDirection: "row", gap: 10, marginBottom: 0 },
    label:         { fontSize: 11, color: "#5f5e5a", letterSpacing: 0.8, marginBottom: 8 },
    field:         { backgroundColor: "#16161d", borderWidth: 0.5, borderColor: "#2a2a35",
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13,
        marginBottom: 12 },
    input:         { color: "#d3d1c7", fontSize: 14 },
    goalRow:       { flexDirection: "row", gap: 8, marginBottom: 20 },
    goalChip:      { flex: 1, backgroundColor: "#16161d", borderWidth: 0.5,
        borderColor: "#2a2a35", borderRadius: 10, paddingVertical: 9,
        alignItems: "center" },
    goalChipActive:{ backgroundColor: "rgba(83,74,183,0.15)", borderColor: "#534ab7" },
    goalLabel:     { fontSize: 11, color: "#888780", marginTop: 3 },
    goalLabelActive:{ color: "#9f98e8" },
    terms:         { flexDirection: "row", alignItems: "flex-start",
        gap: 10, marginBottom: 24 },
    checkbox:      { width: 18, height: 18, borderRadius: 5, borderWidth: 0.5,
        borderColor: "#2a2a35", backgroundColor: "#16161d",
        alignItems: "center", justifyContent: "center", marginTop: 1 },
    checkboxOn:    { backgroundColor: "#534ab7", borderColor: "#534ab7" },
    checkmark:     { color: "#fff", fontSize: 11, fontWeight: "500" },
    termsText:     { flex: 1, fontSize: 11, color: "#5f5e5a", lineHeight: 18 },
    termsLink:     { color: "#534ab7" },
    btn:           { borderRadius: 16, paddingVertical: 16, alignItems: "center",
        marginBottom: 16 },
    btnText:       { color: "#fff", fontSize: 16,
        fontFamily: "BebasNeue_400Regular", letterSpacing: 2 },
    login:         { textAlign: "center", fontSize: 12, color: "#5f5e5a" },
    loginLink:     { color: "#1d9e75", fontWeight: "500" },
});