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

export const getFuelEntries = async (vehicleId?: number) => {
  const query = db.select().from(logs);

  if (vehicleId) {
    query.where(eq(logs.vehicleId, vehicleId));
  }

  // TODO: Add orderBy desc date once supported or manual sort
  const results = await query;
  return results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
