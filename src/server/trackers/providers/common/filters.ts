import { isNil } from "lodash";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getFormattedDateWithoutTz } from "@/lib/date";

/** Filters camp data based on specific weekdays. */
export function filterByWeekDay(campData: CampsiteData, weekDays: number[]) {
  if (!weekDays.length) return true; // ignore filter if no weekdays provided
  return !isNil(campData.weekDay) && weekDays.includes(campData.weekDay);
}

/**
 * Filters out campsites already found in the past.
 */
export function keepOnlyNew(
  handledCampsites: CampsiteData[],
  campData: CampsiteData,
): boolean {
  return !handledCampsites.find(
    (camp) => campData.date === camp.date && campData.site === camp.site,
  );
}

/** Filters camp data based on specific dates. */
export function filterCertainDays(campData: CampsiteData, days: string[]) {
  if (!days.length) return true; // ignore filter if no days provided

  const daysFormatted = days.map(getFormattedDateWithoutTz);
  return daysFormatted.includes(getFormattedDateWithoutTz(campData.date));
}
