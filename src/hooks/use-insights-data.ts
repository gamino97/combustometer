import { useFuelLogs } from "@/hooks/use-fuel-logs";
import { calculateAverageEfficiency } from "@/utils/calculations";
import { format, startOfMonth, subMonths } from "date-fns";
import { Decimal } from "decimal.js";
import { useMemo } from "react";

export interface MonthlyData {
  month: string;
  value: number;
  active: boolean;
}

export function useInsightsData(vehicleId?: number) {
  const { logs, isLoading, stats: fuelLogsStats } = useFuelLogs(vehicleId);

  const stats = useMemo(() => {
    if (isLoading) {
      return {
        efficiency: 0,
        trend: 0,
        totalDistance: 0,
        totalVolume: 0,
        spendingData: [],
        trendData: [],
        totalSpent: 0,
      };
    }

    const now = new Date();
    const currentMonthStart = startOfMonth(now);

    // 1. Efficiency Hero & Trend
    const currentEfficiency = calculateAverageEfficiency(logs);

    // Efficiency for last month (logs up to end of last month)
    const lastMonthLogs = logs.filter(
      (l) => new Date(l.date) < currentMonthStart,
    );
    const lastMonthEfficiency = calculateAverageEfficiency(lastMonthLogs);

    let trend = 0;
    if (lastMonthEfficiency > 0) {
      trend = Number(
        new Decimal(currentEfficiency)
          .minus(lastMonthEfficiency)
          .dividedBy(lastMonthEfficiency)
          .times(100)
          .toFixed(1),
      );
    }

    // 2. Spending Summary (Last 4 months)
    const spendingMap = new Map<string, Decimal>();
    for (let i = 0; i < 4; i += 1) {
      const d = subMonths(now, i);
      spendingMap.set(format(d, "MMM").toUpperCase(), new Decimal(0));
    }

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      const monthKey = format(logDate, "MMM").toUpperCase();
      if (spendingMap.has(monthKey)) {
        const cost = new Decimal(log.liters).times(log.pricePerLiter);
        spendingMap.set(monthKey, spendingMap.get(monthKey)!.plus(cost));
      }
    });

    const spendingData: MonthlyData[] = Array.from(spendingMap.entries())
      .reverse()
      .map(([month, value], index, arr) => ({
        month,
        value: value.toNumber(),
        active: index === arr.length - 1,
      }));

    const totalSpent = spendingData.reduce((acc, curr) => acc + curr.value, 0);

    // 3. Efficiency Trend (Last 6 months)
    const trendData = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = subMonths(now, i);
      const monthLogs = logs.filter((l) => new Date(l.date) <= d);
      trendData.push({
        month: format(d, "MMM").toUpperCase(),
        value: calculateAverageEfficiency(monthLogs),
      });
    }

    return {
      efficiency: currentEfficiency,
      trend,
      totalDistance: fuelLogsStats.totalDistance,
      totalVolume: fuelLogsStats.totalVolume,
      spendingData,
      trendData,
      totalSpent,
    };
  }, [logs, isLoading, fuelLogsStats]);

  return {
    ...stats,
    isLoading,
  };
}
