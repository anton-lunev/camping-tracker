import { format } from "date-fns";

function getDateWithoutTz(date: string) {
  const [datePart] = date.split("T");
  if (!datePart) {
    throw new Error("Invalid date format");
  }
  return new Date(datePart + "T00:00:00");
}

/**
 * Returns the day of the week for a given date.
 */
export function getDayOfWeek(date: string) {
  const dayOfWeek = getDateWithoutTz(date).getDay();
  return isNaN(dayOfWeek) ? null : dayOfWeek;
}

/**
 * Converts a date string to YYYY-MM-DD format by stripping timezone information.
 * Returns today's date as fallback if the input date is invalid.
 * Examples:
 * "2024-03-15T00:00:00.000Z" -> "2024-03-15"
 * "2024-03-15T00:00:00-07:00" -> "2024-03-15"
 * "2024-03-15" -> "2024-03-15"
 */
export function getFormattedDateWithoutTz(date: string): string {
  try {
    return format(getDateWithoutTz(date), "yyyy-MM-dd");
  } catch {
    return format(new Date(), "yyyy-MM-dd"); // fallback to today's date
  }
}
