import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function Login() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { login, loading, error, clearError } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});

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
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={[styles.container]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.iconBox, { backgroundColor: c.surface }]}>
        <Ionicons name="barbell" size={28} color={c.accent} />
      </View>

      <Text style={[styles.title, { color: c.text }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: c.textSecondary }]}>Sign in to continue your training.</Text>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
          <Ionicons name="warning-outline" size={14} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View>
          <Text style={[styles.label, { color: c.text }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(v) => { setEmail(v); clearError(); }}
            placeholder="you@example.com"
            placeholderTextColor={c.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, {
              backgroundColor: c.inputBg,
              borderColor: errors.email ? c.error : c.border,
              color: c.text,
            }]}
          />
          {errors.email && <Text style={[styles.fieldErr, { color: c.error }]}>{errors.email}</Text>}
        </View>

        <View>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: c.text }]}>Password</Text>
            <TouchableOpacity>
              <Text style={[styles.forgotText, { color: c.blue }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              value={password}
              onChangeText={(v) => { setPassword(v); clearError(); }}
              placeholder="••••••••"
              placeholderTextColor={c.placeholder}
              secureTextEntry={!showPw}
              style={[styles.input, {
                backgroundColor: c.inputBg,
                borderColor: errors.password ? c.error : c.border,
                color: c.text,
                paddingRight: 48,
              }]}
            />
            <TouchableOpacity onPress={() => setShowPw((s) => !s)} style={styles.eyeBtn}>
              <Ionicons name={showPw ? "eye-off-outline" : "eye-outline"} size={18} color={c.textMuted} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={[styles.fieldErr, { color: c.error }]}>{errors.password}</Text>}
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={[styles.btn, { backgroundColor: c.accent, opacity: loading ? 0.7 : 1 }]}
        >
          {loading
            ? <ActivityIndicator color={c.accentFg} />
            : <Text style={[styles.btnText, { color: c.accentFg }]}>Sign in</Text>
          }
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: c.textSecondary }]}>
        No account yet?{" "}
        <Link href="/auth/register" style={[{ color: c.blue, fontWeight: "700" }]}>Create one</Link>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flexGrow: 1, justifyContent: "center", padding: 28 },
  iconBox:     { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  title:       { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle:    { marginTop: 6, fontSize: 14, lineHeight: 20, marginBottom: 28 },
  errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 20 },
  errorText:   { fontSize: 13, fontWeight: "500", flex: 1 },
  form:        { gap: 18 },
  labelRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  label:       { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  forgotText:  { fontSize: 12, fontWeight: "600" },
  input:       { height: 50, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 15 },
  fieldErr:    { marginTop: 5, fontSize: 12 },
  eyeBtn:      { position: "absolute", right: 14, top: 14 },
  btn:         { height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 4 },
  btnText:     { fontSize: 16, fontWeight: "700" },
  footer:      { marginTop: 32, textAlign: "center", fontSize: 13 },
});
