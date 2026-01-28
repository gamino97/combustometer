import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatNumber } from "@/utils/format";

interface EfficiencyHeroProps {
  avgEfficiency: number;
  trend: number;
}

export function EfficiencyHero({
  avgEfficiency,
  trend,
}: EfficiencyHeroProps): React.ReactElement {
  const colorScheme = useColorScheme() ?? "light";
  const primaryColor = Colors[colorScheme].primary;

  return (
    <View style={[styles.container, { backgroundColor: primaryColor }]}>
      <View style={styles.header}>
        <View>
          <ThemedText
            style={styles.label}
            lightColor="rgba(255,255,255,0.7)"
            darkColor="rgba(255,255,255,0.7)"
            type="defaultSemiBold"
          >
            Average Efficiency
          </ThemedText>
          <View style={styles.valueContainer}>
            <ThemedText lightColor="#fff" darkColor="#fff" type="title">
              {formatNumber(avgEfficiency)}
            </ThemedText>
            <ThemedText
              style={styles.unit}
              lightColor="rgba(255,255,255,0.8)"
              darkColor="rgba(255,255,255,0.8)"
              type="defaultSemiBold"
            >
              km/L
            </ThemedText>
          </View>
        </View>
        <View style={styles.trendBadge}>
          <IconSymbol size={14} name="arrow.up.right" color="#fff" />
          <ThemedText
            style={styles.trendText}
            lightColor="#fff"
            darkColor="#fff"
          >
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </ThemedText>
        </View>
      </View>
      <View style={styles.footer}>
        <IconSymbol
          size={16}
          name="info.circle"
          color="rgba(255,255,255,0.8)"
        />
        <ThemedText
          style={styles.infoText}
          lightColor="rgba(255,255,255,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Optimized driving detected last month
        </ThemedText>
      </View>
      <View style={styles.backgroundIcon}>
        <IconSymbol
          size={120}
          name="speedometer"
          color="rgba(255,255,255,0.1)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundIcon: {
    position: "absolute",
    right: -20,
    top: -20,
    transform: [{ rotate: "15deg" }],
  },
  container: {
    borderRadius: 24,
    elevation: 5,
    overflow: "hidden",
    padding: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    zIndex: 1,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    zIndex: 1,
  },
  infoText: {
    fontSize: 13,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  trendBadge: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 18,
    fontWeight: "500",
  },
  valueContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
  },
});
