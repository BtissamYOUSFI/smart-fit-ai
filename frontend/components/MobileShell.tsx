import { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";

export function MobileShell({ children }: { children: ReactNode }) {
    return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a" },
});