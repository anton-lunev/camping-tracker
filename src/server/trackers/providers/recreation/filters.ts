import { CampsitesResponse } from "@/server/trackers/providers/recreation/schema";
import { getDayOfWeek, getFormattedDateWithoutTz } from "@/server/trackers/providers/common/utils";
import { CampsiteData } from "@/server/trackers/providers/providerAdapter";

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
          date: getFormattedDateWithoutTz(date),
          day: getDayOfWeek(date),
          site: campsite.site,
          siteName: campsite.site,
          campsite: campsite.loop,
          campsiteId: campsite.campsite_id,
        });
      }
    }
  }
  return available;
}
