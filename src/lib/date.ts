import { format } from "date-fns/format";

export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DATE_FORMAT_FULL = "yyyy-MM-dd";
export const DATE_FORMAT_SHORT = "MMM-dd EEE";
const RANGE_FORMAT = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function getDateWithoutTz(date: string) {
  const [datePart] = date.split("T");
  if (!datePart) {
    throw new Error("Invalid date format");
  }
  return new Date(datePart + "T00:00:00");
}

function hasTZ(dateStr: string) {
  return dateStr.includes("T") || dateStr.includes("+");
}

export function toDate(dateStr: string) {
  // time fixes timezone issues, it'll parse the date in local timezone
  // This should be used only on UI side for rendering
  const time = hasTZ(dateStr) ? "" : "T00:00:00";
  return new Date(dateStr + time);
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

export function formatRange(dates: Date[]) {
  if (!dates.length) return "";
  return RANGE_FORMAT.formatRange(dates[0], dates[dates.length - 1]);
}

export function formatDate(date: Date, formatStr = DATE_FORMAT_FULL) {
  return format(date, formatStr);
}

export function groupConsecutiveDates(
  dates: string[] | null | undefined,
): Date[][] {
  if (!dates?.length) return [];

  // Clone to avoid mutating input, then sort
  const sortedDates = [...new Set(dates).values()]
    .map(toDate)
    .sort((a, b) => a.getTime() - b.getTime());

  const groups: Date[][] = [];
  let currentGroup: Date[] = [sortedDates[0]];

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = currentGroup[currentGroup.length - 1];
    const currentDate = sortedDates[i];

    if (isNextCalendarDay(prevDate, currentDate)) {
      currentGroup.push(currentDate);
    } else {
      groups.push(currentGroup);
      currentGroup = [currentDate];
    }
  }

  groups.push(currentGroup);
  return groups;
}

/** Checks if two dates are consecutive calendar days (ignoring time) */
function isNextCalendarDay(a: Date, b: Date): boolean {
  const expectedNextDay = new Date(a);
  expectedNextDay.setDate(a.getDate() + 1);

  return (
    b.getFullYear() === expectedNextDay.getFullYear() &&
    b.getMonth() === expectedNextDay.getMonth() &&
    b.getDate() === expectedNextDay.getDate()
  );
}

/**
 * Returns an array of strings with month period.
 * @param start - Start date in YYYY-MM-DD format.
 * @param end - End date in YYYY-MM-DD format.
 * @returns Array of date strings.
 */
export function getMonthsInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1,
  );

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return dates;
}

/**
 * Returns an array of date pairs [startDate, endDate] for each month in the range.
 * @param start - Start date in YYYY-MM-DD format.
 * @param end - End date in YYYY-MM-DD format.
 * @returns Array of date pairs, each pair is [startDate, endDate] in YYYY-MM-DD format.
 */
export function getMonthDatePairs(
  start: string,
  end: string,
): [string, string][] {
  const datePairs: [string, string][] = [];
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1,
  );

  while (currentDate <= endDate) {
    const monthStartDate = currentDate.toISOString().slice(0, 10);

    // Get the last day of the current month
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    nextMonth.setDate(0); // Set date to 0 to go to the last day of the current month

    let monthEndDate = nextMonth.toISOString().slice(0, 10);

    // If the calculated monthEndDate is after the overall endDate, use the overall endDate
    if (new Date(monthEndDate) > endDate) {
      monthEndDate = end;
    }

    datePairs.push([monthStartDate, monthEndDate]);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1); // Reset date to 1st of the next month for the next iteration (important for accurate month iteration)
  }
  return datePairs;
}
