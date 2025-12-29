import type { StallDiagnosticRow } from '../types/forms';

interface Averages {
  avgMilkProduction: number | null;
  avgAmountWashed: number | null;
  avgReattaches: number | null;
  avgManualDetaches: number | null;
  avgManualModes: number | null;
  total_milk_production: number | null;
  total_amount_washed: number | null;
  number_reattaches: number | null;
  manual_detach_count: number | null;
  manual_mode_count: number | null;
}

/**
 * Вычисляет среднее значение total_milk_production и total_amount_washed
 * @param data - массив объектов StallDiagnosticRow
 * @returns объект с avgMilkProduction и avgAmountWashed
 */
export function calculateAverages(data: StallDiagnosticRow[]): Averages {
  if (!data || data.length === 0) {
    return { avgMilkProduction: null, avgAmountWashed: null, avgReattaches: null, avgManualDetaches: null, avgManualModes: null, total_milk_production: null, total_amount_washed: null, number_reattaches: null, manual_detach_count: null, manual_mode_count: null };
  }

  let milkSum = 0;
  let washedSum = 0;
  let reattachSum = 0;
  let manualModeSum = 0;
  let manualDetachSum = 0;

  let milkCount = 0;
  let washedCount = 0;
  let reattachCount = 0;
  let manualModeCount = 0;
  let manualDetachCount = 0;

  for (const row of data) {

    if (row.total_milk_production !== null && row.total_milk_production !== undefined) {
      milkSum += row.total_milk_production;
      milkCount += 1;
    }

    if (row.total_amount_washed !== null && row.total_amount_washed !== undefined) {
      washedSum += row.total_amount_washed;
      washedCount += 1;
    }

    if (row.number_reattaches !== null && row.number_reattaches !== undefined) {
      reattachSum += row.number_reattaches;
      reattachCount += 1;
    }

    if (row.manual_detach_count !== null && row.manual_detach_count !== undefined) {
      manualDetachSum += row.manual_detach_count;
      manualDetachCount += 1;
    }
    if (row.manual_mode_count !== null && row.manual_mode_count !== undefined) {
      manualModeSum += row.manual_mode_count;
      manualModeCount += 1;
    }

  }

  return {
    avgMilkProduction: milkCount > 0 ? milkSum / milkCount : null,
    avgAmountWashed: washedCount > 0 ? washedSum / washedCount : null,
    avgReattaches: reattachCount > 0 ? reattachSum / reattachCount : null,
    avgManualDetaches: manualDetachCount > 0 ? manualDetachSum / manualDetachCount : null,
    avgManualModes: manualModeCount > 0 ? manualModeSum / manualModeCount : null,
    total_milk_production: milkSum,
    total_amount_washed: washedSum,
    number_reattaches: reattachSum,
    manual_detach_count: manualDetachSum,
    manual_mode_count: manualModeSum,
  };
}
