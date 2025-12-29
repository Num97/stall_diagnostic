import type { StallDiagnosticRow } from '../types/forms';

interface StallDiagnosticParams {
  farm: string;
  dmb?: number;
  date?: string;
  milking?: number;
}

/**
 * Получает данные по стойлам с аналитического центра
 * @param params - объект с параметрами фильтрации
 * @returns массив StallDiagnosticRow
 */
export async function fetchStallDiagnostic(
  params: StallDiagnosticParams
): Promise<StallDiagnosticRow[]> {
  const queryParams = new URLSearchParams();

  if (params.farm) queryParams.append('farm', params.farm);
  if (params.dmb !== undefined) queryParams.append('dmb', params.dmb.toString());
  if (params.date) queryParams.append('date', params.date);
  if (params.milking !== undefined) queryParams.append('milking', params.milking.toString());

  const url = `/api/v1/stall/diagnostic?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
  }

  const data: StallDiagnosticRow[] = await response.json();
  return data;
}
