import { SearchResponse } from "./schema";
import { getDayOfWeek, getFormattedDateWithoutTz } from "@/server/trackers/providers/common/utils";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";

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
      .map((item) => ({
        date: getFormattedDateWithoutTz(item.Date),
        day: getDayOfWeek(item.Date),
        site: unitInfo.UnitId.toString(),
        siteName: unitInfo.ShortName,
        campsite: data.Facility.Name,
        campsiteId: data.Facility.FacilityId.toString(),
      }));

    availableUnits.push(...freeDays);
  });

  return availableUnits;
}
