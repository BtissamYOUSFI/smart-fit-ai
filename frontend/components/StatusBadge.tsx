import { View, Text, StyleSheet } from "react-native";

type Variant = "Planned" | "InProgress" | "Completed" | "Active" | "Upcoming" | "Modified" | "Pending" | "Analyzed" | "Scored";

const colorMap: Record<Variant, { bg: string; text: string }> = {
    Planned:    { bg: "#1e293b", text: "#94a3b8" },
    Pending:    { bg: "#1e293b", text: "#94a3b8" },
    InProgress: { bg: "#1e3a5f", text: "#3b82f6" },
    Analyzed:   { bg: "#1e3a5f", text: "#3b82f6" },
    Active:     { bg: "#1e3a5f", text: "#3b82f6" },
    Scored:     { bg: "#14532d", text: "#22c55e" },
    Completed:  { bg: "#14532d", text: "#22c55e" },
    Upcoming:   { bg: "#1e293b", text: "#64748b" },
    Modified:   { bg: "#451a03", text: "#f59e0b" },
};

const labelMap: Partial<Record<Variant, string>> = { InProgress: "In Progress" };

export function StatusBadge({ status }: { status: Variant }) {
    const { bg, text } = colorMap[status] ?? colorMap.Planned;
    return (
        <View style={[styles.badge, { backgroundColor: bg }]}>
            <Text style={[styles.label, { color: text }]}>{labelMap[status] ?? status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    label: { fontSize: 11, fontWeight: "600" },
});