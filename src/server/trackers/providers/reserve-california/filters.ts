import { SearchResponse } from "./schema";
import { CampsiteData } from "@/server/trackers/types";
import { getDayOfWeek } from "@/server/trackers/utils";

/**
 * Finds available units within a facility's data.
 * @param data - The facility data from the response.
 * @param days - Specific dates to filter (e.g., ["2025-01-16"]).
 * @returns An array of available campsites.
 */
export function findUnits(
  data: SearchResponse,
  days: string[],
): CampsiteData[] {
  const availableUnits: CampsiteData[] = [];

  Object.entries(data.Facility.Units ?? {}).forEach(([unitId, unitInfo]) => {
    const freeDays = Object.entries(unitInfo.Slices)
      .filter(
        ([key, val]) =>
          !days.length || (days.includes(key.split("T")[0]) && val.IsFree),
      )
      .map(([date]) => ({
        date,
        day: getDayOfWeek(date),
        site: unitId,
        campsite: data.Facility.Name,
        campsiteId: data.Facility.FacilityId.toString(),
      }));

    availableUnits.push(...freeDays);
  });

  return availableUnits;
}
