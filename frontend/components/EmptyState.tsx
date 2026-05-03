import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function EmptyState({ title, description, actionLabel, onAction }: {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.desc}>{description}</Text>}
            {actionLabel && onAction && (
                <TouchableOpacity onPress={onAction} style={styles.button}>
                    <Text style={styles.buttonText}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: "center", justifyContent: "center", padding: 32 },
    title: { fontSize: 15, fontWeight: "600", color: "#f1f5f9", textAlign: "center" },
    desc: { marginTop: 4, fontSize: 13, color: "#64748b", textAlign: "center" },
    button: { marginTop: 16, borderWidth: 1, borderColor: "#3b82f6", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
    buttonText: { color: "#3b82f6", fontWeight: "600", fontSize: 13 },
});