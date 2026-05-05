import { useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const slides = [
    {
        icon: "📊",
        title: "Track your form",
        desc: "AI-powered posture analysis in real time, on every rep.",
        bg: "#1e3a5f",
    },
    {
        icon: "📅",
        title: "Build your program",
        desc: "Create personalized workout programs week by week.",
        bg: "#14532d",
    },
    {
        icon: "📈",
        title: "Improve with data",
        desc: "Track scores and detect recurring errors over time.",
        bg: "#451a03",
    },
];

export default function Onboarding() {
    const router = useRouter();
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        setIndex(Math.round(x / SCREEN_WIDTH));
    };

    const goNext = () => {
        const next = Math.min(index + 1, slides.length - 1);
        scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    };

    return (
        <View style={styles.root}>
            {/* Skip */}
            <View style={styles.skipRow}>
                {index < slides.length - 1 ? (
                    <TouchableOpacity onPress={() => router.replace("/auth/login" as any)}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={{ opacity: 0 }}>Skip</Text>
                )}
            </View>

            {/* Slides */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={styles.slider}
            >
                {slides.map((slide, i) => (
                    <View key={i} style={styles.slide}>
                        <View style={[styles.iconBox, { backgroundColor: slide.bg }]}>
                            <Text style={styles.slideIcon}>{slide.icon}</Text>
                        </View>
                        <Text style={styles.slideTitle}>{slide.title}</Text>
                        <Text style={styles.slideDesc}>{slide.desc}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Dots */}
            <View style={styles.dots}>
                {slides.map((_, i) => (
                    <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
                {index === slides.length - 1 ? (
                    <>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.replace("/auth/register" as any)}
                        >
                            <Text style={styles.primaryButtonText}>Create account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() => router.replace("/auth/login" as any)}
                        >
                            <Text style={styles.outlineButtonText}>I already have an account</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0f172a" },
    skipRow: { alignItems: "flex-end", paddingHorizontal: 20, paddingTop: 56 },
    skipText: { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.6)" },
    slider: { flex: 1 },
    slide: { width: SCREEN_WIDTH, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
    iconBox: { width: 200, height: 200, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 40 },
    slideIcon: { fontSize: 80 },
    slideTitle: { fontSize: 24, fontWeight: "800", color: "#fff", textAlign: "center" },
    slideDesc: { marginTop: 12, fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 280 },
    dots: { flexDirection: "row", justifyContent: "center", gap: 8, paddingBottom: 24 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.3)" },
    dotActive: { width: 24, backgroundColor: "#3b82f6" },
    actions: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
    primaryButton: { height: 52, backgroundColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    outlineButton: { height: 52, borderWidth: 2, borderColor: "#3b82f6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
    outlineButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});