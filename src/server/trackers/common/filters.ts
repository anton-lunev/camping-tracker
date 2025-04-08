import type { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import {
  getDateWithoutTz,
  getDayOfWeek,
  getFormattedDateWithoutTz,
} from "@/lib/date";
import type { TrackingStateItem } from "@/db/schema";

export function filterFreeSpots(campData: CampsiteData) {
  return campData.isFree;
}

/** Filters camp data based on specific weekdays. */
export function filterByWeekDay(campData: CampsiteData, weekDays: number[]) {
  if (!weekDays.length) return false;
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
  if (!days.length) return false; // ignore filter if no days provided

  const daysFormatted = days.map(getFormattedDateWithoutTz);
  return daysFormatted.includes(getFormattedDateWithoutTz(campData.date));
}

/** Filters camp data based on date range. */
export function filterByDateRange(
  campData: CampsiteData,
  dateRange: [string, string],
) {
  if (!dateRange[0] || !dateRange[1]) return false; // return false if date range is incomplete

  const campDate = getDateWithoutTz(campData.date);
  const startDate = getDateWithoutTz(dateRange[0]);
  const endDate = getDateWithoutTz(dateRange[1]);

  return campDate >= startDate && campDate <= endDate;
}

export function applyFilters(
  campsiteData: CampsiteData[],
  filters: {
    dateRange: [string, string];
    days: string[];
    weekDays: number[];
    trackingState?: TrackingStateItem;
  },
) {
  const allSpots = campsiteData
    .filter((item) => filterByDateRange(item, filters.dateRange))
    .filter((item) => filterFreeSpots(item))
    .filter((item) =>
      filters.weekDays.length || filters.days.length
        ? filterByWeekDay(item, filters.weekDays) ||
          filterCertainDays(item, filters.days)
        : true,
    );

  const newSpots = allSpots.filter((item) =>
    keepOnlyNew(filters.trackingState, item),
  );

  return { allSpots, newSpots };
}
