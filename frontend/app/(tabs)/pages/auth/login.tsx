import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        const er: Record<string, string> = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email";
        if (password.length < 6) er.password = "At least 6 characters";
        setErrors(er);
        if (Object.keys(er).length) return;
        setLoading(true);
        try {
            // await login(email, password);
            router.replace("/(tabs)/pages/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Login to continue your training.</Text>

                <View style={styles.form}>
                    {/* Email */}
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#64748b"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                        {errors.email && <Text style={styles.error}>{errors.email}</Text>}
                    </View>

                    {/* Password */}
                    <View>
                        <View style={styles.passwordHeader}>
                            <Text style={styles.label}>Password</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                secureTextEntry={!showPw}
                                style={[styles.input, { paddingRight: 44 }]}
                            />
                            <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.eyeButton}>
                                <Text style={styles.eyeText}>{showPw ? "🙈" : "👁️"}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.error}>{errors.password}</Text>}
                    </View>

                    {/* Submit */}
                    <TouchableOpacity onPress={onSubmit} disabled={loading} style={[styles.button, loading && { opacity: 0.7 }]}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    No account yet?{" "}
                    <Link href="/(tabs)/pages/auth/register" style={styles.linkText}>
                        Register
                    </Link>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", backgroundColor: "#0f172a", padding: 20 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 24 },
    title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
    subtitle: { marginTop: 4, fontSize: 13, color: "#94a3b8" },
    form: { marginTop: 24, gap: 16 },
    label: { fontSize: 12, fontWeight: "600", color: "#f1f5f9", marginBottom: 6 },
    input: { height: 48, borderWidth: 1, borderColor: "#334155", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", backgroundColor: "#0f172a" },
    error: { marginTop: 4, fontSize: 12, color: "#ef4444" },
    passwordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    forgotText: { fontSize: 12, fontWeight: "600", color: "#3b82f6" },
    eyeButton: { position: "absolute", right: 10, top: 12 },
    eyeText: { fontSize: 16 },
    button: { height: 52, backgroundColor: "#3b82f6", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 8 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    footerText: { marginTop: 24, textAlign: "center", fontSize: 13, color: "#94a3b8" },
    linkText: { fontWeight: "600", color: "#3b82f6" },
});