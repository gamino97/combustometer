import { db } from "@/db";
import { logs } from "@/db/schema";
import { FuelEntryData } from "@/schemas/fuel-entry";
import { calculateAverageEfficiency } from "@/utils/calculations";
import { eq } from "drizzle-orm";
import { updateVehicle } from "./vehicle";

export const addFuelEntry = async (vehicleId: number, data: FuelEntryData) => {
  const { odometer, liters, date, pricePerLiter, isFullTank } = data;

  return await db.transaction(async (tx) => {
    // Insert log
    await tx.insert(logs).values({
      vehicleId,
      date: date.toISOString(),
      odometer,
      pricePerLiter,
      isFullTank,
      liters,
    });

    // Recalculate efficiency
    const vehicleLogs = await tx
      .select()
      .from(logs)
      .where(eq(logs.vehicleId, vehicleId));

    const efficiency = calculateAverageEfficiency(vehicleLogs);
    // Update vehicle odometer and efficiency
    await updateVehicle(vehicleId, { distance: odometer, efficiency });
  });
};
