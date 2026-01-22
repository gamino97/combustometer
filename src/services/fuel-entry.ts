import { db } from "@/db";
import { logs, vehicles } from "@/db/schema";
import { FuelEntryData } from "@/schemas/fuel-entry";
import { eq } from "drizzle-orm";

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

    // Update vehicle odometer
    await tx
      .update(vehicles)
      .set({
        distance: odometer,
        lastUpdated: new Date().toISOString(),
      })
      .where(eq(vehicles.id, vehicleId));
  });
};
