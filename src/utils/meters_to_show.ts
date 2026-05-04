import type { StallDiagnosticRow } from "../types/forms";

interface Averages {
  avgMilkProduction: number | null;
  avgAmountWashed: number | null;
  avgReattaches: number | null;
  avgManualDetaches: number | null;
  avgManualModes: number | null;
}

type FilterType = "all" | "bad" | "empty" | "bad_empty" | "good";

/**
 * Формирует массив meter_address для отображения карточек
 * в зависимости от filterType:
 * - all: все meter_address
 * - bad: только isBelowThreshold
 * - empty: только isZero
 * - bad_empty: isBelowThreshold или isZero
 * - good: не isZero и не isBelowThreshold
 */
export function getMetersToShow(
  rows: StallDiagnosticRow[],
  averages: Averages,
  filterType: FilterType = "bad_empty"
): number[] {
  if (!rows || rows.length === 0) return [];

  return rows
    .filter((row) => row.meter_address !== undefined && row.meter_address !== null)
    .filter((row) => {
      const milk = row.total_milk_production ?? 0;
      // const wash = row.total_amount_washed ?? 0;
      const reattaches = row.number_reattaches;
      const manualDetaches = row.manual_detach_count;
      const manualModes = row.manual_mode_count;

      const hasReattaches = reattaches !== null && reattaches !== undefined;
      const hasManualDetaches = manualDetaches !== null && manualDetaches !== undefined;
      const hasManualModes = manualModes !== null && manualModes !== undefined;

      const reattachesIsZero = hasReattaches && reattaches === 0;
      const manualDetachesIsZero = hasManualDetaches && manualDetaches === 0;
      const manualModesIsZero = hasManualModes && manualModes === 0;

      const reattachesBelow =
        hasReattaches &&
        !reattachesIsZero &&
        reattaches >= 1.5 * (averages.avgReattaches ?? 0) &&
        reattaches > 9;

      const manualDetachesBelow =
        hasManualDetaches &&
        !manualDetachesIsZero &&
        manualDetaches >= 1.5 * (averages.avgManualDetaches ?? 0) &&
        manualDetaches > 9;

      const manualModesBelow =
        hasManualModes &&
        !manualModesIsZero &&
        manualModes >= 1.5 * (averages.avgManualModes ?? 0) &&
        manualModes > 9;

      const isZero = milk === 0;

      const isBelowThreshold =
        !isZero &&
        (milk <= 0.5 * (averages.avgMilkProduction ?? 0) ||
          reattachesBelow ||
          manualDetachesBelow ||
          manualModesBelow);

      switch (filterType) {
        case "all":
          return true;
        case "bad":
          return isBelowThreshold;
        case "empty":
          return isZero;
        case "bad_empty":
          return isZero || isBelowThreshold;
        case "good":
          return !isZero && !isBelowThreshold;
        default:
          return false;
      }
    })
    .map((row) => row.meter_address!);
}
