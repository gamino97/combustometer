import {
  addVehicle,
  deleteVehicle,
  getVehiclesQuery,
  updateVehicle,
} from "@/services/vehicle";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

export const useVehicles = () => {
  const { data: vehicles } = useLiveQuery(getVehiclesQuery);

  return {
    vehicles: vehicles ?? [],
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
