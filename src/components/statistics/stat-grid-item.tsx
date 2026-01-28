import React from "react";
import { StyleSheet, View } from "react-native";

import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface StatGridItemProps {
  label: string;
  value: string;
  unit: string;
  icon: IconSymbolName;
}

export function StatGridItem({
  label,
  value,
  unit,
  icon,
}: StatGridItemProps): React.ReactElement {
  const iconColor = useThemeColor({}, "icon");
  const borderSubtle = useThemeColor(
    { light: "#f1f5f9", dark: "rgba(255,255,255,0.05)" },
    "background",
  );

  return (
    <ThemedView
      style={[styles.container, { borderColor: borderSubtle }]}
      lightColor="#fff"
    >
      <View style={styles.header}>
        <IconSymbol size={18} name={icon} color={iconColor} />
        <ThemedText style={styles.label} type="defaultSemiBold">
          {label.toUpperCase()}
        </ThemedText>
      </View>
      <ThemedText style={styles.value} type="subtitle">
        {value} <ThemedText style={styles.unit}>{unit}</ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.6,
  },
  unit: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.6,
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
  },
});
