// Tajik weekday names as stored in doctor schedules, indexed by Date.getDay() (0 = Sunday)
export const WEEKDAYS = ["Якшанбе", "Душанбе", "Сешанбе", "Чоршанбе", "Панҷшанбе", "Ҷумъа", "Шанбе"];

/** Monday-first order for pickers. */
export const WEEKDAYS_MON_FIRST = [...WEEKDAYS.slice(1), WEEKDAYS[0]];

/** YYYY-MM-DD in the visitor's local time zone. */
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function weekdayOf(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

/** Adds days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return localDate(new Date(y, m - 1, d + days));
}
