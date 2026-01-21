import { MaterialIcons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { db } from "@/db";
import { logs, vehicles } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AddFuelEntryScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const [odometer, setOdometer] = useState("");
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [isFullTank, setIsFullTank] = useState(true);

  // Fetch vehicle to get current odometer
  const { data: vehicleData } = useLiveQuery(
    db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, Number(vehicleId))),
  );
  const vehicle = vehicleData?.[0];

  useEffect(() => {
    if (vehicle) {
      setOdometer(vehicle.distance.toString());
    }
  }, [vehicle]);

  const totalCost = (
    (parseFloat(liters) || 0) * (parseFloat(pricePerLiter) || 0)
  ).toFixed(2);

  const handleSave = async () => {
    if (!vehicle || !odometer || !liters) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const currentOdometer = parseFloat(odometer);
    const previousOdometer = vehicle.distance;
    const distanceTraveled = currentOdometer - previousOdometer;
    const fuelAmount = parseFloat(liters);

    if (distanceTraveled < 0) {
      Alert.alert(
        "Error",
        "New odometer reading cannot be less than previous reading",
      );
      return;
    }

    try {
      await db.transaction(async (tx) => {
        // Insert log
        await tx.insert(logs).values({
          vehicleId: vehicle.id,
          amount: fuelAmount,
          distance: distanceTraveled,
          date: new Date().toISOString(),
        });

        // Update vehicle odometer
        await tx
          .update(vehicles)
          .set({
            distance: currentOdometer,
            lastUpdated: new Date().toLocaleDateString(),
          })
          .where(eq(vehicles.id, vehicle.id));
      });

      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save entry");
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top },
          isDark ? styles.headerDark : styles.headerLight,
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="chevron-left" size={28} color={theme.primary} />
          <ThemedText style={[styles.backText, { color: theme.primary }]}>
            Back
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerSubtitle}>REFUELING</ThemedText>
          <ThemedText style={styles.headerTitle}>
            {vehicle?.name || "Vehicle"}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Summary Card */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isDark
                  ? "rgba(0, 108, 117, 0.2)"
                  : "rgba(0, 108, 117, 0.1)",
                borderColor: "rgba(0, 108, 117, 0.2)",
              },
            ]}
          >
            <View style={styles.summaryIconBg}>
              <MaterialIcons
                name="payments"
                size={120}
                color={theme.primary}
                style={{ opacity: 0.1 }}
              />
            </View>
            <ThemedText style={[styles.summaryLabel, { color: theme.primary }]}>
              ESTIMATED TOTAL COST
            </ThemedText>
            <View style={styles.summaryValueContainer}>
              <ThemedText
                style={[styles.currencySymbol, { color: theme.primary }]}
              >
                $
              </ThemedText>
              <ThemedText
                style={[styles.summaryValue, { color: theme.primary }]}
              >
                {totalCost}
              </ThemedText>
            </View>
          </View>

          {/* Date Selection */}
          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: isDark ? theme.surface : theme.surface,
                borderColor: theme.surfaceBorder,
              },
            ]}
          >
            <View style={styles.dateRow}>
              <View>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <ThemedText style={styles.dateValue}>{currentDate}</ThemedText>
              </View>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(0, 108, 117, 0.1)" },
                ]}
              >
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color={theme.primary}
                />
              </View>
            </View>
          </View>

          {/* Odometer Input */}
          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: isDark ? theme.surface : theme.surface,
                borderColor: theme.surfaceBorder,
              },
            ]}
          >
            <ThemedText style={styles.inputLabel}>Odometer Reading</ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={odometer}
                onChangeText={setOdometer}
                placeholder="0"
                placeholderTextColor={isDark ? "#666" : "#999"}
                keyboardType="numeric"
                returnKeyType="done"
              />
              <View
                style={[
                  styles.unitBadge,
                  { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9" },
                ]}
              >
                <ThemedText style={styles.unitText}>km</ThemedText>
              </View>
            </View>
          </View>

          {/* Volume and Price Row */}
          <View style={styles.rowContainer}>
            <View
              style={[
                styles.halfinputCard,
                {
                  backgroundColor: isDark ? theme.surface : theme.surface,
                  borderColor: theme.surfaceBorder,
                },
              ]}
            >
              <ThemedText style={styles.inputLabel}>Liters</ThemedText>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={liters}
                  onChangeText={setLiters}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <ThemedText style={styles.suffixText}>L</ThemedText>
              </View>
            </View>

            <View
              style={[
                styles.halfinputCard,
                {
                  backgroundColor: isDark ? theme.surface : theme.surface,
                  borderColor: theme.surfaceBorder,
                },
              ]}
            >
              <ThemedText style={styles.inputLabel}>Price/L</ThemedText>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  value={pricePerLiter}
                  onChangeText={setPricePerLiter}
                  placeholder="0.000"
                  placeholderTextColor={isDark ? "#666" : "#999"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
                <ThemedText style={styles.suffixText}>$</ThemedText>
              </View>
            </View>
          </View>

          {/* Full Tank Toggle */}
          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: isDark ? theme.surface : theme.surface,
                borderColor: theme.surfaceBorder,
              },
            ]}
          >
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelContainer}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "rgba(255, 127, 17, 0.1)" },
                  ]}
                >
                  <MaterialIcons
                    name="ev-station"
                    size={20}
                    color={theme.accentOrange}
                  />
                </View>
                <View>
                  <ThemedText style={styles.toggleTitle}>Full Tank</ThemedText>
                  <ThemedText style={styles.toggleSubtitle}>
                    Used for consumption accuracy
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={isFullTank}
                onValueChange={setIsFullTank}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </View>

          {/* Location (Static for now as per HTML) */}
          <View
            style={[
              styles.inputCard,
              {
                backgroundColor: isDark ? theme.surface : theme.surface,
                borderColor: theme.surfaceBorder,
              },
            ]}
          >
            <ThemedText style={[styles.inputLabel, { marginBottom: 12 }]}>
              Location
            </ThemedText>
            <View style={styles.locationRow}>
              <View
                style={[
                  styles.mapPlaceholder,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "#f1f5f9",
                  },
                ]}
              >
                <MaterialIcons
                  name="map"
                  size={24}
                  color={isDark ? "#666" : "#999"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.locationName}>
                  Shell Express
                </ThemedText>
                <ThemedText style={styles.locationAddress}>
                  8400 Santa Monica Blvd, West Hollywood
                </ThemedText>
              </View>
              <MaterialIcons name="edit" size={20} color="#999" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background, // Should ideally be gradient or transparent but View doesn't support gradient natively without expo-linear-gradient.
            // Using solid background for simplicity and "keeping same design" roughly.
            borderTopColor: theme.surfaceBorder,
            borderTopWidth: 1,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <MaterialIcons name="save" size={24} color="#FFF" />
          <ThemedText style={styles.saveButtonText}>Save Entry</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: "rgba(249, 250, 250, 0.95)",
    borderBottomColor: "#e2e8f0",
  },
  headerDark: {
    backgroundColor: "rgba(21, 30, 31, 0.95)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: -4,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#94a3b8", // Slate-400
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94a3b8",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Space for bottom bar
    gap: 16,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  summaryIconBg: {
    position: "absolute",
    right: -10,
    top: -10,
    transform: [{ rotate: "-15deg" }],
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "800",
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
  inputCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#94a3b8",
    letterSpacing: 1,
    marginBottom: 8,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    padding: 0,
  },
  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unitText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
  },
  halfinputCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  suffixText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94a3b8",
    marginLeft: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  toggleSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mapPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  locationName: {
    fontSize: 14,
    fontWeight: "700",
  },
  locationAddress: {
    fontSize: 12,
    color: "#64748b",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#006c75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
