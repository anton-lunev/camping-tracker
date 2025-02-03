import { CampsiteData } from "./types";

/** Filters camp data based on specific weekdays. */
export function filterByWeekDay(
  campData: CampsiteData,
  weekDays: number[],
): CampsiteData | null {
  if (weekDays.length) {
    return campData.day && weekDays.includes(campData.day) ? campData : null;
  }
  return campData;
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
  if (!days.length) return campData;
  const daysFormatted = days.map((day) =>
    new Date(`${day}T00:00:00`).toDateString(),
  );
  return daysFormatted.includes(new Date(campData.date).toDateString())
    ? campData
    : null;
}
