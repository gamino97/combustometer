import { Stack } from "expo-router";

export default function HomeLayout(): React.ReactElement {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-fuel-entry/[vehicleId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="add-vehicle" options={{ headerShown: false }} />
      <Stack.Screen
        name="[vehicleId]/history"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
