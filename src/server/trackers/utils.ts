/**
 * Returns the day of the week for a given date.
 */
export function getDayOfWeek(date: string) {
  const dayOfWeek = new Date(date).getDay();
  return isNaN(dayOfWeek) ? null : dayOfWeek;
}
