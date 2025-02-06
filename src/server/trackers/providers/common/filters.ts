import { CampsiteData } from "../../types";
import { getFormattedDateWithoutTz } from "@/server/trackers/providers/common/utils";
import { isNil } from "lodash";

/** Filters camp data based on specific weekdays. */
export function filterByWeekDay(campData: CampsiteData, weekDays: number[]) {
  if (!weekDays.length) return true; // ignore filter if no weekdays provided
  return !isNil(campData.day) && weekDays.includes(campData.day);
}

/**
 * Filters out campsites already found in the past.
 */
export function keepOnlyNew(
  alreadyFoundCampSites: CampsiteData[],
  campData: CampsiteData,
): boolean {
  return !alreadyFoundCampSites.find(
    (camp) => campData.date === camp.date && campData.site === camp.site,
  );
}

/** Filters camp data based on specific dates. */
export function filterCertainDays(campData: CampsiteData, days: string[]) {
  if (!days.length) return true; // ignore filter if no days provided

  const daysFormatted = days.map(getFormattedDateWithoutTz);
  return daysFormatted.includes(getFormattedDateWithoutTz(campData.date));
}
