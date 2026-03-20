/**
 * Utility functions for route interval/alternation logic.
 */

/**
 * Get the ISO week number for a given date.
 * Returns something like "2026-W12".
 */
export function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/**
 * Parse an ISO week string like "2026-W12" into a week number.
 */
export function parseWeekNumber(isoWeek: string): number {
  const m = isoWeek.match(/W(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Parse the year from an ISO week string.
 */
export function parseWeekYear(isoWeek: string): number {
  const m = isoWeek.match(/^(\d{4})-W/);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * Check if a route is active on a specific date given its interval and reference week.
 * 
 * intervalo=1 → every week (always active)
 * intervalo=2 → bi-weekly: active on ref week, skip next, active again, etc.
 */
export function isRotaActiveOnDate(
  date: Date,
  intervalo: number,
  semanaReferencia: string | null | undefined
): boolean {
  if (!intervalo || intervalo <= 1) return true;
  if (!semanaReferencia) return true; // no ref set, assume active

  const currentWeek = getISOWeek(date);
  const currentNum = parseWeekNumber(currentWeek);
  const refNum = parseWeekNumber(semanaReferencia);
  const currentYear = parseWeekYear(currentWeek);
  const refYear = parseWeekYear(semanaReferencia);

  // Calculate total weeks difference (approximate, handles year boundaries)
  const weekDiff = (currentYear - refYear) * 52 + (currentNum - refNum);
  
  return ((weekDiff % intervalo) + intervalo) % intervalo === 0;
}

/**
 * Normalize a client's rota field to always be a string array.
 * Handles: null, string, string[], etc.
 */
export function normalizeRotaArray(rota: unknown): string[] {
  if (!rota) return [];
  if (Array.isArray(rota)) return rota.filter(Boolean) as string[];
  if (typeof rota === "string") {
    // Handle postgres array literal like "{Rota1,Rota2}"
    if (rota.startsWith("{") && rota.endsWith("}")) {
      return rota.slice(1, -1).split(",").filter(Boolean);
    }
    return rota ? [rota] : [];
  }
  return [];
}
