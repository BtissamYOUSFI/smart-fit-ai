import { useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, NativeScrollEvent, NativeSyntheticEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";

const { width: W } = Dimensions.get("window");

type IoniconName = keyof typeof Ionicons.glyphMap;

const slides: { icon: IoniconName; title: string; desc: string }[] = [
  { icon: "analytics",     title: "Track your form",      desc: "AI-powered posture analysis on every rep, in real time." },
  { icon: "calendar",      title: "Build your program",   desc: "Create personalized workout programs week by week." },
  { icon: "trending-up",   title: "Improve with data",    desc: "Track scores and detect recurring errors over time." },
];

export default function Onboarding() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = theme.colors;
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / W));
  };

  const goNext = () => {
    const next = Math.min(index + 1, slides.length - 1);
    scrollRef.current?.scrollTo({ x: next * W, animated: true });
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Skip */}
      <View style={styles.skipRow}>
        {index < slides.length - 1 ? (
          <TouchableOpacity onPress={() => router.replace("/auth/login" as any)}>
            <Text style={[styles.skip, { color: c.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide, i) => (
          <View key={i} style={[styles.slide, { width: W }]}>
            <View style={[styles.iconBox, { backgroundColor: c.surface }]}>
              <Ionicons name={slide.icon} size={56} color={c.accent} />
            </View>
            <Text style={[styles.slideTitle, { color: c.text }]}>{slide.title}</Text>
            <Text style={[styles.slideDesc, { color: c.textSecondary }]}>{slide.desc}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === index ? c.accent : c.border },
              i === index && { width: 24 },
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={[styles.actions, { paddingBottom: 48 }]}>
        {index === slides.length - 1 ? (
          <>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.accent }]}
              onPress={() => router.replace("/auth/register" as any)}
            >
              <Text style={[styles.btnText, { color: c.accentFg }]}>Create account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.outlineBtn, { borderColor: c.border }]}
              onPress={() => router.replace("/auth/login" as any)}
            >
              <Text style={[styles.btnText, { color: c.text }]}>I already have an account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: c.accent }]}
            onPress={goNext}
          >
            <Text style={[styles.btnText, { color: c.accentFg }]}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  skipRow:    { alignItems: "flex-end", paddingHorizontal: 24, paddingTop: 56 },
  skip:       { fontSize: 14, fontWeight: "600" },
  slide:      { alignItems: "center", justifyContent: "center", paddingHorizontal: 40 },
  iconBox:    { width: 160, height: 160, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 40 },
  slideTitle: { fontSize: 26, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  slideDesc:  { marginTop: 12, fontSize: 15, textAlign: "center", maxWidth: 280, lineHeight: 22 },
  dots:       { flexDirection: "row", justifyContent: "center", gap: 6, paddingBottom: 32 },
  dot:        { width: 8, height: 8, borderRadius: 4 },
  actions:    { paddingHorizontal: 24, gap: 12 },
  btn:        { height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  outlineBtn: { backgroundColor: "transparent", borderWidth: 1.5 },
  btnText:    { fontSize: 16, fontWeight: "600" },
});
