import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { db } from "@/db";
import { logs } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useVehicles } from "@/hooks/use-vehicles";
import { MaterialIcons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Vehicle {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  statusTextColor: string;
  lastUpdated: string;
  distance: string;
  efficiency: string;
  efficiencyUnit: string;
  efficiencyColor: string;
  type: "gas" | "electric";
}

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  isDark: boolean;
  accentColor?: string;
  variant?: "primary" | "secondary";
};

function StatCard({
  label,
  value,
  unit,
  isDark,
  accentColor,
  variant = "secondary",
}: StatCardProps): React.ReactElement {
  const cardStyle = [
    styles.statCard,
    variant === "primary"
      ? styles.statCardPrimary
      : isDark
        ? styles.statCardSecondaryDark
        : styles.statCardSecondaryLight,
  ];

  return (
    <View style={cardStyle}>
      <ThemedText
        style={[
          styles.statLabel,
          accentColor ? { color: accentColor } : undefined,
        ]}
      >
        {label}
      </ThemedText>
      <View style={[styles.rowCenter, { alignItems: "baseline" }]}>
        <ThemedText
          style={[
            styles.statValue,
            variant === "secondary" ? { color: "#FF7F11" } : undefined,
          ]}
        >
          {value}
        </ThemedText>
        {unit && <ThemedText style={styles.statUnit}> {unit}</ThemedText>}
      </View>
    </View>
  );
}

type VehicleCardProps = {
  item: Vehicle;
  isDark: boolean;
  primaryColor: string;
  textColor: string;
};

function VehicleCard({
  item,
  isDark,
  primaryColor,
  textColor,
}: VehicleCardProps): React.ReactElement {
  const router = useRouter();
  const logIcon = item.type === "electric" ? "ev-station" : "local-gas-station";
  const logLabel = item.type === "electric" ? "Log Charge" : "Log Fuel";

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor },
              ]}
            >
              <ThemedText
                style={[styles.statusText, { color: item.statusTextColor }]}
              >
                {item.status}
              </ThemedText>
            </View>
            <ThemedText style={styles.lastUpdatedText}>
              {item.lastUpdated}
            </ThemedText>
          </View>
          <ThemedText style={styles.vehicleName}>{item.name}</ThemedText>
          <ThemedText style={styles.odometerText}>
            {item.distance} km • Odometer
          </ThemedText>
        </View>
        <View style={styles.efficiencyContainer}>
          <ThemedText
            style={[styles.efficiencyValue, { color: item.efficiencyColor }]}
          >
            {item.efficiency}
          </ThemedText>
          <ThemedText style={styles.efficiencyUnit}>
            {item.efficiencyUnit}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.logButton,
            { backgroundColor: primaryColor, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() =>
            router.push({
              pathname: "/add-fuel-entry/[vehicleId]",
              params: { vehicleId: item.id },
            })
          }
        >
          <MaterialIcons name={logIcon} size={18} color="#FFF" />
          <ThemedText style={styles.logButtonText}>{logLabel}</ThemedText>
        </Pressable>
        <TouchableOpacity
          style={[
            styles.arrowButton,
            isDark ? styles.arrowButtonDark : styles.arrowButtonLight,
          ]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-forward" size={20} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen(): React.ReactElement {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const { vehicles: vehiclesData, addVehicle } = useVehicles();
  const { data: logsData } = useLiveQuery(db.select().from(logs));
  const processedVehicles = useMemo(() => {
    if (!vehiclesData) return [];

    return vehiclesData.map((v) => {
      const vehicleLogs = logsData?.filter((l) => l.vehicleId === v.id) || [];
      let efficiencyValue = "0.0";

      if (vehicleLogs.length > 0) {
        const totalDistance = vehicleLogs.reduce(
          (acc, l) => acc + (l.distance || 0),
          0,
        );
        const totalAmount = vehicleLogs.reduce(
          (acc, l) => acc + (l.amount || 0),
          0,
        );
        if (totalAmount > 0) {
          efficiencyValue = (totalDistance / totalAmount).toFixed(1);
        }
      }

      return {
        id: v.id,
        name: v.name,
        status: v.status,
        statusColor: v.statusColor,
        statusTextColor: v.statusTextColor,
        lastUpdated: v.lastUpdated,
        distance: v.distance.toLocaleString(),
        efficiency: efficiencyValue,
        efficiencyUnit: v.efficiencyUnit,
        efficiencyColor: v.efficiencyColor,
        type: v.type as "gas" | "electric",
      };
    });
  }, [vehiclesData, logsData]);

  const avgEfficiency = useMemo(() => {
    if (processedVehicles.length === 0) return "0.0";
    const total = processedVehicles.reduce(
      (acc, v) => acc + parseFloat(v.efficiency),
      0,
    );
    return (total / processedVehicles.length).toFixed(1);
  }, [processedVehicles]);

  const renderHeader = (): React.ReactElement => (
    <View style={styles.contentContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScrollContent}
        style={styles.statsScroll}
      >
        <StatCard
          label="TOTAL FLEET"
          value={`${processedVehicles.length} Vehicles`}
          isDark={isDark}
          accentColor={theme.primary}
          variant="primary"
        />

        <StatCard
          label="AVG. EFFICIENCY"
          value={avgEfficiency}
          unit="km/L"
          isDark={isDark}
          accentColor="#8dc9ce"
        />

        <StatCard
          label="TOTAL LOGS"
          value={logsData?.length || 0}
          isDark={isDark}
          accentColor="#8dc9ce"
        />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}
      >
        <ThemedText style={styles.headerTitle}>My Garage</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight,
            ]}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight,
            ]}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={processedVehicles}
        renderItem={({ item }) => (
          <VehicleCard
            item={item}
            isDark={isDark}
            primaryColor={theme.primary}
            textColor={theme.text}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            },
          ]}
          onPress={async () => {
            // Quick test to seed data if empty
            if (processedVehicles.length === 0) {
              await addVehicle({
                name: "Mazda 3",
                type: "gas",
                efficiencyUnit: "KM/L AVG",
                lastUpdated: "Just now",
              });
            }
          }}
        >
          <MaterialIcons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
    zIndex: 10,
  },
  arrowButton: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  arrowButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  arrowButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 20,
    marginHorizontal: 24,
    overflow: "hidden",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardDark: {
    backgroundColor: "#232E2F",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#e2e8f0",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 24,
  },
  efficiencyContainer: {
    alignItems: "flex-end",
  },
  efficiencyUnit: {
    color: "#8dc9ce",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  efficiencyValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  fab: {
    alignItems: "center",
    borderRadius: 16,
    elevation: 8,
    height: 64,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    width: 64,
  },
  fabContainer: {
    bottom: 24,
    position: "absolute",
    right: 24,
    zIndex: 50,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerDark: {
    backgroundColor: "rgba(21, 30, 31, 0.95)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  headerLight: {
    backgroundColor: "rgba(249, 250, 250, 0.95)",
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  iconButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  iconButtonLight: {
    backgroundColor: "#f1f5f9",
  },
  lastUpdatedText: {
    color: "#8dc9ce",
    fontSize: 12,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: 20,
  },
  logButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12,
  },
  logButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  odometerText: {
    color: "#8dc9ce",
    fontSize: 14,
    fontWeight: "500",
  },
  rowCenter: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 140,
    padding: 12,
  },
  statCardPrimary: {
    backgroundColor: "rgba(0, 108, 117, 0.1)",
    borderColor: "rgba(0, 108, 117, 0.2)",
  },
  statCardSecondaryDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statCardSecondaryLight: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statsScroll: {
    paddingLeft: 24,
  },
  statsScrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
});
