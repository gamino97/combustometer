import { logs } from "@/db/schema";
import { Decimal } from "decimal.js";
import { InferSelectModel } from "drizzle-orm";

type Log = InferSelectModel<typeof logs>;

export const calculateAverageEfficiency = (logs: Log[]): number => {
  if (logs.length < 2) return 0;

  // 1. Sort logs by odometer ascending
  const sortedLogs = [...logs].sort((a, b) => a.odometer - b.odometer);

  let totalDistance = new Decimal(0);
  let totalFuel = new Decimal(0);

  // 2. Find valid intervals between Full tanks
  // We need to find a starting Full tank anchor
  let lastFullTankIndex = -1;

  for (let i = 0; i < sortedLogs.length; i += 1) {
    const log = sortedLogs[i];

    if (log.isFullTank) {
      if (lastFullTankIndex !== -1) {
        // Found a complete interval: [lastFullTankIndex ... i]
        const startLog = sortedLogs[lastFullTankIndex];
        const endLog = log;

        const distance = new Decimal(endLog.odometer).minus(startLog.odometer);

        // Sum fuel for all entries in this interval (excluding startLog, including endLog)
        // Fuel added at 'endLog' covers the distance driven *to* 'endLog'.
        // Fuel added at partials between start and end also counts towards this distance.
        let fuel = new Decimal(0);
        for (let j = lastFullTankIndex + 1; j <= i; j += 1) {
          fuel = fuel.plus(sortedLogs[j].liters);
        }

        if (distance.greaterThan(0) && fuel.greaterThan(0)) {
          totalDistance = totalDistance.plus(distance);
          totalFuel = totalFuel.plus(fuel);
        }
      }

      // Update anchor to current Full tank
      lastFullTankIndex = i;
    }
  }

  if (totalDistance.equals(0) || totalFuel.equals(0)) return 0;

  return totalDistance.dividedBy(totalFuel).toDecimalPlaces(2).toNumber();
};
