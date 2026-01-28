import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

interface TrendChartProps {
  data: { month: string; value: number }[];
}

export function TrendChart({ data }: TrendChartProps): React.ReactElement {
  const surfaceBorder = useThemeColor({}, "surfaceBorder");
  const primaryColor = useThemeColor({}, "primary");

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <ThemedView
      style={[styles.container, { borderColor: surfaceBorder }]}
      lightColor="#fff"
    >
      <ThemedText style={styles.title} type="defaultSemiBold">
        6-MONTH EFFICIENCY TREND
      </ThemedText>

      <View style={styles.mockChart}>
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />
        <View style={styles.gridLine} />

        <View style={styles.chartArea}>
          {data.map((item, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  bottom: `${(item.value / maxValue) * 100}%`,
                  left: `${(index / (data.length - 1)) * 100}%`,
                  backgroundColor: primaryColor,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.xAxis}>
        {data.map((d) => (
          <ThemedText key={d.month} style={styles.axisText}>
            {d.month}
          </ThemedText>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  axisText: {
    fontSize: 10,
    fontWeight: "bold",
    opacity: 0.4,
  },
  chartArea: {
    ...StyleSheet.absoluteFillObject,
    paddingVertical: 10,
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  dot: {
    backgroundColor: "#006c75",
    borderColor: "#fff",
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    position: "absolute",
    width: 8,
  },
  gridLine: {
    backgroundColor: "rgba(0,0,0,0.05)",
    height: 1,
    width: "100%",
  },
  mockChart: {
    height: 120,
    justifyContent: "space-between",
    position: "relative",
  },
  title: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 20,
    opacity: 0.6,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
