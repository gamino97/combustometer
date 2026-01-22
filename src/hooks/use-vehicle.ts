import { getVehicleQuery } from "@/services/vehicle";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export function useVehicle(id: number) {
  const { data: vehicle } = useLiveQuery(getVehicleQuery(id));

  return { vehicle: vehicle?.[0] };
}
