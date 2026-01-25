import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

interface FloatingButtonProps {
  onPress?: () => void;
}

export function FloatingButton({ onPress }: FloatingButtonProps) {
  const { theme } = useAppTheme();
  return (
    <View style={styles.fabContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={onPress}
      >
        <MaterialIcons name="add" size={32} color={theme.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
