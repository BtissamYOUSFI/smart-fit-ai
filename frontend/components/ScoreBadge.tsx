import { View, Text, StyleSheet } from "react-native";

function getScoreColor(score: number) {
    if (score >= 75) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
}

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
    const bg = getScoreColor(score);
    const dim = size === "sm" ? 36 : size === "lg" ? 64 : 48;
    const fontSize = size === "sm" ? 11 : size === "lg" ? 18 : 13;
    return (
        <View style={[styles.circle, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: bg }]}>
            <Text style={[styles.text, { fontSize }]}>{Math.round(score)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    circle: { alignItems: "center", justifyContent: "center" },
    text: { color: "#fff", fontWeight: "700" },
});