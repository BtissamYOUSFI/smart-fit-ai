import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";

function Field({
                   label,
                   type = "text",
                   value,
                   onChange,
                   error,
                   placeholder,
                   showToggle,
                   showValue,
                   onToggle,
               }: {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    showToggle?: boolean;
    showValue?: boolean;
    onToggle?: () => void;
}) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="#64748b"
                    secureTextEntry={type === "password" && !showValue}
                    keyboardType={type === "email" ? "email-address" : "default"}
                    autoCapitalize="none"
                    style={[styles.input, showToggle && { paddingRight: 44 }]}
                />
                {showToggle && (
                    <TouchableOpacity onPress={onToggle} style={styles.eyeButton}>
                        <Text style={styles.eyeText}>{showValue ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = "Name is required";
        if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
        if (password.length < 6) e.password = "At least 6 characters";
        if (confirm !== password) e.confirm = "Passwords don't match";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            // await register(name, email, password);
            router.replace("/(tabs)/pages/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create your account</Text>
                <Text style={styles.subtitle}>Start training with SmartFit AI today.</Text>

                <View style={styles.form}>
                    <Field label="Full name" value={name} onChange={setName} error={errors.name} placeholder="Alex Martin" />
                    <Field label="Email" type="email" value={email} onChange={setEmail} error={errors.email} placeholder="you@example.com" />
                    <Field
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        error={errors.password}
                        placeholder="••••••••"
                        showToggle
                        showValue={showPw}
                        onToggle={() => setShowPw((s) => !s)}
                    />
                    <Field
                        label="Confirm password"
                        type="password"
                        value={confirm}
                        onChange={setConfirm}
                        error={errors.confirm}
                        placeholder="••••••••"
                        showToggle
                        showValue={showCpw}
                        onToggle={() => setShowCpw((s) => !s)}
                    />

                    <TouchableOpacity onPress={onSubmit} disabled={loading} style={[styles.button, loading && { opacity: 0.7 }]}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Link href="/(tabs)/pages/auth/login" style={styles.linkText}>
                        Login
                    </Link>
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: "center", backgroundColor: "#0f172a", padding: 20 },
    card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 24 },
    title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
    subtitle: { marginTop: 4, fontSize: 13, color: "#94a3b8", marginBottom: 24 },
    form: { gap: 16 },
    label: { fontSize: 12, fontWeight: "600", color: "#f1f5f9", marginBottom: 6 },
    inputWrapper: { position: "relative" },
    input: { height: 48, borderWidth: 1, borderColor: "#334155", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", backgroundColor: "#0f172a" },
    eyeButton: { position: "absolute", right: 10, top: 12 },
    eyeText: { fontSize: 16 },
    error: { marginTop: 4, fontSize: 12, color: "#ef4444" },
    button: { height: 52, backgroundColor: "#3b82f6", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 8 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    footerText: { marginTop: 24, textAlign: "center", fontSize: 13, color: "#94a3b8" },
    linkText: { fontWeight: "600", color: "#3b82f6" },
});