import React from "react";
import { StyleSheet, View, Pressable } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

export function QuickLogAction(): React.ReactElement {
  const primaryColor = useThemeColor({}, "primary");
  const surfaceBorder = useThemeColor({}, "surfaceBorder");
  const iconBg = useThemeColor(
    { light: "#f8fafc", dark: "#232E2F" },
    "background",
  );

  return (
    <Pressable style={[styles.container, { borderColor: surfaceBorder }]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
          <IconSymbol size={24} name="fuelpump.fill" color={primaryColor} />
        </View>
        <View>
          <ThemedText style={styles.title} type="defaultSemiBold">
            Missing a fill-up?
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Log your latest refueling data now
          </ThemedText>
        </View>
      </View>
      <IconSymbol size={24} name="plus.circle.fill" color={primaryColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  iconWrapper: {
    borderRadius: 12,
    padding: 12,
  },
  leftContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  title: {
    fontSize: 14,
  },
});
