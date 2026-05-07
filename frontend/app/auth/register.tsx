import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

function Field({
  label, type = "text", value, onChange, error, placeholder, showToggle, showValue, onToggle, colors,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; showToggle?: boolean; showValue?: boolean; onToggle?: () => void;
  colors: any;
}) {
  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={type === "password" && !showValue}
          keyboardType={type === "email" ? "email-address" : "default"}
          autoCapitalize="none"
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border, color: colors.text },
            showToggle && { paddingRight: 48 },
          ]}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Ionicons name={showValue ? "eye-off-outline" : "eye-outline"} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={[styles.fieldErr, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

export default function Register() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { register, loading, error, clearError } = useAuth();

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  useEffect(() => { clearError(); }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                      e.name    = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email))    e.email   = "Enter a valid email";
    if (password.length < 6)               e.password = "At least 6 characters";
    if (confirm !== password)              e.confirm  = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    await register(name, email, password);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.iconBox, { backgroundColor: c.surface }]}>
        <Ionicons name="barbell" size={28} color={c.accent} />
      </View>

      <Text style={[styles.title, { color: c.text }]}>Create your account</Text>
      <Text style={[styles.subtitle, { color: c.textSecondary }]}>Start training with SmartFit AI today.</Text>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: c.errorBg, borderColor: c.error }]}>
          <Ionicons name="warning-outline" size={14} color={c.error} />
          <Text style={[styles.errorText, { color: c.error }]}>{error}</Text>
        </View>
      )}

      <View style={styles.form}>
        <Field label="Full name" value={name} placeholder="Alex Martin" error={errors.name} colors={c}
          onChange={(v) => { setName(v); clearError(); }} />
        <Field label="Email" type="email" value={email} placeholder="you@example.com" error={errors.email} colors={c}
          onChange={(v) => { setEmail(v); clearError(); }} />
        <Field label="Password" type="password" value={password} placeholder="••••••••"
          error={errors.password} showToggle showValue={showPw} onToggle={() => setShowPw((s) => !s)} colors={c}
          onChange={(v) => { setPassword(v); clearError(); }} />
        <Field label="Confirm password" type="password" value={confirm} placeholder="••••••••"
          error={errors.confirm} showToggle showValue={showCpw} onToggle={() => setShowCpw((s) => !s)} colors={c}
          onChange={(v) => { setConfirm(v); clearError(); }} />

        <TouchableOpacity
          onPress={onSubmit}
          disabled={loading}
          style={[styles.btn, { backgroundColor: c.accent, opacity: loading ? 0.7 : 1 }]}
        >
          {loading
            ? <ActivityIndicator color={c.accentFg} />
            : <Text style={[styles.btnText, { color: c.accentFg }]}>Create account</Text>
          }
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer, { color: c.textSecondary }]}>
        Already have an account?{" "}
        <Link href="/auth/login" style={{ color: c.blue, fontWeight: "700" }}>Sign in</Link>
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
  label:       { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input:       { height: 50, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 15 },
  fieldErr:    { marginTop: 5, fontSize: 12 },
  eyeBtn:      { position: "absolute", right: 14, top: 14 },
  btn:         { height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 4 },
  btnText:     { fontSize: 16, fontWeight: "700" },
  footer:      { marginTop: 32, textAlign: "center", fontSize: 13 },
});
