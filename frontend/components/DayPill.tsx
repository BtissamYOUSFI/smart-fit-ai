import { TouchableOpacity, Text, StyleSheet } from "react-native";

export function DayPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
    return (
        <TouchableOpacity onPress={onClick} style={[styles.pill, active && styles.active]}>
            <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    pill: { height: 40, minWidth: 44, borderRadius: 99, paddingHorizontal: 12, backgroundColor: "#1e293b", alignItems: "center", justifyContent: "center", marginRight: 8 },
    active: { backgroundColor: "#3b82f6" },
    text: { fontSize: 12, fontWeight: "600", color: "#64748b" },
    activeText: { color: "#fff" },
});