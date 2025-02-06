import { SearchResponse } from "./schema";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";
import { getDayOfWeek, getFormattedDateWithoutTz } from "@/lib/date";

/**
 * Finds available units within a facility's data.
 * @param data - The facility data from the response.
 * @returns An array of available campsites.
 */
export function findAvailablePlaces(data: SearchResponse): CampsiteData[] {
  const availableUnits: CampsiteData[] = [];

  Object.values(data.Facility.Units ?? {}).forEach((unitInfo) => {
    const freeDays = Object.values(unitInfo.Slices)
      .filter((item) => item.IsFree)
      .map(
        (item) =>
          ({
            date: getFormattedDateWithoutTz(item.Date),
            weekDay: getDayOfWeek(item.Date),
            site: unitInfo.UnitId.toString(),
            siteName: unitInfo.ShortName,
            campsite: data.Facility.Name,
            campsiteId: data.Facility.FacilityId.toString(),
          }) satisfies CampsiteData,
      );

    availableUnits.push(...freeDays);
  });

  return availableUnits;
}
