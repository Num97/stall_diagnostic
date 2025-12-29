export interface StallDiagnosticRow {
  id: number;
  farm: string;
  dmb: number;
  date: string;
  number_milking: number;
  milkshift_id?: number | null;
  meter_address?: number | null;
  total_milk_production?: number | null;
  total_amount_washed?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  number_reattaches?: number | null;
  manual_detach_count?: number | null;
  manual_mode_count?: number | null;
}
