import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getDayOfWeek, getFormattedDateWithoutTz } from "@/lib/date";
import type { TrackingStateItem } from "@/db/schema";

export function filterFreeSpots(campData: CampsiteData) {
  return campData.isFree;
}

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

export function applyFilters(
  campsiteData: CampsiteData[],
  filters: {
    days: string[];
    weekDays: number[];
    trackingState?: TrackingStateItem;
  },
) {
  const allSpots = campsiteData
    .filter((item) => filterFreeSpots(item))
    .filter((item) => filterByWeekDay(item, filters.weekDays))
    .filter((item) => filterCertainDays(item, filters.days));
  const newSpots = allSpots.filter((item) =>
    keepOnlyNew(filters.trackingState, item),
  );

  return { allSpots, newSpots };
}
