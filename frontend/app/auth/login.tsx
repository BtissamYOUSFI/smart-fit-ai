import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "@/app/context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { login, loading, error, clearError } = useAuth();

    useEffect(() => { clearError(); }, []);

    const onSubmit = async () => {
        const er: Record<string, string> = {};
        if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email";
        if (password.length < 6) er.password = "At least 6 characters";
        setErrors(er);
        if (Object.keys(er).length) return;
        await login(email, password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Login to continue your training.</Text>

                {/* ✅ Erreur API bien placée */}
                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>⚠️  {error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(v) => { setEmail(v); clearError(); }}
                            placeholder="you@example.com"
                            placeholderTextColor="#64748b"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={[styles.input, errors.email && styles.inputError]}
                        />
                        {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
                    </View>

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
                                onChangeText={(v) => { setPassword(v); clearError(); }}
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                secureTextEntry={!showPw}
                                style={[styles.input, { paddingRight: 44 }, errors.password && styles.inputError]}
                            />
                            <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.eyeButton}>
                                <Text style={styles.eyeText}>{showPw ? "🙈" : "👁️"}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
                    </View>

                    <TouchableOpacity onPress={onSubmit} disabled={loading} style={[styles.button, loading && { opacity: 0.7 }]}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    No account yet?{" "}
                    <Link href="/auth/register" style={styles.linkText}>Register</Link>
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
    errorBanner: { marginTop: 16, backgroundColor: "#7f1d1d", borderWidth: 1, borderColor: "#ef4444", borderRadius: 8, padding: 12 },
    errorBannerText: { color: "#fca5a5", fontSize: 13, fontWeight: "600" },
    form: { marginTop: 24, gap: 16 },
    label: { fontSize: 12, fontWeight: "600", color: "#f1f5f9", marginBottom: 6 },
    input: { height: 48, borderWidth: 1, borderColor: "#334155", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", backgroundColor: "#0f172a" },
    inputError: { borderColor: "#ef4444" },
    fieldError: { marginTop: 4, fontSize: 12, color: "#ef4444" },
    passwordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    forgotText: { fontSize: 12, fontWeight: "600", color: "#3b82f6" },
    eyeButton: { position: "absolute", right: 10, top: 12 },
    eyeText: { fontSize: 16 },
    button: { height: 52, backgroundColor: "#3b82f6", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 8 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    footerText: { marginTop: 24, textAlign: "center", fontSize: 13, color: "#94a3b8" },
    linkText: { fontWeight: "600", color: "#3b82f6" },
});
// import { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import {Link, router, useRouter} from "expo-router";
// import { useAuth } from "@/app/context/AuthContext";
//
// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPw, setShowPw] = useState(false);
//     const [errors, setErrors] = useState<Record<string, string>>({});
//     // const [loading, setLoading] = useState(false);
//     const { login, loading, error } = useAuth();  // ← use hook's loading
//
//     const onSubmit = async () => {
//         const er: Record<string, string> = {};
//         if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email";
//         if (password.length < 6) er.password = "At least 6 characters";
//         setErrors(er);
//         if (Object.keys(er).length) return;
//         await login(email, password);
//     };
//
//     // const onSubmit = async () => {
//     //     const er: Record<string, string> = {};
//     //     if (!/^\S+@\S+\.\S+$/.test(email)) er.email = "Enter a valid email";
//     //     if (password.length < 6) er.password = "At least 6 characters";
//     //     setErrors(er);
//     //     if (Object.keys(er).length) return;
//     //     setLoading(true);
//     //     try {
//     //         // await login(email, password);
//     //         router.replace("/(tabs)/pages/dashboard");
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
//     return (
//         <View style={styles.container}>
//             <View style={styles.card}>
//                 <Text style={styles.title}>Welcome back</Text>
//                 <Text style={styles.subtitle}>Login to continue your training.</Text>
//
//                 <View style={styles.form}>
//                     <View>
//                         <Text style={styles.label}>Email</Text>
//                         <TextInput
//                             value={email}
//                             onChangeText={setEmail}
//                             placeholder="you@example.com"
//                             placeholderTextColor="#64748b"
//                             keyboardType="email-address"
//                             autoCapitalize="none"
//                             style={styles.input}
//                         />
//                         {errors.email && <Text style={styles.error}>{errors.email}</Text>}
//                     </View>
//
//                     <View>
//                         <View style={styles.passwordHeader}>
//                             <Text style={styles.label}>Password</Text>
//                             <TouchableOpacity>
//                                 <Text style={styles.forgotText}>Forgot password?</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View>
//                             <TextInput
//                                 value={password}
//                                 onChangeText={setPassword}
//                                 placeholder="••••••••"
//                                 placeholderTextColor="#64748b"
//                                 secureTextEntry={!showPw}
//                                 style={[styles.input, { paddingRight: 44 }]}
//                             />
//                             <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.eyeButton}>
//                                 <Text style={styles.eyeText}>{showPw ? "🙈" : "👁️"}</Text>
//                             </TouchableOpacity>
//                         </View>
//                         {errors.password && <Text style={styles.error}>{errors.password}</Text>}
//                     </View>
//
//                     <TouchableOpacity onPress={onSubmit} disabled={loading} style={[styles.button, loading && { opacity: 0.7 }]}>
//                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
//                     </TouchableOpacity>
//                 </View>
//
//                 <Text style={styles.footerText}>
//                     No account yet?{" "}
//                     <Link href="/auth/register" style={styles.linkText}>
//                         Register
//                     </Link>
//                 </Text>
//                 {error && <Text style={[styles.error, { textAlign: "center", marginTop: 12 }]}>{error}</Text>}
//             </View>
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", backgroundColor: "#0f172a", padding: 20 },
//     card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 24 },
//     title: { fontSize: 22, fontWeight: "800", color: "#f1f5f9" },
//     subtitle: { marginTop: 4, fontSize: 13, color: "#94a3b8" },
//     form: { marginTop: 24, gap: 16 },
//     label: { fontSize: 12, fontWeight: "600", color: "#f1f5f9", marginBottom: 6 },
//     input: { height: 48, borderWidth: 1, borderColor: "#334155", borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: "#f1f5f9", backgroundColor: "#0f172a" },
//     error: { marginTop: 4, fontSize: 12, color: "#ef4444" },
//     passwordHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
//     forgotText: { fontSize: 12, fontWeight: "600", color: "#3b82f6" },
//     eyeButton: { position: "absolute", right: 10, top: 12 },
//     eyeText: { fontSize: 16 },
//     button: { height: 52, backgroundColor: "#3b82f6", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 8 },
//     buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
//     footerText: { marginTop: 24, textAlign: "center", fontSize: 13, color: "#94a3b8" },
//     linkText: { fontWeight: "600", color: "#3b82f6" },
// });