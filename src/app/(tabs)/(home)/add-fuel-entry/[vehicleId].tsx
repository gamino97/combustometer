import { ControlledInput } from "@/components/controlled-input";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAddFuelEntry } from "@/hooks/use-fuel-entry";
import { FuelEntryData } from "@/schemas/fuel-entry";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Control, Controller, useWatch } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function NoVehicle() {
  return (
    <View>
      <ThemedText>No vehicle found</ThemedText>
    </View>
  );
}

function SummaryCard({ control }: { control: Control<FuelEntryData> }) {
  const isDark = useColorScheme() === "dark";
  const theme = Colors[isDark ? "dark" : "light"];
  const liters = useWatch({ control, name: "liters" });
  const pricePerLiter = useWatch({ control, name: "pricePerLiter" });
  const totalCost = (
    (Number(liters) || 0) * (Number(pricePerLiter) || 0)
  ).toFixed(2);

  return (
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
        <ThemedText style={[styles.currencySymbol, { color: theme.primary }]}>
          $
        </ThemedText>
        <ThemedText style={[styles.summaryValue, { color: theme.primary }]}>
          {totalCost}
        </ThemedText>
      </View>
    </View>
  );
}

export default function AddFuelEntryScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const id = Number(vehicleId);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { form, submit, vehicle } = useAddFuelEntry(id);
  const date = form.watch("date");
  if (!vehicle) return <NoVehicle />;

  const currentDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScreenLayout
      title={vehicle?.name || "Vehicle"}
      subtitle="Refueling"
      showBackButton
      scrollable
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.scrollContent}
      >
        {/* Summary Card */}
        <SummaryCard control={form.control} />

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
        <ControlledInput
          control={form.control}
          name="odometer"
          label="Odometer Reading"
          unit="km"
          placeholder="0"
          keyboardType="numeric"
          returnKeyType="done"
        />

        {/* Volume and Price Row */}
        <View style={styles.rowContainer}>
          <ControlledInput
            control={form.control}
            name="liters"
            label="Liters"
            suffix="L"
            placeholder="0.00"
            keyboardType="decimal-pad"
            returnKeyType="done"
            containerStyle={styles.flex1}
          />

          <ControlledInput
            control={form.control}
            name="pricePerLiter"
            label="Price/L"
            suffix="$"
            placeholder="0.00"
            keyboardType="decimal-pad"
            returnKeyType="done"
            containerStyle={styles.flex1}
          />
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
            <Controller
              control={form.control}
              name="isFullTank"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#767577", true: theme.primary }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
              )}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.surfaceBorder,
            borderTopWidth: 1,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={submit}
        >
          <MaterialIcons name="save" size={24} color="#FFF" />
          <ThemedText style={styles.saveButtonText}>Save Entry</ThemedText>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    bottom: 0,
    left: 0,
    padding: 24,
    position: "absolute",
    right: 0,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "800",
  },
  dateRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  flex1: {
    flex: 1,
  },

  iconContainer: {
    borderRadius: 8,
    padding: 8,
  },
  inputCard: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputLabel: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  rowContainer: {
    flexDirection: "row",
    gap: 16,
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 12,
    elevation: 4,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 16,
    shadowColor: "#006c75",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
  scrollContent: {
    gap: 16,
    padding: 16,
    paddingBottom: 120,
  },
  summaryCard: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    padding: 24,
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
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: "800",
    height: "100%",
    letterSpacing: -1,
    textAlignVertical: "center",
  },
  summaryValueContainer: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 4,
  },
  toggleLabelContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleSubtitle: {
    color: "#64748b",
    fontSize: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
});
