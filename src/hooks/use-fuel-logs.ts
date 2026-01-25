import { db } from "@/db";
import { logs } from "@/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

export type FuelLog = typeof logs.$inferSelect;

export function useFuelLogs(vehicleId?: number) {
  const select = {
    ...getTableColumns(logs),
    cost: sql<number>`CAST(${logs.liters} * ${logs.pricePerLiter} AS REAL)`,
  };
  const { data } = useLiveQuery(
    db
      .select(select)
      .from(logs)
      .where(vehicleId ? eq(logs.vehicleId, vehicleId) : undefined),
  );
  const { data: statsList } = useLiveQuery(
    db
      .select({
        totalDistance: sql<number>`MAX(${logs.odometer}) - MIN(${logs.odometer})`,
        avgConsumption: sql<number>`CAST((MAX(${logs.odometer}) - MIN(${logs.odometer})) / SUM(${logs.liters}) * 100 AS REAL)`,
        totalSpent: sql<number>`SUM(${logs.liters} * ${logs.pricePerLiter})`,
      })
      .from(logs)
      .where(vehicleId ? eq(logs.vehicleId, vehicleId) : undefined),
  );
  const stats = statsList?.[0];

  const sortedLogs = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [data]);

  return {
    logs: sortedLogs,
    stats,
    isLoading: !data || typeof stats === "undefined",
  };
}
