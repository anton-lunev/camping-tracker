import { CampsitesResponse } from "@/server/trackers/providers/recreation/schema";
import { CampsiteData } from "@/server/trackers/types";
import { getDayOfWeek } from "@/server/trackers/utils";

/** Extracts all available sites from the API response. */
export function findAvailablePlaces(
  response: CampsitesResponse,
): CampsiteData[] {
  const available: CampsiteData[] = [];
  const { campsites } = response;

  for (const campsiteId in campsites) {
    const campsite = campsites[campsiteId];
    for (const [date, value] of Object.entries(campsite.availabilities)) {
      if (value === "Available") {
        available.push({
          date,
          day: getDayOfWeek(date),
          site: campsite.site,
          campsite: campsite.loop,
          campsiteId: campsite.campsite_id,
        });
      }
    }
  }
  return available;
}
