import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getDayOfWeek, getFormattedDateWithoutTz } from "@/lib/date";
import { TrackingStateItem } from "@/db/schema";

/** Filters camp data based on specific weekdays. */
export function filterByWeekDay(campData: CampsiteData, weekDays: number[]) {
  if (!weekDays.length) return true; // ignore filter if no weekdays provided
  const weekDay = getDayOfWeek(campData.date);
  return weekDay ? weekDays.includes(weekDay) : false;
}

/**
 * Filters out campsites already found in the past.
 */
export function keepOnlyNew(
  trackingState: TrackingStateItem | undefined,
  campData: CampsiteData,
): boolean {
  return !trackingState?.sites.find(
    (camp) => campData.date === camp.date && campData.siteId === camp.siteId,
  );
}

/** Filters camp data based on specific dates. */
export function filterCertainDays(campData: CampsiteData, days: string[]) {
  if (!days.length) return true; // ignore filter if no days provided

  const daysFormatted = days.map(getFormattedDateWithoutTz);
  return daysFormatted.includes(getFormattedDateWithoutTz(campData.date));
}
