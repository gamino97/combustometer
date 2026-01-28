import { ScreenLayout } from "@/components/screen-layout";
import { EfficiencyHero } from "@/components/statistics/efficiency-hero";
import { QuickLogAction } from "@/components/statistics/quick-log-action";
import { SpendingChart } from "@/components/statistics/spending-chart";
import { StatGridItem } from "@/components/statistics/stat-grid-item";
import { TrendChart } from "@/components/statistics/trend-chart";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useInsightsData } from "@/hooks/use-insights-data";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useVehicles } from "@/hooks/use-vehicles";
import { formatNumber } from "@/utils/format";
import { ReactElement, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function InsightsScreen(): ReactElement {
  const surfaceBorder = useThemeColor({}, "surfaceBorder");
  const { vehicles } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    number | undefined
  >(undefined);

  const selectedVehicle = useMemo(
    () =>
      vehicles.find((v) => v.id === (selectedVehicleId ?? vehicles[0]?.id)) ||
      vehicles[0],
    [vehicles, selectedVehicleId],
  );

  const effectiveId = selectedVehicle?.id;

  const {
    efficiency,
    trend,
    totalDistance,
    totalVolume,
    spendingData,
    trendData,
    totalSpent,
    isLoading,
  } = useInsightsData(effectiveId);

  const currentId = selectedVehicleId ?? vehicles[0]?.id;

  return (
    <ScreenLayout
      title="Statistics & Insights"
      scrollable
      contentContainerStyle={styles.content}
    >
      {/* Vehicle Selector */}
      <ThemedView style={styles.selectorContainer}>
        <ThemedText style={styles.selectorLabel} type="defaultSemiBold">
          SELECTED VEHICLE
        </ThemedText>
        <FlatList
          horizontal
          data={vehicles}
          showsHorizontalScrollIndicator={false}
          style={styles.vehicleScroll}
          keyExtractor={(v) => v.id.toString()}
          renderItem={({ item: v }) => (
            <Pressable
              onPress={() => setSelectedVehicleId(v.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <ThemedView
                style={[
                  styles.selector,
                  { borderColor: surfaceBorder },
                  currentId === v.id && styles.selectedSelector,
                ]}
                lightColor={currentId === v.id ? "#e2e8f0" : "#fff"}
              >
                <ThemedText
                  style={[
                    styles.selectorText,
                    currentId === v.id && styles.selectedSelectorText,
                  ]}
                  type="defaultSemiBold"
                >
                  {v.name}
                </ThemedText>
              </ThemedView>
            </Pressable>
          )}
        />
      </ThemedView>

      {!isLoading && (
        <>
          <EfficiencyHero avgEfficiency={efficiency} trend={trend} />

          <TrendChart data={trendData} />

          <SpendingChart data={spendingData} totalSpent={totalSpent} />

          <View style={styles.statsGrid}>
            <StatGridItem
              label="Distance"
              value={formatNumber(totalDistance)}
              unit="km"
              icon="route"
            />
            <StatGridItem
              label="Volume"
              value={formatNumber(totalVolume)}
              unit="L"
              icon="oil.barrel"
            />
          </View>

          <QuickLogAction />
        </>
      )}

      <View style={styles.spacer} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    padding: 20,
  },
  selectedSelector: {
    backgroundColor: "#006c75",
    borderColor: "#006c75",
  },
  selectedSelectorText: {
    color: "#fff",
  },
  selector: {
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorContainer: {
    gap: 8,
  },
  selectorLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginLeft: 4,
    opacity: 0.6,
  },
  selectorText: {
    fontSize: 14,
  },
  spacer: {
    height: 40,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  vehicleScroll: {
    flexDirection: "row",
  },
});
