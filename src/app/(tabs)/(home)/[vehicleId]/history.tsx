import { FloatingButton } from "@/components/floating-button";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useFuelLogs } from "@/hooks/use-fuel-logs";
import { formatCurrency, formatNumber } from "@/utils/format";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HistoryScreen() {
  const { theme, isDark } = useAppTheme();
  const { vehicleId } = useLocalSearchParams<{ vehicleId?: string }>();
  const parsedVehicleId = vehicleId ? parseInt(vehicleId, 10) : undefined;
  const { logs, stats, isLoading } = useFuelLogs(parsedVehicleId);
  const router = useRouter();

  if (isLoading || !parsedVehicleId) return null;

  const renderHeader = () => (
    <View style={styles.dashboardContainer}>
      <View
        style={[
          styles.card,
          styles.summaryCard,
          {
            backgroundColor: "rgba(13, 223, 242, 0.1)",
            borderColor: "rgba(13, 223, 242, 0.2)",
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <MaterialIcons name="speed" size={16} color={theme.primary} />
          <ThemedText style={[styles.cardLabel, { color: theme.text }]}>
            TOTAL DISTANCE
          </ThemedText>
        </View>
        <ThemedText style={styles.cardValue}>
          {formatNumber(stats.totalDistance)}
          <ThemedText style={styles.unitText}> km</ThemedText>
        </ThemedText>
      </View>

      <View style={styles.statsRow}>
        <View
          style={[
            styles.card,
            styles.halfCard,
            isDark ? styles.cardDark : styles.cardLight,
          ]}
        >
          <ThemedText style={[styles.cardLabel, { color: theme.icon }]}>
            AVG. CONSUMPTION
          </ThemedText>
          <ThemedText style={styles.cardValueSmall}>
            {formatNumber(stats.avgConsumption)}
            <ThemedText style={styles.unitTextSmall}> L/100km</ThemedText>
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            styles.halfCard,
            isDark ? styles.cardDark : styles.cardLight,
          ]}
        >
          <ThemedText style={[styles.cardLabel, { color: theme.icon }]}>
            TOTAL SPENT
          </ThemedText>
          <ThemedText style={[styles.cardValueSmall, { color: theme.primary }]}>
            {formatCurrency(stats.totalSpent)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Refueling Logs</ThemedText>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconContainer,
          { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc" },
        ]}
      >
        <MaterialIcons
          name="local-gas-station"
          size={48}
          color={isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1"}
        />
      </View>
      <ThemedText style={styles.emptyTitle}>No logs yet</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: theme.icon }]}>
        Tap the plus button below to add your first refueling entry and start
        tracking your fuel efficiency.
      </ThemedText>
    </View>
  );

  return (
    <ScreenLayout title="History" style={styles.container} showBackButton>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.logCard,
              isDark ? styles.cardDark : styles.cardLight,
            ]}
          >
            <View style={styles.logHeader}>
              <View>
                <ThemedText style={styles.logDate}>
                  {format(new Date(item.date), "MMM d, yyyy")}
                </ThemedText>
                <ThemedText style={[styles.logOdometer, { color: theme.icon }]}>
                  {formatNumber(item.odometer)} km
                </ThemedText>
              </View>
              {item.isFullTank && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>FULL TANK</ThemedText>
                </View>
              )}
            </View>
            <View
              style={[
                styles.logDetails,
                {
                  borderTopColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                },
              ]}
            >
              <View>
                <ThemedText style={[styles.detailLabel, { color: theme.icon }]}>
                  VOLUME
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {formatNumber(item.liters)}
                  <ThemedText style={styles.unitTextSmall}> L</ThemedText>
                </ThemedText>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <ThemedText style={[styles.detailLabel, { color: theme.icon }]}>
                  COST
                </ThemedText>
                <ThemedText
                  style={[styles.detailValue, { color: theme.primary }]}
                >
                  {formatCurrency(item.cost)}
                </ThemedText>
              </View>
            </View>
          </View>
        )}
      />
      <FloatingButton
        onPress={() => {
          router.push({
            pathname: "/add-fuel-entry/[vehicleId]",
            params: { vehicleId: parsedVehicleId },
          });
        }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  cardDark: {
    backgroundColor: "#183234",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardLight: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  cardValue: {
    fontSize: 30,
    fontWeight: "800",
  },
  cardValueSmall: {
    fontSize: 20,
    fontWeight: "800",
  },
  container: {
    flex: 1,
  },
  dashboardContainer: {
    gap: 12,
    padding: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    alignItems: "center",
    borderRadius: 32,
    height: 100,
    justifyContent: "center",
    marginBottom: 20,
    width: 100,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  halfCard: {
    flex: 1,
    gap: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  logCard: {
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    padding: 20,
  },
  logDate: {
    fontSize: 16,
    fontWeight: "700",
  },
  logDetails: {
    alignItems: "flex-end",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  logHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logOdometer: {
    fontSize: 14,
    marginTop: 2,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    gap: 8,
  },
  unitText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  unitTextSmall: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "500",
  },
});
