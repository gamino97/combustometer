import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./themed-text";

interface ControlledInputProps<T extends FieldValues> extends Omit<
  TextInputProps,
  "style" | "value" | "onChangeText" | "onBlur"
> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  unit?: string;
  suffix?: string;
  containerStyle?: ViewStyle;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  unit,
  suffix,
  containerStyle,
  ...props
}: ControlledInputProps<T>) {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.surface,
              borderColor: error ? "red" : theme.surfaceBorder,
            },
            containerStyle,
          ]}
        >
          <ThemedText style={styles.label}>{label}</ThemedText>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString()}
              placeholderTextColor={isDark ? "#666" : "#999"}
              {...props}
            />
            {suffix && (
              <ThemedText style={styles.suffixText}>{suffix}</ThemedText>
            )}
            {unit && (
              <View
                style={[
                  styles.unitBadge,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "#f1f5f9",
                  },
                ]}
              >
                <ThemedText style={styles.unitText}>{unit}</ThemedText>
              </View>
            )}
          </View>
          {error && (
            <ThemedText style={{ color: "red", fontSize: 12, marginTop: 4 }}>
              {error.message}
            </ThemedText>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    padding: 0,
  },
  inputRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  label: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  suffixText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  unitBadge: {
    borderRadius: 4,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unitText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
  },
});
