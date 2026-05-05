import { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { LoadingDots } from "../../components/bouncingDots"

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => {
            // Remplace par la logique auth : si token → dashboard, sinon → onboarding
            router.replace("/auth/onboarding" as any);
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>🏋️</Text>
            </View>
            <Text style={styles.title}>SmartFit AI</Text>
            <Text style={styles.subtitle}>Train smarter. Move better.</Text>
            {/*<View style={styles.dots}>*/}
            {/*    <View style={[styles.dot, { opacity: 0.4 }]} />*/}
            {/*    <View style={[styles.dot, { opacity: 0.7 }]} />*/}
            {/*    <View style={styles.dot} />*/}
            {/*</View>*/}
            <LoadingDots />

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", alignItems: "center", justifyContent: "center", padding: 24 },
    iconBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: "#3b82f6", alignItems: "center", justifyContent: "center" },
    icon: { fontSize: 38 },
    title: { marginTop: 24, fontSize: 28, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
    subtitle: { marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.6)" },
    dots: { marginTop: 48, flexDirection: "row", gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3b82f6" },
});