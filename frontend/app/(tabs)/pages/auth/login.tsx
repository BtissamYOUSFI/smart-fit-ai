// app/auth/login.tsx
import { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, KeyboardAvoidingView,
    Platform, Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
// import { login } from "@/services/auth.service";

const { width } = Dimensions.get("window");

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            // const res = await login({ email, password });
            // stocker le token + naviguer
            router.replace("/(tabs)");
        } catch (e) {
            alert("Identifiants incorrects");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={s.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={s.flex}
            >
                {/* Badge */}
                <View style={s.badge}>
                    <View style={s.dot} />
                    <Text style={s.badgeText}>SMART FIT AI</Text>
                </View>

                {/* Titre */}
                <Text style={s.title}>BON{"\n"}
                    <Text style={s.titleAccent}>RETOUR</Text>
                </Text>
                <Text style={s.subtitle}>
                    Continuez votre progression.{"\n"}Votre corps vous remerciera.
                </Text>

                {/* Stats */}
                <View style={s.statRow}>
                    {[
                        { n: "12k", l: "Utilisateurs" },
                        { n: "98%", l: "Satisfaction" },
                        { n: "4.9★", l: "Note" },
                    ].map((stat) => (
                        <View key={stat.l} style={s.stat}>
                            <Text style={s.statN}>{stat.n}</Text>
                            <Text style={s.statL}>{stat.l}</Text>
                        </View>
                    ))}
                </View>

                {/* Champs */}
                <Text style={s.label}>EMAIL</Text>
                <View style={s.field}>
                    <TextInput
                        style={s.input}
                        placeholder="votre@email.com"
                        placeholderTextColor="#444"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <Text style={s.label}>Password</Text>
                <View style={s.field}>
                    <TextInput
                        style={s.input}
                        placeholder="••••••••"
                        placeholderTextColor="#444"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <Text style={s.forgot}>Mot de passe oublié ?</Text>

                {/* Bouton */}
                <TouchableOpacity onPress={handleLogin} disabled={loading}>
                    <LinearGradient
                        colors={["#1d9e75", "#0f6e56"]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={s.btn}
                    >
                        <Text style={s.btnText}>
                            {loading ? "CONNEXION..." : "SE CONNECTER"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Inscription */}
                <Text style={s.register}>
                    Pas encore de compte ?{" "}
                    <Text style={s.registerLink} onPress={() => router.push("/pages/auth/register")}>
                        Créer un compte
                    </Text>
                </Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe:     { flex: 1, backgroundColor: "#0c0c0f" },
    flex:        { flex: 1, paddingHorizontal: 28, paddingTop: 40 },
    badge:       { flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "rgba(29,158,117,0.12)",
        borderWidth: 0.5, borderColor: "rgba(29,158,117,0.3)",
        borderRadius: 20, paddingVertical: 5, paddingHorizontal: 12,
        alignSelf: "flex-start", marginBottom: 28 },
    dot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1d9e75" },
    badgeText:   { fontSize: 11, color: "#1d9e75", fontWeight: "500", letterSpacing: 0.5 },
    title:       { fontSize: 52, color: "#f0ede8", lineHeight: 50,
        fontFamily: "BebasNeue_400Regular", marginBottom: 6 },
    titleAccent: { color: "#1d9e75" },
    subtitle:    { fontSize: 13, color: "#888780", marginBottom: 28, lineHeight: 20 },
    statRow:     { flexDirection: "row", gap: 10, marginBottom: 32 },
    stat:        { flex: 1, backgroundColor: "#16161d",
        borderWidth: 0.5, borderColor: "#1e1e2a",
        borderRadius: 12, padding: 10 },
    statN:       { fontSize: 22, color: "#f0ede8", fontFamily: "BebasNeue_400Regular" },
    statL:       { fontSize: 10, color: "#5f5e5a", marginTop: 2 },
    label:       { fontSize: 11, color: "#5f5e5a", letterSpacing: 0.8, marginBottom: 8 },
    field:       { backgroundColor: "#16161d", borderWidth: 0.5, borderColor: "#2a2a35",
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
        marginBottom: 14 },
    input:       { color: "#d3d1c7", fontSize: 14 },
    forgot:      { color: "#534ab7", fontSize: 12, textAlign: "right",
        marginTop: -6, marginBottom: 24 },
    btn:         { borderRadius: 16, paddingVertical: 16, alignItems: "center",
        marginBottom: 24 },
    btnText:     { color: "#fff", fontSize: 16, fontFamily: "BebasNeue_400Regular",
        letterSpacing: 2 },
    register:    { textAlign: "center", fontSize: 12, color: "#5f5e5a" },
    registerLink:{ color: "#1d9e75", fontWeight: "500" },
});